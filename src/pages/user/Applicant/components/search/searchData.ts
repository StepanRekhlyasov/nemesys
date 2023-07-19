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
export const sharedData = ref<DocumentData>(JSON.parse(JSON.stringify(searchDataSample)));
export function updateSharedVariable(newValue: DocumentData) {
    sharedData.value = newValue;
}
export function resetSharedVariable(){
    sharedData.value = JSON.parse(JSON.stringify(searchDataSample));
}
