import { QueryDocumentSnapshot, Timestamp, collection, deleteField, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc, startAt, updateDoc, where, writeBatch } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantElasticFilter, ApplicantElasticSearchData, ApplicantProgressFilter } from 'src/pages/user/Applicant/types/applicant.types';
import { Applicant, ApplicantExperience, ApplicantExperienceInputs, ApplicantFix, ApplicantInputs, ApplicantStatus, Client } from 'src/shared/model';
import { countApplicantRank, getClientList } from 'src/shared/utils/Applicant.utils';
import { ref, watch } from 'vue'
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType, dateToTimestampFormat, toMonthYear } from 'src/shared/utils/utils';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { api } from 'src/boot/axios';
import { ApplicantOrFixColumn, applicantNGStatusField, applicantStatusDates, applicantStatusOkFields, applicantUserInChargeField } from 'src/shared/constants/Applicant.const';
import { useOrganization } from './organization';
import { COLUMN_STATUSES, COUNT_STATUSES, limitQuery } from 'src/pages/user/ApplicantProgress/const/applicantColumns';
import { useRoute } from 'vue-router';
import { useFix } from './fix';
import { getMostCompletedFix } from 'src/shared/utils/Fix.utils';
import { deepCopy } from 'src/shared/utils';

interface ApplicantState {
  clientList: Client[],
  applicantsByColumn: ApplicantsByColumn,
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
  prefectureList: { label: string, value: string | number }[],
  selectedApplicant: Applicant | null,
  needsApplicantUpdateOnMounted: boolean,
  columnsLoading: {
    [ApplicantStatus.WAIT_CONTACT]: boolean,
    [ApplicantStatus.WAIT_ATTEND]: boolean,
    [ApplicantStatus.WAIT_FIX]: boolean,
    [ApplicantStatus.WAIT_VISIT]: boolean,
    [ApplicantStatus.WAIT_OFFER]: boolean,
    [ApplicantStatus.WAIT_ENTRY]: boolean,
    [ApplicantStatus.WAIT_TERMINATION]: boolean,
  },
  applicantRowsCount: {
    [ApplicantStatus.WAIT_CONTACT]: number | undefined,
    [ApplicantStatus.WAIT_ATTEND]: number | undefined,
    [ApplicantStatus.WAIT_FIX]: number | undefined,
    [ApplicantStatus.WAIT_VISIT]: number | undefined,
    [ApplicantStatus.WAIT_OFFER]: number | undefined,
    [ApplicantStatus.WAIT_ENTRY]: number | undefined,
    [ApplicantStatus.WAIT_TERMINATION]: number | undefined,
    [ApplicantStatus.RETIRED]: number | undefined,
    [ApplicantStatus.WORKING]: number | undefined,
  },
  applicantFixes: { [id: string]: ApplicantFix[]; }
  applicants: { [id: string]: Applicant; }
  highlightedApplicant?: string
}

type ContinueFromDoc = {
  [ApplicantStatus.WAIT_CONTACT]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_ATTEND]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_FIX]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_VISIT]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_OFFER]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_ENTRY]: null | QueryDocumentSnapshot,
  [ApplicantStatus.WAIT_TERMINATION]: null | QueryDocumentSnapshot,
}

type ApplicantsByColumn = {
  [ApplicantStatus.WAIT_CONTACT]: Applicant[] | [];
  [ApplicantStatus.WAIT_ATTEND]: Applicant[] | [];
  [ApplicantStatus.WAIT_FIX]: Applicant[] | [];
  [ApplicantStatus.WAIT_VISIT]: ApplicantFix[] | [];
  [ApplicantStatus.WAIT_OFFER]: ApplicantFix[] | [];
  [ApplicantStatus.WAIT_ENTRY]: ApplicantFix[] | [];
  [ApplicantStatus.WAIT_TERMINATION]: ApplicantFix[] | [];
  [ApplicantStatus.WORKING]: ApplicantFix[] | [];
};

