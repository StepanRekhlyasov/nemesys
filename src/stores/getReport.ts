import {
  collection,
  query,
  where,
  getFirestore,
  getCountFromServer,
  QueryFieldFilterConstraint,
  Firestore,
  getDocs,
  Query,
  DocumentData,
  getDoc,
  doc,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Branch, User } from 'src/shared/model';
import { useUserStore } from './user';
import { typeOfQuery } from 'src/shared/types/totalization';
import {
  mediaBasedReportState,
  basedReportState,
  userBasedReportState,
  ReportState,
  FieldDict,
  dailyBasedReportState,
  reportStateAndOthers,
  branchBasedReportState,
  GetAgeReportInput,
} from 'src/shared/model/GetReport';
import { Media } from 'src/shared/model/Media.model';
import { secondperday } from 'src/pages/user/KPI/const/kpi.const';
import { round } from 'src/shared/utils/KPI.utils';
const userStore = useUserStore();
const miliSecondsPerYear = 1000 * 60 * 60 * 24 * 365;
const milsecondPersecond = 1000;
const applicantFieldDict: FieldDict = {
  name: 'applicants',
  dateBasedOnEachItemDate: 'applicationDate',
  dateBasedOnLeftMostItemDate: 'applicationDate',
  filters: [where('deleted', '==', false)],
  collection: 'applicants',
  branchField: 'branchInCharge',
  mediaField: 'media',
  occupationField: 'occupation',
  organizationIdField: 'organizationId',
};

const fixFieldDict: FieldDict = {
  name: 'fix',
  rateName: 'fixRate',
  dateBasedOnEachItemDate: 'fixDate',
  dateBasedOnLeftMostItemDate: 'fixDate',
  filters: [where('fixStatus', '==', true)],
  collection: 'fix',
  branchField: 'branchInCharge',
  uidField: 'chargeOfFix',
  mediaField: 'media',
  organizationIdField: 'organizationId',
};

const BOFieldDict: FieldDict = {
  name: 'BO',
  dateBasedOnEachItemDate: 'created_at',
  dateBasedOnLeftMostItemDate: 'created_at',
  filters: [],
  collection: 'BO',
  uidField: 'registrant',
  mediaField: 'media',
  organizationIdField: 'organizationId',
};

const validApplicantsFieldDict: FieldDict = {
  name: 'validApplicants',
  rateName: 'validApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: applicantFieldDict.filters,
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
  organizationIdField: applicantFieldDict.organizationIdField,
};

const contatApplicantsFieldDict: FieldDict = {
  name: 'contactApplicants',
  rateName: 'contactApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: applicantFieldDict.filters.concat([
    where('contactStatus', '==', true),
  ]),
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
  organizationIdField: applicantFieldDict.organizationIdField,
};

const attractionApplicantsFieldDict: FieldDict = {
  name: 'attractionApplicants',
  rateName: 'attractionApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: applicantFieldDict.filters.concat([
    where('attractionsStatus', '==', true),
  ]),
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
  organizationIdField: applicantFieldDict.organizationIdField,
};
const attendApplicantsFieldDict: FieldDict = {
  name: 'attendApplicants',
  rateName: 'attendApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: applicantFieldDict.filters.concat([
    where('attendingStatus', '==', true),
  ]),
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
  organizationIdField: applicantFieldDict.organizationIdField,
};

