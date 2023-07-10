import { collection, getDocs, getFirestore, query, Timestamp, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ConstraintsType, dateToTimestampFormat } from 'src/shared/utils/utils';

export const useSAA = defineStore('saa', () => {
    const db = getFirestore();
    function getFromTo(dateRange: string | { from: string; to: string; } | null) {
        let to: Timestamp | undefined, from: Timestamp | undefined

        if (dateRange) {
            if (typeof dateRange === 'string') {
                const fromDate = new Date(dateRange)
                const toDate = new Date(new Date(dateRange).setHours(23, 59, 59, 999))
                from = dateToTimestampFormat(fromDate)
                to = dateToTimestampFormat(toDate)
            } else if (dateRange.from && dateRange.to) {
                const fromDate = new Date(dateRange.from)
                const toDate = new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
                from = dateToTimestampFormat(fromDate)
                to = dateToTimestampFormat(toDate)
            }
        }
        return [from, to]
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
        const faxId: string[] = []
        faxSnapshot.docs.map((row) => { faxId.push(row.data()['created_by']) })
        return faxId
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
        const callId: string[] = []
        callSnapshot.docs.map((row) => { callId.push(row.data()['created_by']) })
        return callId
    }
    async function getSAABOReferralList(dateRange: string | { from: string; to: string; } | null) {
        const BORef = collection(db, 'BO');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const BOquery = query(BORef, where('type', '==', 'referral'), ...constraints)
        const BOSnapshot = await getDocs(BOquery)
        const BOId: string[] = []
        BOSnapshot.docs.map((row) => { BOId.push(row.data()['registrant']) })
        return BOId
    }
    async function getSAABODispatchList(dateRange: string | { from: string; to: string; } | null) {
        const BORef = collection(db, 'BO');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const BOquery = query(BORef, where('type', '==', 'dispatch'), ...constraints)
        const BOSnapshot = await getDocs(BOquery)
        const BOId: string[] = []
        BOSnapshot.docs.map((row) => { BOId.push(row.data()['registrant']) })
        return BOId
    }
    async function getSAABOTTPList(dateRange: string | { from: string; to: string; } | null) {
        const BORef = collection(db, 'BO');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const BOquery = query(BORef, where('type', '==', 'TTP'), ...constraints)
        const BOSnapshot = await getDocs(BOquery)
        const BOId: string[] = []
        BOSnapshot.docs.map((row) => { BOId.push(row.data()['registrant']) })
        return BOId
    }
    async function getSAABONList(dateRange: string | { from: string; to: string; } | null) {
        const BORef = collection(db, 'BO');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const BOquery = query(BORef, where('typeCase', '==', 'nurse'), ...constraints)
        const BOSnapshot = await getDocs(BOquery)
        const BOId: string[] = []
        BOSnapshot.docs.map((row) => { BOId.push(row.data()['registrant']) })
        return BOId
    }
    async function getSAABONCList(dateRange: string | { from: string; to: string; } | null) {
        const BORef = collection(db, 'BO');
        const [from, to] = getFromTo(dateRange)
        let constraints: ConstraintsType = []
        if (from && to) {
            constraints = [where('created_at', '>=', from), where('created_at', '<=', to)]
        }
        const BOquery = query(BORef, where('typeCase', '==', 'nursingCare'), ...constraints)
        const BOSnapshot = await getDocs(BOquery)
        const BOId: string[] = []
        BOSnapshot.docs.map((row) => { BOId.push(row.data()['registrant']) })
        return BOId
    }
    return {
        getSAAFaxList,
        getSAACallList,
        getSAABODispatchList,
        getSAABOReferralList,
        getSAABONCList,
        getSAABONList,
        getSAABOTTPList
    }
})
