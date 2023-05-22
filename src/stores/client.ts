import { defineStore } from 'pinia';
import { getFirestore, collection, addDoc, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref } from 'vue';
import { Client } from 'src/shared/model';
import { date } from 'quasar';

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

            return docRef
        } catch(e) {
            console.log(e)
            return undefined
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

    fetchClients();

    return {
        clients,
        addNewClient
    }
})