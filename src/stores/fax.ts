import { defineStore } from 'pinia';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Alert } from 'src/shared/utils/Alert.utils';
import { getAuth } from 'firebase/auth';
import { dateToTimestampFormat } from 'src/shared/utils/utils';

export const useFax = defineStore('fax', () => {
    const db = getFirestore();
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
            Alert.warning(error);
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
        Alert.success()
    }
    return { saveFax }
})