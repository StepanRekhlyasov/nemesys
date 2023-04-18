import { defineStore } from 'pinia';
import { getFirestore, query, where, collection, getDocs, DocumentData, orderBy, limit } from 'firebase/firestore';
import { ref } from 'vue';
import { Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ImportLog } from 'src/shared/model/ImportLog';
import { ReflectLog } from 'src/shared/model/ReflectLog';
import { date } from 'quasar';

export const useAdminClientFactory = defineStore('admin-client-factory', () => {
    // db
    const db = getFirestore();

    // state
    const clientFactories = ref<ClientFactory[]>([])


    //  methdods
    const getLastReflectLogs = async (clientId: string, clientFactoryId: string) => {
        let reflectLog: ReflectLog | undefined

        const lastReflectLogsQuerySnapshot = await getDocs(query(
                collection(db, 'clients', clientId, 'client-factory', clientFactoryId, 'reflectLog'),
                orderBy('executionDate', 'desc'),
                limit(1)
            ))

        lastReflectLogsQuerySnapshot.forEach((doc) => {
            const docData = doc.data()
            reflectLog = {
                ...docData,
                executionDate: date.formatDate(docData.executionDate.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                id: doc.id
            } as ReflectLog
        })
        return reflectLog
    }

    const getAllImportLogs = async(clientId: string, clientFactoryId: string) => {
        const importLogs: ImportLog[] = []

        const importLogsSnapshot = await getDocs(query(
            collection(db, 'clients', clientId, 'client-factory',clientFactoryId, 'importLog'),
            orderBy('executionDate', 'desc')
        ))

        importLogsSnapshot.forEach((doc) => {
            const docData = doc.data()

            importLogs.push(
                {
                    ...docData,
                    executionDate: date.formatDate(docData.executionDate.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                    id: doc.id
                } as ImportLog
            )
        })

        return importLogs
    }

    const getLastImportLog = async (clientId: string, clientFactoryId: string) => {
        let importLog: ImportLog | undefined

        const lastImportLogQuerySnapshot = await getDocs(query(
                collection(db, 'clients', clientId, 'client-factory', clientFactoryId, 'importLog'),
                orderBy('executionDate', 'desc'),
                limit(1)
            ))
            

        lastImportLogQuerySnapshot.forEach((doc) => {
            const docData = doc.data()
            importLog = {
                ...docData,
                executionDate: date.formatDate(docData.executionDate.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                id: doc.id
            } as ImportLog
        })
        return importLog
    }

    const getClientFactories = async () => {
        const clients: DocumentData[] = []
        const clientFactoriesData: ClientFactory[] = []
        const clientsQuerySnapshot = await getDocs(query(collection(db, 'clients'), where('deleted', '==', false)))

        clientsQuerySnapshot.forEach((doc) => {
            clients.push({clientId: doc.id, ...doc.data() as Client})
        })

        await Promise.all(clients.map(async(client) => {
            const clientFactoriesSnapshot = await getDocs(collection(db, 'clients', client.clientId, 'client-factory'))

            clientFactoriesSnapshot.forEach((doc) => {
                const clientFactory = {...doc.data(), id: doc.id, client: client} as ClientFactory
            
                clientFactoriesData.push(clientFactory)
            })

            client.numberOffices = clientFactoriesSnapshot.size
        }))

        await Promise.all(clientFactoriesData.map(async(clientFactory) => {
            clientFactory.reflectLog = await getLastReflectLogs(clientFactory.clientID, clientFactory.id)
            clientFactory.importLog = await getLastImportLog(clientFactory.clientID, clientFactory.id)
        }))

        clientFactories.value = clientFactoriesData

        return clientFactoriesData
    }

    return {
        clientFactories,
        getClientFactories,
        getAllImportLogs
    }
})