import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query, updateDoc, onSnapshot } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { NotificationData } from 'src/shared/model';
import { ref } from 'vue';
import { DocumentData } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/user';
import { date } from 'quasar';

export const useReleaseNotes = defineStore('releaseNotes', () => {
  const db = getFirestore();
  const unsubscribe = ref();
  const { t } = useI18n({ useScope: 'global' });
  const tableRows = ref(<DocumentData[]>[]);
  const userStore = useUserStore()
  const publishNotificationData = async (data: NotificationData) => {
    return await addDoc(collection(db, 'notifications'), {
      ...data,
    });
  };
  const getAllNotifications = async () => {
    if (unsubscribe.value) {
      unsubscribe.value();
    }

    const q = query(collection(db, 'notifications'), orderBy('dateCreation', 'desc'));

    unsubscribe.value = onSnapshot(q, async (querySnapshot) => {
      const notifications: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        notifications.push(data);
      });

      tableRows.value = await Promise.all(
        notifications.map(async (item, index) => {
          const author = await userStore.getUserById(item.author);

          return {
            number: index + 1,
            id: item.id,
            status: item.status,
            category: t('releaseNotes.form.options.' + item.category),
            subject: item.subject,
            content: item.content,
            author: author?.name ?? '',
            creationDate: date.formatDate(item.dateCreation.toDate(), 'YYYY-MM-DD HH:mm:ss'),
            deliveryDate: date.formatDate(item.dateDelivery.toDate(), 'YYYY-MM-DD HH:mm:ss'),
          };
        })
      );
    });

    return await getDocs(q);
  };


  const updateNotificationData = async (notificationId: string, data) => {
    const noteRef = doc(db, 'notifications/' + notificationId);
    await updateDoc(noteRef, data);
  };

  const deleteNotificationData = async (notificationId: string) => {
    const noteRef = doc(db, 'notifications/' + notificationId);
    return await deleteDoc(noteRef);
  };

  return {
    publishNotificationData,
    getAllNotifications,
    updateNotificationData,
    deleteNotificationData,
    tableRows,
  };
});
