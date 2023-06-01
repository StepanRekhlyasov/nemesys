import { QueryDocumentSnapshot, collection, deleteField, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc, where, writeBatch } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantProgressFilter } from 'src/pages/user/Applicant/types/applicant.types';
import { Applicant, ApplicantExperience, ApplicantExperienceInputs, ApplicantInputs, Client, ClientOffice, User, UserPermissionNames } from 'src/shared/model';
import { getClientList, getClientFactoriesList } from 'src/shared/utils/Applicant.utils';
import { ref } from 'vue'
import { watch } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { ConstraintsType, dateToTimestampFormat } from 'src/shared/utils/utils';
import { getUsersByPermission } from 'src/shared/utils/User.utils';
import { useOrganization } from './organization';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { requiredFields } from 'src/shared/constants/Applicant.const';

interface ApplicantState {
  clientList: Client[],
  applicantsByColumn: ApplicantsByColumn,
  applicantsByStatusCount: ApplicantsByStatusCount,
  continueFromDoc: ContinueFromDoc,
  applicantProgressFilter: ApplicantProgressFilter,
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
  usersInCharge: User[],
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
    applicantProgressFilter: {
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
    usersInCharge: [],
  })

  const countApplicantsByStatus = async (status : string, filterData?: ApplicantProgressFilter) => {
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

  const getApplicantsByStatus = async (status : string, filterData?: ApplicantProgressFilter, perQuery = 20, showMore = false, orderQuery = [orderBy('currentStatusTimestamp', 'asc')]) => {
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
    const querys = query(applicantRef, ...filters, ...orderQuery, ...start, limit(perQuery+1))
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

  /** this function checks and creates reqiured fields if they would not exist for some reason */
  function validateApplicant(applicants : Applicant[]){
    const fire = ref(false)
    const batch = writeBatch(db);
    const forUpdate : Record<string, string | number>[] = []
    applicants.map((applicant)=>{
      const needsUpdate : Record<string, string | number>[] = []
      for(const [key, value] of Object.entries(requiredFields)){
        if(typeof applicant[key] == 'undefined'){
          needsUpdate[key] = value
        }
      }
      if(needsUpdate){
        forUpdate[applicant.id] = needsUpdate
      }
    })
    for(const [key, value] of Object.entries(forUpdate)){
      fire.value = true
      const docRef = doc(db, 'applicants/' + key);
      batch.update(docRef, {...value})
    }
    if(fire.value){
      try{
        batch.commit()
      } catch (e){
        console.log(e)
      }
    }
    return fire.value
  }

  async function updateApplicant(applicantData : Partial<ApplicantInputs>, showAlert = true) {
    if (!state.value.selectedApplicant) return; 
    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);
    try {

      /** transform strings to timestamps */
      const saveData = JSON.parse(JSON.stringify(applicantData));
      if(applicantData.applicationDate) saveData.applicationDate = dateToTimestampFormat(new Date(applicantData.applicationDate));
      if(applicantData.dob) saveData.dob = dateToTimestampFormat(new Date(applicantData.dob));
      if(applicantData.seductionDay) saveData.seductionDay = dateToTimestampFormat(new Date(applicantData.seductionDay));
      if(applicantData.attendingDate) saveData.attendingDate = dateToTimestampFormat(new Date(applicantData.attendingDate));
      if(applicantData.timeToWork) saveData.timeToWork = dateToTimestampFormat(new Date(applicantData.timeToWork));

      for(const [key, value] of Object.entries(saveData)){
        if(!value){
          saveData[key] = deleteField()
        }
      }
      saveData['updated_at'] = serverTimestamp();

      await updateDoc(applicantRef, saveData)
      if (showAlert){ Alert.success($q, t); }
      try {
        state.value.selectedApplicant = await getApplicantByID(state.value.selectedApplicant?.id)
      } catch(error) {
        if (showAlert){  Alert.warning($q, t); }
      }
    } catch (error) {
      if (showAlert){  Alert.warning($q, t); }
    }
  };

  async function getApplicantByID(id : string, validate = false){
    const applicantRef = doc(db, 'applicants/' + id);
    const result = await getDoc(applicantRef)
    if(validate){
      validateApplicant([result.data() as Applicant])
    }
    return result.data() as Applicant
  }

  async function createApplicant(data : Applicant, applicantImage? : FileList | []){
    const docRef = doc(collection(db, 'applicants'));
    data['id'] = docRef.id;
    if (applicantImage && applicantImage.length > 0) {
      const file = applicantImage[0];
      const storage = getStorage();
      const storageRef = refStorage(storage, 'applicants/' + docRef.id + '/image/' + file['name']);
      try {
        const snapshot = await uploadBytes(storageRef, file)
        data['imagePath'] = snapshot.ref.fullPath;
        data['imageURL'] = await getDownloadURL(storageRef)
      } catch(error){
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: t('failed'),
        });
        return false;
      }
    }
    try {
      await setDoc(
        docRef,
        data
      );
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: t('success'),
      });
      return true;
    } catch (error) {
      console.log(error);
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: t('failed'),
      });
      return false;
    }
  }

  async function getApplicantsByConstraints(constraints : ConstraintsType){
    const q = query(collection(db, 'applicants'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot?.docs.map((doc) => {
      return doc.data() as Applicant
    })
  }
  async function getApplicantContactData(applicantId, constraints : ConstraintsType){
    const q = query(collection(db, 'applicants/' + applicantId + '/contacts'), ...constraints);
    const snapshot = await getDocs(q);
    const result =  snapshot?.docs.map((doc) => {
      return {id: doc.id, ...doc.data()}
    })
    return result
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

  const saveWorkExperience = async (rawData : Partial<ApplicantExperienceInputs>, applicantId : string) => {
    const saveData : Partial<ApplicantExperience> = JSON.parse(JSON.stringify(rawData))
    if(rawData.startMonth) saveData.startMonth = dateToTimestampFormat(new Date(rawData.startMonth)) 
    if(rawData.endMonth) saveData.endMonth = dateToTimestampFormat(new Date(rawData.endMonth)) 

    try {
        const boRef = doc(db, 'applicants/'+applicantId+'/experience/'+saveData.id);
        await updateDoc(boRef, {
          updated_at: serverTimestamp(),
          ...saveData
        })
        Alert.success($q, t);
    } catch (e) {
      console.log(e)
      Alert.warning($q, t);
    }
  }

  /** update Applicant in tables after details changes */
  watch(() => state.value.selectedApplicant, (newValue) => {
    if(!newValue?.status) return;
    if(!state.value.applicantsByColumn[newValue.status]) return;
    const changingApplicantIndex = state.value.applicantsByColumn[newValue.status].findIndex((row : Applicant)=>row.id==newValue?.id)
    if(changingApplicantIndex>=0){
      state.value.applicantsByColumn[newValue?.status][changingApplicantIndex] = state.value.selectedApplicant
    }
  }, {deep: true})

  /** update columns */
  watch(() => [state.value.selectedApplicant?.id, state.value.selectedApplicant?.status], async (newValue, oldValue) => {

    if (!state.value.selectedApplicant) return;
    if (newValue[0] != oldValue[0]) return;
    if (!newValue[0] || !oldValue[0]) return;
    if (newValue[1] == oldValue[1]) return;
    if (!newValue[1]) return;

    if (oldValue[1] && state.value.applicantsByColumn[oldValue[1]]) {
      state.value.applicantsByColumn[oldValue[1]] = state.value.applicantsByColumn[oldValue[1]].filter((item : Applicant)=>item.id!=state.value.selectedApplicant?.id)
    }

    if (state.value.applicantsByColumn[newValue[1]]) {
      const index = state.value.applicantsByColumn[newValue[1]].findIndex((item : Applicant)=>item.id == state.value.selectedApplicant?.id)
      if (index>-1) return; 
      state.value.applicantsByColumn[newValue[1]].push(state.value.selectedApplicant)
      state.value.applicantsByColumn[newValue[1]].sort((a : Applicant, b: Applicant) => {
        try{
          return a.currentStatusTimestamp.toDate() > b.currentStatusTimestamp.toDate()
        } catch (error){
          console.log(error)
        }
      })
    }
  }, { deep: true})

  return { state, getClients, getClientFactories, getApplicantsByStatus, countApplicantsByStatus, updateApplicant, fetchUsersInChrage, createApplicant, getApplicantsByConstraints, getApplicantContactData, saveWorkExperience }
})
  
