import { defineStore } from 'pinia';
import { getFirestore, collection, addDoc, query, where, serverTimestamp, onSnapshot, setDoc, doc, getDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { Client } from 'src/shared/model';
import { date } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';

export const useClient = defineStore('client', () => {

    // db
    const db = getFirestore();

    // state
    const clients = ref<Client[]>([])

    // methods
    const addNewClient = async (client: Client) => {
        const newClient = {
            ...client,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            deleted: false
        }

        try {
            const docRef =  await addDoc(collection(db, 'clients'), newClient);
            Alert.createAlert({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Client wass added',
          })

            return docRef
        } catch(e) {
           Alert.warning(e)
        }
    }

    const updateClient = async( id: string, client: Omit<Client, 'created_at'>) => {
        try {

            await setDoc(doc(db, 'clients', id), {
                ...client,
                updated_at: serverTimestamp()
            }, {merge: true});

        } catch(e) {
            Alert.warning(e)
            console.log(e)
        }
    }

    // Fetch clients and subscribe to changes
    const fetchClients = async () => {
        const clientsCollection = collection(db, 'clients');
        const filteredClientsQuery = query(clientsCollection, where('deleted', '==', false));
        onSnapshot(filteredClientsQuery, (snapshot) => {
            clients.value = snapshot.docs.map(doc => {
                const clientData = doc.data();
                return {
                    ...clientData,
                    id: doc.id,
                    created_at: date.formatDate(clientData.created_at?.toDate(), 'YYYY-MM-DD HH:mm:ss'),
                    updated_at: date.formatDate(clientData.updated_at?.toDate(), 'YYYY-MM-DD HH:mm:ss')
                };
            }) as Client[];
        });
    };

  async function fetchClientsById (clientId){
        const clientRef = doc(collection(db, 'clients'),clientId);
        const clientDoc = await getDoc(clientRef)
        const clientData = clientDoc.data();
        return clientData as Client;
    };

    fetchClients();

    return {
        clients,
        addNewClient,
        updateClient,
        fetchClientsById
    }
})
