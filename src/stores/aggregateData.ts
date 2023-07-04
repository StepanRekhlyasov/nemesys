import { defineStore } from 'pinia';
import axios from 'axios';
import { Alert } from 'src/shared/utils/Alert.utils';
export const useAggregatedData = defineStore('aggregatedData', () => {
    const downloadCSV = async(triggerURL: string) => {
        try {
            await axios.get(triggerURL)
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'downloaded_data.csv');
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
    return {downloadCSV}
})