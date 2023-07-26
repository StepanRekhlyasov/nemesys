import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Client } from 'src/shared/model';
export const useAdvanceSearch = defineStore('advanceSearch', () => {
  const mapSelected = ref(false);
  const areaSelected = ref(false);
  const mapConditionData = {'keyword':'','industry':[]}
  const areaConditionData = {'keyword':'','industry':[]}
  // const getCFsId = (data: object) => {

  //   if (mapSelected.value == true || areaSelected.value == true) {
  //     combineSelected.value = true;
  //     if (mapSelected.value && areaSelected.value) {
  //       const idsSet1 = new Set(mapSelectedCFs.value.map(element => element['id']));
  //       const idsSet2 = new Set(areaSelectedCFs.value.map(element => element['id']));
  //       const commonIds = [...idsSet1].filter(id => idsSet2.has(id));
  //       combineData.value = [...mapSelectedCFs.value].filter(element => commonIds.includes(element['id']));
  //     }
  //     else if (mapSelected.value) {
  //       mapSelectedCFs.value.forEach((data) => {
  //         combineData.value.push(data)
  //       })
  //     }
  //     else {
  //       areaSelectedCFs.value.forEach((data) => {
  //         combineData.value.push(data)
  //       })
  //     }
  //     const keyword: string = data['keyword'];
  //     let industry: string[] = data['industry']
  //     if (industry.length == 0 || industry.length == 2) {
  //       industry = [];
  //     } else {
  //       if (industry[0] == 'nurse') {
  //         industry = ['nurse', '看護'];
  //       } else {
  //         industry = ['nursing', '介護'];
  //       }
  //     }
  //     const offices: string[] = []
  //     combineData.value.forEach((docData) => {
  //       const name: string = docData['name'] || '';
  //       if (name.substring(0, keyword.length) == keyword) {
  //         const type: string[] = docData['industry'] || [];
  //         if (type.length == 0 && industry.length == 0) {
  //           const id: string = docData['id'] || ''
  //           offices.push(id)
  //         }
  //         else {
  //           for (const t of type) {
  //             if (industry.includes(t)) {
  //               const id: string = docData['id'] || ''
  //               offices.push(id)
  //               break;
  //             }
  //           }
  //         }
  //       }
  //     });
  //     return offices;
  //   }
  //   else {

  //   }
  // }
  const getCFsId = (data:Client[],conditionData:{'keyword':'','industry':[]}) => {
    const keyword: string = conditionData['keyword'] || '';
      let industry: string[] = conditionData['industry']
      if (industry.length == 0) {
        industry = [];
      } else if(industry.length==2){
        industry = ['nurse', '看護','nursing', '介護'];
      }else {
        if (industry[0] == 'nurse') {
          industry = ['nurse', '看護'];
        } else {
          industry = ['nursing', '介護'];
        }
      }
      const offices: string[] = []
      data.forEach((docData) => {
        const name: string = docData['name'] || '';
        if (name.substring(0, keyword.length) == keyword) {
          const type: string[] = docData['industry'] || [];
          if (type.length == 0 && industry.length == 0) {
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
  }
  const resetArea=()=>{
    areaSelected.value=false;
  }
  return { mapSelected, areaSelected, mapConditionData, areaConditionData, resetMap, resetArea, getCFsId }
})