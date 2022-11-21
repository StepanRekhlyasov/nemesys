import { Timestamp } from 'firebase/firestore';

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

export const today = ():string => {
  return new Date().toISOString().slice(0, 10);
};

export const lastMonth = ():string => {
  const date = new Date();
  date.setMonth(date.getMonth()-1);
  return date.toISOString().slice(0, 10);
};



