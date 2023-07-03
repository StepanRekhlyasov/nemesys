import { QueryDocumentSnapshot, Timestamp, collection, deleteField, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc, where, writeBatch } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantElasticFilter, ApplicantElasticSearchData, ApplicantProgressFilter } from 'src/pages/user/Applicant/types/applicant.types';
import { Applicant, ApplicantExperience, ApplicantExperienceInputs, ApplicantFix, ApplicantInputs, ApplicantStatus, Client, ClientOffice } from 'src/shared/model';
import { getClientList, getClientFactoriesList, getApplicantCurrentStatusTimestampField, getApplicantNGStatus, getApplicantCurrentUserInChargeField } from 'src/shared/utils/Applicant.utils';
import { ref, watch } from 'vue'
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType, dateToTimestampFormat, toMonthYear } from 'src/shared/utils/utils';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { api } from 'src/boot/axios';
import { applicantStatusOkFields, requiredFields } from 'src/shared/constants/Applicant.const';
import { useOrganization } from './organization';
import { COLUMN_STATUSES, COUNT_STATUSES, limitQuery } from 'src/pages/user/ApplicantProgress/const/applicantColumns';
import { useRoute } from 'vue-router';
import { useFix } from './fix';
import { getMostCompletedFix } from 'src/shared/utils/Fix.utils';

