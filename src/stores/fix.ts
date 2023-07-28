import { defineStore } from 'pinia';
import { ApplicantFix, ApplicantStatus } from 'src/shared/model';
import { ConstraintsType, myDateFormat, toMonthYear } from 'src/shared/utils/utils';
import { addDoc, collection, deleteField, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { useApplicant } from './applicant';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ApplicantOrFixColumn, applicantNGStatusField, applicantStatusCharge, applicantStatusDates, applicantStatusOkFields } from 'src/shared/constants/Applicant.const';
import { useRoute } from 'vue-router';
import { useOrganization } from './organization';

export interface FixOption {
  operationFilter?: boolean;
}

export const useFix = defineStore('fix', () => {
  const db = getFirestore();
  const { t } = useI18n({ useScope: 'global' });
  const applicantStore = useApplicant()  
  const route = useRoute()
  const organization = useOrganization()

  async function getFixData(applicant_id: string, operationFilter?: boolean): Promise<ApplicantFix[]> {
    
    const fixData = await getFixList(applicant_id, {operationFilter})
    const list: ApplicantFix[] = [];
    fixData.forEach(fix => {
        const data = fix.data()
        list.push({
            ...data,
            id: fix.id,
            fixDate: myDateFormat(data['fixDate'], 'YYYY/MM/DD HH:mm'),
            offerDate: myDateFormat(data['offerDate'], 'YYYY/MM/DD HH:mm'),
            admissionDate: myDateFormat(data['admissionDate'], 'YYYY/MM/DD HH:mm'),
            endDate: myDateFormat(data['endDate'], 'YYYY/MM/DD'),
            inspectionDate: myDateFormat(data['inspectionDate'], 'YYYY/MM/DD HH:mm'),
        } as ApplicantFix)
    })
    applicantStore.state.applicantFixes[applicant_id] = list
    return list
  }

  async function getFixList(applicant_id: string, option?: FixOption) {
    const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]
  
    if (option && option.operationFilter) {
      constraints.push(orderBy('admissionDate'), orderBy('endDate'))
    }
  
    return getDocs(query(
      collection(db, '/fix'), 
      where('applicant_id', '==', applicant_id),
      ...constraints
    ))
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

    const fix = {
      ...data,
      applicant_id: applicant_id,
    }

    if(!fix.organizationId){
      fix.organizationId = organization.currentOrganizationId
    }

    await addDoc(
      collection(db, '/fix'),
      fix
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
    const applicant = data.applicant_id?await applicantStore.getApplicantById(data.applicant_id):null
    if(newStatus){
      data.currentStatusTimestamp = data[applicantStatusDates[newStatus]]
      data.currentStatusMonth = toMonthYear(data[applicantStatusDates[newStatus]])
      data.userInCharge = data[applicantStatusCharge[newStatus]]
      if(applicant){
        data.prefecture = applicant.prefecture
        data.branchIncharge = applicant.branchIncharge
        data.organizationId = applicant.organizationId
      }
      data.status = newStatus
    }
    if(data.status && currentFix.status && currentFix.status !== data.status && route.meta.applicantsUpdateOnOrganizationChange && applicantStore.state.applicantsByColumn[currentFix.status]){
      applicantStore.state.applicantsByColumn[currentFix.status] = applicantStore.state.applicantsByColumn[currentFix.status].filter((item : ApplicantFix)=>item.id!==data.id)
    }
    return data
  }

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
    if(data.status && route.meta.applicantsUpdateOnOrganizationChange && ApplicantOrFixColumn[data.status] === 'fix'){
      await applicantStore.getApplicantsByColumns(data.status, applicantStore.state.applicantProgressFilter)
    }
  }

  return { getFixData, saveFix, updateFix, formatDataFix }
})
