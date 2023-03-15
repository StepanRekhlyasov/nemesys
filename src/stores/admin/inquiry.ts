import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { InquiryData, InquiryDataRow, Organization } from 'src/shared/model';
import { ref } from 'vue';

type InquiryState = {
  currentRowData: InquiryDataRow | Record<string, never>
  currentOrganisationInfo: Organization | Record<string, never>
  showDrawer: boolean
}

export const useInquiry = defineStore('inquiry', () => {

  const state = ref<InquiryState>({
    currentRowData: {},
    currentOrganisationInfo: {},
    showDrawer: false
  })

  const db = getFirestore();

  const setCurrentRowData = (newRow: InquiryDataRow) => {
    state.value.currentRowData = newRow
  }

  const setCurrentRowResponse = (response: string) => {
    state.value.currentRowData.responseContent = response
  }

  const setCurrentOrganisationInfo = (newInfo: Organization) => {
    state.value.currentOrganisationInfo = newInfo
  }

  const openDrawer = (opt: boolean) => {
    state.value.showDrawer = opt
  }

  const addInquiry = async (data: InquiryData) => {
    return await addDoc(collection(db, 'inquires'), {
      ...data,
    })
  }

  const getAllInquires = async () => {
    return await getDocs(query(collection(db, 'inquires'), orderBy('recievedDate', 'desc')));
  }

  const getCurrentInquiry = async (id: string) => {
    const docRef = doc(db, 'inquires', id)

    const organisationSnap = await getDoc(docRef)

    if (organisationSnap.exists()) {
      return organisationSnap.data() as InquiryData
    }
  }

  const getOrganisationById = async (id: string) => {
    const docRef = doc(db, 'organization', id)

    const organisationSnap = await getDoc(docRef)

    if (organisationSnap.exists()) {
      return organisationSnap.data() as Organization
    }
  }

  const replyOnInquiry = async(inquiryId: string, data) => {
    const inquiryRef = doc(db, 'inquires/' + inquiryId);
    await updateDoc(inquiryRef, data);
  }

  const deleteInquiryData = async(inquiryId: string) => {
    const inquiryRef = doc(db, 'inquires/' + inquiryId);
    return await deleteDoc(inquiryRef)
  }

  return {
    state,
    setCurrentRowData,
    setCurrentOrganisationInfo,
    setCurrentRowResponse,
    openDrawer,
    addInquiry,
    getAllInquires,
    getOrganisationById,
    replyOnInquiry,
    getCurrentInquiry,
    deleteInquiryData
  }

})
