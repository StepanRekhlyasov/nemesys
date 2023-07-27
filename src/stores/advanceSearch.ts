import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Client } from 'src/shared/model';
export const useAdvanceSearch = defineStore('advanceSearch', () => {
  const mapSelected = ref(false);
  const areaSelected = ref(false);
  const mapConditionData = ref({});
  const areaConditionData =  ref({});

  const advanceConditionData = ref({});
  const advanceMapSelected = ref(false);
  const advanceAreaSelected = ref(false);
  const advanceMapCFs = ref<Client[]>([]);
  const advanceAreaCFs = ref<Client[]>([]);

  const getAdvaceCFsId = (data: object) => {

    if (advanceMapSelected.value == true || advanceAreaSelected.value == true) {
      const combineData = ref<Client[]>([]);
      if (advanceMapSelected.value && advanceAreaSelected.value) {
        const idsSet1 = new Set(advanceMapCFs.value.map(element => element['id']));
        const idsSet2 = new Set(advanceAreaCFs.value.map(element => element['id']));
        const commonIds = [...idsSet1].filter(id => idsSet2.has(id));
        combineData.value = [...advanceMapCFs.value].filter(element => commonIds.includes(element['id']));
      }
      else if (advanceMapSelected.value) {
        advanceMapCFs.value.forEach((data) => {
          combineData.value.push(data)
        })
      }
      else {
        advanceAreaCFs.value.forEach((data) => {
          combineData.value.push(data)
        })
      }
      const keyword: string = data['keyword'];
      let industry: string[] = data['industry']
      if (industry.length == 0) {
        industry = [];
      } else if(industry.length==2){
        industry = ['nurse', '看護','nursing', '介護', '看護師'];
      }else {
        if (industry[0] == 'nurse') {
          industry = ['nurse', '看護', '看護師'];
        } else {
          industry = ['nursing', '介護'];
        }
      }
      const offices: string[] = []
      combineData.value.forEach((docData) => {
        const name: string = docData['name'] || '';
        if (name.substring(0, keyword.length) == keyword) {
          const type: string[] = docData['industry'] || [];
          if (industry.length == 0) {
            const id: string = docData['id'] || ''
            offices.push(id)
          }
          else {
            for (const t of type) {
              if (industry.includes(t)) {
                const id: string = docData['id'] || ''
                offices.push(id)
                break;
              }
            }
          }
        }
      });
      return offices;
    }
    else {

    }
  }
  const getCFsId = (data:Client[],from:string) => {
    let conditionData = {}
    if(from=='map'){
      conditionData = mapConditionData.value;
    }
    else if(from=='area'){
      conditionData = areaConditionData.value;
    }
    const keyword: string = conditionData['keyword'] || '';
      let industry: string[] = conditionData['industry']
      if (industry.length == 0) {
        industry = [];
      } else if(industry.length==2){
        industry = ['nurse', '看護','nursing', '介護', '看護師'];
      }else {
        if (industry[0] == 'nurse') {
          industry = ['nurse', '看護', '看護師'];
        } else {
          industry = ['nursing', '介護'];
        }
      }
      const offices: string[] = []
      data.forEach((docData) => {
        const name: string = docData['name'] || '';
        if (name.substring(0, keyword.length) == keyword) {
          const type: string[] = docData['industry'] || [];
          if (industry.length == 0) {
            const id: string = docData['id'] || ''
            offices.push(id)
          }
          else {
            for (const t of type) {
              if (industry.includes(t)) {
                const id: string = docData['id'] || ''
                offices.push(id)
                break;
              }
            }
          }
        }
      });
      return offices;
  }
  const resetMap=()=>{
    mapSelected.value=false;
    mapConditionData.value={}
  }
  const resetArea=()=>{
    areaSelected.value=false;
    areaConditionData.value={};
  }
  const resetAdvanceMap = () =>{
    advanceMapCFs.value=[];
    advanceMapSelected.value = false;
  }
  const resetAdvanceArea = () =>{
    advanceAreaCFs.value=[];
    advanceAreaSelected.value = false;
  }
  return { mapSelected, areaSelected, mapConditionData, areaConditionData, advanceConditionData, advanceMapSelected, advanceMapCFs, advanceAreaSelected, advanceAreaCFs, resetMap, resetArea, resetAdvanceMap, resetAdvanceArea, getCFsId, getAdvaceCFsId }
})