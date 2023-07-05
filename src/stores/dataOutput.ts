import { getStorage, ref as refStorage, getDownloadURL } from 'firebase/storage';
import { exportFile } from 'quasar';
import { defineStore } from 'pinia';
import axios from 'axios';
import { Alert } from 'src/shared/utils/Alert.utils';
export const useDataOutput = defineStore('dataOutput', () => {
    const downloadCSV = async (triggerURL: string,collection:string) => {
        try {
            await axios.get(triggerURL)
                .then(response => {
                    if(response.status==200){
                        const name = getFileName(collection)
                        downloadSampleFile(collection,name)
                    }
                    else{
                        Alert.warning()
                    }
                })
                .catch(() => {
                    Alert.warning()
                })
        }
        catch (error) {
            Alert.warning();
        }
    }
    const downloadSampleFile = async (collection:string,name:string) => {
        const storage = getStorage();
        const resumeRef = refStorage(storage, `gs://dev-nemesys-firebase.appspot.com/create_csv/${collection}/exported_data.csv`);
        const url = await getDownloadURL(resumeRef)
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const status = exportFile(
                name,
                xhr.response,
                'text/csv'
            )
            if (status !== true) {
                Alert.warning('Browser denied file download...', { color: 'negative' })
                return
            }
        };
        xhr.open('GET', url);
        xhr.send();
        Alert.success()
    };
    function getFileName(exportName: string): string {
        const now: Date = new Date();
        const timezoneOffset: number = now.getTimezoneOffset() * 60000;
        const localTime: number = now.getTime() - timezoneOffset;
        const localDate: Date = new Date(localTime + 9 * 3600000); 
        const formattedDate: string = localDate.toISOString().replace(/[-:.]/g, '').replace('T', '_').slice(0, -5);
        return `export_${exportName}_${formattedDate}.csv`;
    }
    return { downloadCSV }
})
