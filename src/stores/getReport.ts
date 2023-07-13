import {
  collection,
  query,
  where,
  getFirestore,
  getCountFromServer,
  QueryFieldFilterConstraint,
  Firestore,
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
} from 'src/shared/model/GetReport';
const userStore = useUserStore();

const applicantFieldDict: FieldDict = {
  name: 'applicants',
  dateBasedOnEachItemDate: 'applicationDate',
  dateBasedOnLeftMostItemDate: 'applicationDate',
  filters: [],
  collection: 'applicants',
  branchField: 'branchInCharge',
  mediaField: 'media',
};

const fixFieldDict: FieldDict = {
  name: 'fix',
  rateName: 'fixRate',
  dateBasedOnEachItemDate: 'data',
  dateBasedOnLeftMostItemDate: 'data',
  filters: [where('fixStatus', '==', true)],
  collection: 'fix',
  branchField: 'branchInCharge',
  uidField: 'chargeOfFix',
  mediaField: 'media',
};

const BOFieldDict: FieldDict = {
  name: 'BO',
  dateBasedOnEachItemDate: 'created_at',
  dateBasedOnLeftMostItemDate: 'created_at',
  filters: [],
  collection: 'BO',
  uidField: 'id_registerUser',
  mediaField: 'media',
};

const validApplicantsFieldDict: FieldDict = {
  name: 'validApplicants',
  rateName: 'validApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
};

const contatApplicantsFieldDict: FieldDict = {
  name: 'contactApplicants',
  rateName: 'contactApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('contactStatus', '==', true)],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
};

const attractionApplicantsFieldDict: FieldDict = {
  name: 'attractionApplicants',
  rateName: 'attractionApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('attractionStatus', '==', true)],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
};

const attendApplicantsFieldDict: FieldDict = {
  name: 'attendApplicants',
  rateName: 'attendApplicantsRate',
  dateBasedOnEachItemDate: applicantFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: applicantFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('attendStatus', '==', true)],
  collection: applicantFieldDict.collection,
  branchField: applicantFieldDict.branchField,
  mediaField: applicantFieldDict.mediaField,
};

