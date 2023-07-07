import {
  updateDoc,
  collection,
  getFirestore,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  addDoc,
  where,
  doc,
  writeBatch
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';
import { TeleAppointmentHistory, UserTele } from 'src/shared/model/TeleAppoint.model';

export const useTele = defineStore('TeleAppoint', () => {
  const db = getFirestore();
  const $q = useQuasar();
  const user: { uid: string } | null = $q.localStorage.getItem('user');
  const loadTeleAppointmentData = async (clientId: string) => {
    const teleAppointmentData: TeleAppointmentHistory[] = [];
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const q = await getDocs(
      query(
        collection(db, 'clients', clientId, 'teleAppointments'),
        where('deleted', '==', false),
        where('created_at', '>=', ninetyDaysAgo),
        orderBy('created_at', 'desc')
      )
    );
    q.forEach((doc) => {
      const data = doc.data();
      teleAppointmentData.push({
        ...data,
        id: doc.id,
        created_at: toDate(data.created_at)
      });
    });

    return teleAppointmentData;
  };

  const loadUsers = async () => {
    const userList: UserTele[] = [];
    const q = await getDocs(query(collection(db, 'users'), where('deleted', '==', false)));
    q.forEach((doc) => {
      userList.push({ id: doc.id, name: doc.data().name });
    });
    return userList;
  };

  const deleteTele = async (Teleid: string[], clientId: string) => {
    const updateData = {
      deleted: true,
      deleted_by: user?.uid,
      deleted_at: serverTimestamp()
    };

    const batch = writeBatch(db);
    for (const id of Teleid) {
      const docRef = doc(db, 'clients', clientId, 'teleAppointments', id);
      batch.update(docRef, updateData);
    }
    await batch.commit();
  };

  const updateData = async (clientId: string, data: TeleAppointmentHistory[]) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = user?.uid;
    updateData['result'] = data['result'];
    updateData['jobResult'] = data['jobResult'];
    updateData['requiredService'] = data['requiredService'];
    updateData['remark'] = data['remark'];

    await updateDoc(doc(db, 'clients', clientId, 'teleAppointments', data['id']), updateData);
  };

  const addData = async (clientId: string, data: TeleAppointmentHistory[]) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = user?.uid;

    await addDoc(collection(db, 'clients', clientId, 'teleAppointments'), data);
  };

  return {
    loadTeleAppointmentData,
    loadUsers,
    deleteTele,
    addData,
    updateData
  };
});
