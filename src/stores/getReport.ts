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
import { graphType } from 'src/components/report/Models';
const userStore = useUserStore();
class baseQuery {
  name = '';
  rateName = 'No rate name';
  dateBasedOnEachItemDate: string | undefined;
  dateBasedOnLeftMostItemDate: string | undefined;
  filters: QueryFieldFilterConstraint[] = [];
  collection: string | undefined;
  branchField: string | undefined;
  uidField: string | undefined;
  mediaField: string | undefined;

  getQuery = (
    db: Firestore,
    dateRange: { from: string; to: string },
    dateType:graphType,
    media?,
    branch?,
    uid?,
    organizationId?: string
  ) => {
    // dateRange.from を Date型に変換
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    const filters = [...this.filters];
    if (
      dateType == 'BasedOnLeftMostItemDate' &&
      this.dateBasedOnLeftMostItemDate
    ) {
      filters.push(
        where(this.dateBasedOnLeftMostItemDate, '>=', fromDate)
      );
      filters.push(where(this.dateBasedOnLeftMostItemDate, '<=', toDate));
    } else if (
      dateType == 'BasedOnEachItemDate' &&
      this.dateBasedOnEachItemDate
    ) {
      filters.push(where(this.dateBasedOnEachItemDate, '>=', fromDate));
      filters.push(where(this.dateBasedOnEachItemDate, '<=', toDate));

    }

    if (media && this.mediaField) {
      filters.push(where(this.mediaField, '==', media));
    }

    if (branch && this.branchField) {
      filters.push(where(this.branchField, '==', branch));
    }

    if (uid && this.uidField) {
      filters.push(where(this.uidField, '==', uid));
    }
    if (organizationId) {
      filters.push(where('organization_id', '==', organizationId));
    }

    if (!this.collection) throw new Error('collection is not defined');
    const dbRef = collection(db, this.collection);
    return query(dbRef, ...filters);
  };
}
class applicantQuery extends baseQuery {
  name = 'applicants';
  dateBasedOnEachItemDate = 'applicationDate';
  dateBasedOnLeftMostItemDate = 'applicationDate';
  filters: QueryFieldFilterConstraint[] = [];
  collection = 'applicants';
  branchField = 'branchInCharge';
  mediaField = 'media';
}

class fixQuery extends baseQuery {
  name = 'fix';
  rateName = 'fixRate';
  dateBasedOnEachItemDate = 'data';
  dateBasedOnLeftMostItemDate = 'data';
  filters = [where('fixStatus', '==', true)];
  collection = 'fix';
  branchField = 'branchInCharge';
  uidField = 'chargeOfFix';
  mediaField = 'media';
}

class BOQuery extends baseQuery {
  name = 'BO';
  dateBasedOnEachItemDate = 'created_at';
  dateBasedOnLeftMostItemDate = 'created_at';
  filters: QueryFieldFilterConstraint[] = [];
  collection = 'BO';
  uidField = 'id_registerUser';
  mediaField = 'media';
}

class validApplicantQuery extends applicantQuery {
  name = 'validApplicants';
  rateName = 'validApplicantsRate';
}

class contactApplicantQuery extends applicantQuery {
  name = 'contactApplicants';
  rateName = 'contactApplicantsRate';
  filters = [where('contactStatus', '==', true)];
}

class attractionApplicantQuery extends applicantQuery {
  name = 'attractionApplicants';
  rateName = 'attractionApplicantsRate';
  filters = [where('attractionStatus', '==', true)];
}

class attendApplicantQuery extends applicantQuery {
  name = 'attendApplicants';
  rateName = 'attendApplicantsRate';
  filters = [where('attendStatus', '==', true)];
}

class inspectionQuery extends fixQuery {
  name = 'inspection';
  rateName = 'inspectionRate';
  dateBasedOnEachItemDate = 'inspectionDate';
  filters = [where('inspectionStatus', '==', true)];
  uidField = 'chargeOfInspection';
}

class offerQuery extends fixQuery {
  name = 'offer';
  rateName = 'offerRate';
  dateBasedOnEachItemDate = 'offerDate';
  filters = [where('offerStatus', '==', true)];
  uidField = 'chargeOfOffer';
}

class admissionQuery extends fixQuery {
  name = 'admission';
  rateName = 'admissionRate';
  dateBasedOnEachItemDate = 'admissionDate';
  filters = [where('admissionStatus', '==', true)];
  uidField = 'chargeOfAdmission';
}

class BOIsFirstQuery extends BOQuery {
  name = 'BOIsfirst';
  filters = [where('is_first', '==', true)];
}

class BOIsNotFirstQuery extends BOQuery {
  name = 'BOIsnotfirst';
  filters = [where('is_first', '==', false)];
}

class GeneralDispatchQuery extends BOQuery {
  name = 'generalDispatch';
  filters = [where('transactionType', '==', 'generalDispatch')];
}

class introductionQuery extends BOQuery {
  name = 'introduction';
  filters = [where('transactionType', '==', 'introduction')];
}

class TTPQuery extends BOQuery {
  name = 'TTP';
  filters = [where('transactionType', '==', 'TTP')];
}

class nurseQuery extends BOQuery {
  name = 'nurse';
  filters = [where('typeCase', '==', 'nurse')];
}

class nursingCareQuery extends BOQuery {
  name = 'nursingCare';
  filters = [where('typeCase', '==', 'nursingCare')];
}

