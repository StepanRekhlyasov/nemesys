import { getAuth } from 'firebase/auth';
import { setDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where, writeBatch, DocumentData, Timestamp, addDoc, getCountFromServer, limit } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { BackOrderModel } from 'src/shared/model';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { dateToTimestampFormat, myDateFormat } from 'src/shared/utils/utils';
import { BOElasticFilter, BOElasticSearchData } from 'src/pages/user/BackOrder/types/backOrder.types';
import { useOrganization } from './organization';

interface BackOrderState {
  BOList: BackOrderModel[];
  selectedBo: BackOrderModel | null;
  currentIds: number[];
  isLoadingProgress: boolean;
  metaData: {
    current: number;
    size: number;
    total_pages: number;
    total_results: number;
  };
}

export const useBackOrder = defineStore('backOrder', () => {
  const db = getFirestore();
  const state = ref<BackOrderState>({
    BOList: [],
    selectedBo: null,
    currentIds: [] as number[],
    isLoadingProgress: false,
    metaData: {
      current: 0,
      size: 0,
      total_pages: 0,
      total_results: 0,
    },
  });
  const organization = useOrganization()
  const formatDate = (dt: Date, midNight = false) => {
    const year = dt.toLocaleString('en-US', { year: 'numeric' });
    const month = dt.toLocaleString('en-US', { month: '2-digit' });
    const day = dt.toLocaleString('en-US', { day: '2-digit' });
    if (midNight) {
      return year + '-' + month + '-' + day + 'T00:00:00+00:00';
    }
    return year + '-' + month + '-' + day + 'T23:59:59+00:00';
  };

  async function loadBackOrder(searchData: BOElasticSearchData, pagination = {
    page: 1,
    rowsPerPage: 30,
  }) {
    state.value.currentIds = [];
    state.value.isLoadingProgress = true;

    const filters: BOElasticFilter = ref({ all: [{ deleted: 'false' }, { 'organizationid': organization.currentOrganizationId }] }).value;
    let queryString = '';

    if (searchData['keyword']) {
      queryString = searchData['keyword'];
    }
    if (searchData.registrationDateMin && searchData.registrationDateMax) {
      filters['all'].push({
        dateofregistration: {
          from: formatDate(new Date(searchData.registrationDateMin), true),
          to: formatDate(new Date(searchData.registrationDateMax)),
        },
      });
    } else if (searchData.registrationDateMin) {
      filters['all'].push({
        dateofregistration: {
          from: formatDate(new Date(searchData.registrationDateMin), true),
        },
      });
    } else if (searchData.registrationDateMax) {
      filters['all'].push({
        dateofregistration: {
          to: formatDate(new Date(searchData.registrationDateMax)),
        },
      });
    }

    if (searchData.ageMin) {
      filters['all'].push({
        upperagelimit: { from: parseInt(searchData.ageMin) },
      });
    }
    if (searchData.ageMax) {
      filters['all'].push({
        upperagelimit: { to: parseInt(searchData.ageMax) },
      });
    }
    if (searchData.boid) {
      filters['all'].push({
        boid: Number(searchData['boid']),
      });
    }

    const items = ['qualifications'];
    for (let i = 0; i < items.length; i++) {
      if (searchData[items[i]] && searchData[items[i]].length > 0) {
        const obj = {};
        obj[items[i]] = searchData[items[i]];
        filters['all'].push(obj);
      }
    }

    if (searchData.mapData) {
      filters['all'].push({
        geohash: {
          center: `${searchData.mapData.lat}, ${searchData.mapData.lng}`,
          distance: searchData.mapData.radiusInM,
          unit: 'm',
        },
      });
    }

    await api
      .post(
        process.env.elasticSearchBOURL as string,
        {
          query: queryString,
          page: { size: pagination.rowsPerPage, current: pagination.page },
          filters: filters,
          sort: {
            boid: 'desc'
          }
        },
        {
          headers: {
            Authorization: process.env.elasticSearchKey,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        if (response.status == 200) {
          const responseData = response.data.results;
          state.value.metaData = response.data.meta.page;
          for (let i = 0; i < responseData.length; i++) {
            state.value.currentIds.push(responseData[i]['id']['raw']);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    loadBOData(searchData);
  }

  const loadBOData = async (searchData) => {
    state.value.isLoadingProgress = true;
    let allBOList: BackOrderModel[] = []
    while (state.value.currentIds.length) {
      const batch = state.value.currentIds.splice(0, 10);
      const boList = await getBOByConstraints([where('deleted', '==', false), where('id', 'in', batch), where('organizationId', '==', organization.currentOrganizationId), orderBy('boId', 'desc')]);
      for (let i = 0; i < boList.length; i++) {
        boList[i]['dateOfRegistration'] = myDateFormat(
          boList[i]['dateOfRegistration'] as Timestamp
        );
      }

      allBOList = [...allBOList, ...boList];
    }
    state.value.BOList = allBOList

    if(searchData.customerRepresentative){
      state.value.BOList =  state.value.BOList.filter(bo=>bo.customerRepresentative && bo.customerRepresentative === searchData.customerRepresentative)
    }
    if(searchData.typecase && searchData.typecase.length){
      state.value.BOList =  state.value.BOList.filter(bo=>bo.typeCase && searchData.typecase.includes(bo.typeCase))
    }
    if(searchData.transactiontype && searchData.transactiontype.length){
      state.value.BOList =  state.value.BOList.filter(bo=>bo.transactionType && searchData.transactiontype.includes(bo.transactionType))
    }
    if(searchData.employmenttype && searchData.employmenttype.length){
      state.value.BOList = state.value.BOList.filter(bo =>
        bo.employmentType && bo.employmentType.some(type => searchData.employmenttype.includes(type)));
    }

    state.value.isLoadingProgress = false;
  };

  async function getBOByConstraints(constraints: ConstraintsType) {
    const q = query(collection(db, 'BO'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot?.docs.map((doc) => {
      return doc.data() as BackOrderModel;
    });
  }

  async function getBoById(id: string) {
    const docSnap = await getDoc(doc(db, 'BO/' + id));
    return { ...docSnap.data(), id: docSnap.id } as BackOrderModel;
  }
  async function addBackOrder(backOrderData) {
    const auth = getAuth();
    if (backOrderData.workingDays) {
      const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday','saturday','sunday','holiday'];
      backOrderData.workingDays.sort((a, b) => {
        const indexA = weekdays.indexOf(a);
        const indexB = weekdays.indexOf(b);
        return indexA - indexB;
      });
    }
    const data = JSON.parse(JSON.stringify(backOrderData));
    try {
      const clientDoc = doc(db, 'clients', data.client_id);
      const officeDoc = doc(collection(clientDoc, 'client-factory'), data.office_id);
      const officeData = await getDoc(officeDoc);
      if (officeData.exists()) {
        data['distance'] = officeData.data().distance;
        data['lat'] = officeData.data().lat;
        data['lon'] = officeData.data().lon;
      }
    }
    catch (err) {
      data['distance'] = null;
    }
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['registrant'] = auth.currentUser?.uid;
    const snapshot = query(collection(db, '/BO'), where('organizationId', '==', organization.currentOrganizationId),orderBy('boId', 'desc'),limit(1));
    const largestBoId = await getDocs(snapshot);
    data['boId'] = largestBoId.docs[0].data().boId + 1;

    const checkNew = await getDocs(query(collection(db, '/BO'), where('office_id', '==', data.office_id), limit(1)))
    if (checkNew.docs.length > 0) {
      data.isNew = false
    } else {
      data.isNew = true
    }

    if (data.dateOfRegistration) data.dateOfRegistration = dateToTimestampFormat(new Date(data.dateOfRegistration));

    const docRef = doc(collection(db, '/BO'));
    data['id'] = docRef.id;
    data['organizationId'] = organization.currentOrganizationId
    await setDoc(docRef, data);
    ;
  }
  async function getClientBackOrder(clientId: string): Promise<BackOrderModel[]> {
    const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc'), where('client_id', '==', clientId), where('organizationId', '==', organization.currentOrganizationId)];
    const docs = await getDocs(query(collection(db, '/BO'), ...constraints));

    const list: BackOrderModel[] = [];
    docs.forEach((fix) => {
      const data = fix.data();
      list.push({
        ...data,
      } as BackOrderModel);
    });
    list.forEach(bo=>{
      bo.dateOfRegistration =  myDateFormat(
        bo.dateOfRegistration as Timestamp
      );
    })
    return list;
  }

  async function getClientFactoryBackOrder(office_id: string): Promise<BackOrderModel[]> {
    const constraints: ConstraintsType = [where('deleted', '==', false), where('office_id', '==', office_id),];
    const docs = await getDocs(query(collection(db, '/BO'), ...constraints));

    const list: BackOrderModel[] = [];
    docs.forEach((fix) => {
      const data = fix.data();
      list.push({
        ...data,
        id: fix.id,
      } as BackOrderModel);
    });
    return list;
  }

  async function getCfBoOfCurrentOrganization(office_id: string, isAdmin: boolean): Promise<BackOrderModel[]> {
    let constraints: ConstraintsType = []
    if(isAdmin){
     constraints = [where('deleted', '==', false), where('office_id', '==', office_id)];
    }
    else{
     constraints = [where('deleted', '==', false), where('office_id', '==', office_id),where('organizationId', '==', organization.currentOrganizationId)];
    }
    const docs = await getDocs(query(collection(db, '/BO'), ...constraints));

    const list: BackOrderModel[] = [];
    docs.forEach((fix) => {
      const data = fix.data();
      list.push({
        ...data,
        id: fix.id,
      } as BackOrderModel);
    });
    list.forEach(bo=>{
      bo.dateOfRegistration =  myDateFormat(
        bo.dateOfRegistration as Timestamp
      );
    })
    return list;
  }

  async function updateBackOrder(backOrder: BackOrderModel) {
    if (!state.value.selectedBo) return;
    const backOrderData = { ...backOrder };
    if (backOrderData.workingDays) {
      const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday','saturday','sunday','holiday'];
      backOrderData.workingDays.sort((a, b) => {
        const indexA = weekdays.indexOf(a);
        const indexB = weekdays.indexOf(b);
        return indexA - indexB;
      });
    }
    if (backOrderData.dateOfRegistration) backOrderData.dateOfRegistration = dateToTimestampFormat(new Date(backOrderData.dateOfRegistration as string));
    const boRef = doc(db, '/BO/' + backOrderData.id);
    await updateDoc(boRef, { ...backOrderData });
    state.value.selectedBo = { ...state.value.selectedBo, ...backOrder };

    const changeIndex = state.value.BOList.findIndex(
      (bo) => bo.id === state.value.selectedBo?.id
    );
    state.value.BOList[changeIndex] = state.value.selectedBo;

    state.value.BOList = state.value.BOList.map((bo) => {
      if (bo.id === state.value.selectedBo?.id) {
        return backOrder;
      }
      return bo;
    });
  }

  const deleteBackOrder = async (boList) => {
    const ret = boList.map(async (bo) => {
      const boRef = doc(db, '/BO/' + bo.id);
      await updateDoc(boRef, {
        deleted: true,
      });
    });
    Promise.all(ret);
  };
  const deleteBO = async (ids) => {
    const updateData = {};
    updateData['deleted'] = true;
    const batch = writeBatch(db);
    for (const id of ids) {
      batch.update(doc(db, 'BO', id), updateData);
    }
    await batch.commit();
  };

  function getDistance(loc1: { lat: number; lon: number }, loc2: { lat: number; lon: number }) {
    const easrtRadiusInKm = 6371;
    const accuracyVar = 0.165
    const dLat = degToRad(loc2.lat - loc1.lat);
    const dLon = degToRad(loc2.lon - loc1.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(loc1.lat)) *
      Math.cos(degToRad(loc2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = easrtRadiusInKm * c + accuracyVar;
    return Number(distance.toFixed(2));
  }

  const degToRad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  function matchData(staff: DocumentData, bo: DocumentData, isBo=false) {
    let qualification = 0;
    let daysToWork = 0;
    let daysPerWeek = 0;
    let agePercent = 0;
    let expReq = 0;
    let workingHoursDay = 0;
    let workingHoursEarly = 0;
    let workingHoursLate = 0;
    let workingHoursNight = 0;
    let workingHours = 0;
    let commuteDistance = 0;
    const matchedData = {
      'qualification': {
        value: 0,
        label: '',
      },
      'expReq': {
        value: 0,
        label: '',
      },
      'daysToWork': {
        value: 0,
        label: '',
      },
      'agePercent': {
        value: 0,
        label: '',
      },
      'commuteDistance': {
        value: 0,
        label: '',
      },
      'daysPerWeek': {
        value: 0,
        'sunday': 0,
        'monday': 0,
        'tuesday': 0,
        'wednesday': 0,
        'thursday': 0,
        'friday': 0,
        'saturday': 0,
      },
      'workingHours': {
        value: 0,
        'day': 0,
        'early': 0,
        'late': 0,
        'night': 0,
      },
    };

    if(!Array.isArray(bo.workingDays)){
      bo.workingDays = []
    }

    //qualification percentage
    if (bo.qualifications && bo.qualifications.length) {
      let totalQualification = 0
      staff.qualification?.forEach((q) => {
        bo.qualifications?.forEach((qBo) => {
          if (qBo.toLowerCase() === q.toLowerCase()) {
            totalQualification++;
            matchedData['qualification'].label = q;
          }
        })
      });
      qualification = totalQualification / bo.qualifications.length
    }
    else {
      qualification = 1;
    }
    matchedData['qualification'].value = qualification * 100;

    //Experience required
    if (!bo.experience_req) {
      expReq = 1;
    }
    else {
      if (staff.totalYear) {
        matchedData['expReq'].label = staff.totalYear;
        if (Number(staff.totalYear) >= Number(bo.experience_req)) {
          expReq = 1;
        }
      }
    }
    matchedData['expReq'].value = expReq * 100

    //daysToWork
    if (!bo.daysPerWeekList) {
      daysToWork = 1;
    }
    else {
      const days = stringToNumber(bo.daysPerWeekList)
      if (staff.daysToWork) {
        matchedData.daysToWork.label = staff.daysToWork;
        if (!days || days <= Number(staff.daysToWork)) {
          daysToWork = 1;
        } else {
          daysToWork = Number(staff.daysToWork) / days;
        }
      }
    }
    matchedData['daysToWork'].value = daysToWork * 100;

    //workingDaysWeek
    if (!bo.workingDays || bo.workingDays.length === 0) {
      daysPerWeek = 1;
    } else {
      if (staff.daysPerWeek && staff.daysPerWeek.length != 0) {
        let matchingDays = 0;
        staff.daysPerWeek.forEach((daySatff) => {
          bo.workingDays.forEach((dayClient) => {
            if (dayClient === daySatff) {
              matchingDays++;
              matchedData['daysPerWeek'][dayClient] = 1;
            }
          });
        });
        if (bo.workingDays && bo.workingDays.length) {
          daysPerWeek = matchingDays / bo.workingDays.length;
        }
      }
    }
    matchedData['daysPerWeek'].value = daysPerWeek * 100;
    //age
    if (staff.dob) {
      const currentDate = new Date();
      const dob = new Date(staff.dob.seconds * 1000);
      let age = currentDate.getFullYear() - dob.getFullYear();
      if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        age--;
      }
      matchedData.agePercent.label = age.toString();
      if (bo.upperAgeLimit) {
        agePercent = age <= bo.upperAgeLimit ? 1 : 0;
      }
      else {
        agePercent = 1;
      }
    }

    matchedData['agePercent'].value = agePercent * 100;

    //workingHoursDay
    if (bo.workingHoursDay_min || bo.workingHoursDay_max) {
      if (staff.workingHoursDay === true || staff.workingHoursDay === '△') {
        workingHoursDay = 1;
      }
    }
    else {
      workingHoursDay = 1;
    }
    //workingHoursEarly
    if (bo.workingHoursEarly_min || bo.workingHoursEarly_max) {
      if (staff.workingHoursEarly === true || staff.workingHoursEarly === '△') {
        workingHoursEarly = 1;
      }
    }
    else {
      workingHoursEarly = 1;
    }
    //workingHoursLate
    if (bo.workingHoursLate_min || bo.workingHoursLate_max) {
      if (staff.workingHoursLate === true || staff.workingHoursLate === '△') {
        workingHoursLate = 1;
      }
    }
    else {
      workingHoursLate = 1;
    }
    //workingHoursNight
    if (bo.workingHoursNight_min || bo.workingHoursNight_max) {
      if (staff.workingHoursNight === true || staff.workingHoursNight === '△') {
        workingHoursNight = 1;
      }
    }
    else {
      workingHoursNight = 1;
    }
    workingHours = (workingHoursDay + workingHoursEarly + workingHoursLate + workingHoursNight) / 4;
    matchedData['workingHours'].value = workingHours * 100;
    matchedData['workingHours']['day'] = workingHoursDay;
    matchedData['workingHours']['early'] = workingHoursEarly;
    matchedData['workingHours']['late'] = workingHoursLate;
    matchedData['workingHours']['night'] = workingHoursNight;

    //commute distance
    if (staff.commutingTime) {
      const distance = 30 * staff.commutingTime;
      if(isBo){
        commuteDistance = distance >= bo.distanceBusiness ? 1 : distance / bo.distanceBusiness;
      }
      else{
        commuteDistance = distance >= staff.distanceBusiness ? 1 : distance / staff.distanceBusiness;
      }
      matchedData.commuteDistance.label = distance.toString();
    }
    matchedData['commuteDistance'].value = Number((commuteDistance * 100).toFixed(2));

    const matchPercent = ((agePercent + qualification + daysPerWeek + daysToWork + expReq + workingHours + commuteDistance) / 7) * 100;
    staff.matchDegree = Number(matchPercent.toFixed(2));
    if(isBo){
      bo.matchDegree = Number(matchPercent.toFixed(2));
    }
    return matchedData;
  }

  const stringToNumber = (num: string): number | undefined => {
    const numberMap: { [key: string]: number } = { one: 1, two: 2, three: 3, four: 4, five: 5, };
    return numberMap[num];
  };

  const getApplicantIds = async (bo) => {
    const db = getFirestore();
    const collectionRef = collection(db, 'fix');

    const q = query(collectionRef, where('backOrder', '==', bo.id), where('deleted', '==', false));
    const snapshot = await getDocs(q);

    const assignedStaff = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    const applicantIds = assignedStaff.map((staff) => staff['applicant_id']);
    return applicantIds
  }

  async function addToFix(data: DocumentData) {
    const collectionRef = collection(db, 'fix');
    await addDoc(collectionRef, data.value);
    ;
  }

  const countDaysByOfficeId = async (
    officeId: string,
    day?: string,
    route?: string,
    type?: string
  ) => {
    const collectionRef = collection(db, 'BO');
    const today = new Date();
    const halfYearAgo = new Date();
    halfYearAgo.setMonth(halfYearAgo.getMonth() - 6);
    const filters = [
      where('office_id', '==', officeId),
      where('deleted', '==', false),
      where('created_at', '>=', halfYearAgo),
      where('created_at', '<=', today),
    ];
    if (day) {
      filters.push(where('daysPerWeekList', '==', day));
    }
    if (route) {
      filters.push(where('BOGenerationRoute', '==', route));
    }
    if (type) {
      filters.push(where('type', '==', type));
    }
    const q = query(collectionRef, ...filters);
    const counted = await getCountFromServer(q);
    return counted.data().count;
  };

  return { getCfBoOfCurrentOrganization, addToFix, stringToNumber, getApplicantIds, state, getDistance, matchData, loadBackOrder, addBackOrder, getClientBackOrder, deleteBackOrder, updateBackOrder, getClientFactoryBackOrder, getBoById, deleteBO, getBOByConstraints, countDaysByOfficeId }
})