const inspectionFieldDict: FieldDict = {
  name: 'inspection',
  rateName: 'inspectionRate',
  dateBasedOnEachItemDate: 'inspectionDate',
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('inspectionStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
  uidField: 'chargeOfInspection',
  organizationIdField: fixFieldDict.organizationIdField,
};

const offerFieldDict: FieldDict = {
  name: 'offer',
  rateName: 'offerRate',
  dateBasedOnEachItemDate: 'offerDate',
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('offerStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
  uidField: 'chargeOfOffer',
  organizationIdField: fixFieldDict.organizationIdField,
};

const admissionFieldDict: FieldDict = {
  name: 'admission',
  rateName: 'admissionRate',
  dateBasedOnEachItemDate: 'admissionDate',
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('admissionStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
  uidField: 'chargeOfAdmission',
  organizationIdField: fixFieldDict.organizationIdField,
};

const BOIsfirstFieldDict: FieldDict = {
  name: 'BOIsfirst',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('is_first', '==', true)],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const BOIsNotfirstFieldDict: FieldDict = {
  name: 'BOIsnotfirst',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('is_first', '==', false)],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const generalDispatchFieldDict: FieldDict = {
  name: 'generalDispatch',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'generalDispatch')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const introductionFieldDict: FieldDict = {
  name: 'introduction',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'introduction')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const TTPFieldDict: FieldDict = {
  name: 'TTP',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'TTP')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const nurseFieldDict: FieldDict = {
  name: 'nurse',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('typeCase', '==', 'nurse')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const nurseCareFieldDict: FieldDict = {
  name: 'nursingCare',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('typeCase', '==', 'nursingCare')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
  organizationIdField: BOFieldDict.organizationIdField,
};

const amountFieldDict: FieldDict = {
  name: 'amount',
  dateBasedOnEachItemDate: 'accountingMonthDate',
  dateBasedOnLeftMostItemDate: 'accountingMonthDate',
  filters: [where('deleted', '==', false)],
  collection: 'budgets',
  mediaField: 'media',
};

const maleFieldDict: FieldDict = {
  name: 'male',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('sex', '==', 'male')],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
};

const femaleFieldDict: FieldDict = {
  name: 'female',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('sex', '==', 'female')],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
  occupationField: applicantFieldDict.occupationField,
};

const fieldDicts: { [key in typeOfQuery]: FieldDict } = {
  applicants: applicantFieldDict,
  validApplicants: validApplicantsFieldDict,
  contactApplicants: contatApplicantsFieldDict,
  attractionApplicants: attractionApplicantsFieldDict,
  attendApplicants: attendApplicantsFieldDict,
  fix: fixFieldDict,
  inspection: inspectionFieldDict,
  offer: offerFieldDict,
  admission: admissionFieldDict,
  BO: BOFieldDict,
  BOIsfirst: BOIsfirstFieldDict,
  BOIsnotfirst: BOIsNotfirstFieldDict,
  generalDispatch: generalDispatchFieldDict,
  introduction: introductionFieldDict,
  TTP: TTPFieldDict,
  nurse: nurseFieldDict,
  nursingCare: nurseCareFieldDict,
  amount: amountFieldDict,
  male: maleFieldDict,
  female: femaleFieldDict,
};
const proratedRate = (dayForMonth: Date, fromDate: Date, toDate: Date) => {
  const numOfDayOfMonth = new Date(
    dayForMonth.getFullYear(),
    dayForMonth.getMonth() + 1,
    0
  ).getDate();

  const days = (toDate.getTime() - fromDate.getTime()) / secondperday + 1;

  return days / numOfDayOfMonth;
};
const getQuery = (
  reportState: ReportState,
  queryName: {
    queryName: typeOfQuery;
    filtersInput?:
      | readonly [QueryFieldFilterConstraint]
      | QueryFieldFilterConstraint[];
    fieldName?: string;
  },
  db: Firestore
): Query<DocumentData> => {
  const fromDate =
    typeof reportState.dateRange.from == 'string'
      ? new Date(reportState.dateRange.from)
      : reportState.dateRange.from;
  const toDate =
    typeof reportState.dateRange.to == 'string'
      ? new Date(reportState.dateRange.to)
      : reportState.dateRange.to;
  toDate.setHours(23, 59, 59, 999);
  if (queryName.queryName == 'amount') {
    fromDate.setMonth(fromDate.getMonth() - 1);
  }
  const fieldDict = fieldDicts[queryName.queryName];
  let filters: QueryFieldFilterConstraint[] = [...fieldDict.filters];
  if (queryName.filtersInput) {
    filters = filters.concat([...queryName.filtersInput]);
  }
  if (
    reportState.dateType == 'BasedOnLeftMostItemDate' &&
    fieldDict.dateBasedOnLeftMostItemDate
  ) {
    filters.push(where(fieldDict.dateBasedOnLeftMostItemDate, '>=', fromDate));
    filters.push(where(fieldDict.dateBasedOnLeftMostItemDate, '<=', toDate));
  } else if (
    reportState.dateType == 'BasedOnEachItemDate' &&
    fieldDict.dateBasedOnEachItemDate
  ) {
    filters.push(where(fieldDict.dateBasedOnEachItemDate, '>=', fromDate));
    filters.push(where(fieldDict.dateBasedOnEachItemDate, '<=', toDate));
  }

  if (reportState.media && fieldDict.mediaField) {
    filters.push(where(fieldDict.mediaField, '==', reportState.media));
  }

  if (reportState.branch && fieldDict.branchField) {
    filters.push(where(fieldDict.branchField, '==', reportState.branch));
  }

  if (reportState.uid && fieldDict.uidField) {
    filters.push(where(fieldDict.uidField, '==', reportState.uid));
  }
  if (reportState.organizationId && fieldDict.organizationIdField) {
    filters.push(
      where(fieldDict.organizationIdField, '==', reportState.organizationId)
    );
  }
  if (reportState.occupation && fieldDict.occupationField) {
    filters.push(
      where(fieldDict.occupationField, '==', reportState.occupation)
    );
  }
  const dbRef = collection(db, fieldDict.collection);
  return query(dbRef, ...filters);
};

const getData = async (
  reportState: ReportState,
  queryName: {
    queryName: typeOfQuery;
    filtersInput?:
      | readonly [QueryFieldFilterConstraint]
      | QueryFieldFilterConstraint[];
    fieldName?: string;
  },
  db: Firestore,
  isAverage = false
): Promise<number> => {
  const fromDateTrue =
    typeof reportState.dateRange.from == 'string'
      ? new Date(reportState.dateRange.from)
      : new Date(reportState.dateRange.from.getTime());
  const toDateTrue =
    typeof reportState.dateRange.to == 'string'
      ? new Date(reportState.dateRange.to)
      : new Date(reportState.dateRange.to.getTime());
  toDateTrue.setHours(23, 59, 59, 999);
  const queryNow = getQuery(reportState, queryName, db);
  if (queryName.queryName == 'amount') {
    const docSnap = await getDocs(queryNow);
    if (
      fromDateTrue.getMonth() == toDateTrue.getMonth() &&
      docSnap.docs.length == 1
    ) {
      const amount = docSnap.docs[0].data().amount
        ? docSnap.docs[0].data().amount
        : 0;
      const rate = proratedRate(fromDateTrue, fromDateTrue, toDateTrue);
      return amount * rate;
    } else {
      let amountSum = 0;
      docSnap.docs.forEach((doc, index) => {
        let amount = 0;
        if (doc.data().amount) {
          if (index == 0) {
            const rate = proratedRate(
              fromDateTrue,
              fromDateTrue,
              new Date(
                fromDateTrue.getFullYear(),
                fromDateTrue.getMonth() + 1,
                0
              )
            );
            amount = doc.data().amount * rate;
          } else if (index == docSnap.docs.length - 1) {
            const rate = proratedRate(
              toDateTrue,
              new Date(toDateTrue.getFullYear(), toDateTrue.getMonth(), 1),
              toDateTrue
            );
            amount = doc.data().amount * rate;
          } else {
            amount = doc.data().amount;
          }
        }
        amountSum += amount;
      });
      return round(amountSum, 1);
    }
  }
  if (isAverage) {
    return (
      (await getCountFromServer(queryNow)).data().count /
      (await userStore.getNumberOfUsers(reportState.organizationId))
    );
  } else {
    return (await getCountFromServer(queryNow)).data().count;
  }
};

const queryPatternToData = async (stateAndOthers: reportStateAndOthers) => {
  const db = getFirestore();
  const countedData = await Promise.all(
    stateAndOthers.queryNames.map(async (queryName) => {
      return getData(
        stateAndOthers.reportState,
        queryName,
        db,
        stateAndOthers.isAverage
      );
    })
  );
  return countedData;
};

const getMonthDateList = (date: string) => {
  const dateNum = new Date(date);
  const firstDate = new Date(dateNum.getFullYear(), dateNum.getMonth(), 1);
  const lastDate = new Date(dateNum.getFullYear(), dateNum.getMonth() + 1, 0);
  const dateList: string[] = [];
  for (let i = 0; i < lastDate.getDate(); i++) {
    const date = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate() + i
    );
    const dateStr = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;
    dateList.push(dateStr);
  }
  return dateList;
};

const agesListOfApplicants = async (
  state: ReportState
): Promise<number[] | undefined> => {
  const db = getFirestore();
  const querys = getQuery(state, { queryName: 'applicants' }, db);
  const docSnap = await getDocs(querys);
  const applicants = docSnap.docs.map((doc) => {
    if (!doc.data().dob) return undefined;
    const dob = doc.data().dob;
    const now = new Date();
    const age = Math.floor(
      (now.getTime() - dob.seconds * 1000) / miliSecondsPerYear
    );
    return age;
  });
  if (applicants.length === 0) return undefined;
  //remove undefined in applicants
  const filteredApplicants = applicants.filter(
    (applicant): applicant is number => typeof applicant == 'number'
  );
  return filteredApplicants;
};

export const useGetReport = defineStore('getReport', () => {
  const getDailyReport = async (state: dailyBasedReportState) => {
    const rows: { [key: string]: string | number }[] = [];
    const dateList = getMonthDateList(state.dateInMonth);

    for (const date of dateList) {
      const dateRange = {
        from: new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate(),
          0,
          0,
          0
        ),
        to: new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate(),
          23,
          59,
          59,
          999
        ),
      };
      let data: number[] = [];
      data = await queryPatternToData({
        reportState: {
          dateRange: dateRange,
          dateType: state.graphType,
          branch: state.branch,
        },
        isAverage: false,
        queryNames: state.queryNames,
      });
      const row: { [key: string]: number | string } = {
        name: dateRange.from.toLocaleDateString('JP'),
      };
      for (let i = 0; i < state.queryNames.length; i++) {
        const fieldName = state.queryNames[i].fieldName;
        if (fieldName) row[fieldName] = data[i];
        else row[fieldDicts[state.queryNames[i].queryName].name] = data[i];
      }
      if (state.rateNames) {
        for (const rate of state.rateNames) {
          const num = row[rate[0]];
          const deno = row[rate[1]];
          if (typeof num === 'number' && typeof deno === 'number') {
            let per = 0;
            if (num !== 0) {
              per = (deno / num) * 100;
            }
            const perStr = per.toFixed(1) + '%';
            if ('rateName' in fieldDicts[rate[2]]) {
              const rateName = fieldDicts[rate[2]]['rateName'];
              if (rateName) row[rateName] = perStr;
            }
          }
        }
      }
      rows.push(row);
    }
    return rows;
  };

  const getReport = async (
    state:
      | mediaBasedReportState
      | basedReportState
      | userBasedReportState
      | branchBasedReportState
  ) => {
    const rows: { [key: string]: string | number }[] = [];
    let rowItems: (User | Branch | Media | { id: 'all'; name: 'all' })[] = [];
    if ('branches' in state) {
      rowItems = state.branches;
    } else if ('users' in state) {
      rowItems = state.users;
    } else if ('medias' in state) {
      rowItems = state.medias;
    } else rowItems = [{ id: 'all', name: 'all' }];
    for (const rowItem of rowItems) {
      let data: number[] = [];

      if ('branches' in state) {
        data = await queryPatternToData({
          reportState: {
            dateRange: state.dateRange,
            dateType: state.graphType,
            media: state.media,
            branch: rowItem.id,
            occupation: state.occupation,
          },
          isAverage: state.isAverage,
          queryNames: state.queryNames,
        });
      } else if ('users' in state) {
        data = await queryPatternToData({
          reportState: {
            dateRange: state.dateRange,
            dateType: state.graphType,
            uid: rowItem.id,
            occupation: state.occupation,
          },
          isAverage: state.isAverage,
          queryNames: state.queryNames,
        });
      } else if ('medias' in state) {
        data = await queryPatternToData({
          reportState: {
            dateRange: state.dateRange,
            dateType: state.graphType,
            media: rowItem.id,
            branch: state.branch,
            occupation: state.occupation,
          },
          isAverage: state.isAverage,
          queryNames: state.queryNames,
        });
      } else {
        data = await queryPatternToData({
          reportState: {
            dateRange: state.dateRange,
            dateType: state.graphType,
            organizationId: state.organizationId,
            occupation: state.occupation,
          },
          isAverage: state.isAverage,
          queryNames: state.queryNames,
        });
      }
      const row: { [key: string]: number | string } = { name: rowItem.name };
      for (let i = 0; i < state.queryNames.length; i++) {
        const fieldName = state.queryNames[i].fieldName;
        if (fieldName) row[fieldName] = data[i];
        else row[fieldDicts[state.queryNames[i].queryName].name] = data[i];
      }

      if (state.rateNames) {
        for (const rate of state.rateNames) {
          const num = row[rate[0]];
          const deno = row[rate[1]];
          if (typeof num === 'number' && typeof deno === 'number') {
            let per = 0;
            if (num !== 0) per = (deno / num) * 100;
            const perStr = per.toFixed(1) + '%';
            const rateName = fieldDicts[rate[1]].rateName;
            if (rate.length == 3) {
              row[rate[2]] = perStr;
            } else if (rateName) row[rateName] = perStr;
          }
        }
      }
      rows.push(row);
    }
    return rows;
  };

  const getAgeReport = async (getAgeReportInput: GetAgeReportInput) => {
    let ageData = {
      '10s': 0,
      '20s': 0,
      '30s': 0,
      '40s': 0,
      '50s': 0,
      '60sOver': 0,
    };
    const listofages = await agesListOfApplicants({
      dateRange: getAgeReportInput.dateRange,
      dateType: 'BasedOnLeftMostItemDate',
      media: getAgeReportInput.media,
      branch: getAgeReportInput.branch,
      organizationId: getAgeReportInput.organizationId,
    });
    if (listofages) {
      ageData = {
        '10s': listofages.filter((age) => age >= 10 && age < 20).length,
        '20s': listofages.filter((age) => age >= 20 && age < 30).length,
        '30s': listofages.filter((age) => age >= 30 && age < 40).length,
        '40s': listofages.filter((age) => age >= 40 && age < 50).length,
        '50s': listofages.filter((age) => age >= 50 && age < 60).length,
        '60sOver': listofages.filter((age) => age >= 60).length,
      };
    }
    return ageData;
  };

  const calcLeadtime = async (
    dateRange: { from: string; to: string },
    organizationId?: string
  ) => {
    const db = getFirestore();

    const dataAverageList: number[] = Array(5).fill(0);
    const querys = getQuery(
      {
        dateRange: dateRange,
        dateType: 'BasedOnLeftMostItemDate',
        organizationId: organizationId,
      },
      { queryName: 'fix' },
      db
    );
    const snapshot = await getDocs(querys);
    let InspectionFixCounter = 0;
    let OfferInspectionCounter = 0;
    let AdmissionOfferCounter = 0;
    let ApplicantFixCounter = 0;
    await Promise.all(
      snapshot.docs.map(async (doc_) => {
        const data = doc_.data();
        const offerDate = data.offerDate;
        const dataDate = data.fixDate;
        const inspectiondate = data.inspectionDate;
        const admissiondate = data.admissionDate;
        const applicantData = (
          await getDoc(doc(db, 'applicants', data.applicant_id))
        ).data();

        if (applicantData && applicantData.invitationDate) {
          dataAverageList[0] +=
            ((applicantData.invitationDate - applicantData.applicationDate) /
              secondperday) *
            milsecondPersecond;
          dataAverageList[1] +=
            ((dataDate - applicantData.invitationDate) / secondperday) *
            milsecondPersecond;
          ApplicantFixCounter += 1;
        }

        if (inspectiondate) {
          dataAverageList[2] +=
            ((inspectiondate - dataDate) / secondperday) * milsecondPersecond;
          InspectionFixCounter += 1;
        }
        if (offerDate) {
          dataAverageList[3] +=
            ((offerDate - inspectiondate) / secondperday) * milsecondPersecond;
          OfferInspectionCounter += 1;
        }
        if (admissiondate) {
          dataAverageList[4] +=
            ((admissiondate - offerDate) / secondperday) * milsecondPersecond;
          AdmissionOfferCounter += 1;
        }
      })
    );

    dataAverageList[0] /= ApplicantFixCounter;
    dataAverageList[1] /= ApplicantFixCounter;
    dataAverageList[2] /= InspectionFixCounter;
    dataAverageList[3] /= OfferInspectionCounter;
    dataAverageList[4] /= AdmissionOfferCounter;
    return dataAverageList;
  };

  return { getReport, getDailyReport, getAgeReport, calcLeadtime };
});
