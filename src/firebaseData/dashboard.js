import { doc, collection, addDoc, query, where, getFirestore, serverTimestamp, getDoc, getDocs, updateDoc, onSnapshot   } from "firebase/firestore";

const db = getFirestore();

export default {
  getColumns() {
    return getDocs(query(collection(db, "kabanGroup"), where("deleted", "==", false)));
  },
  getApplicant(applicantId) {
    return getDoc(query(doc(db, "applicant", applicantId)));
  },
  createCard(card) {
    card["created_at"] = serverTimestamp();
    card["updated_at"] = serverTimestamp();
    card["deleted"] = false;
    return addDoc(collection(db, "applicant"), card);
  },
  updateApplicant(data) {
    let id = data.id;
    delete data.id;
    delete data.created_at;
    data["updated_at"] = serverTimestamp();
    return updateDoc(doc(db, "applicant", id), data)
  },
  //group
  getColumnData(groupId) {
    return getDocs(query(collection(db, "applicant"), where("groupId", "==", groupId), where("deleted", "==", false)));
  },
  getGroup(id) {
    return getDoc(query(doc(db, "kabanGroup", id)));
  },
  createGroup(data) {
    data["created_at"] = serverTimestamp();
    data["updated_at"] = serverTimestamp();
    data["deleted"] = false;
    return addDoc(collection(db, "kabanGroup"), data);
  },
  updateGroup(data) {
    let id = data.id;
    delete data.id;
    delete data.created_at;
    data["updated_at"] = serverTimestamp();
    return updateDoc(doc(db, "kabanGroup", id), data)
  },
}
