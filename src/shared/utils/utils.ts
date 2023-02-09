import { collection, endAt, Firestore, getDocs, orderBy, query, startAt, Timestamp, where, } from 'firebase/firestore';
import { QVueGlobals } from 'quasar';
import { computed } from 'vue';
import { Organization } from '../model/Organization.model';

export interface dataObject{
  date: string,
  time: string
}

export const toDate = (timestamp: Timestamp):string => {
  let data = '';
  if (timestamp) {
    data = timestamp.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    data += ' ' + timestamp.toDate().toLocaleTimeString('ja-JP');
  }
  return data;
};

export const differentDateYear = (date1: string, date2: string):number => {
  const d1 = new Date(date1), d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24 * 12 * 30)) - 1;
}

export const toDateObject = (timestamp: Timestamp):dataObject => {
  const obj:dataObject = {
    date: '',
    time: ''
  }
  if (timestamp) {
    obj.date = timestamp.toDate().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    obj.time = timestamp.toDate().toLocaleTimeString('ja-JP');
  }
  return obj
}

export const today = ():string => {
  return new Date().toISOString().slice(0, 10);
};

export const lastMonth = ():string => {
  const date = new Date();
  date.setMonth(date.getMonth()-1);
  return date.toISOString().slice(0, 10);
};

export const getOrganizationId = ($q: QVueGlobals) => {
  const organizations: Organization[] | null = $q.localStorage.getItem('organizations');
  const active_organization: number | null = $q.localStorage.getItem('active_organizations');
  if (organizations && (active_organization || active_organization == 0)) {
    return organizations[active_organization].id;
  }
  new Error('An error occurred while receiving the user organization.')
  return ;
}

// collection

export const templateCollection = (db: Firestore, organization_id: string) => collection(db, 'organization/'+organization_id+'/template');

export const branchCollection = (db: Firestore, organization_id: string) => collection(db, 'organization/'+organization_id+'/branch')

export const itemCollection = (db: Firestore, organization_id: string) => collection(db, 'organization/'+organization_id+'/item')

// DB request

export const getTemplates = (db: Firestore, organization_id: string, queryText?: string) => {
  return getDocs(query(
    templateCollection(db, organization_id),
    where('deleted', '==', false),
    orderBy('name'),
    startAt(queryText),
    endAt(queryText+'\uf8ff')
  ))
}


// rules intut textfield

// export const fieldIsMore = (val, limit: number) => val <= limit || `Please use maximum ${limit} characters`
