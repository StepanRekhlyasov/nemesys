import { collection, Firestore, getDocs, Timestamp } from 'firebase/firestore';

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

// DB request

export const getTemplates = (db: Firestore) => {
  return getDocs(collection(db, 'templates'))
}

