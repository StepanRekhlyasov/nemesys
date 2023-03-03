import { collection, doc, endAt, getDoc, getDocs, getFirestore, orderBy, query, startAt, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { User } from 'src/shared/model';


export const useUserStore = defineStore('user', () => {
  const db = getFirestore()

  async function getAllUsers( active_organization_id: string, queryText?: string) {
    const usersData = await getDocs(query(
      collection(db, 'users'),
      where('deleted', '==', false),
      where('organization_ids', 'array-contains', active_organization_id),
      orderBy('displayName'),
      startAt(queryText || ''),
      endAt(queryText + '\uf8ff'),
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
