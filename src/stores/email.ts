import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';


export const useMail = defineStore('email', () => {
  const db = getFirestore()
  async function send(to: string, subject: string, content?: { html?: string, text?: string }) {
    const document = doc(collection(db, 'mail'))
    await setDoc(document, {
      to,
      message: {
        subject,
        ...content
      },
    })
  }

  return { send }
})
