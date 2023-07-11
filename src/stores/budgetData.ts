import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, query, getDocs, collectionGroup, DocumentData, where, Timestamp, doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
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
	const db = getFirestore();
	const options = ref({ occupation: occupationList });
	const budgetList = ref(<DocumentData[]>[]);
	const unsubscribe = ref();
	const auth = getAuth();

	async function saveBudget(budgetData) {
    const length = await getBudgetLength()
		const data = JSON.parse(JSON.stringify(budgetData));
		if(data.postingEndDate) data.postingEndDate = dateToTimestampFormat(new Date(data.postingEndDate));
		if(data.postingStartDate) data.postingStartDate = dateToTimestampFormat(new Date(data.postingStartDate));
		let docRef;
		if (!data['id']) {
			data['created_at'] = serverTimestamp();
      data['recordNumber'] = length+1;
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

  const getBudgetLength = async () => {
    const budgetsCollection = collection(db, 'budgets');
    const q = query(budgetsCollection, where('deleted', '==', false));
    const querySnapshot = await getDocs(q);
    const length = querySnapshot.docs.length;
    return length;
  };

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
		const q = query(collection(db, 'budgets'), where('deleted', '==', false));
		if (unsubscribe.value) {
			unsubscribe.value();
		}
		unsubscribe.value = onSnapshot(q, (querySnapshot) => {
			const items: DocumentData[] = [];
			querySnapshot.forEach((doc) => {
        // if(typeof doc.data().accountingMonth==='string'){
        // }
        if(doc.data().accountingMonth){
        const timeStamp = doc.data().accountingMonth.split('/');
        const year = Number(timeStamp[0])
        const month = Number(timeStamp[1])
        if(year===selectedYear && month===selectedMonth){
          const data = doc.data();
          data['media'] = getItem(data['media'], 'media')
          data['branch'] = getItem(data['branch'], 'branch')
          data['occupation'] = getItem(data['occupation'], 'occupation')
          data['id'] = doc.id
          data['selected'] = false
          items.push(data);
        }
      }
      else{
        const data = doc.data();
          data['media'] = getItem(data['media'], 'media')
          data['branch'] = getItem(data['branch'], 'branch')
          data['occupation'] = getItem(data['occupation'], 'occupation')

          data['id'] = doc.id
          data['selected'] = false
          items.push(data);
      }
			});
      items.sort((a,b)=>a.recordNumber-b.recordNumber);
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

  const processData = async (data,selectedYear:number,selectedMonth:number) => {
    const rows = data.split('\r\n')
    for (let i = 1; i < rows.length; i++) {
      const formateData = rows[i].split(',')
      const budgetData = getFormateData(formateData);
      await getOptionData();

      budgetData.value.media = getColoumnsData('media',budgetData.value.media);
      budgetData.value.branch = getColoumnsData('branch',budgetData.value.branch);
      budgetData.value.occupation = getColoumnsData('occupation',budgetData.value.occupation);

      budgetData.value['postingStartDate'] = getDateFromString(budgetData.value.postingStart)
      budgetData.value['postingEndDate'] = getDateFromString(budgetData.value.postingEnd)

      await saveBudget(budgetData.value)
    }
    await getBudgetList(selectedYear, selectedMonth);
  }

 const getColoumnsData = (key:string,value:string)=>{
  let correctValue = '';
  options.value[key].forEach(item=>{
    if(item.label===value){
      correctValue = item.value
    }
  })
  return correctValue;
 }

  const getFormateData = (formateData)=>{
    const budgetData = ref({
      accountingMonth: '',
      amount: '',
      branch: '',
      id: '',
      media: '',
      numberOfSlots: '',
      occupation: '',
      postingEnd: '',
      postingStart: '',
      unitPrice: '',
      remark: '',
      agency: '',
    });
    budgetData.value.media = formateData[0].replace(/"/g, '');
    budgetData.value.branch = formateData[1].replace(/"/g, '');
    budgetData.value.occupation = formateData[2].replace(/"/g, '');
    budgetData.value.postingStart = formateData[3].replace(/"/g, '')+','+formateData[4].replace(/"/g, '');
    budgetData.value.postingEnd = formateData[5].replace(/"/g, '')+','+formateData[6].replace(/"/g, '');
    budgetData.value.accountingMonth = formateData[7].replace(/"/g, '');
    budgetData.value.amount = formateData[8].replace(/"/g, '');
    budgetData.value.numberOfSlots = formateData[9].replace(/"/g, '');
    budgetData.value.unitPrice = formateData[10].replace(/"/g, '');
    budgetData.value.agency = formateData[11].replace(/"/g, '');
    budgetData.value.remark = formateData[12].replace(/"/g, '');
    return budgetData;
  }

  const getDateFromString = (dateInString)=>{
      const secondsMatchStr = dateInString.match(/seconds=(\d+)/);
      if (secondsMatchStr && secondsMatchStr[1]) {
        const seconds = parseInt(secondsMatchStr[1]);
        const date = new Date(seconds * 1000);
        return date;
      }
  }

	return { saveBudget, processData, getOptionData, getBudgetList, getBudgetData, deleteBudget, budgetList, downloadSampleFile, exportTable }
})
