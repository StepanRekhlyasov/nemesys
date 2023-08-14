import { collection, Firestore,  getDocs, orderBy, query, where } from 'firebase/firestore';
import { ConstraintsType, myDateFormat } from './utils';
import { Applicant } from '../model';

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

export const getClientFactoriesList = (db: Firestore, client_id: string) => {
  return getDocs(query(
    collection(db, 'clients/'+client_id+'/client-factory'),
    orderBy('name')
  ))
}

export const countApplicantRank = (applicant : Applicant) => {
  let rank = 0
  if(applicant.daysToWork){
    if(applicant.daysToWork === 3) {
      rank += 15
    }else if(applicant.daysToWork === 4) {
      rank += 20
    }else if(applicant.daysToWork >= 5) {
      rank += 35
    }
  }
  if(Array.isArray(applicant.daysPerWeek)){
    applicant.daysPerWeek.forEach((day)=>{
      if(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day)){
        rank += 3
      }
      if(['saturday', 'sunday'].includes(day)){
        rank += 7
      }
    })
  }
  if(Array.isArray(applicant.specialDay)){
    if(applicant.specialDay.length > 0){
      rank += 6
    }
  }
  [applicant.workingHoursDay, applicant.workingHoursEarly, applicant.workingHoursLate, applicant.workingHoursNight].forEach((row)=>{
    if(row === '○'){
      rank += 5
    }else if(row === '△'){
      rank += 2.5
    }else if(row === '×'){
      rank += 0
    }
  })
  if(applicant.commutingTime){
    if(applicant.commutingTime <= 15){
      rank += 0
    } else if (applicant.commutingTime <= 30){
      rank += 2
    } else if (applicant.commutingTime <= 45){
      rank += 4
    } else if (applicant.commutingTime <= 90){
      rank += 8
    } else if (applicant.commutingTime > 90){
      rank += 10
    }
  }
  if(Array.isArray(applicant.qualification) && applicant.qualification.length > 0){
    rank += 0
  } else {
    rank -= 50
  }
  if(applicant.totalMonthes && Number.isInteger(applicant.totalMonthes) && applicant.totalMonthes < 6){
    rank -= 10
  }
  if(applicant.dob){
    const age = getAge(myDateFormat(applicant.dob, 'YYYY.MM.DD'))
    if(age >= 70){
      rank -= 50
    } else if (age >= 60){
      rank -= 40
    } else if (age >= 50){
      rank -= 5
    }
  }
  if(applicant.tattoos === 'yes'){
    rank -= 10
  }
  if(applicant.isMedicalHistory){
    rank -= 10
  }
  return rank
}

function getAge(dateString : string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}
