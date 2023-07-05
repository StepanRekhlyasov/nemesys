import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where,writeBatch } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { BackOrderModel } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue'
export const done = ref (false)
interface BackOrderState {
  BOList: BackOrderModel[]
  selectedBo: BackOrderModel | null,
}

export const useBackOrder = defineStore('backOrder', () => {
	const db = getFirestore();
	const state = ref<BackOrderState>({
			BOList: [],
			selectedBo: null
	})

	async function loadBackOrder() {
		const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]
		const docs = await getDocs(query(
			collection(db, '/BO'),
			...constraints
		))

		const list:BackOrderModel[] = []
		docs.forEach(fix => {
			const data = fix.data()
			list.push({
				...data,
				id: fix.id
			} as BackOrderModel)
		})
		state.value.BOList = list
	}
  async function getBoById(id: string){
    const docSnap = await getDoc(doc(db, 'BO/'+id))
    return {...docSnap.data(), id: docSnap.id} as BackOrderModel
  }
  async function addBackOrder(backOrderData) {
    const auth = getAuth();
    const data = JSON.parse(JSON.stringify(backOrderData));
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['registrant'] = auth.currentUser?.uid
    const snapshot = await getDocs(query(collection(db, '/BO')))
    data['boId'] = snapshot.docs.length
    const clientRef = collection(db, '/BO');
    await addDoc(clientRef, data);
    Alert.success()
  }
	async function getClientBackOrder(clientId: string): Promise<BackOrderModel[]> {
		const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc'), where('clientId', '==', clientId)]
		const docs = await getDocs(query(
			collection(db, '/BO'),
			...constraints
		))

		const list:BackOrderModel[] = []
		docs.forEach(fix => {
			const data = fix.data()
			list.push({
				...data,
			} as BackOrderModel)
		})
		return list;
	}

	async function getClientFactoryBackOrder(office_id: string): Promise<BackOrderModel[]> {
		const constraints: ConstraintsType = [where('deleted', '==', false), where('office_id', '==', office_id)]
		const docs = await getDocs(query(
			collection(db, '/BO'),
			...constraints
		))

		const list:BackOrderModel[] = []
		docs.forEach(fix => {
			const data = fix.data()
			list.push({
				...data,
        id: fix.id
			} as BackOrderModel)
		})
		return list;
	}

	async function updateBackOrder(backOrder: BackOrderModel) {
		if (!state.value.selectedBo) return ;

		const boRef = doc(db, '/BO/'+backOrder.id);
		await updateDoc(boRef, {...backOrder});

		const changeIndex = state.value.BOList.findIndex(bo => bo.id === state.value.selectedBo?.id)

		state.value.BOList[changeIndex] = state.value.selectedBo;

		state.value.BOList = state.value.BOList.map(bo => {
			if (bo.id === state.value.selectedBo?.id) {
				return backOrder
			}
			return bo
		})

	}

	const deleteBackOrder = async (boList) => {
		const ret = boList.map( async (bo) => {
			const boRef = doc(db, '/BO/'+bo.id);
			await updateDoc(boRef, {
				deleted: true
			})
		})
		Promise.all(ret)
	}
  const deleteBO = async (ids) => {
    const updateData = {};
    updateData['deleted'] = true;
    const batch = writeBatch(db);
    for (const id of ids) {
      batch.update(doc(db, 'BO' , id), updateData);
    }
    await batch.commit();
    return true;
  };
	return { state, loadBackOrder, addBackOrder, getClientBackOrder, deleteBackOrder, updateBackOrder, getClientFactoryBackOrder, getBoById,deleteBO }
})
