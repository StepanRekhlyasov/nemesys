import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { getFirestore, query, collection, getDocs, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp, setDoc, doc, where } from 'firebase/firestore';
import { ref } from 'vue';
import { Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { ImportLog } from 'src/shared/model/ImportLog';
import { ReflectLog } from 'src/shared/model/ReflectLog';
import { date } from 'quasar';

export const useClientFactory = defineStore('client-factory', () => {

    //quasar
    const $q = useQuasar();

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
                            
                        const reflectRes = await getLastReflectLog(clientFactory.clientID, clientFactory.id);

                        if(reflectRes) {
                            clientFactory.reflectLog = reflectRes
                        }

                        const importRes = await getLastImportLog(clientFactory.clientID, clientFactory.id);

                        if(importRes) {
                            clientFactory.importLog = importRes
                        }

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

            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Success',
            });

        } catch(e) {
            $q.notify({
                textColor: 'white',
                color: 'red-5',
                icon: 'warning',
                message: 'Unexpected error',
            });

            console.log(e)
        }
    }

    const addModifiedCF = async (organizationId: string, modifiedClientFactory: ClientFactory) => {
        try {
            const res = await addDoc(collection(db, 'clients', modifiedClientFactory.clientID, 'client-factory', modifiedClientFactory.id, 'modifiedCF'), {
                ...modifiedClientFactory,
                organizationId: organizationId,
                updated_at: serverTimestamp(),
                created_at: Timestamp.fromDate(new Date(modifiedClientFactory.created_at))
            })

            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'CF was modified',
            })

            return res.id
        } catch(e) {
            $q.notify({
                textColor: 'white',
                color: 'red-5',
                icon: 'warning',
                message: 'Unexpected error',
            });

            console.log(e)
        }
    }

    const updateModifiedCF = async ( clientFactoryId: string, modifiedCF: ModifiedCF) => {
        try {
            await setDoc(doc(db, 'clients', modifiedCF.clientID, 'client-factory', clientFactoryId, 'modifiedCF', modifiedCF.id), modifiedCF)

            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'CF was updated',
            });
        } catch(e) {
            $q.notify({
                textColor: 'white',
                color: 'red-5',
                icon: 'warning',
                message: 'Unexpected error',
            });

            console.log(e)
        }
    }

    const getModifiedCF = async (organizationId: string, originalClientFactory: ClientFactory) => {
        let modifiedCF: ModifiedCF | undefined

        try {
            const foundModifiedCF = await getDocs(query(
                collection(db, 'clients', originalClientFactory.clientID, 'client-factory', originalClientFactory.id, 'modifiedCF'),
                where('organizationId', '==', organizationId)
            ))

            if(!foundModifiedCF.empty) {
                foundModifiedCF.forEach((doc) => {
                    const docData = doc.data()

                    modifiedCF = {
                        ...docData,
                        id: doc.id,
                        updated_at: date.formatDate(docData?.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                        created_at: date.formatDate(docData?.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                    } as ModifiedCF
                })
            }

        } catch(e) {
            console.log(e) 
        }

        return modifiedCF
    }

    const updateClientFactory = async(updatedClientFactory: Omit<ClientFactory, 'created_at'>) => {
        try {

            await setDoc(doc(db, 'clients', updatedClientFactory.clientID, 'client-factory', updatedClientFactory.id), {
                ...updatedClientFactory,
                updated_at: serverTimestamp()
            }, {merge: true});

            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'CF was updated',
            });
        } catch(e) {
            $q.notify({
                textColor: 'white',
                color: 'red-5',
                icon: 'warning',
                message: 'Unexpected error',
            });

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
        getHeadClientFactory,
        addModifiedCF,
        getModifiedCF,
        updateModifiedCF
    }
})