export const useApplicant = defineStore('applicant', () => {
  const db = getFirestore();
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
      [ApplicantStatus.WAIT_CONTACT]: [],
      [ApplicantStatus.WAIT_ATTEND]: [],
      [ApplicantStatus.WAIT_FIX]: [],
      [ApplicantStatus.WAIT_VISIT]: [],
      [ApplicantStatus.WAIT_OFFER]: [],
      [ApplicantStatus.WAIT_ENTRY]: [],
      [ApplicantStatus.WAIT_TERMINATION]: [],
      [ApplicantStatus.WORKING]: []
    },
    continueFromDoc: {
      [ApplicantStatus.WAIT_CONTACT]: null,
      [ApplicantStatus.WAIT_ATTEND]: null,
      [ApplicantStatus.WAIT_FIX]: null,
      [ApplicantStatus.WAIT_VISIT]: null,
      [ApplicantStatus.WAIT_OFFER]: null,
      [ApplicantStatus.WAIT_ENTRY]: null,
      [ApplicantStatus.WAIT_TERMINATION]: null,
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
      [ApplicantStatus.WAIT_CONTACT]: false,
      [ApplicantStatus.WAIT_ATTEND]: false,
      [ApplicantStatus.WAIT_FIX]: false,
      [ApplicantStatus.WAIT_VISIT]: false,
      [ApplicantStatus.WAIT_OFFER]: false,
      [ApplicantStatus.WAIT_ENTRY]: false,
      [ApplicantStatus.WAIT_TERMINATION]: false,
    },
    applicantRowsCount: {
      [ApplicantStatus.WAIT_CONTACT]: undefined,
      [ApplicantStatus.WAIT_ATTEND]: undefined,
      [ApplicantStatus.WAIT_FIX]: undefined,
      [ApplicantStatus.WAIT_VISIT]: undefined,
      [ApplicantStatus.WAIT_OFFER]: undefined,
      [ApplicantStatus.WAIT_ENTRY]: undefined,
      [ApplicantStatus.WAIT_TERMINATION]: undefined,
      [ApplicantStatus.RETIRED]: undefined,
      [ApplicantStatus.WORKING]: undefined,
    },
    applicantFixes: {},
    applicants: {}
  })

  const countApplicantsByStatus = async (status: ApplicantStatus, filterData?: ApplicantProgressFilter) => {
    const filters = [
      where('status', '==', status),
      where('deleted', '==', false),
      where('organizationId', '==', organization.currentOrganizationId)
    ]
    let currentTime: Timestamp | undefined
    if (filterData) {
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          if (status === ApplicantStatus.WORKING && key === 'currentStatusMonth') {
            currentTime = dateToTimestampFormat(new Date(value))
            if (!currentTime) continue;
            filters.push(where('currentStatusMonth', '<=', value))
            continue;
          }
          filters.push(where(key, '==', value))
        }
      }
    }
    const queryCollection = ApplicantOrFixColumn[status]
    const collectionRef = collection(db, queryCollection)
    const querys = query(collectionRef, ...filters)
    if (status === ApplicantStatus.WORKING && currentTime) {
      const docsSnap = await getDocs(querys)
      const documents = docsSnap.docs.map((row) => {
        return row.data()
      })
      const result = documents.filter((row) => {
        return row.endDate >= (currentTime as Timestamp)
      })
      state.value.applicantRowsCount[status] = result?.length ? result.length : 0
      return result?.length ? result.length : 0
    }
    const docCount = await getCountFromServer(querys)
    const result = docCount.data().count
    state.value.applicantRowsCount[status] = result
    return result
  }

  const loadApplicantData = async (searchData: ApplicantElasticSearchData = {},
    pagination = {
      page: 1,
      rowsPerPage: 10
    }) => {

    state.value.isLoadingProgress = true;
    const filters: ApplicantElasticFilter = ref({ 'all': [{ 'deleted': 'false' }, { 'organizationid': organization.currentOrganizationId }] }).value;
    const queryString = searchData['keyword'] ? searchData['keyword'] : ''
    searchData = deepCopy(searchData);

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
        'dob': { 'to': getDate(parseInt(searchData.ageMin), true) }
      });
    }
    if (searchData.ageMax) {
      filters['all'].push({
        'dob': { 'from': getDate(parseInt(searchData.ageMax) + 1) }
      });
    }
    if (searchData['prefectureArea']) {
      if (searchData['prefecture']) {
        searchData['prefecture'] = [...[searchData['prefecture']], ...searchData['prefectureArea']]
      } else {
        searchData['prefecture'] = searchData['prefectureArea']
      }
    }
    if (searchData['municipalitiesArea']) {
      if (searchData['municipalities']) {
        searchData['municipalities'] = [...[searchData['municipalities']], ...searchData['municipalitiesArea']]
      } else {
        searchData['municipalities'] = searchData['municipalitiesArea']
      }
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
        await loadFirestoreApplicantData()
        if(searchData['yearsExperienceMin']){
          state.value.applicantList = state.value.applicantList.filter(app=>(Math.floor(app['totalMonthes']/12)>=searchData['yearsExperienceMin']))
        }
        if(searchData['yearsExperienceMax']){
          state.value.applicantList = state.value.applicantList.filter(app=>(Math.floor(app['totalMonthes']/12)<=searchData['yearsExperienceMax']))
        }
      }
    }).catch((error) => {
      Alert.warning(error)
    });
  };

  const loadFirestoreApplicantData = async () => {
    state.value.isLoadingProgress = true;
    let applicantList: Applicant[] = [];
    while (state.value.currentIds.length) {
      const batch = state.value.currentIds.splice(0, 10);
      const applicants = await getApplicantsByConstraints([where('id', 'in', batch), where('organizationId', '==', organization.currentOrganizationId)])
      applicantList = [...applicantList, ...applicants];
    }
    state.value.applicantList = applicantList;
    state.value.isLoadingProgress = false;
  }

  const formatDate = (dt: Date, midNight = false) => {
    const year = dt.toLocaleString('en-US', { year: 'numeric' });
    const month = dt.toLocaleString('en-US', { month: '2-digit' });
    const day = dt.toLocaleString('en-US', { day: '2-digit' });
    if (midNight) {
      return year + '-' + month + '-' + day + 'T00:00:00+09:00';

    }
    return year + '-' + month + '-' + day + 'T23:59:59+09:00';
  }

  const getDate = (ageInYears: number, midNight = false) => {
    const calDate = new Date();
    calDate.setFullYear(calDate.getFullYear() - ageInYears);
    const year = calDate.toLocaleString('en-US', { year: 'numeric' });
    const month = calDate.toLocaleString('en-US', { month: '2-digit' });
    const day = calDate.toLocaleString('en-US', { day: '2-digit' });

    if (midNight) {
      return year + '-' + month + '-' + day + 'T00:00:00+09:00';

    }
    return year + '-' + month + '-' + day + 'T23:59:59+09:00';
  }

  const countApplicantsByMedia = async (media: string, dateRange: { from: string; to: string }) => {
    const targetDateFrom = new Date(dateRange.from);
    const targetDateTo = new Date(dateRange.to);
    const filters = [
      where('applicationDate', '>=', targetDateFrom),
      where('applicationDate', '<=', targetDateTo),
      where('media', '==', media),
      where('organizationId', '==', organization.currentOrganizationId)
    ]
    const applicantRef = collection(db, 'applicants')
    const querys = query(applicantRef, ...filters)
    const docCount = await getCountFromServer(querys)
    const result = docCount.data().count
    return result

  }

  const getApplicantsByColumns = async (status: ApplicantStatus, filterData?: ApplicantProgressFilter, perQuery = 20, showMore = false, orderQuery = [orderBy('currentStatusTimestamp', 'asc')]) => {
    if (state.value.columnsLoading[status]) {
      return;
    }
    const queryCollection = ApplicantOrFixColumn[status]
    if (!showMore) {
      state.value.applicantsByColumn[status] = []
      state.value.continueFromDoc[status] = null
    }
    if (!organization.currentOrganizationId) {
      state.value.applicantRowsCount[status] = 0
      return []
    }
    state.value.columnsLoading[status] = true

    const applicantRef = collection(db, queryCollection)
    const filters = [
      where('status', '==', status),
      where('deleted', '==', false),
    ]

    if (!filterData?.organizationId) {
      filters.push(where('organizationId', '==', organization.currentOrganizationId))
    }


    if (filterData) {
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          filters.push(where(key, '==', value))
        }
      }
    }

    const start = showMore ? [startAt(state.value.continueFromDoc[status])] : []
    const querys = query(applicantRef, ...orderQuery, ...filters, ...start, limit(perQuery + 1))
    const docSnap = await getDocs(querys)

    if (!docSnap.empty) {
      const documents = docSnap.docs.map((item) => {
        const result = { ...item.data(), id: item.id }
        return result
      })

      if (perQuery + 1 === docSnap.docs.length) {
        state.value.continueFromDoc[status] = docSnap.docs[docSnap.docs.length - 1]
        documents.pop()
      } else {
        state.value.continueFromDoc[status] = null
      }

      if (queryCollection === 'applicants') {
        documents.forEach((item) => {
          state.value.applicants[item.id] = item as Applicant
        })
      } else if (queryCollection === 'fix') {
        await Promise.all(documents.map(async (row) => {
          const item = row as ApplicantFix
          if (item.applicant_id && !state.value.applicants[item.applicant_id]) {
            state.value.applicants[item.applicant_id] = await fetchApplicantByID(item.applicant_id)
          }
          if (state.value.applicantFixes[item.applicant_id]) {
            if (!state.value.applicantFixes[item.applicant_id].find((row) => row.id === item.id)) {
              state.value.applicantFixes[item.applicant_id].push({ ...item, id: item.id } as ApplicantFix)
            }
          } else {
            state.value.applicantFixes[item.applicant_id] = [{ ...item, id: item.id } as ApplicantFix]
          }
        }))
      }
      const result = state.value.applicantsByColumn[status].concat(documents)
      state.value.applicantsByColumn[status] = result
      state.value.columnsLoading[status] = false
      await countApplicantsByStatus(status, state.value.applicantProgressFilter)
      return result
    }
    state.value.applicantRowsCount[status] = 0
    state.value.continueFromDoc[status] = null
    state.value.columnsLoading[status] = false
    return []
  }

  async function fetchApplicantByID(id: string) {
    const applicantRef = doc(db, 'applicants/' + id);
    const result = await getDoc(applicantRef)
    state.value.applicants[result.id] = { ...result.data(), id: result.id } as Applicant
    return { ...result.data(), id: result.id } as Applicant
  }

  async function createApplicant(data: Applicant, applicantImage?: FileList | []) {
    const docRef = doc(collection(db, 'applicants'));
    data['id'] = docRef.id;
    data['organizationId'] = organization.currentOrganizationId;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'undefined') delete data[key];
    }
    if (applicantImage && applicantImage.length > 0) {
      const file = applicantImage[0];
      const storage = getStorage();
      const storageRef = refStorage(storage, 'applicants/' + docRef.id + '/image/' + file['name']);
      const snapshot = await uploadBytes(storageRef, file)
      data['imagePath'] = snapshot.ref.fullPath;
      data['imageURL'] = await getDownloadURL(storageRef)
    }
    /** staff rank */
    data.staffRank = countApplicantRank(data)
    /** staff rank */
    await setDoc(
      docRef,
      data
    );
  }

  async function getApplicantsByConstraints(constraints: ConstraintsType) {
    constraints.push(where('organizationId', '==', organization.currentOrganizationId))
    const q = query(collection(db, 'applicants'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot?.docs.map((doc) => {
      return doc.data() as Applicant
    })
  }

  async function getApplicantById(id: string) {
    const applicantRef = doc(db, 'applicants/' + id);
    const result = await getDoc(applicantRef)
    if (!result.data()) {
      return undefined
    }
    return { ...result.data(), id: result.id } as Applicant
  }

  async function getApplicantContactData(applicantId: string, constraints: ConstraintsType) {
    constraints.push(where('organizationId', '==', organization.currentOrganizationId))
    const q = query(collection(db, 'applicants/' + applicantId + '/contacts'), ...constraints);
    const snapshot = await getDocs(q);
    const result = snapshot?.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
    return result
  }

  async function getClients(active_organization_id?: string) {
    const clientsData = await getClientList(db, { active_organization_id })
    const list: Client[] = [];
    clientsData?.forEach((doc) => {
      const data = doc.data();
      list.push({ id: doc.id, ...data } as Client);
    });
    state.value.clientList = list
  }

  const saveWorkExperience = async (rawData: Partial<ApplicantExperienceInputs>, applicantId: string) => {
    const saveData: Partial<ApplicantExperience> = JSON.parse(JSON.stringify(rawData))
    if (rawData.startMonth) saveData.startMonth = dateToTimestampFormat(new Date(rawData.startMonth))
    if (rawData.endMonth) saveData.endMonth = dateToTimestampFormat(new Date(rawData.endMonth))
    try {
      const boRef = doc(db, 'applicants/' + applicantId + '/experience/' + saveData.id);
      await updateDoc(boRef, {
        updated_at: serverTimestamp(),
        ...saveData
      })
        ;
    } catch (e) {
      Alert.warning(e);
    }
  }

  /** Applicant status should be awlays changed here! */
  async function updateApplicantStatus(status: ApplicantStatus, NGStatus?: ApplicantStatus) {
    if (!state.value.selectedApplicant) return;
    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);
    const dateField = applicantStatusDates[status]
    const saveData: Partial<Applicant> = {}
    if (state.value.selectedApplicant[dateField] instanceof Timestamp) {
      saveData.currentStatusTimestamp = state.value.selectedApplicant[dateField]
      saveData.statusChangeTimestamp = state.value.selectedApplicant.statusChangeTimestamp || {}
      saveData.statusChangeTimestamp[status] = state.value.selectedApplicant[dateField]
      saveData.currentStatusMonth = toMonthYear(state.value.selectedApplicant[dateField])
    }
    const userInCharge = applicantUserInChargeField[NGStatus ? NGStatus : status]
    if (userInCharge && state.value.selectedApplicant[userInCharge]) {
      saveData.userInCharge = state.value.selectedApplicant[userInCharge]
    }
    saveData['updated_at'] = serverTimestamp();
    saveData.status = status
    if (saveData.status === ApplicantStatus.RETIRED) {
      if (saveData.statusChangeTimestamp) {
        saveData.statusChangeTimestamp[status] = serverTimestamp()
      }
      saveData.currentStatusTimestamp = serverTimestamp()
      saveData.currentStatusMonth = toMonthYear(dateToTimestampFormat(new Date()))
    }
    for (const [key, value] of Object.entries(saveData)) {
      if (typeof value === 'undefined') delete saveData[key];
    }
    await updateDoc(applicantRef, saveData)
    state.value.selectedApplicant = await fetchApplicantByID(state.value.selectedApplicant?.id)
    if (route.meta.applicantsUpdateOnOrganizationChange) {
      await getApplicantsByColumns(status, state.value.applicantProgressFilter)
    }
  }


  async function updateApplicant(applicantData: Partial<ApplicantInputs>) {
    if (!state.value.selectedApplicant) return;
    const applicantRef = doc(db, 'applicants/' + state.value.selectedApplicant.id);
    /** transform strings to timestamps */
    const saveData = JSON.parse(JSON.stringify(applicantData));

    if (saveData.status) {
      await updateApplicantStatus(saveData.status);
      return;
    }

    if (applicantData.applicationDate) saveData.applicationDate = dateToTimestampFormat(new Date(applicantData.applicationDate));
    if (applicantData.dob) saveData.dob = dateToTimestampFormat(new Date(applicantData.dob));
    if (applicantData.invitationDate) saveData.invitationDate = dateToTimestampFormat(new Date(applicantData.invitationDate));
    if (applicantData.attendingDate) saveData.attendingDate = dateToTimestampFormat(new Date(applicantData.attendingDate));
    if (applicantData.timeToWork) saveData.timeToWork = dateToTimestampFormat(new Date(applicantData.timeToWork));
    if (applicantData.fixDate) saveData.fixDate = dateToTimestampFormat(new Date(applicantData.fixDate));
    if (applicantData.inspectionDate) saveData.inspectionDate = dateToTimestampFormat(new Date(applicantData.inspectionDate));
    if (applicantData.offerDate) saveData.offerDate = dateToTimestampFormat(new Date(applicantData.offerDate));
    if (applicantData.admissionDate) saveData.admissionDate = dateToTimestampFormat(new Date(applicantData.admissionDate));

    /** staff rank */
    saveData.staffRank = countApplicantRank({...state.value.selectedApplicant, ...saveData})
    /** staff rank */

    for (const [key, value] of Object.entries(saveData)) {
      if (typeof value === 'undefined') delete saveData[key];
    }
    saveData['updated_at'] = serverTimestamp();
    await updateDoc(applicantRef, saveData)
    /** update fixes with filtered data */
    if (saveData.prefecture || saveData.organizationId || saveData.branchIncharge) {
      const batch = writeBatch(db)
      const fixes = await getDocs(query(collection(db, 'fix'), where('applicant_id', '==', state.value.selectedApplicant.id), where('deleted', '==', false)))
      await Promise.all(fixes.docs.map(async (row) => {
        const data = await fixStore.formatDataFix(row.id, row.data())
        const docRef = doc(db, 'fix/' + row.id)
        batch.update(docRef, { ...data })
      }))
      await batch.commit()
    }
    state.value.selectedApplicant = await fetchApplicantByID(state.value.selectedApplicant?.id)
    const applicantIndex = state.value.applicantList.findIndex(app => app.id == state.value.selectedApplicant?.id);
    if (applicantIndex >= 0) {
      state.value.applicantList[applicantIndex] = { ...state.value.applicantList[applicantIndex], ...saveData }
    }
    /** status change by OK fields */
    const saveBooleans = {}
    for (const [key, value] of Object.entries(saveData)) {
      if (['fixStatus', 'inspectionStatus', 'offerStatus', 'admissionStatus', 'attendingStatus', 'attractionsStatus'].includes(key)) {
        saveBooleans[key] = value
      }
    }
    if (Object.keys(saveBooleans).length) {
      await changeApplicantStatusByOkFields(saveBooleans)
    }
  };

  const saveFixDataToApplicant = async () => {
    if (!state.value.selectedApplicant) return;
    const bestFix = getMostCompletedFix(state.value.applicantFixes[state.value.selectedApplicant.id])
    if (!bestFix) return;

    const { fixStatus, inspectionStatus, offerStatus, admissionStatus, fixDate, inspectionDate, offerDate, admissionDate, chargeOfFix, chargeOfInspection, chargeOfAdmission, chargeOfOffer, fixReasonNG, inspectionReasonNG, offerReasonNG, admissionReasonNG, id } = bestFix
    const saveBooleans = { fixStatus, inspectionStatus, offerStatus, admissionStatus }
    const saveDates = { fixDate, inspectionDate, offerDate, admissionDate }
    const chargeOfStatus = { chargeOfAdmission, chargeOfOffer, chargeOfInspection, chargeOfFix }
    const NGReasons = { fixReasonNG, inspectionReasonNG, offerReasonNG, admissionReasonNG }

    for (const [key, value] of Object.entries(saveBooleans)) {
      if (typeof value === 'undefined') {
        saveBooleans[key] = deleteField()
      }
    }

    const saveData = { ...saveBooleans, ...saveDates, ...NGReasons, ...chargeOfStatus, bestFixID: id }
    await updateApplicant(saveData)
  }


  const changeApplicantStatusByOkFields = async (saveBooleans: Partial<Applicant>) => {
    if (!state.value.selectedApplicant) {
      return
    }
    let newStatus: ApplicantStatus | undefined, NGStatus: ApplicantStatus | undefined
    for (const [key, value] of Object.entries(applicantStatusOkFields)) {
      if (saveBooleans[key] === true) {
        newStatus = value
      } else if (saveBooleans[key] === false) {
        const NGField = applicantNGStatusField[applicantStatusOkFields[key]]
        NGStatus = newStatus
        newStatus = state.value.selectedApplicant[NGField]
        break;
      }
    }
    if (newStatus) {
      await updateApplicantStatus(newStatus, NGStatus)
    }
  }

  /** reset fixes on filter change */
  watch(() => state.value.applicantProgressFilter, () => {
    state.value.applicantFixes = {}
  }, { deep: true })

  /** remove applicant from column when status change */
  watch(() => [state.value.selectedApplicant?.id, state.value.selectedApplicant?.status], async (newValue, oldValue) => {
    if (!state.value.selectedApplicant) return;
    if (newValue[0] !== oldValue[0]) return;
    if (!newValue[0] || !oldValue[0]) return;
    if (newValue[1] === oldValue[1]) return;
    if (!newValue[1]) return;
    if (oldValue[1] && state.value.applicantsByColumn[oldValue[1]]) {
      state.value.applicantsByColumn[oldValue[1]] = state.value.applicantsByColumn[oldValue[1]].filter((item: Applicant) => item.id !== state.value.selectedApplicant?.id)
    }
  }, { deep: true })

  /** update Applicant in tables after details changes */
  watch(() => state.value.selectedApplicant, (newValue) => {
    if (!newValue?.status) return;
    if (!state.value.applicantsByColumn[newValue.status]) return;
    const changingApplicantIndex = state.value.applicantsByColumn[newValue.status].findIndex((row: Applicant) => row.id === newValue?.id)
    if (changingApplicantIndex >= 0) {
      state.value.applicantsByColumn[newValue?.status][changingApplicantIndex] = state.value.selectedApplicant
    }
  }, { deep: true })

  /** reload applicants by status */
  watch(() => organization.currentOrganizationId, (newValue) => {
    state.value.applicantProgressFilter.organizationId = newValue
    state.value.applicantProgressFilter.branchIncharge = ''
    state.value.applicantProgressFilter.userInCharge = ''
    state.value.selectedApplicant = null
    if (route.meta.applicantsUpdateOnOrganizationChange) {
      COLUMN_STATUSES.forEach((status) => {
        getApplicantsByColumns(status, state.value.applicantProgressFilter, limitQuery, false)
      })
      COUNT_STATUSES.forEach(async (status: ApplicantStatus) => {
        countApplicantsByStatus(status, state.value.applicantProgressFilter)
      })
    } else {
      state.value.needsApplicantUpdateOnMounted = true
    }
  })

  return { state, getClients, loadApplicantData, getApplicantsByColumns, countApplicantsByStatus, updateApplicant, createApplicant, getApplicantContactData, saveWorkExperience, countApplicantsByMedia, getApplicantsByConstraints, saveFixDataToApplicant, /* changeApplicantStatusByOkFields, */ getApplicantById }
})

