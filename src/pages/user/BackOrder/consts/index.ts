import { defineStore } from 'pinia';
import {ref} from 'vue';

export const useBO = defineStore('BO', () => {

  function getDistance(loc1, loc2){
    const R = 6371;
    const dLat = degToRad(loc2.lat - loc1.lat);
    const dLon = degToRad(loc2.lon - loc1.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(loc1.lat)) *
        Math.cos(degToRad(loc2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Number(distance.toFixed(2));
  };

  const degToRad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

function matchData(staff,bo){
  const qualification = ref<number>(0);
  const occupation = ref<number>(0);
  const classification = ref<number>(0);
  const daysToWork = ref<number>(0);
  const daysPerWeek = ref<number>(0);
  const agePercent = ref<number>(0);
  const expReq = ref<number>(0);

  //qualification percentage
  staff.qualification?.forEach((q)=>{
    if(bo.qualifications.toLowerCase()===q.toLowerCase()){
      qualification.value = 1
    }
  })

  //Experience required
  if(Number(staff.totalYear) && Number(bo.experience_req)){
    if(staff.totalYear>=bo.experience_req){
      expReq.value = 1
    }
    else{
      expReq.value = staff.totalYear/bo.experience_req;
    }
  }

  //caseType
  if(bo.caseType && (staff.occupation?.toLowerCase() === bo.caseType?.toLowerCase())){
    occupation.value = 1
  }

  //classification
  if(bo.transactionType && (staff.classification?.toLowerCase() === bo.transactionType?.toLowerCase())){
    classification.value = 1
  }

  //daysToWork
  if(bo.numberWorkingDays && staff.daysToWork){
    const days = stringToNumber(bo.numberWorkingDays)
    if(days && days <= (staff.daysToWork)){
      daysToWork.value = 1;
    }
    else if(days){
      daysToWork.value = staff.daysToWork/days
    }
  }

  //workingDaysWeek
  if(bo.working_days_week && staff.daysPerWeek){
    let matchingDays = 0
    staff.daysPerWeek.forEach((daySatff)=>{
      bo.working_days_week.forEach((dayClient)=>{
        if(dayClient === daySatff){
          matchingDays++;
        }
      })
    })
    if(bo.working_days_week.length){
      daysPerWeek.value = matchingDays/bo.working_days_week.length
    }
  }

  //age
  if(bo.ageLimit && staff.dob){
    const currentDate = new Date();
    const dob = new Date(staff.dob.seconds*1000);
    let age = currentDate.getFullYear() - dob.getFullYear();
    if (currentDate.getMonth() < dob.getMonth() ||(currentDate.getMonth() === dob.getMonth() &&currentDate.getDate() < dob.getDate())){
      age--;
    }
    agePercent.value = age<=bo.ageLimit?1:bo.ageLimit/age;
  }
  const matchPercent = ((agePercent.value+qualification.value+occupation.value+classification.value+daysPerWeek.value+daysToWork.value+expReq.value)/7)*100
  staff.matchDegree = Number(matchPercent.toFixed(2));
}

const stringToNumber = (num: string): number | undefined => {
  const numberMap: { [key: string]: number } = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    // Add more mappings as needed
  };

  return numberMap[num];
};

  return {getDistance, matchData}
})
