import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType } from './utils';

export const getApplicantContactsList = (db: Firestore, applicant_id: string) => {
  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/contacts'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}


export const getClientList = (db: Firestore, options?: {
  active_organization_id?: string;
}) => {

  const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('name')]
  if (options && options.active_organization_id) {
    constraints.push(where('organization', '==', options.active_organization_id))
  }
  return getDocs(query(
    collection(db, 'clients'),
    ...constraints
  ))
}

export const getClientOfficeList = (db: Firestore, client_id: string) => {
  return getDocs(query(
    collection(db, 'clients/'+client_id+'/office'),
    where('deleted', '==', false),
    orderBy('name')
  ))
}

export interface FixOption {
  operationFilter?: boolean;
}

export const countRank = (applicant): number => {
  let count = 0
  // workable days per week
  count+= countWorkableDay(applicant)
  // workable day of the week
  count+= countWorkableDay(applicant)
  // available shift
  count+= countAvaiableShift(applicant)
  // commuting Time
  count+= countCommutingTime(applicant)

  // attracting qualification
  count+= countQualification(applicant)
  // total year
  if (applicant['totalYear'] < 1) {
    count+= -10
  }
  // Tattoos
  if (applicant['tattoos'] == 'yes'){
    count+= -10
  }
  // Medical History
  if (applicant['medicalHistory'] == 'yes'){
    count+= -10
  }
  if (applicant['dob']) {
    count+=countAge(applicant)
  }
  return count
}

export const countCommutingTime = (applicant):number => {
  if (applicant['commutingTime'] < 15){
    return 0;
  }
  if (applicant['commutingTime'] < 30){
    return 2;
  }
  if (applicant['commutingTime'] < 45){
    return 4;
  }
  if (applicant['commutingTime'] < 90){
    return 8;
  }
  return 10  
}

export const countAvaiableShift = (applicant):number => {  
  let count = 0;
  const arrayAvailableShift = [
    applicant['workingHoursEarly'] || null,
    applicant['workingHoursDay'] || null,
    applicant['workingHoursLate'] || null,
    applicant['workingHoursNight'] || null,
  ]
  arrayAvailableShift.map(shift => {
    switch(shift){
      case (true):
        count+=5;
        break
      case (null):
        count+=2.5;
    }
  })
  return count;
}

export const countWorkableDay = (applicant):number => {
  let count = 0;
  if (applicant['daysPerWeek']) {
    applicant['daysPerWeek'].map(day => {
      switch(day) {
        case 'monday':
        case 'tuesday':
        case 'wednesday':
        case 'friday':
          count+=3;
        break;
        case 'saturday':
        case 'sunday':
          count+=7;
        break;
        case 'holiday':
          count+=6;
        break;
      }
    })
  }
  return count;
}

export const countDaysPerWeeek = (applicant):number => {
  if (applicant['daysToWork']) {
    switch(applicant['daysToWork']){
      case 3:
        return 15;
      case 4:
        return 20;
      case 5:
        return 35;
    }
  }
  return 0;
}

export const countAge = (applicant):number => {
  if (applicant['dob']) {
    const age = ageCount(applicant['dob']);
    if (age > 70) {
      return -50
    }
    if (age > 60) {
      return -40
    }
    if (age > 50) {
      return -5
    }
  }
  return 0
}

export const countQualification = (applicant):number => {
  if (applicant['qualification']) {
    if (applicant['qualification'] == 'newcomer' || applicant['qualification'] == 'careWorker') {
      return -50;
    }
  }
  return 0;
}

export const ageCount = (data: string) => {
  const now = new Date()
  let diff =(now.getTime() - new Date(data).getTime()) / 1000;
  diff /= (60 * 60 * 24);
  return Math.abs(Math.round(diff/365.25));
}

export const getRank = (rank: number) => {
  if (rank >= 90) {
    return 'S'
  }
  if (rank >= 80) {
    return 'A'
  }
  if (rank >= 60) {
    return 'B'
  }
  if (rank >= 40) {
    return 'C'
  }
  if (rank >= 20) {
    return 'D'
  }
  return 'E'
}

export const getFixList = (db: Firestore, applicant_id: string, option?: FixOption) => {
  const constraints: ConstraintsType = [where('deleted', '==', false), orderBy('created_at', 'desc')]

  if (option && option.operationFilter) {
    constraints.push(where('admissionStatus', '==', 'ok'))
  }

  return getDocs(query(
    collection(db, 'applicants/' + applicant_id + '/fix'), 
    ...constraints
  ))
}