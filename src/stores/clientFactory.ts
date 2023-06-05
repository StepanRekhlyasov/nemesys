import { defineStore } from 'pinia';
import { getFirestore, query, collection, getDocs, orderBy, limit, onSnapshot, addDoc, serverTimestamp, setDoc, doc, where } from 'firebase/firestore';
import { ref } from 'vue';
import { Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ImportLog } from 'src/shared/model/ImportLog';
import { ReflectLog } from 'src/shared/model/ReflectLog';
import { date } from 'quasar';

export const useClientFactory = defineStore('client-factory', () => {

    // db
    const db = getFirestore();

    // state
    const clientFactories = ref<ClientFactory[]>([])

    // unsubscribe
    const unsubscribe = ref<{ [clientId: string]: (() => void) }>({});

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

    // Unsubscribe from removed clients
        for (const clientId in unsubscribe.value) {
            if (!clients.some(client => client.id === clientId)) {
                unsubscribe.value[clientId]();
                delete unsubscribe.value[clientId];
            }
        }

        const clientFactoriesMap = ref<{ [clientId: string]: ClientFactory[] }>({});

        Object.assign(clientFactoriesMap.value, clientFactories.value);

        await Promise.all(clients.map(async (client) => {
            if (!unsubscribe.value[client.id as string]) {
                unsubscribe.value[client.id as string] = onSnapshot(collection(db, `clients/${client.id}/client-factory`), async (snapshot) => {
                    const newClientFactories: ClientFactory[] = [];

                    const clientFactoryPromises = snapshot.docs.map(async (doc) => {
                        const clientFactoryData = doc.data()

                        const clientFactory = {
                            ...clientFactoryData,
                            id: doc.id,
                            updated_at: date.formatDate(clientFactoryData?.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                            created_at: date.formatDate(clientFactoryData?.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                            client } as ClientFactory;
                            
                        clientFactory.reflectLog = await getLastReflectLog(clientFactory.clientID, clientFactory.id);
                        clientFactory.importLog = await getLastImportLog(clientFactory.clientID, clientFactory.id);

                        newClientFactories.push(clientFactory);
                    });

                    await Promise.all(clientFactoryPromises);

                    clientFactoriesMap.value[client.id as string] = newClientFactories;
                    clientFactories.value = Object.values(clientFactoriesMap.value).flat();

                });
            }
        }));
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
        }
    }

    const updateClientFactory = async(updatedClientFactory: Omit<ClientFactory, 'created_at'>) => {
        try {

            await setDoc(doc(db, 'clients', updatedClientFactory.clientID, 'client-factory', updatedClientFactory.id), {
                ...updatedClientFactory,
                updated_at: serverTimestamp()
            }, {merge: true});

        } catch(e) {
            console.log(e)
        }
    }

    const getHeadClientFactory = async(clientId: string) => {
        let headClientFactory: ClientFactory | undefined

        try {
            const headClientFactoryQuerySnapshot = await getDocs(query(
                collection(db, 'clients', clientId, 'client-factory'),
                where('isHead', '==', true)
            ))

            headClientFactoryQuerySnapshot.forEach((doc) => {
                const docData = doc.data()

                headClientFactory = {
                    ...docData,
                        id: doc.id,
                        updated_at: date.formatDate(docData?.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                        created_at: date.formatDate(docData?.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                } as ClientFactory
            })

        } catch(e) {
            console.log(e)
        }

        return headClientFactory;
    }

    return {
        clientFactories,
        getClientFactories,
        getAllImportLogs,
        getAllReflectLogs,
        addClientFactory,
        updateClientFactory,
        getHeadClientFactory
    }
})