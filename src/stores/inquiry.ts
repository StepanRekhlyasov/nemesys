import { addDoc, arrayUnion, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { date } from 'quasar';
import { InquiryMessage, INQUIRY_MESSAGE_TYPE } from 'src/pages/admin/InquiryPage/types/inquiryTypes';
import { InquiryData, InquiryDataRow, Organization } from 'src/shared/model';
import { findTheLastDate, myDateFormat } from 'src/shared/utils/utils';
import { DELIVERY_STATUS } from 'src/pages/admin/ReleaseNotes/types/notificationTypes';
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
    const docWholeSnap =  await getDocs(query(collection(db, 'inquires'), orderBy('updated_at', 'desc')));

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
            companyID: organisation.code,
            companyName: organisation.name,
            issueDate: findTheLastDate(recievedMessageDate),
            answerDate: findTheLastDate(answeredMessageDate),
            updated_at: myDateFormat(item.data().updated_at, 'YYYY-MM-DD HH:mm:ss'),
        }]
      }
  })
  }

  const getCurrentInquiry = async (id: string) => {
    const docRef = doc(db, 'inquires', id)

    const inquirySnap = await getDoc(docRef)

    if (inquirySnap.exists()) {
      const id = inquirySnap.id
      return { id, ...inquirySnap.data() } as InquiryData
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
          messageDate: myDateFormat(message.date),
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

  const replyOnInquiry = async({inquiryId, message,  data} : {inquiryId: string, message?: InquiryMessage,  data: Partial<InquiryData>}) => {
    const inquiryRef = doc(db, 'inquires/' + inquiryId);
    if(message){
      await updateDoc(inquiryRef, {
        messages: arrayUnion(message)
      });
    }
    await updateDoc(inquiryRef, data);
  }

  const deleteInquiryData = async(inquiryId: string) => {
    const inquiryRef = doc(db, 'inquires/' + inquiryId);
    return await deleteDoc(inquiryRef)
  }

  const getInqueriesByOrganizationId = async (organizationId : string) => {
    if(!organizationId){
      return []
    }
    const docSnap =  await getDocs(query(collection(db, 'inquires'), orderBy('recievedDate', 'desc'), where('organization', '==', organizationId)));
    const documents = docSnap.docs.map(item => {
      const id = item.id
      return { id, ...item.data() }
    })
    return documents as InquiryData[]
  }
  const getDeliveredNotifications = async () => {
    return await getDocs(query(collection(db, 'notifications'), where('status','==',DELIVERY_STATUS.delivered)));
  }

  const addFlagValue = async (id,data) => {
    data['flagExclamation'] = false
    await updateDoc(doc(db, 'notifications', id), data);
  };

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
    deleteInquiryData,
    getInqueriesByOrganizationId,
    getDeliveredNotifications,
    addFlagValue
  }

})
