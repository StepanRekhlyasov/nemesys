import { defineStore } from 'pinia';
import { getFirestore, query, where, collection, getDocs, DocumentData } from 'firebase/firestore';
import { ref } from 'vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

export const useAdminClientFactory = defineStore('admin-client-factory', () => {
    const db = getFirestore();

    // state
    const clientFactories = ref<ClientFactory[]>([])


    //  methdods
    const getClientFactories = async () => {
        const clients: DocumentData[] = []
        const clientsQuerySnapshot = await getDocs(query(collection(db, 'clients'), where('deleted', '==', false)))

        clientsQuerySnapshot.forEach((doc) => {
            clients.push({clientId: doc.id, ...doc.data()})
        })

        const clientFactoriesSnapshot = await getDocs((collection(db, 'clients', clients[0]['clientId'], 'client-factory')))

        const clientFactoriesData: ClientFactory[] = []
        clientFactoriesSnapshot.forEach((doc) => {
            clientFactoriesData.push({...doc.data(), id: doc.id} as ClientFactory)
        })

        clientFactories.value = clientFactoriesData

        return clientFactoriesData
    }

    return {
        clientFactories,
        getClientFactories
    }
})