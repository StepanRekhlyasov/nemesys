import { getFirestore, onSnapshot, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Industry } from 'src/shared/model/Industry.model';
import { ref, onBeforeUnmount } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';

export const useIndsutry = defineStore('industries', () => {

    // db
    const db = getFirestore();

    // state
    const industries = ref<Industry[]>([])
    const isFirstLoading = ref(true)

    // unsubscribe
    const unsubscribe = ref<(() => void) | null>(null);

    // methods

    const getIndustries = () => {
        unsubscribe.value = onSnapshot(collection(db, 'industries'), (snapshot) => {
            industries.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Industry));
            isFirstLoading.value = false
        });
    };

    const stopListening = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
            unsubscribe.value = null;
        }
    };

    const addIndustry = async (industry: Industry) => {
        try {
            const docRef = await addDoc(collection(db, 'industries'), industry);
            
            if(docRef.id) {
                Alert.success()
            }
        } catch (e) {
            Alert.warning(e)
            console.log( e);
        }
    };

    const updateIndustry = async (industryId: string, updatedIndustry: Industry) => {
        try {
            await setDoc(doc(db, 'industries', industryId), updatedIndustry, {merge: true})

            Alert.success()
        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
    }

    getIndustries();

    // cleanup
    onBeforeUnmount(stopListening);

    return {
        industries,
        isFirstLoading,
        getIndustries,
        addIndustry,
        updateIndustry
    }
})