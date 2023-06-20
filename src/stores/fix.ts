import { defineStore } from 'pinia';
import { ApplicantFix } from 'src/shared/model';
import { ConstraintsType, toDateFormat } from 'src/shared/utils/utils';
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';

export interface FixOption {
  operationFilter?: boolean;
}

export const useFix = defineStore('fix', () => {
  const db = getFirestore();  

  async function getFixData(applicant_id: string, operationFilter?: boolean): Promise<ApplicantFix[]> {
    const fixData = await getFixList(applicant_id, {operationFilter})
    const list: ApplicantFix[] = [];
    fixData.forEach(fix => {
        const data = fix.data()
        list.push({
            ...data,
            id: fix.id,
            fixDate: toDateFormat(data['fixDate']),
            offerDate: toDateFormat(data['offerDate']),
            admissionDate: toDateFormat(data['admissionDate']),
            endDate: toDateFormat(data['endDate']),
            inspectionDate: toDateFormat(data['inspectionDate']),
        } as ApplicantFix)
    })

    return list
  }

  async function getFixList(applicant_id: string, option?: FixOption) {
      const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]
    
      if (option && option.operationFilter) {
        constraints.push(where('admissionStatus', '==', 'ok'))
      }
    
      return getDocs(query(
        collection(db, '/fix'), 
        where('applicant_id', '==', applicant_id),
        ...constraints
      ))
  }

  async function getFixByApplicantIDs(ids: string[] | string){
    const constraints = Array.isArray(ids)?[where('applicant_id', 'in', ids)]:[where('applicant_id', '==', ids)]
    const docSnap = await getDocs(query(
      collection(db, '/fix'), 
      where('deleted', '==', false),
      ...constraints
    ))
    const documents = docSnap.docs.map(item => {
      const itemData = item.data()
      return {
        ...itemData,
        id: item.id,
        fixDate: toDateFormat(itemData['fixDate']),
        offerDate: toDateFormat(itemData['offerDate']),
        admissionDate: toDateFormat(itemData['admissionDate']),
        endDate: toDateFormat(itemData['endDate']),
        inspectionDate: toDateFormat(itemData['inspectionDate']),
      } as ApplicantFix
    })
    return documents
  }

  async function saveFix (applicant_id: string, data) {
    await addDoc(
      collection(db, '/fix'),
      {
        ...data,
        applicant_id: applicant_id
      }
    )
  }

  async function updateFix (fix_id: string, data) {
    await updateDoc(
      doc(db, '/fix/'+ fix_id ),
      data
    );
  }
  return { useFix, getFixData, getFixList, saveFix, updateFix, getFixByApplicantIDs }
})