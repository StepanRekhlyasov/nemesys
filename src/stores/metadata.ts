import { doc, getDoc, getFirestore , collection , getDocs} from 'firebase/firestore';
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

  async function getStations() {
    const docRef = doc(db, 'metadata', 'stationList');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const stationListData = docSnap.data();
      return stationListData;
    }

    return {};
  }

  async function createStationOptions() {
    const stationListData = await getStations();
    const options = Object.values(stationListData).flatMap(stationArray => stationArray);

    return options;
  }

  async function getRouteByStation(station) {
    const collectionRef = collection(db, 'metadata', 'stationRoutes', 'station');
    const querySnapshot = await getDocs(collectionRef);
    for (const docSnap of querySnapshot.docs) {
      const routeName = docSnap.id;
      const stationData = docSnap.data().stations;
      for (let i = 0; i < stationData.length; i++) {
        if (stationData[i] === station) {
          return routeName;
        }
      }
    }
    return '';
  }

  return { state, getPrefectureJP, getStationRoutes, getStationByID ,createStationOptions , getRouteByStation}

})

