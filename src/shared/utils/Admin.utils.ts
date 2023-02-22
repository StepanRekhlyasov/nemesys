import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';

export const getMaintainEnabledEvent = (db: Firestore) => {
  return getDocs(query(
    collection(db, 'maintainModeEvent'),
    where('endDate', '==', null)
  ))
}

export const getAllMaintainEvents = (db: Firestore) => {
  return getDocs(query(
    collection(db, 'maintainModeEvent')
  ))
}

export const parseDateSecondsToHours = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds % 3600 / 60)
  const sec = seconds % 3600 % 60
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${sec < 10 ? '0' + sec : sec}`
}
