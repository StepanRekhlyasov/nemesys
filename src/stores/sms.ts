
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, query, where, getDocs,getFirestore ,addDoc,serverTimestamp, DocumentData} from 'firebase/firestore';

  export const useSMS = defineStore('sms',()=>{
  const db = getFirestore();

    async function getApplicant(){
      const collectionRef = collection(db, 'applicants');
      const q = query(collectionRef, where('phone', '!=', null));
      const querySnapshot = await getDocs(q);
      const row = ref<DocumentData>([]);
      row.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.applicationDate) {
          const timestamp = data.applicationDate;
          const date = timestamp.toDate();
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          data.applicationDate = `${year}/${month}/${day}`;
        }
        return data;
      });
      return row.value;
    }

    async function Send(msg: string, selected: Record<string, { selected: boolean; Number: string }>) {
      try {
        const selectedItems = Object.values(selected).filter((item) => item.selected === true);
        if(selectedItems.length==0){
          return false;
        }
        for (const item of selectedItems) {
            await addDoc(collection(db, 'sms'),{
              'to':item.Number,
              'body':msg,
              'created_at':serverTimestamp(),
            });
        }
        return true;
      } catch (error) {
        return false
      }
    };

    const formatDate= (date:string,filteredData:DocumentData)=> {
      date = date.split('-').join('/')
      return filteredData.value.filter((item) => item.applicationDate === date);
      }

    function filterData(status:string,keyword:string,date:string,row:DocumentData){
      if(status || keyword || date){

        const filteredData = row;

      if(status)
        filteredData.value = filteredData.value.filter((item) => item.status === status);

      if(date)
        filteredData.value = formatDate(date,filteredData)

      if(keyword)
        filteredData.value = filteredData.value.filter((item) => item.name === keyword);

      return filteredData.value
      }
      else return row.value
    }

      return {getApplicant,Send,filterData}
    })