const inspectionFieldDict: FieldDict = {
  name: 'inspection',
  rateName: 'inspectionApplicantsRate',
  dateBasedOnEachItemDate: fixFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('inspectionStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
};

const offerFieldDict: FieldDict = {
  name: 'offer',
  rateName: 'offerApplicantsRate',
  dateBasedOnEachItemDate: fixFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('offerStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
};

const admissionFieldDict: FieldDict = {
  name: 'admission',
  rateName: 'admissionApplicantsRate',
  dateBasedOnEachItemDate: fixFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: fixFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('admissionStatus', '==', true)],
  collection: fixFieldDict.collection,
  branchField: fixFieldDict.branchField,
  mediaField: fixFieldDict.mediaField,
};

const BOIsfirstFieldDict: FieldDict = {
  name: 'BOIsfirst',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('is_first', '==', true)],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const BOIsNotfirstFieldDict: FieldDict = {
  name: 'BOIsnotfirst',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('is_first', '==', false)],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const generalDispatchFieldDict: FieldDict = {
  name: 'generalDispatch',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'generalDispatch')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const introductionFieldDict: FieldDict = {
  name: 'introduction',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'introduction')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const TTPFieldDict: FieldDict = {
  name: 'TTP',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('transactionType', '==', 'TTP')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const nurseFieldDict: FieldDict = {
  name: 'nurse',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('typeCase', '==', 'nurse')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
};

const nurseCareFieldDict: FieldDict = {
  name: 'nursingCare',
  dateBasedOnEachItemDate: BOFieldDict.dateBasedOnEachItemDate,
  dateBasedOnLeftMostItemDate: BOFieldDict.dateBasedOnLeftMostItemDate,
  filters: [where('typeCase', '==', 'nursingCare')],
  collection: BOFieldDict.collection,
  uidField: BOFieldDict.uidField,
  mediaField: BOFieldDict.mediaField,
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
};

const getQuery = (
  reportState: ReportState,
  queryName: typeOfQuery,
  db: Firestore
) => {
  const fieldDict = fieldDicts[queryName];
  const fromDate = new Date(reportState.dateRange.from);
  const toDate = new Date(reportState.dateRange.to);
  const filters: QueryFieldFilterConstraint[] = [...fieldDict.filters];
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
  if (reportState.organizationId) {
    filters.push(where('organization_id', '==', reportState.organizationId));
  }
  const dbRef = collection(db, fieldDict.collection);
  return query(dbRef, ...filters);
};

const queryPatternToData = async (stateAndOthers: reportStateAndOthers) => {
  const db = getFirestore();

  const queryList = stateAndOthers.queryNames.map((queryName) =>
    getQuery(stateAndOthers.reportState, queryName, db)
  );
  const countedData = await Promise.all(
    queryList.map(async (query) => {
      if (stateAndOthers.isAverage) {
        return (
          (await getCountFromServer(query)).data().count /
          (await userStore.getNumberOfUsers(
            stateAndOthers.reportState.organizationId
          ))
        );
      } else {
        return (await getCountFromServer(query)).data().count;
      }
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

export const useGetReport = defineStore('getReport', () => {
  const getDailyReport = async (state: dailyBasedReportState) => {
    const rows: { [key: string]: string | number }[] = [];
    const dateList = getMonthDateList(state.dateInMonth);

    for (const date of dateList) {
      const dateRange = {
        from: date,
        to: new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate() + 1
        ).toLocaleDateString(),
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
      const dataCVR = data.map((num, idx) => {
        if (idx == 0) return '100.0%';
        if (data[idx - 1] == 0) return '0.0%';
        const per = (data[idx] / data[idx - 1]) * 100;
        const perStr = per.toFixed(1);
        return perStr + '%';
      });
      const row: { [key: string]: number | string } = { name: dateRange.from };
      for (let i = 0; i < state.queryNames.length; i++) {
        row[fieldDicts[state.queryNames[i]].name] = data[i];
      }
      for (let i = 0; i < state.queryNames.length; i++) {
        const rateName = fieldDicts[state.queryNames[i]].rateName;
        if (rateName) {
          row[rateName] = dataCVR[i];
        }
      }
      rows.push(row);
    }
    return rows;
  };

  const getReport = async (
    state: mediaBasedReportState | basedReportState | userBasedReportState
  ) => {
    const rows: { [key: string]: string | number }[] = [];
    let rowItems: (User | Branch | { id: 'all'; name: 'all' })[] = [];
    if ('branches' in state) {
      rowItems = state.branches;
    } else if ('users' in state) {
      rowItems = state.users;
    } else rowItems = [{ id: 'all', name: 'all' }];

    for (const rowItem of rowItems) {
      let data: number[] = [];

      if ('branches' in state) {
        data = await queryPatternToData({
          reportState: {
            dateRange: state.dateRange,
            dateType: state.graphType,
            media: state.media,
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
          },
          isAverage: state.isAverage,
          queryNames: state.queryNames,
        });
      }

      const dataCVR = data.map((num, idx) => {
        if (idx == 0) return '100.0%';
        if (data[idx - 1] == 0) return '0.0%';
        const per = (data[idx] / data[idx - 1]) * 100;
        const perStr = per.toFixed(1);
        return perStr + '%';
      });
      const row: { [key: string]: number | string } = { name: rowItem.name };
      for (let i = 0; i < state.queryNames.length; i++) {
        row[fieldDicts[state.queryNames[i]].name] = data[i];
      }
      for (let i = 0; i < state.queryNames.length; i++) {
        const rateName = fieldDicts[state.queryNames[i]].rateName;
        if (rateName) {
          row[rateName] = dataCVR[i];
        }
      }
      rows.push(row);
    }
    return rows;
  };
  return { getReport, getDailyReport };
});