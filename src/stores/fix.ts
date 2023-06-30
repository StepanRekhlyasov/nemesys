import { defineStore } from 'pinia';
import { ApplicantFix } from 'src/shared/model';
import { ConstraintsType, toDateFormat } from 'src/shared/utils/utils';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
// import { ref } from 'vue'
import { useApplicant } from './applicant';

export interface FixOption {
  operationFilter?: boolean;
}
// export interface FixState {
//   selectedApplicantFixes: ApplicantFix[];
// }

export const useFix = defineStore('fix', () => {
  const db = getFirestore();  
  const $q = useQuasar();
  const { t } = useI18n({ useScope: 'global' });
  const applicantStore = useApplicant()
  // const state = ref<FixState>({
  //   selectedApplicantFixes: []
  // })

  async function getFixData(applicant_id: string, operationFilter?: boolean): Promise<ApplicantFix[]> {
    // state.value.selectedApplicantFixes = []
    
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
    applicantStore.state.applicantFixes[applicant_id] = list
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
    const result = docSnap.docs.map(item => {
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
    if(Array.isArray(ids)){
      ids.forEach((id)=>{
        applicantStore.state.applicantFixes[id] = result.filter((row)=>{
          return row.applicant_id === id
        })
      })
    } else {
      applicantStore.state.applicantFixes[ids] = result
    }
    return result
  }

  /** when BO quotas will be added use this function to check quotas */
  async function preventFixFromSaving(applicant_id: string, backOrder_id: string, fix_id?: string){
    const checkFix = await getDocs(query(
      collection(db, '/fix'), 
      where('applicant_id', '==', applicant_id),
      where('deleted', '==', false),
      where('backOrder', '==', backOrder_id)
    ))
    const isOccupied = !!checkFix.docs.find((row)=>{
      if(fix_id){
        return row.id !== fix_id
      } else {
        return row
      }
    })
    if(isOccupied){
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: t('errors.BO_occupied'),
      });
    }
    return isOccupied
  }

  async function saveFix (applicant_id: string, data: Partial<ApplicantFix>) {
    if(data.backOrder){
      if(await preventFixFromSaving(applicant_id, data.backOrder)){
        return;
      }
    }
    await addDoc(
      collection(db, '/fix'),
      {
        ...data,
        applicant_id: applicant_id
      }
    )
  }

  async function updateFix (fix_id: string, data: Partial<ApplicantFix>) {
    if(data.backOrder){
      const currentFix = (await getDoc(doc(db, 'fix/' + fix_id))).data()
      if(currentFix && await preventFixFromSaving(currentFix.applicant_id, data.backOrder, fix_id)){
        return;
      }
    }
    for (const [key, value] of Object.entries(data)){
      if(typeof value === 'undefined'){
        delete data[key]
      }
    }
    await updateDoc(
      doc(db, '/fix/'+ fix_id ),
      data
    );
  }
  return { useFix, getFixData, getFixList, saveFix, updateFix, getFixByApplicantIDs }
})