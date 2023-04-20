import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { BackOrderModel } from 'src/shared/model';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue'

interface BackOrderState {
  BOList: BackOrderModel[]
}

export const useBackOrder = defineStore('backPrder', () => {
	const db = getFirestore();  
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
				...data,
			} as BackOrderModel)
		})
		state.value.BOList = list 
	}
	
	return { state, loadBackOrder }
})
  