import { collection, doc, endAt, getDoc, getDocs, getFirestore, orderBy, PartialWithFieldValue, query, startAt, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { User } from 'src/shared/model';
import { ConstraintsType } from 'src/shared/utils/utils';
import { i18n } from 'boot/i18n';
import { adminRolesIds, ADMIN_ORGANIZATION_CODE } from 'src/components/handlers/consts';

const { t } = i18n.global

export const useUserStore = defineStore('user', () => {
  const db = getFirestore()

  async function getAllUsers(active_organization_id?: string, queryText?: string) {
    const constraints: ConstraintsType = [
      where('deleted', '==', false),
      orderBy('displayName'),
    ]

    if (active_organization_id) {
      constraints.push(where('organization_ids', 'array-contains', active_organization_id))
    }

    if (queryText) {
      constraints.push(startAt(queryText || ''), endAt(queryText + '\uf8ff'),)
    }


    const usersData = await getDocs(query(
      collection(db, 'users'),
      ...constraints
    ))

    const users: User[] = []

    usersData.forEach((user) => {
      if (user.exists()) {
        users.push(user.data() as User)
      }
    })

    return users
  }


  async function getUserById(id: string) {

    const docRef = doc(db, 'users', id)

    const userSnap = await getDoc(docRef)

    if (userSnap.exists()) {
      return userSnap.data() as User
    }

    throw new Error(t('common.userNotFound'))

  }

  async function editUser(id: string, user: PartialWithFieldValue<User>) {
    const userRef = doc(db, 'users/' + id);
    await updateDoc(userRef, {
      ...user
    })
  }

  async function checkUserAffiliation(organizationCode: string, userId: string) {
    const user = await getUserById(userId)

    if (adminRolesIds.includes(user.role)) {
      if (organizationCode == ADMIN_ORGANIZATION_CODE) {
        return true
      }
      return false
    }

    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', organizationCode))

    const querySnapshot = await getDocs(organizationQuery)

    if (querySnapshot.size > 1) {
      throw new Error(t('menu.admin.organizationsTable.codeNotUnique'))
    }

    if (querySnapshot.size == 0) {
      return false
    }

    const organizationId = querySnapshot.docs[0].data().id

    if (!user.organization_ids) {
      return false
    }

    return user.organization_ids.includes(organizationId)

  }

  async function searchUsers(searchText: string) {
    const usersQuery = query(collection(db, 'users'), orderBy('displayName'), startAt(searchText), endAt(searchText + '\uf8ff'))

    const usersDocs = await getDocs(usersQuery);

    return usersDocs.docs.map((organization) => {
      return organization.data() as User
    })


  }
  return { getAllUsers, getUserById, editUser, checkUserAffiliation, searchUsers }
})
