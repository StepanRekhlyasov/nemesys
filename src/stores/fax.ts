import { defineStore } from 'pinia';
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
  query,
  where,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { Alert } from 'src/shared/utils/Alert.utils';
import { getAuth } from 'firebase/auth';
import { dateToTimestampFormat } from 'src/shared/utils/utils';
import { ref } from 'vue';
import { FaxSearchData } from 'src/pages/user/BusinessManagement/types';
import { useUserStore } from 'src/stores/user';

export const useFax = defineStore('fax', () => {
  const db = getFirestore();
  const auth = getAuth();
  const unsubscribe = ref();
  const faxList = ref(<DocumentData[]>[]);
  const useStore = useUserStore();

  const uploadFaxFile = async (faxFile: FileList | []) => {
    const file = faxFile[0];
    const storage = getStorage();
    const timestamp: number = Date.now();
    const storageRef = refStorage(
      storage,
      `faxFile/${auth.currentUser?.uid}/${timestamp}.pdf`
    );
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const data = {};
      data['fileName'] = file['name'];
      data['faxFilePath'] = snapshot.ref.fullPath;
      data['faxFileURL'] = await getDownloadURL(storageRef);
      return data;
    } catch (error) {
      Alert.warning(error);
      return false;
    }
  };
  const saveFax = async (data, faxFile: FileList | []) => {
    if (faxFile && faxFile.length > 0) {
      const faxData = await uploadFaxFile(faxFile);
      data = { ...data, ...faxData };
    }
    const user = await useStore.getUserById(auth.currentUser?.uid as string);
    if (user) {
      data['branch_id'] = user.branch_id;
    }

    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['created_at'] = serverTimestamp();
    data['applicantId'] = data['applicants']['value'];
    data['applicantName'] = data['applicants']['label'];
    data['senderId'] = auth.currentUser?.uid;
    if (data.transmissionDateTime)
      data.transmissionDateTime = dateToTimestampFormat(
        new Date(data.transmissionDateTime)
      );

    await addDoc(collection(db, '/fax'), {
      ...data,
    });
    Alert.success();
  };
  async function getFaxList(searchData: FaxSearchData) {
    const start = Timestamp.fromDate(new Date(searchData.selectedDate));
    const endDate = new Date(new Date(searchData.selectedDate));
    endDate.setDate(endDate.getDate() + 1);
    const end = Timestamp.fromDate(endDate);
    const filters = [
      where('deleted', '==', false),
      where('created_at', '>=', start),
      where('created_at', '<', end),
    ];
    if (searchData.selectedApplicant) {
      filters.push(
        where('applicantId', '==', searchData.selectedApplicant['value'])
      );
    }
    if (searchData.selectedBranch) {
      filters.push(where('branch_id', '==', searchData.selectedBranch));
    }
    if (searchData.selectedInCharge) {
      filters.push(where('senderId', '==', searchData.selectedInCharge));
    }

    const q = query(collection(db, 'fax'), ...filters);

    if (unsubscribe.value) {
      unsubscribe.value();
    }

    unsubscribe.value = onSnapshot(q, (querySnapshot) => {
      const items: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data['id'] = doc.id;
        items.push(data);
      });
      faxList.value = items;
    });
  }

  return { saveFax, getFaxList, faxList };
});
