
import { defineStore } from 'pinia';
import { collection, where, getFirestore,doc, serverTimestamp, DocumentData,writeBatch } from 'firebase/firestore';
import {useApplicant} from 'src/stores/applicant'

export const useSMS = defineStore('sms', () => {
  const db = getFirestore();

  async function Send(msg:string, selected:Record<string, { selected: boolean; Number: string }>) {
    try {
      const selectedItems = Object.values(selected).filter((item) => item.selected === true);
      if (selectedItems.length === 0) {
        return false;
      }

      const batch = writeBatch(db);
      for (const item of selectedItems) {
        const docRef = doc(collection(db, 'sms'));
        const docData = {
          to: item.Number,
          body: msg,
          created_at: serverTimestamp(),
        };
        batch.set(docRef, docData);
      }
      batch.commit()
      return true;
    } catch (error) {
      return false;
    }
  }

  const formatDate = (date: string, filteredData: DocumentData) => {
    date = date.split('-').join('/')
    return filteredData.filter((item) => item.applicationDate === date);
  }

  async function filterData(status: string, keyword: string, date: string) {
    let filteredData = await useApplicant().getApplicantsByConstraints([where('deleted', '==', false)]);
    filteredData = getApplicantWithFormatedDate(filteredData)
    if (status || keyword || date) {
      if (status)
        filteredData = filteredData.filter((item) => item.status === status);

      if (date)
        filteredData = formatDate(date, filteredData)

      if (keyword)
        filteredData = filteredData.filter((item) => item.name === keyword);
    }
      return filteredData
  }

  function getApplicantWithFormatedDate(applicantData){
    const rowData = applicantData;
    console.log(rowData)
    rowData.forEach(element=>{
            if (element.applicationDate) {
          const timestamp = element.applicationDate;
          const date = timestamp.toDate();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          element.applicationDate = `${year}/${month}/${day}`;
      }
    })

    return rowData;
  }

  return {  Send, filterData, getApplicantWithFormatedDate }
})
