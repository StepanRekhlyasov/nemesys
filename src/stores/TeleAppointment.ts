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
  doc as docDb,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { toDate } from 'src/shared/utils/utils';
import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
import { getAuth } from 'firebase/auth';
import { useOrganization } from './organization';

export const useTele = defineStore('TeleAppoint', () => {
  const db = getFirestore();
  const auth = getAuth()
  const organization = useOrganization()

  const loadTeleAppointmentData = async (clientId: string, clientFactoryId: string) => {
    const teleAppointmentData: TeleAppointmentHistory[] = [];
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const userData = await getDoc(docDb(collection(db, 'users'), auth.currentUser?.uid))
    const q = await getDocs(
      query(
        collection(db, 'clients', clientId, 'client-factory', clientFactoryId, 'teleAppointments'),
        where('deleted', '==', false),
        where('created_at', '>=', ninetyDaysAgo),
        where('organizationId', '==', organization.currentOrganizationId),
        orderBy('created_at', 'desc')
      )
    );
    q.forEach(async (doc) => {
      const data = doc.data();
      const registerUser = userData.data()
      teleAppointmentData.push({
        ...data,
        id: doc.id,
        user: registerUser,
        created_at: toDate(data.created_at)
      });
    });

    return teleAppointmentData;
  };

  const deleteTele = async (Teleid: string[], clientId: string, clientFactoryId: string) => {
    const updateData = {
      deleted: true,
      deleted_by: auth.currentUser?.uid,
      deleted_at: serverTimestamp()
    };

    const batch = writeBatch(db);
    for (const id of Teleid) {
      const docRef = docDb(db, 'clients', clientId, 'client-factory', clientFactoryId, 'teleAppointments', id);
      batch.update(docRef, updateData);
    }
    await batch.commit();
  };

  const updateData = async (clientId: string, clientFactoryId: string, data: TeleAppointmentHistory[]) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;
    updateData['result'] = data['result'];
    updateData['jobResult'] = data['jobResult'];
    updateData['requiredService'] = data['requiredService'];
    updateData['remark'] = data['remark'];

    await updateDoc(docDb(db, 'clients', clientId, 'client-factory', clientFactoryId, 'teleAppointments', data['id']), updateData);
  };

  const addData = async (clientId: string, clientFactoryId: string, data: TeleAppointmentHistory[]) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId;
    data['officeId'] = clientFactoryId;
    await addDoc(collection(db, 'clients', clientId, 'client-factory', clientFactoryId, 'teleAppointments'), data);
  };

  return {
    loadTeleAppointmentData,
    deleteTele,
    addData,
    updateData
  };
});
