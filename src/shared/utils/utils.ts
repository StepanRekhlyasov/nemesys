import { collection, endAt, Firestore, getDocs, orderBy, query, QueryEndAtConstraint, QueryFieldFilterConstraint, QueryOrderByConstraint, QueryStartAtConstraint, startAt, Timestamp, where, } from 'firebase/firestore';
import { date, is } from 'quasar';
import { toRaw } from 'vue';

export interface dataObject{
  date: string,
  time: string
}

export type ConstraintsType = Array<QueryStartAtConstraint | QueryFieldFilterConstraint | QueryEndAtConstraint | QueryOrderByConstraint>

export const pick = (obj: object, keys: string[]) => keys.reduce((acc, n) => (obj.hasOwnProperty(n) && (acc[n] = obj[n]), acc), {});

export const sortDate = (a: dataObject, b: dataObject) => {
  const aDate = date.extractDate(a.date + '--' + a.time, 'YYYY/MM/DD--H:mm:ss')
  const bDate = date.extractDate(b.date + '--' + b.time, 'YYYY/MM/DD--H:mm:ss')
  return aDate.getTime() - bDate.getTime()
}

export function sortOrganization (a: string, b: string){
  const firstOrganizationName = a.split(' ')[1]
  const secondOrganizationName = b.split(' ')[1]
  return firstOrganizationName.localeCompare(secondOrganizationName)
}

export function serializeTimestamp(obj: object) {
  for (const key in obj) {
    const val = obj[key]
    if (val.hasOwnProperty?.('seconds') && val.hasOwnProperty?.('nanoseconds')) {
      obj[key] =  new Timestamp(val.seconds, val.nanoseconds)
    }
  }
}

export function cloneToRaw<T>(obj: T) {
  return JSON.parse(JSON.stringify(toRaw(obj)))
}

export function deepEqualClone<T>(obj1: T, obj2: unknown) {
  return is.deepEqual(cloneToRaw(obj1), cloneToRaw(obj2))
}

export const toDateFormat = (time?: Timestamp):string => {
	if (!time) {
		return ''
	}
	const dateFormat = new Date(time['seconds']*1000);
	return date.formatDate(dateFormat, 'YYYY/MM/DD')
}

export const toMonthYear = (time?: Timestamp) => {
  if(!time){
    time = Timestamp.now();
  }
  const year = time.toDate().getFullYear();
  const month = time.toDate().getMonth()+1;
  return year+'-'+(month>=10?month:'0'+month);
}

export const toDate = (timestamp: Timestamp):string => {
  let data = '';
  if (timestamp) {
    try{
      data = timestamp.toDate().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      data += ' ' + timestamp.toDate().toLocaleTimeString('ja-JP');
    } catch(e) {
      console.log(e)
      return data;
    }
  }
  return data;
};
export const limitDate = (date : string) => {
  return date <= new Date().toLocaleDateString('ja-JP')
}

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

export const findTheLastDate = (dates: Date[]) => {
  // @ts-expect-error https://quasar.dev/quasar-utils/date-utils#minimum-maximum
  const maxDate =  date.getMaxDate(...dates)
  return date.formatDate(maxDate, 'YYYY-MM-DD HH:mm:ss')

}

export const myDateFormat = (myDate?: string | undefined | Timestamp, format?: string) => {
  if (!myDate) return '-';
  if(typeof myDate === 'string'){
    const timeStamp = Date.parse(myDate)
    return date.formatDate(timeStamp, format?format:'YYYY.MM.DD')
  } else if (myDate instanceof Timestamp){
    return date.formatDate(myDate.toDate(), format?format:'YYYY.MM.DD');
  } else {
    return '-';
  }
}

export const dateToTimestampFormat = (myDate : Date) => {
  const result = Timestamp.fromDate?.(myDate)
  if(isNaN(result.seconds)){
    return undefined
  }
  return Timestamp.fromDate?.(myDate);
}

// collection

export const templateCollection = (db: Firestore, organization_id: string) => collection(db, 'organization/'+organization_id+'/template');

export const branchCollection = (db: Firestore, organization_id: string) => collection(db, 'organization/'+organization_id+'/branch')

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

export const remainingDays = (date1 : Date, date2 : Date) => {
  const millisecondsInDay = 1000 * 3600 * 24
  return Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / millisecondsInDay) 
}

export const getFromTo = (dateRange: string | { from: string; to: string; } | null) => {
  let to: Timestamp | undefined, from: Timestamp | undefined

  if (dateRange) {
      if (typeof dateRange === 'string') {
          const fromDate = new Date(dateRange)
          const toDate = new Date(new Date(dateRange).setHours(23, 59, 59, 999))
          from = dateToTimestampFormat(fromDate)
          to = dateToTimestampFormat(toDate)
      } else if (dateRange.from && dateRange.to) {
          const fromDate = new Date(dateRange.from)
          const toDate = new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
          from = dateToTimestampFormat(fromDate)
          to = dateToTimestampFormat(toDate)
      }
  }
  return [from, to]
}
// rules intut textfield

// export const fieldIsMore = (val, limit: number) => val <= limit || `Please use maximum ${limit} characters`
