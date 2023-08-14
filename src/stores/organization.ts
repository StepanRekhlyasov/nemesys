import { DocumentData, QuerySnapshot, collection, collectionGroup, doc, documentId, endAt, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, Organization, RequestType, ReturnedObjectType, User, UserPermissionNames } from 'src/shared/model';
import { serializeTimestamp } from 'src/shared/utils/utils';
import { computed, ref, watch } from 'vue';
import { useUserStore } from './user';
import { i18n } from 'boot/i18n';

const { t } = i18n.global

interface OrganizationState {
  organizations: Organization[],
  activeOrganization: number,
  currentOrganizationBranches: { [id: string]: Branch; },
  currentOrganizationUsers: { [id: string]: User; },
  userAndBranchesUpdated: boolean
}

const organization = 'organization'

export const useOrganization = defineStore('organization', () => {
  const db = getFirestore()
  const state = ref<OrganizationState>({
    organizations: [],
    activeOrganization: 0,
    currentOrganizationBranches: {},
    currentOrganizationUsers: {},
    userAndBranchesUpdated: true
  })

  const userStore = useUserStore()

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
    state.value.userAndBranchesUpdated = false
    state.value.currentOrganizationBranches = await getCurrentOrganizationBranches()
    state.value.currentOrganizationUsers = await getCurrentUsersInChrage()
    state.value.userAndBranchesUpdated = true
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
    const branchesQuery = query(collectionGroup(db, 'branches'), where('deleted', '==', false), where('working', '==', true), where('hidden', '==', false), orderBy(documentId()),startAt(organizationRef.path),endAt(organizationRef.path + '\uf8ff'));
    const querySnapshot = await getDocs(branchesQuery);
    const branches: { [id: string]: Branch; } = {}
    querySnapshot.forEach((doc) => {
      branches[doc.id] = doc.data() as Branch
    })
    return branches
  }

  async function getCurrentUsersInChrage() {
    const users = await userStore.getUsersByPermission(UserPermissionNames.UserUpdate, '', currentOrganizationId.value);
    const usersObject: { [id: string]: User; } = {}
    if (!users) {
      return usersObject
    }
    users.forEach((user) => {
      usersObject[user.id] = user as User
    })

    return usersObject
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

    if (querySnapshot.size == 0) {
      throw new Error('Organization not found')
    }
    if (querySnapshot.size > 1) {
      throw new Error(t('menu.admin.organizationsTable.codeNotUnique'))
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
    if (!ids.length) {
      return []
    }
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

    if (ids.length > 10) {
      const queries: Promise<QuerySnapshot<DocumentData>>[] = [];
      while (ids.length) {
        const batch = ids.splice(0, 10);
        const q = getDocs(query(collectionGroup(db, collectionId), ...constraints, where('id', 'in', batch)))
        queries.push(q)
      }
      const docsArray = await Promise.all(queries)
      const dataArray = docsArray.map((snapshot) => {
        return snapshot.docs.map((doc) => {
          return doc.data() as ReturnedObjectType<T>
        })
      })
      return dataArray.flat()
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

  async function getAllOrganizations() {
    const organizationsQuery = query(collection(db, 'organization/'), where('deleted', '==', false));
    const querySnapshot = await getDocs(organizationsQuery);
    return querySnapshot.docs.map((org) => {
      return org.data() as Organization
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
    getAllOrganizations,
    getCurrentUsersInChrage
  }
})
