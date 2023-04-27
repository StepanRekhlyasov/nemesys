import { defineStore } from 'pinia';
import { getFirestore, query, collection, getDocs, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
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

    // unsubscribe
    const unsubscribe = ref<(() => void)[]>([]);

    //  methdods
    const getLastReflectLog = async (clientId: string, clientFactoryId: string) => {
        let reflectLog: ReflectLog | undefined

        try {
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

        } catch(e) {
            console.log(e)
            return undefined
        }

        return reflectLog
    }

    const getAllImportLogs = async(clientId: string, clientFactoryId: string) => {
        const importLogs: ImportLog[] = []

        try {
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

        } catch(e) {
            console.log(e)
            return []
        }

        return importLogs
    }

    const getLastImportLog = async (clientId: string, clientFactoryId: string) => {
        let importLog: ImportLog | undefined

        try {
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

        } catch(e) {
            console.log(e)
            return undefined
        }

        return importLog
    }

    const getAllReflectLogs = async (clientId: string, clientFactoryId: string) => {
        const importLogs: ReflectLog[] = []

        try {
            const importLogsSnapshot = await getDocs(query(
                collection(db, 'clients', clientId, 'client-factory',clientFactoryId, 'reflectLog'),
                orderBy('executionDate', 'desc')
            ))

            importLogsSnapshot.forEach((doc) => {
                const docData = doc.data()

                importLogs.push(
                    {
                        ...docData,
                        executionDate: date.formatDate(docData.executionDate.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                        id: doc.id
                    } as ReflectLog
                )
            })

        } catch(e) {
            console.log(e)
            return []
        }

        return importLogs
    }

    const getClientFactories = async (clients: Client[]) => {
        if (unsubscribe.value.length > 0) {
            unsubscribe.value.forEach(unsub => unsub());
            unsubscribe.value = [];
        }

        const newClientFactories: ClientFactory[] = [];

        await Promise.all(clients.map(async (client) => {
            return new Promise<void>((resolve) => {
            const unsub = onSnapshot(collection(db, 'clients', client.id, 'client-factory'), async (snapshot) => {
                const clientFactoryPromises = snapshot.docs.map(async (doc) => {
                    const clientFactory = { ...doc.data(), id: doc.id } as ClientFactory;
                    clientFactory.client = client;

                    clientFactory.reflectLog = await getLastReflectLog(clientFactory.clientID, clientFactory.id);
                    clientFactory.importLog = await getLastImportLog(clientFactory.clientID, clientFactory.id);

                    newClientFactories.push(clientFactory);
                });

                await Promise.all(clientFactoryPromises);
                resolve();
            });

                unsubscribe.value.push(unsub);
            });
        }));

        console.log(newClientFactories)
        // clientFactories.value = newClientFactories;
        return newClientFactories;
    };
 
    const addClientFactory = async (clientFactory: ClientFactory) => {
        try {

            await addDoc(collection(db, 'clients', clientFactory.clientID, 'client-factory'), {
                ...clientFactory,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

        } catch(e) {
            console.log(e)
            return undefined
        }
    }

    return {
        clientFactories,
        getClientFactories,
        getAllImportLogs,
        getAllReflectLogs,
        addClientFactory
    }
})