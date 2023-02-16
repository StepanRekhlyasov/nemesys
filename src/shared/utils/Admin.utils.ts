import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';

export const getMaintainEnabledEvent = (db: Firestore) => {
  return getDocs(query(
    collection(db, 'maintainModeEvent'),
    where('endDate', '==', null)
  ))
}
