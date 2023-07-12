import { collection, doc, Firestore,  getDocs, getFirestore, orderBy, query, where, writeBatch } from 'firebase/firestore';
import { ConstraintsType } from './utils';
import { Applicant } from '../model';
import { Alert } from './Alert.utils';
import { ref } from 'vue'
import { requiredFields } from '../constants/Applicant.const';

const db = getFirestore();

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export const getClientList = (db: Firestore, options?: {
  active_organization_id?: string;
}) => {

  const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('name')]
  if (options && options.active_organization_id) {
    constraints.push(where('organization', '==', options.active_organization_id))
  }
  return getDocs(query(
    collection(db, 'clients'),
    ...constraints
  ))
}

export const getClientFactoriesList = (db: Firestore, client_id: string) => {
  return getDocs(query(
    collection(db, 'clients/'+client_id+'/office'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export async function validateAllApplicants() {
  const applicantRef = collection(db, 'applicants')
  const applicantQuery = query(applicantRef)
  const docSnap = await getDocs(applicantQuery)
  if (!docSnap.empty) {
    const documents = docSnap.docs.map(item => {
      const id = item.id
      return { id, ...item.data() }
    })
    return validateApplicants(documents as Applicant[])
  }
  return false
}

/** this function checks and creates reqiured fields if they would not exist for some reason */
export async function validateApplicants(applicants: Applicant[]) {
  const fire = ref(false)
  const batch = writeBatch(db);
  const forUpdate: Record<string, string | number>[] = []
  applicants.map((applicant) => {
    const needsUpdate: { [key: string]: string | number; } = {}
    for (const [key, value] of Object.entries(requiredFields.value)) {
      if (typeof applicant[key] === 'undefined') {
        needsUpdate[key] = value
      }
    }
    if (Object.keys(needsUpdate).length > 0) {
      forUpdate[applicant.id] = needsUpdate
    }
  })
  for (const [key, value] of Object.entries(forUpdate)) {
    fire.value = true
    const docRef = doc(db, 'applicants/' + key);
    batch.update(docRef, { ...value })
  }
  if (fire.value) {
    try {
      await batch.commit()
    } catch (e) {
      Alert.warning(e)
    }
  }
  return fire.value
}