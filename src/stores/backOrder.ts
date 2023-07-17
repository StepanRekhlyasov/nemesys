import { getAuth } from 'firebase/auth';
import { setDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where, writeBatch, DocumentData, Timestamp, } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { BackOrderModel } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue';
import { api } from 'src/boot/axios';
import { dateToTimestampFormat, timestampToDateFormat } from 'src/shared/utils/utils';
import { BOElasticFilter, BOElasticSearchData } from 'src/pages/user/BackOrder/types/backOrder.types';

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

    const filters: BOElasticFilter = ref({ all: [{ deleted: 'false' }] }).value;
    let queryString = '';

    if (searchData['keyword']) {
      queryString = searchData['keyword'];
    }
    if (searchData.registrationDateMin && searchData.registrationDateMax) {
      filters['all'].push({
        created_at: {
          from: formatDate(new Date(searchData.registrationDateMin), true),
          to: formatDate(new Date(searchData.registrationDateMax)),
        },
      });
    } else if (searchData.registrationDateMin) {
      filters['all'].push({
        created_at: {
          from: formatDate(new Date(searchData.registrationDateMin), true),
        },
      });
    } else if (searchData.registrationDateMax) {
      filters['all'].push({
        created_at: {
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

    const items = ['boid', 'qualifications', 'employmenttype', 'experience', 'category', 'casetype',];
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

    loadBOData();
  }

  const loadBOData = async () => {
    state.value.isLoadingProgress = true;
    const allBOList = ref<BackOrderModel[]>([])
    while (state.value.currentIds.length) {
      const batch = state.value.currentIds.splice(0, 10);
      const boList = await getBOByConstraints([where('deleted', '==', false), where('id', 'in', batch), orderBy('boId', 'desc')]);
      for (let i = 0; i < boList.length; i++) {
        boList[i]['dateOfRegistration'] = timestampToDateFormat(
          boList[i]['dateOfRegistration'] as Timestamp
        );
      }

      allBOList.value = [...allBOList.value, ...boList];
    }
    state.value.BOList = allBOList.value
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
    const data = JSON.parse(JSON.stringify(backOrderData));
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['registrant'] = auth.currentUser?.uid;
    const snapshot = await getDocs(query(collection(db, '/BO')));
    data['boId'] = snapshot.docs.length;
    if (data.dateOfRegistration) data.dateOfRegistration = dateToTimestampFormat(new Date(data.dateOfRegistration));

    const docRef = doc(collection(db, '/BO'));
    data['id'] = docRef.id;
    await setDoc(docRef, data);
    Alert.success();
  }
  async function getClientBackOrder(clientId: string): Promise<BackOrderModel[]> {
    const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc'), where('clientId', '==', clientId),];
    const docs = await getDocs(query(collection(db, '/BO'), ...constraints));

    const list: BackOrderModel[] = [];
    docs.forEach((fix) => {
      const data = fix.data();
      list.push({
        ...data,
      } as BackOrderModel);
    });
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

  async function updateBackOrder(backOrder: BackOrderModel) {
    if (!state.value.selectedBo) return;
    const backOrderData = { ...backOrder };
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
    const dLat = degToRad(loc2.lat - loc1.lat);
    const dLon = degToRad(loc2.lon - loc1.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(loc1.lat)) *
      Math.cos(degToRad(loc2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = easrtRadiusInKm * c;
    return Number(distance.toFixed(2));
  }

  const degToRad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  function matchData(staff: DocumentData, bo: DocumentData) {
    let qualification = 0;
    let occupation = 0;
    let classification = 0;
    let daysToWork = 0;
    let daysPerWeek = 0;
    let agePercent = 0;
    let expReq = 0;

    //qualification percentage
    staff.qualification?.forEach((q) => {
      if (bo.qualifications.toLowerCase() === q.toLowerCase()) {
        qualification = 1;
      }
    });

    //Experience required
    if (Number(staff.totalYear) && Number(bo.experience_req)) {
      if (staff.totalYear >= bo.experience_req) {
        expReq = 1;
      } else {
        expReq = staff.totalYear / bo.experience_req;
      }
    }

    //caseType
    if (bo.caseType && staff.occupation?.toLowerCase() === bo.caseType?.toLowerCase()) {
      occupation = 1;
    }

    //classification
    if (bo.transactionType && staff.classification?.toLowerCase() === bo.transactionType?.toLowerCase()) {
      classification = 1;
    }

    //daysToWork
    if (bo.numberWorkingDays && staff.daysToWork) {
      const days = stringToNumber(bo.numberWorkingDays);
      if (days && days <= staff.daysToWork) {
        daysToWork = 1;
      } else if (days) {
        daysToWork = staff.daysToWork / days;
      }
    }

    //workingDaysWeek
    if (bo.working_days_week && staff.daysPerWeek) {
      let matchingDays = 0;
      staff.daysPerWeek.forEach((daySatff) => {
        bo.working_days_week.forEach((dayClient) => {
          if (dayClient === daySatff) {
            matchingDays++;
          }
        });
      });
      if (bo.working_days_week.length) {
        daysPerWeek = matchingDays / bo.working_days_week.length;
      }
    }

    //age
    if (bo.ageLimit && staff.dob) {
      const currentDate = new Date();
      const dob = new Date(staff.dob.seconds * 1000);
      let age = currentDate.getFullYear() - dob.getFullYear();
      if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
        age--;
      }
      agePercent = age <= bo.ageLimit ? 1 : bo.ageLimit / age;
    }
    const matchPercent = ((agePercent + qualification + occupation + classification + daysPerWeek + daysToWork + expReq) / 7) * 100;
    staff.matchDegree = Number(matchPercent.toFixed(2));
  }

  const stringToNumber = (num: string): number | undefined => {
    const numberMap: { [key: string]: number } = { one: 1, two: 2, three: 3, four: 4, five: 5, };
    return numberMap[num];
  };
  return {
    state,
    getDistance,
    matchData,
    loadBackOrder,
    addBackOrder,
    getClientBackOrder,
    deleteBackOrder,
    updateBackOrder,
    getClientFactoryBackOrder,
    getBoById,
    deleteBO,
    getBOByConstraints
  };
});
