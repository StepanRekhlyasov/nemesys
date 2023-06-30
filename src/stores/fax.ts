import { defineStore } from 'pinia';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { Alert } from 'src/shared/utils/Alert.utils';
import { getAuth } from 'firebase/auth';
import { dateToTimestampFormat } from 'src/shared/utils/utils';

export const useFax = defineStore('fax', () => {
    const db = getFirestore();
    const $q = useQuasar();
    const { t } = useI18n({ useScope: 'global' });
    const auth = getAuth();

    const uploadFaxFile = async (faxFile: FileList | []) => {
        const file = faxFile[0];
        const storage = getStorage();
        const storageRef = refStorage(storage, `faxFile/${auth.currentUser?.uid}/${file['name']}`);
        try {
            const snapshot = await uploadBytes(storageRef, file)
            const data = {}
            data['faxFilePath'] = snapshot.ref.fullPath;
            data['faxFileURL'] = await getDownloadURL(storageRef)
            return data
        } catch (error) {
            Alert.warning($q, t);
            return false;
        }

    }
    const saveFax = async (data, faxFile: FileList | []) => {
        if (faxFile && faxFile.length > 0) {
            const faxData = await uploadFaxFile(faxFile)
            data = { ...data, ...faxData }
        }
        data['deleted'] = false;
        data['created_by'] = auth.currentUser?.uid;
        data['created_at'] = serverTimestamp();
        if (data.transmissionDateTime) data.transmissionDateTime = dateToTimestampFormat(new Date(data.transmissionDateTime));

        await addDoc(
            collection(db, '/fax'),
            {
                ...data
            }
        )
        Alert.success($q, t)
    }
    return { saveFax }
})