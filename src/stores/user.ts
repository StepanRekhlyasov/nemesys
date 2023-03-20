import { collection, doc, endAt, getDoc, getDocs, getFirestore, orderBy, query, startAt, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { User } from 'src/shared/model';
import { ConstraintsType } from 'src/shared/utils/utils';


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
  }


  return { getAllUsers, getUserById }
})
