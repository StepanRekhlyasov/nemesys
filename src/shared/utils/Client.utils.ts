import { Firestore, doc, getDoc } from 'firebase/firestore';
import { Client } from '../model';


export const getClient = async (db: Firestore, clientId: string):Promise<Client> => {
  const clientDoc = await getDoc(doc(db, 'clients/' + clientId));
  return {clientId, ...clientDoc.data()} as Client;
}