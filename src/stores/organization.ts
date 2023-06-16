import { collection, collectionGroup, doc, documentId, endAt, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, startAt , updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, Organization, RequestType, ReturnedObjectType, User, UserPermissionNames } from 'src/shared/model';
import { serializeTimestamp } from 'src/shared/utils/utils';
import { computed, ref, watch } from 'vue';
import { i18n } from 'boot/i18n';
import { getUsersByPermission } from 'src/shared/utils/User.utils';

const { t } = i18n.global
interface OrganizationState {
  organizations: Organization[],
  activeOrganization: number,
  currentOrganizationBranches: { [id: string]: Branch; },
  currentOrganizationUsers: { [id: string]: User; },
}

const organization = 'organization'

export const useOrganization = defineStore('organization', () => {
  const db = getFirestore()
  const state = ref<OrganizationState>({
    organizations: [],
    activeOrganization: 0,
    currentOrganizationBranches: {},
    currentOrganizationUsers: {},
  })

  const currentOrganizationId = computed(() => {
    return state.value.organizations[state.value.activeOrganization]?.id
  })

  const storage = localStorage.getItem(organization)

  if (storage) {
    state.value = JSON.parse(storage)
  }

  watch(state, (stateVal) => {
    localStorage.setItem(organization, JSON.stringify(stateVal))
  },
    { deep: true }
  )
  watch(() => currentOrganizationId.value, async () => {
    state.value.currentOrganizationBranches = await getCurrentOrganizationBranches()
    state.value.currentOrganizationUsers = await getCurrentUsersInChrage()
  })

  async function getAllOrganizationsIds() {
    const organizationsQuery = query(collection(db, 'organization/'), where('deleted', '==', false));
    const querySnapshot = await getDocs(organizationsQuery);
    const organizationsIds: string[] = []
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        organizationsIds.push(doc.id)
      }
    })

    return organizationsIds
  }

  async function getCurrentOrganizationBranches() {
    const organizationRef = doc(db, `/organization/${currentOrganizationId.value}/`);
    const branchesQuery = query(collectionGroup(db, 'branches'), where('deleted', '==', false), where('working', '==', true), where('hidden', '==', false), orderBy(documentId()), startAt(organizationRef.path), endAt(organizationRef.path + '\uf8ff'));
    const querySnapshot = await getDocs(branchesQuery);
    const branches: { [id: string]: Branch; } = {}
    querySnapshot.forEach((doc) => {
      branches[doc.id] = doc.data() as Branch
    })
    return branches
  }

  async function getCurrentUsersInChrage() {
    const organization = useOrganization()
    const usersSnapshot = getUsersByPermission(db, UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);
    const querySnapshot = await usersSnapshot
    const users: { [id: string]: User; } = {}
    if (querySnapshot) {
      querySnapshot.forEach((doc) => {
        users[doc.id] = doc.data() as User
      })
    }
    return users
  }

  async function addOrganization(organization: Organization) {
    const organizationRef = collection(db, 'organization/')
    const docRef = doc(organizationRef)
    organization.id = docRef.id
    organization.deleted = false
    await setDoc(docRef, {
      ...organization,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function isCodeUnique(code: string) {
    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', code))
    const querySnapshot = await getDocs(organizationQuery)
    return querySnapshot.size === 0
  }

  async function editOrganization(organization: Partial<Organization>, organizationId: string) {
    const ref = doc(db, 'organization/' + organizationId)
    serializeTimestamp(organization)
    await updateDoc(ref, {
      ...organization
    })
  }

  async function getOrganizationByCode(code: string) {
    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', code))
    const querySnapshot = await getDocs(organizationQuery)

    if (querySnapshot.size > 1) {
      throw new Error(t('menu.admin.organizationsTable.codeNotUnique'))
    }

    if (querySnapshot.size == 0) {
      throw new Error('Organization not found')
    }

    return querySnapshot.docs[0].data() as Organization
  }

  async function getOrganizationsByName(name: string) {
    const organizationsQuery = query(collection(db, 'organization'), orderBy('name'), startAt(name), endAt(name + '\uf8ff'),)

    const organizationsData = await getDocs(organizationsQuery);

    return organizationsData.docs.map((organization) => {
      return organization.data() as Organization
    })
  }

  async function getDataById<T extends RequestType>(ids: string[], type: T): Promise<ReturnedObjectType<T>[]> {
    const constraints = [where('working', '==', true)]
    let collectionId = 'businesses'
    if (type == 'Branch') {
      constraints.push(where('deleted', '==', false), where('hidden', '==', false))
      collectionId = 'branches'
    }

    if (type == 'Organization') {
      constraints.push(where('deleted', '==', false))
      collectionId = 'organization'
    }

    const organizationsQuery = query(collectionGroup(db, collectionId), ...constraints, where('id', 'in', ids))
    const organizationData = await getDocs(organizationsQuery)
    return organizationData.docs.map((organization) => {
      const data = organization.data()
      if (type == 'Branch') {
        return data as ReturnedObjectType<T>
      }
      if (type == 'Organization') {
        return data as ReturnedObjectType<T>
      }
      return data as ReturnedObjectType<T>
    })

  }

  return {
    state,
    currentOrganizationId,
    addOrganization,
    editOrganization,
    isCodeUnique,
    getOrganizationByCode,
    getAllOrganizationsIds,
    getOrganizationsByName,
    getDataById,
  }
})
