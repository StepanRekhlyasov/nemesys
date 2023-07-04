import { defineStore } from 'pinia';
import axios from 'axios';
import { Alert } from 'src/shared/utils/Alert.utils';
export const useDataOutput = defineStore('dataOutput', () => {
    const downloadCSV = async(triggerURL: string,name:string) => {
        try {
            await axios.get(triggerURL)
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    Alert.success();
                })
                .catch((error) => {
                    Alert.warning(error)
                })
        }
        catch (error) {
            Alert.warning('An error occurred:');
        }
    }
    function getFileName(exportName: string): string {
        const now: Date = new Date();
        const timezoneOffset: number = now.getTimezoneOffset() * 60000; // Offset in milliseconds
        const localTime: number = now.getTime() - timezoneOffset;
        const localDate: Date = new Date(localTime + 9 * 3600000); // Adding 9 hours for UTC+9 timezone
        
        const formattedDate: string = localDate.toISOString().replace(/[-:.]/g, '').replace('T', '_').slice(0, -5);
        return `export_${exportName}_${formattedDate}.csv`;
      }
    return {downloadCSV,getFileName}
})