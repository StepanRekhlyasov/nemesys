import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantFix, Client, ClientOffice } from 'src/shared/model';
import { getClientList, getClientOfficeList } from 'src/shared/utils/Applicant.utils';
import { toDateFormat } from 'src/shared/utils/utils';
import { ConstraintsType } from 'src/shared/utils/utils';
import { ref } from 'vue'

interface ApplicantState {
    clientList: Client[],
    selectApplicant: number
}

export interface FixOption {
    operationFilter?: boolean;
}

export const useApplicant = defineStore('applicant', () => {
    
    const db = getFirestore();  
    const state = ref<ApplicantState>({
        clientList: [] as Client[],
        selectApplicant: 0,
    })

    async function getClients( active_organization_id?: string ): Promise<Client[]> {
      const clientsData = await getClientList(db, {active_organization_id})
      const list: Client[] = [] ;
      clientsData?.forEach((doc) => {
        const data = doc.data();
        list.push({id: doc.id, ...data} as Client);
      });
      return list;
    }

    async function getClientOffice(client_id: string): Promise<ClientOffice[]>{
        const officeData = await getClientOfficeList(db, client_id)
        const list: ClientOffice[] = []

        officeData.forEach(office => {
            list.push({id: office.id, ...office.data()} as ClientOffice)
        })

        return list
    }

    async function getFixData(applicant_id: string, operationFilter?: boolean): Promise<ApplicantFix[]> {
        const fixData = await getFixList(applicant_id, {operationFilter})
        const list: ApplicantFix[] = [];

        fixData.forEach(fix => {
            const data = fix.data()
            list.push({
                ...data,
                id: fix.id,
                date: toDateFormat(data['date']),
                offerDate: toDateFormat(data['offerDate']),
                admissionDate: toDateFormat(data['admissionDate']),
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

    getClients().then(clients => {
        state.value.clientList = clients
        state.value.clientList.forEach(async (client) => {
            if (client.id) {
                client.office = await getClientOffice(client.id)
            }
        })
    })

    return { state, getClients, getClientOffice, getFixData, getFixList, saveFix, updateFix}
})
  