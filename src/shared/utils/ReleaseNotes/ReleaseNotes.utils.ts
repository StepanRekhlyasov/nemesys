import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore'
import { NotificationDataRow } from 'src/pages/admin/ReleaseNotes/types/notificationTypes';

const db = getFirestore();

export const publishNotificationData = async (data: NotificationDataRow) => {
    return await addDoc(collection(db, 'notifications'), {
      ...data,
    })
}

export const getAllNotifications = async () => {
  return await getDocs(query(collection(db, 'notifications'), orderBy('dateCreation', 'desc')));
}

export const getUser = async (userId: string) => {
  return await getDoc(doc(db, 'users/', userId))
}

export const updateNotificationData = async(notificationId: string, data) => {
  const noteRef = doc(db, 'notifications/' + notificationId);
  await updateDoc(noteRef, data);
}

export const deleteNotificationData = async(notificationId: string) => {
  const noteRef = doc(db, 'notifications/' + notificationId);
  return await deleteDoc(noteRef)
}