const queryDict: { [key in typeOfQuery]: baseQuery } = {
  applicants: new applicantQuery(),
  validApplicants: new validApplicantQuery(),
  contactApplicants: new contactApplicantQuery(),
  attractionApplicants: new attractionApplicantQuery(),
  attendApplicants: new attendApplicantQuery(),
  fix: new fixQuery(),
  inspection: new inspectionQuery(),
  offer: new offerQuery(),
  admission: new admissionQuery(),
  BO: new BOQuery(),
  BOIsfirst: new BOIsFirstQuery(),
  BOIsnotfirst: new BOIsNotFirstQuery(),
  generalDispatch: new GeneralDispatchQuery(),
  introduction: new introductionQuery(),
  TTP: new TTPQuery(),
  nurse: new nurseQuery(),
  nursingCare: new nursingCareQuery(),
};

const queryPatternToData = async (
  queryNames: typeOfQuery[],
  dateRange: { from: string; to: string },
  dateType: string,
  media: string | undefined = undefined,
  branch: string | undefined = undefined,
  uid: string | undefined = undefined,
  organizationId: string | undefined = undefined,
  isAverage = false
) => {
  const db = getFirestore();
  const queryList = queryNames.map((queryName) => {
    return queryDict[queryName].getQuery(
      db,
      dateRange,
      dateType as graphType,
      media,
      branch,
      uid,
      organizationId
    );
  });
  const countedData = await Promise.all(
    queryList.map(async (query) => {
      if (isAverage) {
        return (
          (await getCountFromServer(query)).data().count /
          (await userStore.getNumberOfUsers(organizationId))
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
    )
    const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    dateList.push(
      dateStr
    );
  }
  return dateList;
};

export const useGetReport = defineStore('getReport', () => {
  const getDailyReport = async (
    dateInMonth: string,
    branch: string | undefined = undefined,
    graphType: graphType,
    queryNames: typeOfQuery[],
    isAverage = false
  ) => {
    const rows: { [key: string]: string | number }[] = [];
    const dateList = getMonthDateList(dateInMonth)

    for (const date of dateList) {
      //date は　1900/01/02 のようになっているので それをその日と次の日を示す範囲　dateRange = {from:1900/01/02 , to:1900/01/03}　の形に変換する
      const dateRange = {
        from: date,
        to: new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate() + 1
        ).toLocaleDateString(),
      };
      let data: number[] = [];
      data = await queryPatternToData(
          queryNames,
          dateRange,
          graphType,
          undefined,
          branch,
          undefined,
          undefined,
          isAverage
        );
      const dataCVR = data.map((num, idx) => {
        if (idx == 0) return '100.0%';
        if (data[idx - 1] == 0) return '0.0%';
        const per = (data[idx] / data[idx - 1]) * 100;
        const per_str = per.toFixed(1);
        return per_str + '%';
      });
      const row: { [key: string]: number | string } = { name: dateRange.from };
      for (let i = 0; i < queryNames.length; i++) {
        row[queryDict[queryNames[i]].name] = data[i];
      }
      for (let i = 0; i < queryNames.length; i++) {
        row[queryDict[queryNames[i]].rateName] = dataCVR[i];
      }
      rows.push(row);
    }
    return rows;
  };

  const getReport = async (
    users: User[] | undefined = undefined,
    branches: Branch[] | undefined = undefined,
    dateRange: { from: string; to: string } | undefined,
    graphType: graphType,
    queryNames: typeOfQuery[],
    media: string | undefined = undefined,
    organizationId: string | undefined = undefined,
    isAverage = false
  ) => {
    const rows: { [key: string]: string | number }[] = [];
    if (!dateRange || !dateRange.from || !dateRange.to) return [];
    let rowItems: (User | Branch | { id: 'all'; name: 'all' })[] = [];
    if (users) {
      rowItems = users;
    } else if (branches) {
      rowItems = branches;
    } else {
      rowItems = [{ id: 'all', name: 'all' }];
    }

    for (const rowItem of rowItems) {
      let data: number[] = [];
      if (users) {
        data = await queryPatternToData(
          queryNames,
          dateRange,
          graphType,
          media,
          undefined,
          rowItem.id,
          organizationId,
          isAverage
        );
      } else if (branches) {
        data = await queryPatternToData(
          queryNames,
          dateRange,
          graphType,
          media,
          rowItem.id,
          undefined,
          organizationId,
          isAverage
        );
      } else {
        data = await queryPatternToData(
          queryNames,
          dateRange,
          graphType,
          undefined,
          undefined,
          undefined,
          organizationId,
          isAverage
        );
      }
      const dataCVR = data.map((num, idx) => {
        if (idx == 0) return '100.0%';
        if (data[idx - 1] == 0) return '0.0%';
        const per = (data[idx] / data[idx - 1]) * 100;
        const per_str = per.toFixed(1);
        return per_str + '%';
      });
      const row: { [key: string]: number | string } = { name: rowItem.name };
      for (let i = 0; i < queryNames.length; i++) {
        row[queryDict[queryNames[i]].name] = data[i];
      }
      for (let i = 0; i < queryNames.length; i++) {
        row[queryDict[queryNames[i]].rateName] = dataCVR[i];
      }
      rows.push(row);
    }
    return rows;
  };
  return { getReport ,getDailyReport};
});
