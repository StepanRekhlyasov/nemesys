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
