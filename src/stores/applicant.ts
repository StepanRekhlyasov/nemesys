import { QueryDocumentSnapshot, Timestamp, collection, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, startAt, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantFilter } from 'src/pages/user/ApplicantProgress/types/applicant.types';
import { Applicant, Client, ClientOffice, User, UserPermissionNames } from 'src/shared/model';
import { getClientList, getClientFactoriesList } from 'src/shared/utils/Applicant.utils';
import { ref } from 'vue'
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { watch } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { toMonthYear } from 'src/shared/utils/utils';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { useOrganization } from './organization';

interface ApplicantState {
  clientList: Client[],
  applicantsByColumn: ApplicantsByColumn,
  applicantsByStatusCount: ApplicantsByStatusCount,
  continueFromDoc: ContinueFromDoc,
  applicantFilter: ApplicantFilter,
  reFilterOnReturn: boolean,
  prefectureList: {label: string, value: string | number}[],
  selectedApplicant: Applicant | null
  columnsLoading: {
    'wait_contact': boolean,
    'wait_attend': boolean,
    'wait_FIX': boolean,
    'wait_visit': boolean,
    'wait_offer': boolean,
    'wait_entry': boolean,
    'wait_termination': boolean,
  },
  usersInCharge: User[]
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

type ApplicantsByColumn = {
  'wait_contact': Applicant[] | [];
  'wait_attend': Applicant[] | [];
  'wait_FIX': Applicant[] | [];
  'wait_visit': Applicant[] | [];
  'wait_offer': Applicant[] | [];
  'wait_entry': Applicant[] | [];
  'wait_termination': Applicant[] | [];
};

type ApplicantsByStatusCount = {
  'entry': number,
  'retired': number,
  'working': number,
}

export const useApplicant = defineStore('applicant', () => {
  const db = getFirestore();  
  const $q = useQuasar();
  const { t } = useI18n({ useScope: 'global' });
  const state = ref<ApplicantState>({
    clientList: [] as Client[],
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
    prefectureList: [],
    selectedApplicant: null,
    columnsLoading: {
      'wait_contact': false,
      'wait_attend': false,
      'wait_FIX': false,
      'wait_visit': false,
      'wait_offer': false,
      'wait_entry': false,
      'wait_termination': false,
    },
    usersInCharge: []
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

  async function updateApplicant(applicantData : Partial<Applicant>, showAlert = true) {
    if (!state.value.selectedApplicant) return; 
    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);
    try {
      for(const [key, value] of Object.entries(applicantData)){
        if(typeof value === 'undefined'){
          delete applicantData[key]
        }
      }
      await updateDoc(applicantRef, applicantData)
      if (showAlert){ Alert.success($q, t); }
      state.value.selectedApplicant = {
        ...state.value.selectedApplicant,
        ...applicantData,
        staffRank: RankCount.countRank(state.value.selectedApplicant)
      }
    } catch (error) {
      if(state.value.selectedApplicant?.status){
        try {
          state.value.selectedApplicant = await getApplicantByID(state.value.selectedApplicant?.id)
        } catch(error) {
          if (showAlert){  Alert.warning($q, t); }
        }
      }
      if (showAlert){  Alert.warning($q, t); }
    }
  };

  async function getApplicantByID(id : string){
    const applicantRef = doc(db, 'applicants/' + id);
    const result = await getDoc(applicantRef)
    return result.data() as Applicant
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
  
  const fetchUsersInChrage = async () => {
    const organization = useOrganization()
    const usersSnapshot = getUsersByPermission(db, UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);
    const users = await usersSnapshot
    if(users){
      const result = users.docs.map(item => {
        return item.data() as User
      })
      state.value.usersInCharge = result
    }
  }

  /** update Applicant in tables after details changes */
  watch(() => state.value.selectedApplicant, (newValue) => {
    if(!newValue?.status) return;
    const changingApplicantIndex = state.value.applicantsByColumn[newValue.status].findIndex((row : Applicant)=>row.id==newValue?.id)
    if(changingApplicantIndex>=0){
      state.value.applicantsByColumn[newValue?.status][changingApplicantIndex] = state.value.selectedApplicant
    }
  }, {deep: true})

  /** update Applicant in tables after details changes */
  watch(() => state.value.selectedApplicant, (newValue) => {
    if(!newValue?.status) return;
    const changingApplicantIndex = state.value.applicantsByColumn[newValue.status].findIndex((row : Applicant)=>row.id==newValue?.id)
    if(changingApplicantIndex>=0){
      state.value.applicantsByColumn[newValue?.status][changingApplicantIndex] = state.value.selectedApplicant
    }
  }, {deep: true})

  /** update timestamps and sort columns */
  watch(() => state.value.selectedApplicant?.status, async (newValue, oldValue) => {
    if (!state.value.selectedApplicant) return;
    if (!newValue || !oldValue) return;
    if (newValue == oldValue) return;
    const timeData = {
      currentStatusMonth : toMonthYear(),
      currentStatusTimestamp : serverTimestamp() as Timestamp,
      ['statusChangeTimestamp.'+newValue] : serverTimestamp() as Timestamp
    }
    await updateApplicant(timeData, false);
    state.value.selectedApplicant = await getApplicantByID(state.value.selectedApplicant.id)
    if (state.value.applicantsByColumn[newValue]) {
      const index = state.value.applicantsByColumn[newValue].findIndex((item : Applicant)=>item.id == state.value.selectedApplicant?.id)
      if (index>-1) return; 
      state.value.applicantsByColumn[newValue].push(state.value.selectedApplicant)
      state.value.applicantsByColumn[newValue].sort((a : Applicant, b: Applicant) => {
        try{
          return a.currentStatusTimestamp.toDate() > b.currentStatusTimestamp.toDate()
        } catch (error){
          console.log(error)
        }
      })
    }
    if (state.value.applicantsByColumn[oldValue]) {
      state.value.applicantsByColumn[oldValue] = state.value.applicantsByColumn[oldValue].filter((item : Applicant)=>item.id!=state.value.selectedApplicant?.id)
    }
  }, { deep: true})

  return { state, getClients, getClientFactories, getApplicantsByStatus, countApplicantsByStatus, updateApplicant, fetchUsersInChrage }
})
  
