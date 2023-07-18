import { ref } from 'vue'
import { DocumentData } from 'firebase/firestore';
export const searchDataSample = { 
    sex: [], 
    qualification: [], 
    classification: [], 
    occupation: [], 
    availableShift: [], 
    daysperweek: [] 
};
export const dataa = ref<DocumentData>(JSON.parse(JSON.stringify(searchDataSample)));
export function updateSharedVariable(newValue: DocumentData) {
    dataa.value = newValue;
}
export function resetSharedVariable(){
    dataa.value = JSON.parse(JSON.stringify(searchDataSample));
}
