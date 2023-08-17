import { getFirestore, onSnapshot, collection, addDoc, setDoc, doc, query, where, getDocs ,serverTimestamp ,writeBatch} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Industry } from 'src/shared/model/Industry.model';
import { ref, onBeforeUnmount } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { getAuth } from 'firebase/auth';

export const useIndsutry = defineStore('industries', () => {

    // db
    const db = getFirestore();
    const auth = getAuth()
    // state
    const industries = ref<Industry[]>([])
    const isFirstLoading = ref(true)

    // unsubscribe
    const unsubscribe = ref<(() => void) | null>(null);

    // methods

    const getIndustries = () => {
      unsubscribe.value = onSnapshot(
          query(collection(db, 'industries'), where('deleted', '==', false)),
          (snapshot) => {
              industries.value = snapshot.docs.map(doc => {
                  const industry = { id: doc.id, ...doc.data() } as Industry;

                  industry.uniqueItems.typeSpecificItems = Object.entries(industry.uniqueItems.typeSpecificItems)
                      .sort(([, a], [, b]) => a.order - b.order)
                      .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});

                  industry.uniqueItems.facilityForms = Object.entries(industry.uniqueItems.facilityForms)
                      .sort(([, a], [, b]) => a.order - b.order)
                      .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});
                  if((industry.uniqueItems.certificateForms)){
                    industry.uniqueItems.certificateForms = Object.entries(industry.uniqueItems.certificateForms)
                    .sort(([, a], [, b]) => a.order - b.order)
                    .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});
                  }
                  else{
                    industry.uniqueItems.certificateForms = {}
                  }
                  if((industry.uniqueItems.occupationForms)){
                    industry.uniqueItems.occupationForms = Object.entries(industry.uniqueItems.occupationForms)
                    .sort(([, a], [, b]) => a.order - b.order)
                    .reduce((acc, [key, item]) => ({ ...acc, [key]: item }), {});
                  }
                  else{
                    industry.uniqueItems.occupationForms = {}
                  }
                  return industry;
              });

              isFirstLoading.value = false;
          }
      );
  };



    const stopListening = () => {
        if (unsubscribe.value) {
            unsubscribe.value();
            unsubscribe.value = null;
        }
    };

    const addIndustry = async (industry: Omit<Industry, 'id'>) => {
        try {
            const docRef = await addDoc(collection(db, 'industries'), industry);
            if(docRef.id) {
              return docRef.id
            }
        } catch (e) {
            Alert.warning(e)
            console.log( e);
        }
    };

    const updateIndustry = async (industryId: string , updatedIndustry: Industry) => {
        try {
            await setDoc(doc(db, 'industries', industryId), updatedIndustry)
        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
    }
    const addId = async (industryId: string , updatedIndustry) => {
      try {
          await setDoc(doc(db, 'industries', industryId), updatedIndustry)
      } catch(e) {
          Alert.warning(e)
          console.log(e)
      }
  }

    const deleteIndustry = async (id: string |  undefined) => {
      const updateData = {}
      updateData['deleted'] = true;
      updateData['deleted_by'] = auth.currentUser?.uid;
      updateData['deleted_at'] = serverTimestamp();
      const batch = writeBatch(db);
        batch.update(
          doc(db, 'industries/' + id),
          updateData
        );
      await batch.commit();
    };

    const getIndustryByName = async (industryName: string) => {
        try {
            const q = query(collection(db, 'industries'), where('industryName', '==', industryName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as Industry;
            } else {
                return null;
            }

        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
    }

      const getCertificate = async (industryName: string) => {
        try {
            const industry = await getIndustryByName(industryName);

            if (industry) {
                const certificateTitles: string[] = [];

                for (const key in industry.uniqueItems.certificateForms) {
                    certificateTitles.push(industry.uniqueItems.certificateForms[key].title);
                }
                return {
                    certificateTitles
                };
            } else {
                console.log('no industry');
                return null;
            }
        } catch (e) {
            console.error('Error fetching industry:', e);
            return null;
        }
    }
    const getOccupation = async (industryName: string) => {
      try {
          const industry = await getIndustryByName(industryName);

          if (industry) {
              const occupationTitles: string[] = [];
              for (const key in industry.uniqueItems.occupationForms) {
                occupationTitles.push(industry.uniqueItems.occupationForms[key].title);
              }
              return {
                occupationTitles
              };
          } else {
              console.log('no industry');
              return null;
          }
      } catch (e) {
          console.error('Error fetching industry:', e);
          return null;
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
        updateIndustry,
        getIndustryByName,
        getOccupation,
        getCertificate,
        deleteIndustry,
        addId
    }
})
