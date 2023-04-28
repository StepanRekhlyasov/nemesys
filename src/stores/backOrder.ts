import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { BackOrderModel } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

interface BackOrderState {
  BOList: BackOrderModel[]
}

export const useBackOrder = defineStore('backPrder', () => {
	const db = getFirestore();  
	const { t } = useI18n({ useScope: 'global' });
	const $q = useQuasar();
	const state = ref<BackOrderState>({
			BOList: []
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
				id: data.id,
				...data,
			} as BackOrderModel)
		})
		state.value.BOList = list 
	}

	async function addBackOrder(backOrderData, clientId: string) {
		const data = JSON.parse(JSON.stringify(backOrderData));
		data['created_at'] = serverTimestamp();
		data['updated_at'] = serverTimestamp();
		data['clientId'] = clientId;
		data['deleted'] = false;

		const clientRef = collection(db, '/BO');
		await addDoc(clientRef, data);
		Alert.success($q, t)
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

	const deleteBackOrder = async (boList) => {
		const ret = boList.map( async (bo) => {
			const boRef = doc(db, '/BO/'+bo.id);
			await updateDoc(boRef, {
				deleted: true
			})
		})
		Promise.all(ret)
	}
	
	return { state, loadBackOrder, addBackOrder, getClientBackOrder, deleteBackOrder}
})
  