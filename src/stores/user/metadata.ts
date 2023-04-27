import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Prefecture } from 'src/shared/model';
import { ref } from 'vue'

interface MetadataState {
  prefectureJP: Prefecture[] | [],
}

export const useMetadata = defineStore('metadata', () => {

  const db = getFirestore();
  const state = ref<MetadataState>({
    prefectureJP: [],
  })

	async function getPrefectureJP(): Promise<Prefecture[]> {
		const docRef = doc(db, 'metadata', 'prefectureJP');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const result = docSnap.data() as Prefecture[];
      state.value.prefectureJP = result;
      console.log(result)
      return result;
    }
    return [];
  }

  return { state, getPrefectureJP }

})