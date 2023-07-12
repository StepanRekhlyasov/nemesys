import { collection, getDocs, getFirestore, query, where, DocumentData } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ConstraintsType, getFromTo } from 'src/shared/utils/utils';
import { Applicant, ApplicantFix, User } from 'src/shared/model';

export const useSAA = defineStore('saa', () => {
    const db = getFirestore();

    async function getSAAFixList(users: { [id: string]: User; }, dateRange: string | { from: string; to: string; } | null) {
        const [from, to] = getFromTo(dateRange)
        const userIDs = Object.keys(users)
        const fixRef = collection(db, 'fix');
        const userID: string[][] = []
        let tuserID: string[] = []
        for (let idx = 0; idx < userIDs.length; idx++) {
            tuserID.push(userIDs[idx])
            if (tuserID.length === 10) {
                userID.push(tuserID)
                tuserID = []
            }
        }
        if (tuserID.length > 0) {
            userID.push(tuserID)
        }
        interface fixWithApplicant extends ApplicantFix {
            applicant?: Applicant
        }
        const fixList: { [id: string]: fixWithApplicant } = {};
        for (let index = 0; index < userID.length; index++) {
            const dateConstaings: {
                fixStatus: ConstraintsType,
                inspectionStatus: ConstraintsType,
                offerStatus: ConstraintsType,
                admissionStatus: ConstraintsType,
            } = {
                fixStatus: [],
                inspectionStatus: [],
                offerStatus: [],
                admissionStatus: [],
            }
            if (from && to) {
                dateConstaings.fixStatus = [where('fixDate', '>=', from), where('fixDate', '<=', to)]
                dateConstaings.inspectionStatus = [where('inspectionDate', '>=', from), where('inspectionDate', '<=', to)]
                dateConstaings.offerStatus = [where('offerDate', '>=', from), where('offerDate', '<=', to)]
                dateConstaings.admissionStatus = [where('admissionDate', '>=', from), where('admissionDate', '<=', to)]
            }
            const qFix = query(fixRef, where('chargeOfFix', 'in', userID[index]), where('fixStatus', '==', true), ...dateConstaings['fixStatus'])
            const qInspection = query(fixRef, where('chargeOfInspection', 'in', userID[index]), where('inspectionStatus', '==', true), ...dateConstaings['inspectionStatus'])
            const qOffer = query(fixRef, where('chargeOfOffer', 'in', userID[index]), where('offerStatus', '==', true), ...dateConstaings['offerStatus'])
            const qAdmission = query(fixRef, where('chargeOfAdmission', 'in', userID[index]), where('admissionStatus', '==', true), ...dateConstaings['admissionStatus'])


            const [admissionQuerySnapshot, offerQuerySnapshot, inspectionQuerySnapshot, fixQuerySnapshot] = await Promise.all([
                getDocs(qFix),
                getDocs(qInspection),
                getDocs(qOffer),
                getDocs(qAdmission)
            ]);
            const admissionFixes = admissionQuerySnapshot.docs.map((row) => { return { ...row.data() as ApplicantFix, id: row.id } });
            const offerFixes = offerQuerySnapshot.docs.map((row) => { return { ...row.data() as ApplicantFix, id: row.id } });
            const inspectionFixes = inspectionQuerySnapshot.docs.map((row) => { return { ...row.data() as ApplicantFix, id: row.id } });
            const fixFixes = fixQuerySnapshot.docs.map((row) => { return { ...row.data() as ApplicantFix, id: row.id } });
            const list = [...admissionFixes, ...offerFixes, ...inspectionFixes, ...fixFixes]
            const applicantIds: string[][] = []
            let tempapplicantIds: string[] = [];
            list.forEach(async (fix) => {
                fixList[fix.id] = fix
                tempapplicantIds.push(fix.applicant_id)
                if (tempapplicantIds.length === 10) {
                    applicantIds.push(tempapplicantIds)
                    tempapplicantIds = []
                }
            })
            if (tempapplicantIds.length > 0) {
                applicantIds.push(tempapplicantIds)
            }
            for (let idx = 0; idx < applicantIds.length; idx++) {
                const applicantRef = collection(db, 'applicants')
                const applicantQuery = query(applicantRef, where('id', 'in', applicantIds[idx]))
                const applicantSnapshot = await getDocs(applicantQuery)
                const applicantList: { [id: string]: Applicant } = {};
                applicantSnapshot.docs.forEach((row) => {
                    applicantList[row.id] = row.data() as Applicant
                })
                for (const fix of Object.values(fixList)) {
                    fix.applicant = applicantList[fix.applicant_id]
                }
            }
        }
        return Object.values(fixList);
    }
    async function getSAAFaxList(dateRange: string | { from: string; to: string; } | null) {
        const faxRef = collection(db, 'fax')
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const faxQuery = query(faxRef, ...constraints)
        const faxSnapshot = await getDocs(faxQuery)
        const faxList: DocumentData[] = []
        faxSnapshot.docs.map((row) => { faxList.push({ ...row.data(), id: row.id }) })
        return faxList
    }
    async function getSAACallList(dateRange: string | { from: string; to: string; } | null) {
        const callRef = collection(db, 'teleAppointment');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const callQuery = query(callRef, ...constraints)
        const callSnapshot = await getDocs(callQuery)
        const callList: DocumentData[] = []
        callSnapshot.docs.map((row) => { callList.push({ ...row.data(), id: row.id }) })
        return callList
    }
    return {
        getSAAFixList,
        getSAAFaxList,
        getSAACallList,
    }
})
