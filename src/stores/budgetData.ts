import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, query, getDocs, DocumentData, where, doc, getDoc, onSnapshot, writeBatch, orderBy, Timestamp } from 'firebase/firestore';
import { getStorage, ref as refStorage, getDownloadURL } from 'firebase/storage';
import { defineStore } from 'pinia';
import { exportFile, date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { occupationList } from 'src/shared/constants/Applicant.const';
import { budgetAddItem } from 'src/pages/user/budget/consts/Budget.const';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { dateToTimestampFormat, toJPDateString, toDateFormat } from 'src/shared/utils/utils';
import { deepCopy } from 'src/shared/utils';
import { useBranch } from './branch';
import { BudgetData } from 'src/pages/user/budget/type/budget'

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
    if (data.postingStartDate) data.postingStartDate = dateToTimestampFormat(new Date(data.postingStartDate));
    if (!data.accountingMonth) {
      return
    }
    const checkMonth = data.accountingMonth.split('/')
    if (checkMonth[1].length == 1) {
      data.accountingMonth = `${checkMonth[0]}/${('0' + checkMonth[1]).slice(-2)}`;
    }

    data.accountingMonthDate = dateToTimestampFormat(new Date(data.accountingMonth));

    if (!data['id']) {
      const snapshot = await getDocs(query(collection(db, '/budgets'), where('organizationId', '==', organization.currentOrganizationId)))
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
  async function getBudgetList(accountingMonth: string, organizationId: string) {
    await getOptionData(organizationId);
    const constraints = [where('deleted', '==', false)]

    if (accountingMonth) {
      const checkMonth = accountingMonth.split('/')
      constraints.push(where('accountingMonth', '==', `${checkMonth[0]}/${('0' + checkMonth[1]).slice(-2)}`))
    }
    const q = query(collection(db, 'budgets'), where('deleted', '==', false), where('organizationId', '==', organizationId), ...constraints, orderBy('recordNumber', 'desc'));
    if (unsubscribe.value) {
      unsubscribe.value();
    }
    unsubscribe.value = onSnapshot(q, (querySnapshot) => {
      const items: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data['mediaId'] = data['media'];
        data['media'] = getItem(data['media'], 'media')
        data['branchId'] = data['branch'];
        data['branch'] = getItem(data['branch'], 'branch')
        data['occupationId'] = data['occupation']
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
    const budgetData: BudgetData[] = deepCopy(rows)
    for (let i = 0; i < budgetData.length; i++) {
      budgetData[i]['postingStartDate'] = toDateFormat(budgetData[i]['postingStartDate'] as Timestamp)
      budgetData[i]['postingEndDate'] = toDateFormat(budgetData[i]['postingEndDate'] as Timestamp)
      if (budgetData[i]['accountingMonth']) {
        budgetData[i]['accountingMonth'] = toJPDateString(budgetData[i]['accountingMonth'])
      }

    }

    const content = '\uFEFF' + [budgetAddItem.value.map(col => wrapCsvValue(col.label))].concat(
      budgetData.map(row => budgetAddItem.value.map(col => wrapCsvValue(row[col.key])).join(','))
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
  const CSVtoArray = (text: string) => {
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    const a: string[] = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
      function (m0: string, m1: string, m2: string, m3: string) {
        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        // Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return ''; // Return empty string.
      });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
  }

  const processData = async (data: string, accountingMonth: string, preview = false) => {
    try {
      const rowsInString = data
      const rows = rowsInString.split('\r\n')
      const batch = writeBatch(db);
      const previewData: { ok: BudgetData[], ng: BudgetData[] } = ({ ok: [], ng: [] });
      await getOptionData(organization.currentOrganizationId);
      const snapshot = await getDocs(query(collection(db, '/budgets'), where('organizationId', '==', organization.currentOrganizationId)))
      let recordNumber = snapshot.docs.length + 1;
      for (let i = 1; i < rows.length; i++) {
        const formateData = CSVtoArray(rows[i]) as string[];
        if (formateData.length < 2) continue
        const budgetData = getFormateData(formateData);

        budgetData.value.accountingMonth = budgetData.value.accountingMonth.replace(/[年]/g, '/').replace(/[月]/g, '')
        const checkMonth = budgetData.value.accountingMonth.split('/')
        if (checkMonth && checkMonth.length > 1 && checkMonth[1].length == 1) {
          budgetData.value.accountingMonth = `${checkMonth[0]}/${('0' + checkMonth[1]).slice(-2)}`
        }
        const budgetDataCopy = deepCopy(budgetData.value)

        budgetData.value.accountingMonthDate = dateToTimestampFormat(new Date(budgetData.value.accountingMonth));
        budgetData.value.postingEndDate = dateToTimestampFormat(new Date(budgetData.value.postingEndDate as string)) as Timestamp;
        budgetData.value.postingStartDate = dateToTimestampFormat(new Date(budgetData.value.postingStartDate as string)) as Timestamp;
        budgetData.value.media = getColoumnsData('media', budgetData.value.media);
        budgetData.value.branch = getColoumnsData('branch', budgetData.value.branch);
        budgetData.value.occupation = getColoumnsData('occupation', budgetData.value.occupation);

        const items = ['accountingMonth', 'postingEndDate', 'postingStartDate', 'media', 'branch', 'occupation', 'amount']
        let ng = false;
        items.forEach(item => {
          if (!budgetData.value[item] || budgetData.value[item] == '-') {
            budgetDataCopy[item] = ''
            budgetDataCopy['ngFields'].push(item)
            ng = true
          }
        });
        if (ng) {
          previewData.ng.push({ ...budgetDataCopy })
          continue
        }

        budgetData.value['updated_at'] = serverTimestamp();
        budgetData.value['deleted'] = false;
        if (budgetData.value.id) {
          budgetData.value['recordNumber'] = parseInt(budgetData.value['recordNumber'] as string);
          budgetData.value['updated_by'] = auth.currentUser?.uid;
          const docRef = doc(db, 'budgets', budgetData.value.id);
          if (preview) {
            previewData.ok.push({ ...budgetData.value })
          } else {
            batch.update(docRef, { ...budgetData.value });
          }
        } else {
          budgetData.value['created_at'] = serverTimestamp();
          budgetData.value['recordNumber'] = recordNumber;
          budgetData.value['added_by'] = auth.currentUser?.uid;
          const docRef = doc(collection(db, 'budgets'));
          budgetData.value['id'] = docRef.id;
          if (preview) {
            previewData.ok.push({ ...budgetData.value })
          } else {
            batch.set(docRef, { ...budgetData.value });
          }
          recordNumber += 1;
        }

      }
      if (!preview) {
        await batch.commit()
        await getBudgetList(accountingMonth, organization.currentOrganizationId);
        return true
      }
      return previewData

    } catch (error) {
      console.log(error)
    }

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

  const getFormateData = (formateDataCSV: string[]) => {
    const budgetData = ref<BudgetData>({
      organizationId: organization.currentOrganizationId,
      accountingMonth: '',
      amount: '',
      branch: '',
      media: '',
      numberOfSlots: '',
      occupation: '',
      postingEndDate: '',
      postingStartDate: '',
      unitPrice: '',
      remark: '',
      agency: '',
      id: '',
      recordNumber: '',
    });
    budgetData.value['ngFields'] = [];
    budgetData.value.id = formateDataCSV[0].replace(/"/g, '');
    budgetData.value.recordNumber = formateDataCSV[1].replace(/"/g, '');
    budgetData.value.media = formateDataCSV[2].replace(/"/g, '');
    budgetData.value.branch = formateDataCSV[3].replace(/"/g, '');
    budgetData.value.occupation = formateDataCSV[4].replace(/"/g, '');
    budgetData.value.postingStartDate = formateDataCSV[5].replace(/"/g, '')
    budgetData.value.postingEndDate = formateDataCSV[6].replace(/"/g, '')
    budgetData.value.accountingMonth = formateDataCSV[7].replace(/"/g, '');
    budgetData.value.amount = formateDataCSV[8].replace(/"/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    budgetData.value.numberOfSlots = formateDataCSV[9].replace(/"/g, '');
    budgetData.value.unitPrice = formateDataCSV[10].replace(/"/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    budgetData.value.agency = formateDataCSV[11].replace(/"/g, '');
    budgetData.value.remark = formateDataCSV[12].replace(/"/g, '');
    return budgetData;
  }
  const getChartData = async (media: { label: string, value: string }[], monthList: string[], branchId: string, organizationId: string) => {
    const chatItems: object[] = []
    for (let i = 0; i < monthList.length; i++) {
      const chatItem = {}
      const constraints = [where('deleted', '==', false), where('accountingMonth', '==', monthList[i]), where('organizationId', '==', organizationId)]
      const q = query(collection(db, 'budgets'), ...constraints);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let amount = data.amount;
        if (branchId && branchId != data.branch) {
          return
        }
        if (amount) {
          amount = parseInt(amount.replace(/,/g, ''), 10);
          const index = media.findIndex(x => x.value === data['media']);
          if (index > -1) {
            if (chatItem[media[index]['label']]) {
              chatItem[media[index]['label']] += amount;
            } else {
              chatItem[media[index]['label']] = amount;
            }

          }
        }
      })
      chatItems.push(chatItem);
    }

    const series: { name: string, data: number[] }[] = []
    media.forEach(md => {
      const values: number[] = []
      chatItems.forEach(chatItem => {
        if (chatItem[md.label]) {
          values.push(chatItem[md.label] as number)
        } else {
          values.push(0)
        }
      })
      series.push({ name: md.label, data: values })
    })

    return series

  }

  return { saveBudget, processData, getOptionData, getBudgetList, getBudgetData, deleteBudget, budgetList, downloadSampleFile, exportTable, getItem, getChartData }
})
