import { addDoc, arrayUnion, collection, deleteDoc, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { date } from 'quasar';
import { InquiryMessage, INQUIRY_MESSAGE_TYPE } from 'src/pages/admin/InquiryPage/types/inquiryTypes';
import { InquiryData, InquiryDataRow, Organization } from 'src/shared/model';
import { findTheLastDate } from 'src/shared/utils/utils';
import { ref } from 'vue';

type InquiryState = {
  currentRowData: InquiryDataRow | Record<string, never>
  currentOrganisationInfo: Organization | Record<string, never>
  showDrawer: boolean
  wholeInquiresData: InquiryDataRow[]
}

export const useInquiry = defineStore('inquiry', () => {

  const state = ref<InquiryState>({
    currentRowData: {},
    currentOrganisationInfo: {},
    showDrawer: false,
    wholeInquiresData: []
  })

  const db = getFirestore();

  const setCurrentRowData = (newRow: InquiryDataRow) => {
    state.value.currentRowData = newRow
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
    state.value.wholeInquiresData = []
    const docWholeSnap =  await getDocs(query(collection(db, 'inquires'), orderBy('recievedDate', 'desc')));

    if (!docWholeSnap.empty) {
      setCurrentInquiresData(docWholeSnap.docs)
    }

    return docWholeSnap
  }

  const setCurrentInquiresData = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    docs.forEach(async (item, index) => {
      const organisation = await getOrganisationById(item.data().organization)
      if (organisation?.id) {
        const recievedMessageDate: Date[] = [item.data().recievedDate.toDate()]
        const answeredMessageDate: Date[] = []
        state.value.wholeInquiresData = [...state.value.wholeInquiresData, {
            number: index + 1,
            id: item.id,
            status: item.data().status,
            category: item.data().category,
            subject: item.data().subject,
            organisation,
            inquiryContent: item.data().inquiryContent,
            messages: item.data().messages.map((item) => {
              if (item.type === INQUIRY_MESSAGE_TYPE.issue) {
                recievedMessageDate.push(item.date.toDate())
              } else {
                answeredMessageDate.push(item.date.toDate())
              }
             return {
                messageDate: date.formatDate(item.date.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                content: item.content,
                type: item.type
              }
            }),
            companyID: `${organisation.code} ${organisation.name}`,
            issueDate: findTheLastDate(recievedMessageDate),
            answerDate: findTheLastDate(answeredMessageDate),
        }]
      }
  })
  }

  const getCurrentInquiry = async (id: string) => {
    const docRef = doc(db, 'inquires', id)

    const inquirySnap = await getDoc(docRef)

    if (inquirySnap.exists()) {
      return inquirySnap.data() as Organization
    }
  }

  const updateCurrentRowDataMessages = async ({message, data}: {message: InquiryMessage,  data: Partial<InquiryData>}) => {
    // @ts-expect-error some problem with an existence check, idk how to solve it
    state.value.currentRowData = {
      ...state.value.currentRowData,
      ...data,
      // @ts-expect-error the same problem as on 98 line
      messages: [...state.value.currentRowData.messages,
        {
          messageDate: date.formatDate(message.date, 'YYYY-MM-DD HH:mm:ss'),
          content: message.content,
          type: message.type
        }
      ]
    }
  }

  const getOrganisationById = async (id: string) => {
    const docRef = doc(db, 'organization', id)

    const organisationSnap = await getDoc(docRef)

    if (organisationSnap.exists()) {
      return organisationSnap.data() as Organization
    }
  }

  const replyOnInquiry = async({inquiryId, message,  data} : {inquiryId: string, message: InquiryMessage,  data: Partial<InquiryData>}) => {
    const inquiryRef = doc(db, 'inquires/' + inquiryId);
    await updateDoc(inquiryRef, {
      messages: arrayUnion(message)
    });
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
    openDrawer,
    addInquiry,
    getAllInquires,
    getOrganisationById,
    replyOnInquiry,
    getCurrentInquiry,
    updateCurrentRowDataMessages,
    deleteInquiryData
  }

})
