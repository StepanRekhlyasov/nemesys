import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { NotificationData } from 'src/shared/model';

export const useReleaseNotes = defineStore('releaseNotes', () => {

  const db = getFirestore();

  const publishNotificationData = async (data: NotificationData) => {
    return await addDoc(collection(db, 'notifications'), {
      ...data,
    })
  }

  const getAllNotifications = async () => {
    return await getDocs(query(collection(db, 'notifications'), orderBy('dateCreation', 'desc')));
  }

  const updateNotificationData = async(notificationId: string, data) => {
    const noteRef = doc(db, 'notifications/' + notificationId);
    await updateDoc(noteRef, data);
  }

  const deleteNotificationData = async(notificationId: string) => {
    const noteRef = doc(db, 'notifications/' + notificationId);
    return await deleteDoc(noteRef)
  }

  return {
    publishNotificationData,
    getAllNotifications,
    updateNotificationData,
    deleteNotificationData
  }

})
