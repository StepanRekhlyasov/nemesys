import { QueryDocumentSnapshot, addDoc, collection, doc, getCountFromServer, getDocs, getFirestore, limit, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantFilter } from 'src/pages/ApplicantProgress/types/applicant.types';
import { Applicant, ApplicantFix, Client, ClientOffice } from 'src/shared/model';
import { getClientList, getClientOfficeList } from 'src/shared/utils/Applicant.utils';
import { toDateFormat } from 'src/shared/utils/utils';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue'

interface ApplicantState {
  clientList: Client[],
  selectApplicant: number,
  applicantsByColumn: ApplicantsByColumn,
  applicantsByStatusCount: ApplicantsByStatusCount,
  continueFromDoc: ContinueFromDoc
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

export interface FixOption {
    operationFilter?: boolean;
}

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
    }
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

  async function getClientOffice(client_id: string): Promise<ClientOffice[]>{
      const officeData = await getClientOfficeList(db, client_id)
      const list: ClientOffice[] = []

      officeData.forEach(office => {
          list.push({id: office.id, ...office.data()} as ClientOffice)
      })

      return list
  }

  async function getFixData(applicant_id: string, operationFilter?: boolean): Promise<ApplicantFix[]> {
      const fixData = await getFixList(applicant_id, {operationFilter})
      const list: ApplicantFix[] = [];
      fixData.forEach(fix => {
          const data = fix.data()
          list.push({
              ...data,
              id: fix.id,
              date: toDateFormat(data['date']),
              offerDate: toDateFormat(data['offerDate']),
              admissionDate: toDateFormat(data['admissionDate']),
              inspectionDate: toDateFormat(data['inspectionDate']),
          } as ApplicantFix)
      })

      return list
  }
  
  async function getFixList(applicant_id: string, option?: FixOption) {
      const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]
    
      if (option && option.operationFilter) {
        constraints.push(where('admissionStatus', '==', 'ok'))
      }
    
      return getDocs(query(
        collection(db, '/fix'), 
        where('applicant_id', '==', applicant_id),
        ...constraints
      ))
  }

  async function saveFix (applicant_id: string, data) {
    await addDoc(
      collection(db, '/fix'),
      {
        ...data,
        applicant_id: applicant_id
      }
    )
  }
  
  async function updateFix (fix_id: string, data) {
    await updateDoc(
      doc(db, '/fix/'+ fix_id ),
      data
    );
  }
  
  getClients().then(clients => {
      state.value.clientList = clients
      state.value.clientList.map(async (client) => {
          if (client.id) {
              client.office = await getClientOffice(client.id)
          }
      })
  })

  return { state, getClients, getClientOffice, getFixData, getFixList, saveFix, updateFix, getApplicantsByStatus, countApplicantsByStatus }
})
  
