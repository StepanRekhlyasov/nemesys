import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Role } from 'src/shared/model';


export const useRole = defineStore('role', () => {
  const db = getFirestore()

  async function getRole(roleid: string) {
    const roleSnapshot = await getDoc(doc(db, 'roles/' + roleid))
    if (!roleSnapshot.exists()) {
      return
    }
    return roleSnapshot.data() as Role
  }

  async function getAllRoles() {
    const roles = await getDocs(collection(db, 'roles'))
    return roles.docs.map((doc) => {
      return doc.data() as Role
    })
  }

  return {
    getRole,
    getAllRoles
  }
})

