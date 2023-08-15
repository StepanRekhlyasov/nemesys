import { defineStore } from 'pinia';
import { getFirestore, query, collection, getDocs, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp, setDoc, getDoc, doc, where, getCountFromServer, collectionGroup } from 'firebase/firestore';
import { ref } from 'vue';
import { Client, Organization, User } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { ImportLog } from 'src/shared/model/ImportLog';
import { ReflectLog } from 'src/shared/model/ReflectLog';
import { date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ConstraintsType } from 'src/shared/utils/utils';

export const useClientFactory = defineStore('client-factory', () => {

    // db
    const db = getFirestore();

    // state
    const clientFactories = ref<ClientFactory[]>([])
    const modifiedCFs = ref<ModifiedCF[]>([])

    // unsubscribe
    const unsubscribe = ref<{ [clientId: string]: (() => void) }>({});
    const unsubscribeModifiedCF = ref<{ [clientFactoryId: string]: (() => void) }>({});

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


                if(doc.exists()) {
                    const docData = doc.data()

                    reflectLog = {
                        ...docData,
                        executionDate: date.formatDate(docData.executionDate?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                        id: doc.id
                    } as ReflectLog
                }

            })

        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }

        return reflectLog
    }

    const addReflectLog = async (user: User , clientFactory: ClientFactory, isDetailChanged: boolean) => {
        try {
            const saveData = {
              userId: user.id ?? '',
              userName: user.name ?? '',
              clientFactoryId: clientFactory.id,
              executionDate: serverTimestamp(),
              isUpdated: true,
              itemType: {
                  isBasicChanged: true,
                  isDetailInfoChanged: isDetailChanged ?? false
              }
            }
            const docRef = await addDoc(collection(db, 'clients', clientFactory.clientID, 'client-factory', clientFactory.id, 'reflectLog'),
            saveData)

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data()

                return {
                    ...data,
                    id: docSnap.id,
                    executionDate: date.formatDate(data.executionDate?.toDate(), 'YYYY-MM-DD HH:mm:ss')
                }
            }

        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
    }

    const addImportLog = async (user: User, clientFactory: ClientFactory, organization: Organization, isDetailChanged: boolean) => {
        try {
            const docRef = await addDoc(collection(db, 'clients', clientFactory.clientID, 'client-factory', clientFactory.id, 'importLog'), {
                userId: user.id,
                userName: user.name,
                clientFactoryId: clientFactory.id,
                organizationId: organization.id,
                organizationName: organization.name,
                executionDate: serverTimestamp(),
                isUpdated: true,
                itemType: {
                    isBasicInfoChanged: true,
                    isDetailInfoChanged: isDetailChanged
                }
            })

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data()

                return {
                    ...data,
                    id: docSnap.id,
                    executionDate: date.formatDate(data.executionDate?.toDate(), 'YYYY-MM-DD HH:mm:ss')
                }
            }

        } catch(e) {
           Alert.warning(e)
           console.log(e)
        }
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
            Alert.warning(e)
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
            Alert.warning(e)
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
            Alert.warning(e)
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

    const getClientFactoryList = async (client_id: string) => {
        const docSnap =  await getDocs(query(
            collection(db, 'clients/'+client_id+'/client-factory'),
            orderBy('name')
        ))
        return docSnap.docs.map((doc) => {
            return {
                ...doc.data(),
                id: doc.id,
                updated_at: date.formatDate(doc.data()?.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                created_at: date.formatDate(doc.data()?.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss')
            } as ClientFactory;
        })
    }

    const addClientFactory = async (clientFactory: ClientFactory) => {
        try {

            await addDoc(collection(db, 'clients', clientFactory.clientID, 'client-factory'), {
                ...clientFactory,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });


        } catch(e) {
            Alert.warning(e)

            console.log(e)
        }
    }

    const addModifiedCF = async (organizationId: string, modifiedClientFactory: ClientFactory) => {
        try {
          let createdAt = modifiedClientFactory.created_at as string | object

          if(typeof createdAt === 'object'){
            if('seconds' in createdAt  && 'nanoseconds' in createdAt){
                createdAt = new Timestamp(createdAt.seconds as number, createdAt.nanoseconds as number).toDate()
            }
          }

            const res = await addDoc(collection(db, 'clients', modifiedClientFactory.clientID, 'client-factory', modifiedClientFactory.id, 'modifiedCF'), {
                ...modifiedClientFactory,
                organizationId: organizationId,
                isIgnored: false,
                numberUpdates: 1,
                numberImports: 0,
                updated_at: serverTimestamp(),
                created_at: createdAt
            })



            return res.id
        } catch(e) {
            Alert.warning(e)

            console.log(e)
        }
    }

    const updateModifiedCF = async ( clientFactoryId: string, modifiedCF:ModifiedCF) => {
        for(const [key, value] of Object.entries(modifiedCF)){
          if(!key || typeof value === undefined){
            delete modifiedCF[key]
          }
        }
        try {
            await setDoc(doc(db, 'clients', modifiedCF.clientID, 'client-factory', clientFactoryId, 'modifiedCF', modifiedCF.id), {
                ...modifiedCF,
                isIgnored: false,
                numberUpdates: modifiedCF.numberUpdates + 1,
                numberImports: modifiedCF.numberImports,
                created_at: Timestamp.fromDate(new Date(modifiedCF.created_at)),
                updated_at: serverTimestamp(),
            })


        } catch(e) {
            Alert.warning(e)

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
            Alert.warning(e)
            console.log(e)
        }

        return modifiedCF
    }

    const getModifiedCFs = async (clientId: string, clientFactoryId: string) => {
        if (unsubscribeModifiedCF.value[clientFactoryId]) {
            unsubscribeModifiedCF.value[clientFactoryId]();
            delete unsubscribeModifiedCF.value[clientFactoryId];
        }

        unsubscribeModifiedCF.value[clientFactoryId] = onSnapshot(collection(db, 'clients', clientId, 'client-factory', clientFactoryId, 'modifiedCF'), (snapshot) => {
            modifiedCFs.value = snapshot.docs.reduce((acc, doc) => {
                const docData = doc.data()

                if (docData.isIgnored === true) return acc

                const newModifiedCF = {
                    ...docData,
                    id: doc.id,
                    updated_at: date.formatDate(docData.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                    created_at: date.formatDate(docData.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                } as ModifiedCF;

                return [...acc, newModifiedCF];
            }, [] as ModifiedCF[])
        });
    }

    const setIgnoredStatus = async (clientId: string, clientFactoryId: string, modifiedCFId: string) => {
        try {
            const modifiedCFDoc = doc(db, 'clients', clientId, 'client-factory', clientFactoryId, 'modifiedCF', modifiedCFId);

            await setDoc(modifiedCFDoc, {
                isIgnored: true
            }, {merge: true});


        } catch(e) {
            Alert.warning(e)

            console.log(e)
        }
    }

    const updateClientFactory = async (updatedClientFactory) => {
      for(const [key, value] of Object.entries(updatedClientFactory)){
        if(!key || typeof value === undefined){
          delete updatedClientFactory[key]
        }
      }
      try {
          await setDoc(doc(db, 'clients', updatedClientFactory.clientID, 'client-factory', updatedClientFactory.id), {
              ...updatedClientFactory,
              created_at: Timestamp.fromMillis(updatedClientFactory.created_at),
              updated_at: serverTimestamp()
          });
      } catch (e) {
          Alert.warning(e);
          console.log(e);
      }
  };

    const getHeadClientFactory = async(clientId: string) => {
        let headClientFactory: ClientFactory | undefined

        try {
            const headClientFactoryQuerySnapshot = await getDocs(query(
                collection(db, 'clients', clientId, 'client-factory'),
                where('isHead', '==', true)
            ))
            const countSnapshot = await getCountFromServer(collection(db, 'clients', clientId, 'client-factory'));

            headClientFactoryQuerySnapshot.forEach((doc) => {
                const docData = doc.data()
                docData.client = {
                  ...docData.client,
                  numberOffices: countSnapshot.data().count,
                }
                headClientFactory = {
                    ...docData,
                        id: doc.id,
                        updated_at: date.formatDate(docData?.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                        created_at: date.formatDate(docData?.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                } as ClientFactory
            })
        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
        return headClientFactory;
    }
    const getEmploymentStatus = async(boSnapshot,fixSnapshot,employmentType1,employmentType2)=>{
        const array:string[]=[]
        boSnapshot.docs.forEach(
            (doc) => {
                if ((doc.data()['employmentType']
                && (doc.data()['employmentType'].includes(employmentType1)
                || (employmentType2!=='' && doc.data()['employmentType'].includes(employmentType2))))) {
                    array.push(doc.id)
                }
            }
        )
        let count = 0;

        array.forEach((id) => {
            fixSnapshot.docs.forEach(
                (doc) => {
                    if (doc.data()['backOrder'] === id
                        && doc.data()['admissionStatus'] === true) {
                        count++;
                    }
                }
            )
        })
        return count;
    }
    const getRelatedOfficeInfo = async(clientId:string) => {
        const officeInfo = {};
        const cfSnapshot = await getDocs(collection(db, 'clients', clientId, 'client-factory'));
        officeInfo['numberOffices'] = cfSnapshot.size;
        const boSnapshot = await getDocs(query(collection(db,'BO'),where('client_id','==',clientId)))
        officeInfo['backOrder'] = boSnapshot.size;
        const fixSnapshot = await getDocs(collection(db,'fix'))
        officeInfo['fullTime']  = await getEmploymentStatus(boSnapshot,fixSnapshot,'fullTime','');
        officeInfo['nonRegular'] = await getEmploymentStatus(boSnapshot,fixSnapshot,'partTime','');
        officeInfo['temporary'] =  await getEmploymentStatus(boSnapshot,fixSnapshot,'dispatch', 'referralDispacth');
        officeInfo['current'] = 0;
        let count=0;
        boSnapshot.forEach((docs) => {
            fixSnapshot.docs.forEach(
                (doc) => {
                    if (doc.data()['backOrder'] === docs.id
                        && ['wait_termination','working'].includes(doc.data()['status'])) {
                        count++;
                    }
                }
            )
        })
        officeInfo['current'] = count
        return officeInfo;
    }

    async function getClientFactory(client_id: string, office_id: string){
      const docRef = doc(db, 'clients/' + client_id + '/client-factory/' + office_id);
      const result = await getDoc(docRef)
      if(!result.data()){
        return undefined
      }
      return { ...result.data(), id: result.id } as ClientFactory
    }


    async function getClientFactoryByConstraints(constraints: ConstraintsType) {
        const ref = query(collectionGroup(db, 'client-factory'), ...constraints)
        const data = await getDocs(ref)
        return await Promise.all(data.docs.map(async (d) => {
            const data = d.data()
            const client = await getDoc(doc(db, `clients/${data.clientID}`))
            return {
                ...data,
                id: d.id,
                client: client.data(),
            } as ClientFactory
        }))
    }

    async function getModifiedCfWithId(office_id: string) {
        const querySnapshot = await getDocs(
            query(
                collectionGroup(db, 'modifiedCF'),
                where('id', '==', office_id)
            )
        );
        const modifiedCF = ref<ClientFactory>()
        querySnapshot.forEach((doc) => {
            modifiedCF.value = doc.data() as ClientFactory;
            return modifiedCF.value ? modifiedCF.value : {};
        });
        return modifiedCF.value ? modifiedCF.value : {};
    }

    return {
        clientFactories,
        modifiedCFs,
        getModifiedCfWithId,
        getClientFactoryByConstraints,
        getClientFactories,
        getClientFactory,
        getClientFactoryList,
        getAllImportLogs,
        getAllReflectLogs,
        addReflectLog,
        addImportLog,
        addClientFactory,
        updateClientFactory,
        getHeadClientFactory,
        getRelatedOfficeInfo,
        addModifiedCF,
        getModifiedCF,
        updateModifiedCF,
        getModifiedCFs,
        setIgnoredStatus,
    }
})
