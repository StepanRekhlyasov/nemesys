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
    if(state.value.prefectureJP.length){
      return state.value.prefectureJP
    }
		const docRef = doc(db, 'metadata', 'prefectureJP');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const result = docSnap.data() as Prefecture[];
      state.value.prefectureJP = result;
      return result;
    }
    return [];
  }

  async function getStationRoutes() {
    const stationDocRef = doc(db, 'metadata', 'stationRoutes');
    const stationDocSnap = await getDoc(stationDocRef);

    if (stationDocSnap.exists()) {
      return stationDocSnap.data().routes;
    }
    return []
  }
  async function getStationByID(id : string) {
    const docRef = doc(db, 'metadata', 'stationRoutes', 'station', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()['stations'];
    }
    return []
  }

  return { state, getPrefectureJP, getStationRoutes, getStationByID }

})