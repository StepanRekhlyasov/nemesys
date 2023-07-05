import { getAuth, Unsubscribe } from 'firebase/auth';
import { collection, doc, DocumentData, DocumentReference, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

interface Sessions {
  userId: string  //document id should be the same as userId
  sessionId: string
}

export const useSession = defineStore('session', () => {
  const db = getFirestore();
  const sessionIdKey = 'sessionId'
  const $q = useQuasar();
  const auth = getAuth();
  const router = useRouter();
  const unsubscribeSnapshot = ref<Unsubscribe>()

  function generateSesionId() {
    return doc(collection(db, 'generateSesionId')).id
  }

  async function createSession(sessionRef: DocumentReference<DocumentData>, userId: string) {
    const sessionId = generateSesionId()

    const session: Sessions = {
      userId,
      sessionId
    }

    await setDoc(sessionRef, session)
    $q.localStorage.set(sessionIdKey, sessionId)
  }


  async function rewriteSession(sessionRef: DocumentReference<DocumentData>,) {
    const sessionId = generateSesionId()
    $q.localStorage.set(sessionIdKey, sessionId)
    await updateDoc(sessionRef, {
      sessionId
    })
  }


  async function trackSession(userId: string) {
    if (unsubscribeSnapshot.value) {
      return
    }
    unsubscribeSnapshot.value = onSnapshot(
      doc(db, 'Sessions/' + userId),
      async (snapshot) => {
        const session = snapshot.data() as Sessions
        const currentSession = $q.localStorage.getItem(sessionIdKey)?.toString()
        if (session.sessionId != currentSession) {
          await logOut()
        }
      },
      async (error) => {
        console.log(error);
        await logOut()
      });
  }

  async function logOut() {
    $q.localStorage.remove(sessionIdKey)
    await auth.signOut()
    router.push('/auth/login')
  }


  async function checkSession(userId: string) {
    const sessionRef = doc(db, 'Sessions/' + userId)
    const currentSession = await getDoc(sessionRef)

    if (!currentSession.exists()) {
      await createSession(sessionRef, userId)
    } else {

      const session = currentSession.data() as Sessions
      const savedSessionId = $q.localStorage.getItem(sessionIdKey)?.toString()

      if(session.sessionId !== savedSessionId){
        await rewriteSession(sessionRef)
      }

    }
  }
  return {
    trackSession,
    checkSession,
    logOut,
    unsubscribeSnapshot,
    sessionIdKey
  }
})
