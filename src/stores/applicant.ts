import { getFirestore } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ApplicantFix, Client, ClientOffice } from 'src/shared/model';
import { getClientList, getClientOfficeList, getFixList } from 'src/shared/utils/Applicant.utils';
import { ref } from 'vue'

interface ApplicantState {
    clientList: Client[],
    selectApplicant: number
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

    async function getFixData(applicant_id: string, operationFilter?: boolean) {
        const fixData = await getFixList(db, applicant_id, {operationFilter})
        const list: ApplicantFix[] = [];

        fixData.forEach(fix => {
            list.push({id: fix.id, ...fix.data()} as ApplicantFix)
        })

        return list
    }

    getClients().then(clients => {
        state.value.clientList = clients
        state.value.clientList.forEach(async (client) => {
            if (client.id) {
                client.office = await getClientOffice(client.id)
            }
        })
    })

    return { state, getClients, getClientOffice, getFixData}
})
  