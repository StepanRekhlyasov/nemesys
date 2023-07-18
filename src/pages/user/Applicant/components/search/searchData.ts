import { ref } from 'vue'
import { DocumentData } from 'firebase/firestore';
export const dataa = ref<DocumentData>([]);
export function updateSharedVariable(newValue: DocumentData) {
    dataa.value = newValue
}
