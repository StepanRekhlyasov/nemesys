import { defineStore } from 'pinia';
import { ApplicantFix, ApplicantStatus } from 'src/shared/model';
import { ConstraintsType, toDateFormat, toMonthYear } from 'src/shared/utils/utils';
import { addDoc, collection, deleteField, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { useApplicant } from './applicant';
import { Alert } from 'src/shared/utils/Alert.utils';
import { applicantNGStatusField, applicantStatusCharge, applicantStatusDates, applicantStatusOkFields } from 'src/shared/constants/Applicant.const';
import { useRoute } from 'vue-router';

export interface FixOption {
  operationFilter?: boolean;
}

export const useFix = defineStore('fix', () => {
  const db = getFirestore();
  const { t } = useI18n({ useScope: 'global' });
  const applicantStore = useApplicant()

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
      Alert.warning(t('errors.BO_occupied'))
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

  async function formatDataFix(fix_id: string, data: Partial<ApplicantFix>){
    
    const fixDoc = await getDoc(doc(db, 'fix/' + fix_id))
    const currentFix = {...fixDoc.data(), id: fixDoc.id} as ApplicantFix
    if(!currentFix){
      return {}
    }
    if(data.backOrder){
      if(await preventFixFromSaving(currentFix.applicant_id, data.backOrder, fix_id)){
        return {}
      }
    }
    let newStatus : ApplicantStatus | undefined = undefined
    data = {...currentFix, ...data}
    for (const [key, value] of Object.entries(applicantStatusOkFields)){
      if(data[key] === true){
        newStatus = value
      } else if (data[key] === false){
        const NGField = applicantNGStatusField[applicantStatusOkFields[key]]
        newStatus = data[NGField]
        break;
      }
    }
    const applicant = await applicantStore.getApplicantsByConstraints([where('id', '==', data.applicant_id)])
    if(newStatus){
      data.currentStatusTimestamp = data[applicantStatusDates[newStatus]]
      data.currentStatusMonth = toMonthYear(data[applicantStatusDates[newStatus]])
      data.userInCharge = data[applicantStatusCharge[newStatus]]
      if(applicant[0]){
        data.prefecture = applicant[0].prefecture
        data.branchIncharge = applicant[0].branchIncharge
        data.organizationId = applicant[0].organizationId
      }
      data.status = newStatus
    }
    if(data.status && currentFix.status && currentFix.status !== data.status && route.meta.applicantsUpdateOnOrganizationChange){
      applicantStore.state.applicantsByColumn[currentFix.status] = applicantStore.state.applicantsByColumn[currentFix.status].filter((item : ApplicantFix)=>item.id!==data.id)
    }
    return data
  }
  const route = useRoute()
  async function updateFix (fix_id: string, data: Partial<ApplicantFix>) {
    data = await formatDataFix(fix_id, data)
    for (const [key, value] of Object.entries(data)){
      if(typeof value === 'undefined'){
        data[key] = deleteField()
      }
    }
    if(!Object.keys(data).length){
      return;
    }
    await updateDoc(
      doc(db, '/fix/'+ fix_id ),
      data
    );
    if(data.status && route.meta.applicantsUpdateOnOrganizationChange && [ApplicantStatus.WAIT_VISIT, ApplicantStatus.WAIT_OFFER, ApplicantStatus.WAIT_ENTRY, ApplicantStatus.WAIT_TERMINATION].includes(data.status)){
      await applicantStore.getApplicantsByStatus(data.status, applicantStore.state.applicantProgressFilter)
    }
  }
  
  return { useFix, getFixData, getFixList, saveFix, updateFix, getFixByApplicantIDs, formatDataFix }
})
