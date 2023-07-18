import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, query, getDocs, DocumentData, where, doc, getDoc, onSnapshot, writeBatch, orderBy, Timestamp } from 'firebase/firestore';
import { getStorage, ref as refStorage, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { exportFile, date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { occupationList } from 'src/shared/constants/Applicant.const';
import { budgetAddItem } from 'src/pages/user/budget/consts/Budget.const';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { dateToTimestampFormat, myDateFormat } from 'src/shared/utils/utils';
import { useBranch } from './branch';
import { BudgetData, selectedYearMonth } from 'src/pages/user/budget/type/budget'

import { useOrganization } from 'src/stores/organization';

export const useBudget = defineStore('budget', () => {
  const db = getFirestore();
  const options = ref({ occupation: occupationList });
  const budgetList = ref(<DocumentData[]>[]);
  const unsubscribe = ref();
  const auth = getAuth();
	const branchStore = useBranch()
  const organization = useOrganization();
  async function saveBudget(budgetData: BudgetData) {
    const data = JSON.parse(JSON.stringify(budgetData));
    if (data.postingEndDate) data.postingEndDate = dateToTimestampFormat(new Date(data.postingEndDate));
    if  (data.postingStartDate) data.postingStartDate = dateToTimestampFormat(new Date(data.postingStartDate));
    if  (data.accountingMonth) data.accountingMonthDate = dateToTimestampFormat(new Date(data.accountingMonth));

    if (!data['id']) {
      const snapshot = await getDocs(query(collection(db, '/budgets')))
      data['recordNumber'] = snapshot.docs.length + 1;
      data['created_at'] = serverTimestamp();
      data['deleted'] = false;
      data['added_by'] = auth.currentUser?.uid;
      data['updated_at'] = serverTimestamp();
      const docRef = doc(collection(db, 'budgets'));
      data['id'] = docRef.id;
      await setDoc(docRef, data);
    } else {
      const docRef = doc(db, 'budgets', data['id']);
      data['updated_at'] = serverTimestamp();
      data['updated_by'] = auth.currentUser?.uid;
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
  async function getBudgetList(selectedYear: selectedYearMonth, selectedMonth: selectedYearMonth,organizationId: string) {
    await getOptionData(organizationId);
    const constraints = [where('deleted', '==', false)]
    if (selectedYear && selectedMonth) {
      constraints.push(where('accountingMonth', '==', `${selectedYear}/${('0' + selectedMonth).slice(-2)}`))
    }
    const q = query(collection(db, 'budgets'), where('deleted', '==', false), where('organizationId', '==', organizationId), ...constraints, orderBy('recordNumber'));
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
    return { ...result.data() as BudgetData, id: result.id }
  }

  const getItem = (item: string, key: string) => {

    const obj = options.value[key].find(o => o.value === item);
    if (obj) {
      return obj.label;
    }
  };
  const deleteBudget = async (budgetIds: string[]) => {
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

  const exportTable = async (rows: BudgetData[]) => {
    // naive encoding to csv format
    for (let i = 0; i < rows.length; i++) {
      rows[i]['postingStartDate'] = myDateFormat(rows[i]['postingStartDate'] as Timestamp)
      rows[i]['postingEndDate'] = myDateFormat(rows[i]['postingEndDate'] as Timestamp)
    }

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

  const processData = async (data, selectedYear: selectedYearMonth, selectedMonth: selectedYearMonth) => {
    const rows = data.split('\r\n')
    const batch = writeBatch(db);
    await getOptionData(organization.currentOrganizationId);
    const snapshot = await getDocs(query(collection(db, '/budgets'),where('deleted','==',false)))
    let recordNumber = snapshot.docs.length + 1;
    for (let i = 1; i < rows.length; i++) {
      const formateData = rows[i].split(',')
      if (formateData.length < 2) continue
      const budgetData = getFormateData(formateData);
      if (!budgetData.value.accountingMonth) continue
      budgetData.value.media = getColoumnsData('media', budgetData.value.media);
      budgetData.value.branch = getColoumnsData('branch', budgetData.value.branch);
      budgetData.value.occupation = getColoumnsData('occupation', budgetData.value.occupation);
      budgetData.value.accountingMonthDate = dateToTimestampFormat(new Date(budgetData.value.accountingMonth));
      budgetData.value['updated_at'] = serverTimestamp();
      budgetData.value['deleted'] = false;

      if (budgetData.value.id) {
        budgetData.value['recordNumber'] = parseInt(budgetData.value['recordNumber'] as string);
        budgetData.value['updated_by'] = auth.currentUser?.uid;
        const docRef = doc(db, 'budgets', budgetData.value.id);
        batch.update(docRef, { ...budgetData.value });
      } else {
        budgetData.value['created_at'] = serverTimestamp();
        budgetData.value['recordNumber'] = recordNumber;
        budgetData.value['added_by'] = auth.currentUser?.uid;
        const docRef = doc(collection(db, 'budgets'));
        budgetData.value['id'] = docRef.id;
        batch.set(docRef, { ...budgetData.value });
        recordNumber += 1;
      }

    }
    await batch.commit()
    await getBudgetList(selectedYear, selectedMonth,organization.currentOrganizationId);
  }

  const getColoumnsData = (key: string, value: string) => {
    let correctValue = '';
    options.value[key].forEach(item => {
      if (item.label === value) {
        correctValue = item.value
      }
    })
    return correctValue;
  }

  const getFormateData = (formateData: BudgetData) => {
    const budgetData = ref<BudgetData>({
      // recordNumber: '',
      organizationId:organization.currentOrganizationId,
      accountingMonth: '',
      amount: '',
      branch: '',
      // id: '',
      media: '',
      numberOfSlots: '',
      occupation: '',
      postingEndDate: '',
      postingStartDate: '',
      unitPrice: '',
      remark: '',
      agency: '',
    });
    budgetData.value.media = formateData[2].replace(/"/g, '');
    budgetData.value.branch = formateData[3].replace(/"/g, '');
    budgetData.value.occupation = formateData[4].replace(/"/g, '');
    budgetData.value.postingStartDate = (formateData[5]).replace(/"/g,'')
    budgetData.value.postingEndDate = (formateData[6]).replace(/"/g,'')
    budgetData.value.accountingMonth = formateData[7].replace(/"/g, '');
    budgetData.value.amount = formateData[8].replace(/"/g, '');
    budgetData.value.numberOfSlots = formateData[9].replace(/"/g, '');
    budgetData.value.unitPrice = formateData[10].replace(/"/g, '');
    budgetData.value.agency = formateData[11].replace(/"/g, '');
    budgetData.value.remark = formateData[12].replace(/"/g, '');
    return budgetData;
  }

  return { saveBudget, processData, getOptionData, getBudgetList, getBudgetData, deleteBudget, budgetList, downloadSampleFile, exportTable }
})
