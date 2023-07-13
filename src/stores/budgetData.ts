import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, query, getDocs, DocumentData, where, Timestamp, doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { getStorage, ref as refStorage, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { exportFile, date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { occupationList } from 'src/shared/constants/Applicant.const';
import { budgetAddItem } from 'src/pages/user/budget/consts/Budget.const';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { dateToTimestampFormat } from 'src/shared/utils/utils';
import { useBranch } from './branch';

export const useBudget = defineStore('budget', () => {
	const db = getFirestore();
	const options = ref({ occupation: occupationList });
	const budgetList = ref(<DocumentData[]>[]);
	const unsubscribe = ref();
	const auth = getAuth();
	const branchStore = useBranch()

	async function saveBudget(budgetData) {
		const data = JSON.parse(JSON.stringify(budgetData));
		if (data['postingStartDate'] > data['postingEndDate']) {
			Alert.warning('Posting start date > Posting end date');
			return false
		}
		if (data.postingEndDate) data.postingEndDate = dateToTimestampFormat(new Date(data.postingEndDate));
		if (data.postingStartDate) data.postingStartDate = dateToTimestampFormat(new Date(data.postingStartDate));

		let docRef;
		if (!data['id']) {
			data['created_at'] = serverTimestamp();
			data['deleted'] = false;
			docRef = doc(collection(db, 'budgets'));
			data['id'] = docRef.id;
			await setDoc(docRef, data);
		} else {
			docRef = doc(db, 'budgets', data['id']);
			data['updated_at'] = serverTimestamp();
			await updateDoc(docRef, data);
		}


		Alert.success()
		return true
	}
	async function getOptionData(organizationId: string) {
		const docsMedia = await getDocs(query(collection(db, 'media')));
		const mediaList: DocumentData = [];
		docsMedia.forEach((doc) => {
			mediaList.push({ value: doc.id, label: doc.data().name });
		});
		options.value['media'] = mediaList;
		const branches = Object.values((await branchStore.getBranchesInOrganization(organizationId)))
		options.value['branch'] = branches.map((b) => {
			return { value: b.id, label: b.name }
		})
		return options.value;
	}
	async function getBudgetList(selectedYear: number, selectedMonth: number, organizationId: string) {
		await getOptionData(organizationId);
		const nextMonth = selectedMonth == 12 ? 1 : selectedMonth + 1;
		const nextYear = selectedMonth == 12 ? selectedYear + 1 : selectedYear;
		const start = Timestamp.fromDate(new Date(`${selectedYear}-${('0' + selectedMonth).slice(-2)}-01`))
		const end = Timestamp.fromDate(new Date(`${nextYear}-${('0' + nextMonth).slice(-2)}-01`))
		const q = query(collection(db, 'budgets'), where('deleted', '==', false), where('created_at', '>=', start), where('created_at', '<', end), where('organizationId', '==', organizationId));

		if (unsubscribe.value) {
			unsubscribe.value();
		}

		unsubscribe.value = onSnapshot(q, (querySnapshot) => {
			const items: DocumentData[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				data['media'] = getItem(data['media'], 'media')
				data['branch'] = getItem(data['branch'], 'branch')
				data['occupation'] = getItem(data['occupation'], 'occupation')
				data['id'] = doc.id
				data['selected'] = false
				items.push(data);
			});
			budgetList.value = items;
		});
	}
	async function getBudgetData(budgetId: string) {
		const applicantRef = doc(db, 'budgets/' + budgetId);
		const result = await getDoc(applicantRef)
		return { id: result.id, ...result.data() }
	}

	const getItem = (item: string, key: string) => {
		const obj = options.value[key].find(o => o.value === item);
		if (obj) {
			return obj.label;
		}
	};
	const deleteBudget = async (budgetIds) => {
		const updateData = {}
		updateData['deleted'] = true;
		updateData['deleted_by'] = auth.currentUser?.uid;
		updateData['deleted_at'] = serverTimestamp();
		const batch = writeBatch(db);
		for (const budgetId of budgetIds) {
			batch.update(
				doc(db, 'budgets/' + budgetId),
				updateData
			);
		}
		// Commit the batch
		await batch.commit();

		return true;
	};

	const downloadSampleFile = async () => {
		const storage = getStorage();
		const resumeRef = refStorage(storage, 'gs://dev-nemesys-firebase.appspot.com/meta/budget_sample.csv');
		const url = await getDownloadURL(resumeRef)
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'blob';
		xhr.onload = () => {
			const status = exportFile(
				'budget_sample.csv',
				xhr.response,
				'text/csv'
			)
			if (status !== true) {
				Alert.warning('Browser denied file download...', { color: 'negative' })
			}
		};
		xhr.open('GET', url);
		xhr.send();


	};
	const wrapCsvValue = (val: string) => {
		let formatted = val

		formatted = !formatted ? '' : String(formatted)

		formatted = formatted.split('"').join('""')
		/**
		 * Excel accepts \n and \r in strings, but some other CSV parsers do not
		 * Uncomment the next two lines to escape new lines
		 */
		// .split('\n').join('\\n')
		// .split('\r').join('\\r')

		return `"${formatted}"`
	}

	const exportTable = async (rows) => {
		// naive encoding to csv format
		const content = '\uFEFF' + [budgetAddItem.value.map(col => wrapCsvValue(col.label))].concat(
			rows.map(row => budgetAddItem.value.map(col => wrapCsvValue(row[col.key])).join(','))
		).join('\r\n')

		const timeStamp = Date.now()
		const formattedString = date.formatDate(timeStamp, 'YYYYMMDDHHmmss')

		const status = exportFile(
			`budget_export_${formattedString}.csv`,
			content,
			{
				encoding: 'utf-8-sig',
				mimeType: 'text/csv;charset=utf-8-sig;'
			}
		)
		if (status !== true) {
			Alert.warning('Browser denied file download...', { color: 'negative' })
		}
	}


	return { saveBudget, getOptionData, getBudgetList, getBudgetData, deleteBudget, budgetList, downloadSampleFile, exportTable }
})
