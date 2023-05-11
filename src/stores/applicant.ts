import { QueryDocumentSnapshot, collection, getCountFromServer, getDocs, getFirestore, limit, orderBy, query, startAt, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantFilter } from 'src/pages/user/ApplicantProgress/types/applicant.types';
import { Applicant, Client, ClientOffice } from 'src/shared/model';
import { getClientList, getClientFactoriesList } from 'src/shared/utils/Applicant.utils';
import { ref } from 'vue'

interface ApplicantState {
  clientList: Client[],
  selectApplicant: number,
  applicantsByColumn: ApplicantsByColumn,
  applicantsByStatusCount: ApplicantsByStatusCount,
  continueFromDoc: ContinueFromDoc,
  applicantFilter: ApplicantFilter,
  reFilterOnReturn: boolean,
  prefectureList: {label: string, value: string | number}[]
}

type ContinueFromDoc = {
  'wait_contact': null | QueryDocumentSnapshot,
  'wait_attend': null | QueryDocumentSnapshot,
  'wait_FIX': null | QueryDocumentSnapshot,
  'wait_visit': null | QueryDocumentSnapshot,
  'wait_offer': null | QueryDocumentSnapshot,
  'wait_entry': null | QueryDocumentSnapshot,
  'wait_termination': null | QueryDocumentSnapshot,
}

type ApplicantsByStatusCount = {
  'entry': number,
  'retired': number,
  'working': number,
}

type ApplicantsByColumn = {
  'wait_contact': Applicant[] | [];
  'wait_attend': Applicant[] | [];
  'wait_FIX': Applicant[] | [];
  'wait_visit': Applicant[] | [];
  'wait_offer': Applicant[] | [];
  'wait_entry': Applicant[] | [];
  'wait_termination': Applicant[] | [];
};

export const useApplicant = defineStore('applicant', () => {
  const db = getFirestore();  
  const state = ref<ApplicantState>({
    clientList: [] as Client[],
    selectApplicant: 0,
    applicantsByColumn: {
      'wait_contact': [],
      'wait_attend': [],
      'wait_FIX': [],
      'wait_visit': [],
      'wait_offer': [],
      'wait_entry': [],
      'wait_termination': [],
    },
    applicantsByStatusCount: {
      'entry': 0,
      'retired': 0,
      'working': 0,
    },
    continueFromDoc: {
      'wait_contact': null,
      'wait_attend': null,
      'wait_FIX': null,
      'wait_visit': null,
      'wait_offer': null,
      'wait_entry': null,
      'wait_termination': null,
    },
    applicantFilter: {
      branch: '',
      userInCharge: '',
      prefecture: '',
      currentStatusMonth: ''
    },
    reFilterOnReturn: false,
    prefectureList: []
  })

  const countApplicantsByStatus = async (status : string, filterData?: ApplicantFilter) => {
    const filters = [
      where('status', '==', status)
    ]

    if(filterData){
      for(const [key, value] of Object.entries(filterData)){
        if(value){
          filters.push(where(key, '==', value))
        }
      }
    }
    const applicantRef = collection(db, 'applicants')
    const querys = query(applicantRef, ...filters)
    const docCount = await getCountFromServer(querys)
    const result = docCount.data().count
    state.value.applicantsByStatusCount[status] = result
    return result
  }

  const getApplicantsByStatus = async (status : string, filterData?: ApplicantFilter, perQuery = 20, showMore = false) => {
    if(!showMore){
      state.value.applicantsByColumn[status] = []
      state.value.continueFromDoc[status] = null
    }
    const applicantRef = collection(db, 'applicants')
    const filters = [where('status', '==', status)]
    if(filterData){
      for(const [key, value] of Object.entries(filterData)){
        if(value){
          filters.push(where(key, '==', value))
        }
      }
    }
    const start = showMore?[startAt(state.value.continueFromDoc[status])]:[]
    const querys = query(applicantRef, ...filters, orderBy('currentStatusTimestamp', 'asc'), ...start, limit(perQuery+1))
    const docSnap = await getDocs(querys)

    if (!docSnap.empty) {
      const documents = docSnap.docs.map(item => {
        return item.data() as Applicant
      })

      if(perQuery+1 == docSnap.docs.length){
        state.value.continueFromDoc[status] = docSnap.docs[docSnap.docs.length-1]
        documents.pop()
      } else {
        state.value.continueFromDoc[status] = null
      }
      const result = state.value.applicantsByColumn[status].concat(documents)
      state.value.applicantsByColumn[status] = result
      return result
    }
    state.value.continueFromDoc[status] = null
    return []
  }

  async function getClients( active_organization_id?: string ): Promise<Client[]> {
    const clientsData = await getClientList(db, {active_organization_id})
    const list: Client[] = [] ;
    clientsData?.forEach((doc) => {
      const data = doc.data();
      list.push({id: doc.id, ...data} as Client);
    });
    return list;
  }

  async function getClientFactories(client_id: string): Promise<ClientOffice[]>{
      const officeData = await getClientFactoriesList(db, client_id)
      const list: ClientOffice[] = []

      officeData.forEach(office => {
          list.push({id: office.id, ...office.data()} as ClientOffice)
      })

      return list
  }
  
  getClients().then(clients => {
      state.value.clientList = clients
      state.value.clientList.map(async (client) => {
          if (client.id) {
              client.office = await getClientFactories(client.id)
          }
      })
  })

  return { state, getClients, getClientFactories, getApplicantsByStatus, countApplicantsByStatus }
})
  
