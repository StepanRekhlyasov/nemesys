import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, query, getDocs, collectionGroup, DocumentData, where, Timestamp, doc, getDoc, onSnapshot, writeBatch, QueryFieldFilterConstraint} from 'firebase/firestore';
import { getStorage, ref as refStorage, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { exportFile, date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { occupationList } from 'src/shared/constants/Applicant.const';
import { budgetAddItem } from 'src/pages/user/budget/consts/Budget.const';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { dateToTimestampFormat } from 'src/shared/utils/utils';

export const useBudget = defineStore('budget', () => {
  const monthPerYear = 12;
	const db = getFirestore();
	const options = ref({ occupation: occupationList });
	const budgetList = ref(<DocumentData[]>[]);
	const unsubscribe = ref();
	const auth = getAuth();

	async function saveBudget(budgetData) {
		const data = JSON.parse(JSON.stringify(budgetData));
		if (data['postingStartDate'] > data['postingEndDate']) {
			Alert.warning('Posting start date > Posting end date');
			return false
		}
		if(data.postingEndDate) data.postingEndDate = dateToTimestampFormat(new Date(data.postingEndDate));
		if(data.postingStartDate) data.postingStartDate = dateToTimestampFormat(new Date(data.postingStartDate));

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
	async function getOptionData() {
		const docsMedia = await getDocs(query(collection(db, 'media')));
		const mediaList: DocumentData = [];
		docsMedia.forEach((doc) => {
			mediaList.push({ value: doc.id, label: doc.data().name });
		});
		options.value['media'] = mediaList;

		const docsBranch = await getDocs(query(collectionGroup(db, 'branches')));
		const branchList: DocumentData = [];
		docsBranch.forEach((doc) => {
			branchList.push({ value: doc.id, label: doc.data().name });
		});
		options.value['branch'] = branchList;

		return options.value;

	}
	async function getBudgetList(selectedYear: number, selectedMonth: number) {
		await getOptionData();
		const nextMonth = selectedMonth == 12 ? 1 : selectedMonth + 1;
		const nextYear = selectedMonth == 12 ? selectedYear + 1 : selectedYear;
		const start = Timestamp.fromDate(new Date(`${selectedYear}-${('0' + selectedMonth).slice(-2)}-01`))
		const end = Timestamp.fromDate(new Date(`${nextYear}-${('0' + nextMonth).slice(-2)}-01`))
		const q = query(collection(db, 'budgets'), where('deleted', '==', false), where('created_at', '>=', start), where('created_at', '<', end));

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

  const getUnitPricePerOrganization = async (
    dateRangeProps?: { from: string; to: string },
    organization_id?: string,
    beforeMonth = 7
  ) => {
    const mediaRef = collection(db, 'budgets');
    const filters: QueryFieldFilterConstraint[] = [];
    const filters_: QueryFieldFilterConstraint[] = [];

    if (organization_id !== undefined) {
      filters.push(where('organization_id', '==', organization_id));
    }
    //dateRangeProps is like {from:1900/01/01,to:1900/12/01}
    if (dateRangeProps === undefined) return;
    const toMonth = dateRangeProps.to.split('/')[1];
    const year = dateRangeProps.to.split('/')[0];

    //get month from before 7 month
    const fromMonth = Number(toMonth) - beforeMonth + 1;

    filters.push(where('record_year', '==', Number(year)));
    filters.push(where('record_month', '<=', Number(toMonth)));
    filters.push(where('record_month', '>=', Number(fromMonth)));
    if (fromMonth <= 0) {
      filters_.push(where('record_year', '==', Number(year) - 1));
      filters_.push(where('record_month', '>=', Number(fromMonth) + 12));
    }
    const querys = query(mediaRef, ...filters);
    const docSnap = await getDocs(querys);
    const querys_ = query(mediaRef, ...filters_);
    const docSnap_ = await getDocs(querys_);

    const budget_amount: number[] = [];
    budget_amount.length = beforeMonth;
    budget_amount.fill(0);

    const number_of_applicants: number[] = [];
    number_of_applicants.length = beforeMonth;
    number_of_applicants.fill(0);

    const number_of_admission: number[] = [];
    number_of_admission.length = beforeMonth;
    number_of_admission.fill(0);

    for (const doc of [...docSnap.docs, ...docSnap_.docs]) {
      const budget = doc.data() ;
      let index: number;
      if (Number(toMonth) - doc.data().record_month < 0) {
        index =
          -Number(toMonth) + doc.data().record_month - monthPerYear + beforeMonth - 1;
      } else {
        index = -Number(toMonth) + doc.data().record_month + beforeMonth - 1;
      }
      budget_amount[index] += budget.budget_amount;
      number_of_applicants[index] += budget.number_of_applicants;
      number_of_admission[index] += budget.number_of_admission;
    }

    const unitpricePerApplicants: number[] = [];
    unitpricePerApplicants.length = beforeMonth;
    unitpricePerApplicants.fill(0);

    const unitpricePerAdmission: number[] = [];
    unitpricePerAdmission.length = beforeMonth;
    unitpricePerAdmission.fill(0);

    for (let i = 0; i < beforeMonth; i++) {
      if (number_of_applicants[i] === 0) continue;
      if (number_of_admission[i] === 0) continue;
      unitpricePerApplicants[i] = budget_amount[i] / number_of_applicants[i];
      unitpricePerAdmission[i] = budget_amount[i] / number_of_admission[i];
    }
    return [unitpricePerApplicants, unitpricePerAdmission];
  };

  const getUnitPricePerOrganizationPerMedia = async (
    mediaList: string[],
    dateRangeProps?: { from: string; to: string },
    organization_id?: string,
  ) => {
    const mediaRef = collection(db, 'budgets');
    const filters: QueryFieldFilterConstraint[] = [];
    if (organization_id) {
      filters.push(where('organization_id', '==', organization_id));
    }
    if (!dateRangeProps) return;
    const toMonth = dateRangeProps.to.split('/')[1];
    const year = dateRangeProps.to.split('/')[0];
    filters.push(where('record_year', '==', Number(year)));
    filters.push(where('record_month', '==', Number(toMonth)));
    const querys = query(mediaRef, ...filters);
    const docSnap = await getDocs(querys);
    const budget_amount: number[] = [];
    budget_amount.length = mediaList.length;
    budget_amount.fill(0);
    const number_of_applicants: number[] = [];
    number_of_applicants.length = mediaList.length;
    number_of_applicants.fill(0);

    for (const doc of docSnap.docs) {
      const budget = doc.data();
      if (!mediaList.includes(doc.data().media)) continue;
      const index = mediaList.indexOf(doc.data().media);
      budget_amount[index] += budget.budget_amount;
      number_of_applicants[index] += budget.number_of_applicants;
    }
    const unitpricePerApplicants: number[] = [];
    unitpricePerApplicants.length = mediaList.length;
    unitpricePerApplicants.fill(0);
    const unitpricePerAdmission: number[] = [];
    unitpricePerAdmission.length = mediaList.length;
    unitpricePerAdmission.fill(0);
    for (let i = 0; i < mediaList.length; i++) {
      if (number_of_applicants[i] === 0) continue;
      unitpricePerApplicants[i] = budget_amount[i] / number_of_applicants[i];
    }
    return unitpricePerApplicants;
  };


	return { saveBudget, getOptionData, getBudgetList, getBudgetData, deleteBudget, budgetList, downloadSampleFile, exportTable ,getUnitPricePerOrganization ,getUnitPricePerOrganizationPerMedia }
})