interface ApplicantState {
  clientList: Client[],
  applicantsByColumn: ApplicantsByColumn,
  applicantERWCount: ApplicantERWCount,
  continueFromDoc: ContinueFromDoc,
  applicantProgressFilter: ApplicantProgressFilter,
  reFilterOnReturn: boolean,
  applicantList: Applicant[],
  currentIds: number[],
  isLoadingProgress: boolean,
  metaData: {
    current: number,
    size: number,
    total_pages: number,
    total_results: number
  },
  prefectureList: {label: string, value: string | number}[],
  selectedApplicant: Applicant | null,
  needsApplicantUpdateOnMounted: boolean,
  columnsLoading: {
    'wait_contact': boolean,
    'wait_attend': boolean,
    'wait_FIX': boolean,
    'wait_visit': boolean,
    'wait_offer': boolean,
    'wait_entry': boolean,
    'wait_termination': boolean,
  },
  applicantCount: {
    'wait_contact': number | undefined,
    'wait_attend': number | undefined,
    'wait_FIX': number | undefined,
    'wait_visit': number | undefined,
    'wait_offer': number | undefined,
    'wait_entry': number | undefined,
    'wait_termination': number | undefined,
  },
  applicantFixes: { [id: string]: ApplicantFix[]; }
  applicants: { [id: string]: Applicant; }
  highlightedApplicant?: string
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

type ApplicantERWCount = {
  'entry': number,
  'retired': number,
  'working': number,
}

export const useApplicant = defineStore('applicant', () => {
  const db = getFirestore();
  const miliSecondsPerYear = 1000 * 60 * 60 * 24 * 365;
  const organization = useOrganization()
  const fixStore = useFix()
  const route = useRoute()

  const state = ref<ApplicantState>({
    clientList: [] as Client[],
    applicantList: [] as Applicant[],
    currentIds: [] as number[],
    isLoadingProgress: false,
    metaData: {
      current: 0,
      size: 0,
      total_pages: 0,
      total_results: 0
    },
    applicantsByColumn: {
      'wait_contact': [],
      'wait_attend': [],
      'wait_FIX': [],
      'wait_visit': [],
      'wait_offer': [],
      'wait_entry': [],
      'wait_termination': [],
    },
    applicantERWCount: {
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
      branchIncharge: '',
      userInCharge: '',
      prefecture: '',
      currentStatusMonth: '',
      organizationId: organization.currentOrganizationId
    },
    reFilterOnReturn: false,
    prefectureList: [],
    selectedApplicant: null,
    needsApplicantUpdateOnMounted: false,
    columnsLoading: {
      'wait_contact': false,
      'wait_attend': false,
      'wait_FIX': false,
      'wait_visit': false,
      'wait_offer': false,
      'wait_entry': false,
      'wait_termination': false,
    },
    applicantCount: {
      'wait_contact': undefined,
      'wait_attend': undefined,
      'wait_FIX': undefined,
      'wait_visit': undefined,
      'wait_offer': undefined,
      'wait_entry': undefined,
      'wait_termination': undefined,
    },
    applicantFixes: {},
    applicants: {}
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
    state.value.applicantERWCount[status] = result
    return result
  }

  const loadApplicantData = async (searchData : ApplicantElasticSearchData = {},
    pagination = {
      page: 1,
      rowsPerPage: 10
    }) => {
    state.value.applicantList = []
    state.value.isLoadingProgress = true;

    const filters : ApplicantElasticFilter = ref({ 'all': [{ 'deleted': 'false' }] }).value;
    const queryString = searchData['keyword'] ? searchData['keyword'] : ''

    if (searchData['status']) {
      filters['all'].push({
        'status': searchData['status']
      });
    }
    if (searchData.applicationDateMin && searchData.applicationDateMax) {
      filters['all'].push({
        'applicationdate': { 'from': formatDate(new Date(searchData.applicationDateMin), true), 'to': formatDate(new Date(searchData.applicationDateMax)) }
      });
    }
    else if (searchData.applicationDateMin) {
      filters['all'].push({
        'applicationdate': { 'from': formatDate(new Date(searchData.applicationDateMin), true) }
      });
    }
    else if (searchData.applicationDateMax) {
      filters['all'].push({
        'applicationdate': { 'to': formatDate(new Date(searchData.applicationDateMax)) }
      });
    }
    if (searchData.ageMin) {
      filters['all'].push({
        'dob': { 'to': getDate(parseInt(searchData.ageMin)) }
      });
    }
    if (searchData.ageMax) {
      filters['all'].push({
        'dob': { 'from': getDate(parseInt(searchData.ageMax)) }
      });
    }

    const items = ['sex', 'classification', 'occupation', 'qualification', 'daysperweek', 'prefecture', 'route', 'neareststation', 'municipalities', 'staffrank']
    for (let i = 0; i < items.length; i++) {
      if (searchData[items[i]] && searchData[items[i]].length > 0) {
        const obj = {}
        obj[items[i]] = searchData[items[i]]
        filters['all'].push(obj);
      }
    }
    if (searchData.availableShift && searchData.availableShift.length > 0) {
      for (let i = 0; i < searchData.availableShift.length; i++) {
        const obj = {}
        obj[searchData.availableShift[i]] = 'true'
        filters['all'].push(obj);
      }
    }
    if (searchData.workPerWeekMin && searchData.workPerWeekMax) {
      filters['all'].push({
        'daystowork': { 'from': parseInt(searchData.workPerWeekMin), 'to': parseInt(searchData.workPerWeekMax) }
      });
    } else if (searchData.workPerWeekMin) {
      filters['all'].push({
        'daystowork': { 'from': parseInt(searchData.workPerWeekMin) }
      });
    } else if (searchData.workPerWeekMax) {
      filters['all'].push({
        'daystowork': { 'to': parseInt(searchData.workPerWeekMax) }
      });
    }

    if (searchData.mapData) {
      filters['all'].push({
        'geohash': {
          'center': `${searchData.mapData.lat}, ${searchData.mapData.lng}`,
          'distance': searchData.mapData.radiusInM,
          'unit': 'm'
        }
      });
    }

    if (!queryString && filters.all.length == 1) {
      const d = new Date();
      const m = d.getMonth();
      d.setMonth(d.getMonth() - 1);
      /** If still in same month, set date to last day of previous month */
      if (d.getMonth() == m) d.setDate(0);
      filters['all'].push({
        'created_at': { 'from': formatDate(d, true), 'to': formatDate(new Date()) }
      });
    }
    await api.post(
      (process.env.elasticSearchStaffURL as string),
      {
        'query': queryString,
        'page': { 'size': pagination.rowsPerPage, 'current': pagination.page },
        'filters': filters,
      },
      {
        headers: { 'Authorization': process.env.elasticSearchKey, 'Content-Type': 'application/json' },
      }
    ).then(async (response) => {
      if (response.status == 200) {
        const responseData = ref(response.data.results).value;
        state.value.metaData = response.data.meta.page;
        for (let i = 0; i < responseData.length; i++) {
          state.value.currentIds.push(responseData[i]['id']['raw'])
        }
        loadFirestoreApplicantData()
      }
    }).catch((error) => {
      Alert.warning(error)
    });
  };

  const loadFirestoreApplicantData = async () => {
    state.value.applicantList = [];
    state.value.isLoadingProgress = true;
    while (state.value.currentIds.length) {
      const batch = state.value.currentIds.splice(0, 10);
      state.value.applicantList = await getApplicantsByConstraints([where('deleted', '==', false), where('id', 'in', batch)])
    }
    state.value.isLoadingProgress = false;
  }

  const formatDate = (dt : Date, midNight = false) => {
    const year = dt.toLocaleString('en-US', { year: 'numeric' });
    const month = dt.toLocaleString('en-US', { month: '2-digit' });
    const day = dt.toLocaleString('en-US', { day: '2-digit' });
    if (midNight) {
      return year + '-' + month + '-' + day + 'T00:00:00+00:00';

    }
    return year + '-' + month + '-' + day + 'T23:59:59+00:00';
  }

  const getDate = (ageInYears : number) => {
    const calDate = new Date();
    calDate.setFullYear(calDate.getFullYear() - ageInYears);
    const year = calDate.toLocaleString('en-US', { year: 'numeric' });
    const month = calDate.toLocaleString('en-US', { month: '2-digit' });
    const day = calDate.toLocaleString('en-US', { day: '2-digit' });

    return year + '-' + month + '-' + day + 'T00:00:00+00:00';
  }

  const countApplicantsBySex = async (sex : 'female'|'male', dateRange: { from: string; to: string }, filterData?: ApplicantProgressFilter) => {
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const filters = [
      where('sex', '==', sex),
      where('applicationDate', '>=', targetDateFrom),
      where('applicationDate', '<=', targetDateTo)
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
    return result
  }

  const countApplicantsdaysToWork = async ( dateRange: { from: string; to: string }, filterData?: ApplicantProgressFilter) => {
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);

    const result:number[][] = []
    for(let i = 1; i <= 7; i++){

      const filters = [
        where('applicationDate', '>=', targetDateFrom),
        where('applicationDate', '<=', targetDateTo)
      ]
      filters.push(where('daysToWork', '==', i))
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
      result.push([docCount.data().count])
      filters.length = 0
    }
    return result
  }
  const countApplicantsByMedia = async (media:string, dateRange: { from: string; to: string }) => {
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const filters = [
      where('applicationDate', '>=', targetDateFrom),
      where('applicationDate', '<=', targetDateTo),
      where('media', '==', media)
    ]
    const applicantRef = collection(db, 'applicants')
    const querys = query(applicantRef, ...filters)
    const docCount = await getCountFromServer(querys)
    const result = docCount.data().count
    return result

  }


  const agesListOfApplicants = async (dateRange: { from: string; to: string }, filterData?:ApplicantProgressFilter):Promise<number[] | undefined>=> {
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const filters = [
      where('applicationDate', '>=', targetDateFrom),
      where('applicationDate', '<=', targetDateTo)
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
    const docSnap = await getDocs(querys)
    const applicants = docSnap.docs.map((doc) => {
    if(!doc.data().dob) return undefined
    const dob = doc.data().dob
    const now = new Date()
    const age = Math.floor((now.getTime() - dob.seconds * 1000) / miliSecondsPerYear)
    return age
    })
    if (applicants.length === 0) return undefined
    //remove undefined in applicants
    const filteredApplicants = applicants.filter((applicant):applicant is number  => typeof applicant =='number' )
    return filteredApplicants

  }


  const getApplicantsByStatus = async (status : string, filterData?: ApplicantProgressFilter, perQuery = 20, showMore = false, orderQuery = [orderBy('currentStatusTimestamp', 'asc')]) => {
    if(!showMore){
      state.value.applicantsByColumn[status] = []
      state.value.continueFromDoc[status] = null
    }
    if(!organization.currentOrganizationId){
      state.value.applicantCount[status] = 0
      return []
    }
    state.value.columnsLoading[status] = true

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
    const querys = query(applicantRef, ...orderQuery, ...filters, ...start, limit(perQuery+1))

    const countSnapshot = await getCountFromServer(query(applicantRef, ...orderQuery, ...filters))

    const docSnap = await getDocs(querys)
    state.value.applicantCount[status] = countSnapshot.data().count
    if (!docSnap.empty) {
      const applicantIds : string[] = []
      const documents = docSnap.docs.map(item => {
        const result = {...item.data(), id: item.id} as Applicant
        state.value.applicants[item.id] = result
        return result
      })

      if(perQuery+1 === docSnap.docs.length){
        state.value.continueFromDoc[status] = docSnap.docs[docSnap.docs.length-1]
        documents.pop()
      } else {
        state.value.continueFromDoc[status] = null
      }
      documents.forEach((row)=>{
        applicantIds.push(row.id)
      })
      const result = state.value.applicantsByColumn[status].concat(documents)
      state.value.applicantsByColumn[status] = result
      state.value.columnsLoading[status] = false
    
      await fixStore.getFixByApplicantIDs(applicantIds);

      return result
    }
    state.value.continueFromDoc[status] = null
    state.value.columnsLoading[status] = false
    return []
  }

  async function validateAllApplicants(){
    const applicantRef = collection(db, 'applicants')
    const applicantQuery = query(applicantRef)
    const docSnap = await getDocs(applicantQuery)
    if (!docSnap.empty) {
      const documents = docSnap.docs.map(item => {
        const id = item.id
        return {id, ...item.data()}
      })
      return validateApplicants(documents as Applicant[])
    }
    return false
  }

  /** this function checks and creates reqiured fields if they would not exist for some reason */
  async function validateApplicants(applicants : Applicant[]){
    const fire = ref(false)
    const batch = writeBatch(db);
    const forUpdate : Record<string, string | number>[] = []
    applicants.map((applicant)=>{
      const needsUpdate : { [key : string]: string | number; } = {}
      for(const [key, value] of Object.entries(requiredFields.value)){
        if(typeof applicant[key] === 'undefined'){
          needsUpdate[key] = value
        }
      }
      if(Object.keys(needsUpdate).length > 0){
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
        await batch.commit()
      } catch (e){
        Alert.warning(e)
      }
    }
    return fire.value
  }



  async function getApplicantByID(id : string, validate = false){
    const applicantRef = doc(db, 'applicants/' + id);
    const result = await getDoc(applicantRef)
    if(validate){
      validateApplicants([result.data() as Applicant])
    }
    return result.data() as Applicant
  }

  async function createApplicant(data : Applicant, applicantImage? : FileList | []){
    const docRef = doc(collection(db, 'applicants'));
    data['id'] = docRef.id;
    for (const [key, value] of Object.entries(data)){
      if(typeof value === 'undefined') delete data[key];
    }
    if (applicantImage && applicantImage.length > 0) {
      const file = applicantImage[0];
      const storage = getStorage();
      const storageRef = refStorage(storage, 'applicants/' + docRef.id + '/image/' + file['name']);
      try {
        const snapshot = await uploadBytes(storageRef, file)
        data['imagePath'] = snapshot.ref.fullPath;
        data['imageURL'] = await getDownloadURL(storageRef)
      } catch(error){
        Alert.warning(error);
        return false;
      }
    }
    try {
      await setDoc(
        docRef,
        data
      );
      Alert.success();
      return true;
    } catch (error) {
      Alert.warning(error);
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
        Alert.success();
    } catch (e) {
      Alert.warning(e);
    }
  }

  /** Applicant status should be awlays changed here! */
  async function updateApplicantStatus(status : ApplicantStatus , NGStatus?: ApplicantStatus){
    
    if (!state.value.selectedApplicant) return;
    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);

    const dateField = getApplicantCurrentStatusTimestampField(status)
    const saveData : Partial<Applicant> = {}
    if(saveData[dateField] instanceof Timestamp){
      saveData.currentStatusTimestamp = saveData[dateField]
      saveData.statusChangeTimestamp = state.value.selectedApplicant.statusChangeTimestamp || {}
      saveData.statusChangeTimestamp[status] = saveData[dateField]
      saveData.currentStatusMonth = toMonthYear(saveData[dateField])
    }

    const userInCharge = getApplicantCurrentUserInChargeField(NGStatus?NGStatus:status)
    
    if(userInCharge && typeof userInCharge === 'string'){
      saveData.userInCharge = state.value.selectedApplicant[userInCharge]
    }

    saveData['updated_at'] = serverTimestamp();
    saveData.status = status
    await updateDoc(applicantRef, saveData)
    state.value.selectedApplicant = await getApplicantByID(state.value.selectedApplicant?.id)
  }


  async function updateApplicant(applicantData : Partial<ApplicantInputs>, showAlert = true) {
    if (!state.value.selectedApplicant) return;

    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);
    try {
      /** transform strings to timestamps */
      const saveData = JSON.parse(JSON.stringify(applicantData));

      if (saveData.status){
        await updateApplicantStatus(saveData.status);
        return;
      }

      if(applicantData.applicationDate) saveData.applicationDate = dateToTimestampFormat(new Date(applicantData.applicationDate));
      if(applicantData.dob) saveData.dob = dateToTimestampFormat(new Date(applicantData.dob));
      if(applicantData.invitationDate) saveData.invitationDate = dateToTimestampFormat(new Date(applicantData.invitationDate));
      if(applicantData.attendingDate) saveData.attendingDate = dateToTimestampFormat(new Date(applicantData.attendingDate));
      if(applicantData.timeToWork) saveData.timeToWork = dateToTimestampFormat(new Date(applicantData.timeToWork));
      if(applicantData.fixDate) saveData.fixDate = dateToTimestampFormat(new Date(applicantData.fixDate));
      if(applicantData.inspectionDate) saveData.inspectionDate = dateToTimestampFormat(new Date(applicantData.inspectionDate));
      if(applicantData.offerDate) saveData.offerDate = dateToTimestampFormat(new Date(applicantData.offerDate));
      if(applicantData.admissionDate) saveData.admissionDate = dateToTimestampFormat(new Date(applicantData.admissionDate));

      for(const [key, value] of Object.entries(saveData)){
        if(typeof value === 'undefined') delete saveData[key];
      }
      saveData['updated_at'] = serverTimestamp();

      await updateDoc(applicantRef, saveData)
      state.value.selectedApplicant = await getApplicantByID(state.value.selectedApplicant?.id)
      const applicantIndex = state.value.applicantList.findIndex(app => app.id == state.value.selectedApplicant?.id);
      if (applicantIndex >=0) {
        state.value.applicantList[applicantIndex] = {...state.value.applicantList[applicantIndex], ...saveData}
      }
      if (showAlert) { Alert.success(); }
      try {
        

        /** status change by OK fields */
        const saveBooleans = {}
        for ( const [key, value] of Object.entries(saveData)){
          if(['fixStatus', 'inspectionStatus', 'offerStatus', 'admissionStatus', 'attendingStatus', 'attractionsStatus'].includes(key)){
            saveBooleans[key] = value
          }
        }
        if(Object.keys(saveBooleans).length){
          await changeApplicantStatusByOkFields( saveBooleans )
        }
        

      } catch(error) {
        if (showAlert){ Alert.warning(error); }
      }
    } catch (error) {
      if (showAlert){  Alert.warning(error); }
    }
  };

  const saveFixDataToApplicant = async() => {
    if ( !state.value.selectedApplicant ) return;
    const bestFix = getMostCompletedFix(state.value.applicantFixes[state.value.selectedApplicant.id])
    if ( !bestFix ) return;

    const { fixStatus, inspectionStatus, offerStatus, admissionStatus, fixDate, inspectionDate, offerDate, admissionDate, chargeOfFix, chargeOfInspection, chargeOfAdmission, chargeOfOffer, fixReasonNG, inspectionReasonNG, offerReasonNG, admissionReasonNG, id } = bestFix
    const saveBooleans = { fixStatus, inspectionStatus, offerStatus, admissionStatus }
    const saveDates = { fixDate, inspectionDate, offerDate, admissionDate }
    const chargeOfStatus = { chargeOfAdmission, chargeOfOffer, chargeOfInspection, chargeOfFix }
    const NGReasons = { fixReasonNG, inspectionReasonNG, offerReasonNG, admissionReasonNG }

    for(const [key, value] of Object.entries(saveBooleans)){
      if(typeof value === 'undefined'){
        saveBooleans[key] = deleteField()
      }
    }

    const saveData = {...saveBooleans, ...saveDates, ...NGReasons, ...chargeOfStatus, bestFixID: id}
    await updateApplicant(saveData, true)
  }


  const changeApplicantStatusByOkFields = async (saveBooleans: Partial<Applicant>) => {
    if(!state.value.selectedApplicant){
      return
    }
    
    let newStatus : ApplicantStatus | undefined,
    NGStatus : ApplicantStatus | undefined

    for (const [key, value] of Object.entries(applicantStatusOkFields)){
      if(saveBooleans[key] === true){
        newStatus = value
      } else if (saveBooleans[key] === false){
        const NGField = getApplicantNGStatus(applicantStatusOkFields[key])
        NGStatus = newStatus
        newStatus = state.value.selectedApplicant[NGField]
        break;
      }
    }
    if(newStatus){
      await updateApplicantStatus(newStatus, NGStatus)
    }
  }

  /** update Applicant in tables after details changes */
  watch(() => state.value.selectedApplicant, (newValue) => {
    if(!newValue?.status) return;
    if(!state.value.applicantsByColumn[newValue.status]) return;
    const changingApplicantIndex = state.value.applicantsByColumn[newValue.status].findIndex((row : Applicant)=>row.id===newValue?.id)
    if(changingApplicantIndex>=0){
      state.value.applicantsByColumn[newValue?.status][changingApplicantIndex] = state.value.selectedApplicant
    }
  }, {deep: true})

  /** reset fixes on filter change */
  watch(() => state.value.applicantProgressFilter, () => {
    state.value.applicantFixes = {}
  }, {deep: true})

  /** update columns */
  watch(() => [state.value.selectedApplicant?.id, state.value.selectedApplicant?.status], async (newValue, oldValue) => {
    if (!state.value.selectedApplicant) return;
    if (newValue[0] !== oldValue[0]) return;
    if (!newValue[0] || !oldValue[0]) return;
    if (newValue[1] === oldValue[1]) return;
    if (!newValue[1]) return;
    if (oldValue[1] && state.value.applicantsByColumn[oldValue[1]]) {
      state.value.applicantsByColumn[oldValue[1]] = state.value.applicantsByColumn[oldValue[1]].filter((item : Applicant)=>item.id!=state.value.selectedApplicant?.id)
    }
    state.value.needsApplicantUpdateOnMounted = true
    if (state.value.applicantsByColumn[newValue[1]]) {
      const index = state.value.applicantsByColumn[newValue[1]].findIndex((item : Applicant)=>item.id === state.value.selectedApplicant?.id)
      if (index>-1) return;
      state.value.applicantsByColumn[newValue[1]].push(state.value.selectedApplicant)
      state.value.applicantsByColumn[newValue[1]].sort((a : Applicant, b: Applicant) => {
        try{
          if(a.currentStatusTimestamp instanceof Timestamp && b.currentStatusTimestamp instanceof Timestamp){
            return a.currentStatusTimestamp.toDate() > b.currentStatusTimestamp.toDate()
          }
        } catch (error){
          Alert.warning(error)
        }
      })
    }
  }, { deep: true})

  /** reload applicants by status */
  watch(()=>organization.currentOrganizationId, (newValue)=>{
    state.value.applicantProgressFilter.organizationId = newValue
    state.value.applicantProgressFilter.branchIncharge = ''
    state.value.applicantProgressFilter.userInCharge = ''
    state.value.selectedApplicant = null
    if ( route.meta.applicantsUpdateOnOrganizationChange ) {
      COLUMN_STATUSES.map(async (status)=>{
        await getApplicantsByStatus(status, state.value.applicantProgressFilter, limitQuery, false)
      })
      COUNT_STATUSES.map(async (status)=>{
        state.value.applicantERWCount[status] = await countApplicantsByStatus(status, state.value.applicantProgressFilter)
      })
    } else {
      state.value.needsApplicantUpdateOnMounted = true
    }
  })

  return { state, getClients, loadApplicantData, getClientFactories, getApplicantsByStatus, countApplicantsByStatus, updateApplicant , createApplicant, countApplicantsBySex,getApplicantContactData,saveWorkExperience, agesListOfApplicants ,countApplicantsdaysToWork ,countApplicantsByMedia,getApplicantsByConstraints, validateAllApplicants, saveFixDataToApplicant, changeApplicantStatusByOkFields }
})

