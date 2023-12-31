import { collection, Firestore, getDocs, query, orderBy } from 'firebase/firestore';

export const getMaintainEnabledEvent = async (db: Firestore) => {
  const docs = await getDocs(query(collection(db, 'maintainModeEvent'), orderBy('date', 'desc')));
  return docs.docs[0].data().typeOperation === 'resume'
}


export const parseDateSecondsToHours = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor(seconds % 3600 / 60)
  const sec = seconds % 3600 % 60
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${sec < 10 ? '0' + sec : sec}`
}
