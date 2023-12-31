import { ref, computed } from 'vue'
import { defineStore } from 'pinia';
import { collection, where, getFirestore, doc, serverTimestamp, DocumentData, writeBatch, query, getDocs } from 'firebase/firestore';
import { useApplicant } from 'src/stores/applicant'
import { useOrganization } from 'src/stores/organization';
import { templateCollection } from 'src/shared/utils/utils';

export const useSMS = defineStore('sms', () => {
  const db = getFirestore();

  async function send(msg: string, selected: Record<string, { selected: boolean; phoneNumber: string | undefined }>) {
    const selectedItems = Object.values(selected).filter((item) => item.selected === true);
    if (selectedItems.length === 0) {
      throw new Error('No selected Applicants');
    }
    const batch = writeBatch(db);
    for (const item of selectedItems) {
      const docRef = doc(collection(db, 'sms'));
      const docData = {
        to: item.phoneNumber,
        body: msg,
        created_at: serverTimestamp(),
      };
      batch.set(docRef, docData);
    }
    await batch.commit()
  }

  const formatDate = (date: string, filteredData: DocumentData) => {
    date = date.split('-').join('/')
    return filteredData.filter((item) => item.applicationDate === date);
  }

  async function filterData(status: string | null, keyword: string | null, date: string | null) {
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

  function getApplicantWithFormatedDate(applicantData) {
    const rowData = applicantData;
    rowData.forEach(element => {
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

const options = computed(async () => {
    const organization = useOrganization();
    const templates = ref<DocumentData[]>([]);
    const db = getFirestore();
    const q = query(templateCollection(db, organization.currentOrganizationId), where('deleted', '==', false));
    const querySnapshot = await getDocs(q);

    const fetchedTemplates: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      const template = doc.data();
      template['label'] = template.name;
      fetchedTemplates.push(template);
    });

    templates.value = fetchedTemplates;

    return templates.value;
  });

  return { options, send, filterData, getApplicantWithFormatedDate }
})
