import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { Client } from 'src/shared/model';
import { collection, getFirestore, Timestamp, getDocs, collectionGroup, where, query } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';
import { useClientFactory } from 'src/stores/clientFactory';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useIndsutry } from 'src/stores/industry';
const industryStore = useIndsutry();
const { industries } = storeToRefs(industryStore);
export const getBackOrderData = () => {
    return{
        client_name: '',
        industry: [],
        facilityType: {},
        basic_contract_signed: false,
        avail_job_postings: false,
        status: [],
        dispatchRecord: {
            'postingStartDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'postingEndDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'quantity': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
        },
        referralResults: {
            'postingStartDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'postingEndDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'quantity': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
        },
        dispatchedOtherCompanies: {
            'postingStartDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'postingEndDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'quantity': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
        },
        otherCompanyReferralResults: {
            'postingStartDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'postingEndDate': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
            'quantity': { 'numBOs': '', 'numFixResults': '', 'jobSearchResults': '', 'numJobOffers': '', 'hiringRecord': '' },
        },
        numFullTimeEmployees: '',
        numPartTimeEmployees: '',
        numTempEmployees: '',
        route: []
    }
};
export const useAdvanceSearch = defineStore('advanceSearch', () => {
    const db = getFirestore();
    const organizationStore = useOrganization();
    const clientFactoryStore = useClientFactory();
    const router = useRouter();
    const currentOrganizationId = ref(organizationStore.currentOrganizationId)
    watch(() => organizationStore.state.userAndBranchesUpdated, () => {
        currentOrganizationId.value = organizationStore.currentOrganizationId
    })
    const mapCSelected = ref(false);
    const areaCSelected = ref(false);
    const mapConditionData = ref(getBackOrderData());
    const areaConditionData = ref(getBackOrderData());

    const advanceConditionData = ref(getBackOrderData());
    const advanceMapSelected = ref(false);
    const advanceAreaSelected = ref(false);
    const advanceMapCFs = ref<Client[]>([]);
    const advanceAreaCFs = ref<Client[]>([]);

    const saveConditionData = ref(getBackOrderData())

    const getCombineId = () => {
        const combineData: string[] = [];
        if (advanceMapSelected.value && advanceAreaSelected.value) {
            const idsSet1 = new Set(advanceMapCFs.value.map(element => element['id']));
            const idsSet2 = new Set(advanceAreaCFs.value.map(element => element['id']));
            const commonIds = [...idsSet1].filter(id => idsSet2.has(id));
            commonIds.forEach((id) => {
                combineData.push(id || '')
            })
        }
        else if (advanceMapSelected.value) {
            advanceMapCFs.value.forEach((data) => {
                const id: string = data['id'] || '';
                combineData.push(id)
            })
        }
        else {
            advanceAreaCFs.value.forEach((data) => {
                const id: string = data['id'] || '';
                combineData.push(id)
            })
        }
        return combineData;
    }
    const convertDate = (date: string) => {
        return Timestamp.fromDate(new Date(date));
    }
    const getDate = (backOrderData, recordType: string) => {
        const start = backOrderData[recordType]['postingStartDate']['numBOs']
        const sd1 = backOrderData[recordType]['postingStartDate']['numFixResults']
        const sd2 = backOrderData[recordType]['postingStartDate']['jobSearchResults']
        const sd3 = backOrderData[recordType]['postingStartDate']['numJobOffers']
        const sd4 = backOrderData[recordType]['postingStartDate']['hiringRecord']
        const end = backOrderData[recordType]['postingEndDate']['numBOs']
        const ed1 = backOrderData[recordType]['postingEndDate']['numFixResults']
        const ed2 = backOrderData[recordType]['postingEndDate']['jobSearchResults']
        const ed3 = backOrderData[recordType]['postingEndDate']['numJobOffers']
        const ed4 = backOrderData[recordType]['postingEndDate']['hiringRecord']
        const qty = parseInt(backOrderData[recordType]['quantity']['numBOs']) | 0;
        const qty1 = parseInt(backOrderData[recordType]['quantity']['numFixResults']) | 0
        const qty2 = parseInt(backOrderData[recordType]['quantity']['jobSearchResults']) | 0
        const qty3 = parseInt(backOrderData[recordType]['quantity']['numJobOffers']) | 0
        const qty4 = parseInt(backOrderData[recordType]['quantity']['hiringRecord']) | 0
        if ((start === '' && sd1 === '' && sd2 === '' && sd3 === '' && sd4 === '')
            && (end === '' && ed1 === '' && ed2 === '' && ed3 === '' && ed4 === '')
            && (qty === 0 && qty1 === 0 && qty2 === 0 && qty3 === 0 && qty4 === 0)) {
            return { 'status': false };
        }
        else {
            return {
                'status': true, 'date': [[start, end, qty], {
                    'fixDate': [sd1, ed1, qty1],
                    'inspectionDate': [sd2, ed2, qty2],
                    'offerDate': [sd3, ed3, qty3],
                    'admissionDate': [sd4, ed4, qty4]
                }]
            }
        }
    }
    const getEmploymentStatus = (backOrderData) => {
        const empTypeStaus = {}
        const fullTime = backOrderData['numFullTimeEmployees'];
        if (fullTime !== '' && fullTime !== '0') {
            empTypeStaus['fullTime'] = parseInt(fullTime) | 0;
        }
        const partTime = backOrderData['numPartTimeEmployees'];
        if (partTime !== '' && partTime !== '0') {
            empTypeStaus['partTime'] = parseInt(partTime) | 0;
        }
        const partTimeEmployee = backOrderData['numTempEmployees']
        if (partTimeEmployee !== '' && partTimeEmployee !== '0') {
            empTypeStaus['partTimeEmployee'] = parseInt(partTimeEmployee) | 0;
        }
        if (Object.keys(empTypeStaus).length === 0) {
            return { 'status': false, 'empTypeStatus': empTypeStaus }
        }
        else {
            return { 'status': true, 'empTypeStatus': empTypeStaus }
        }
    }
    const interSectionOfArray = (arr1: string[], arr2: string[]) => {
        return arr1.filter(element => arr2.includes(element));
    }
    const getKeywordData = async (officeData: string[], keyword: string, industry: string[], facilityType: string[]) => {
        const cfSnapshot = await getDocs(collectionGroup(db, 'client-factory'));
        const office: string[] = [];
        cfSnapshot.docs.forEach((doc) => {
            if (officeData.includes(doc.id)) {
                const name: string = doc.data()['name'] || '';
                const regex = new RegExp(keyword.split('').join('.*'), 'i');
                if (regex.test(name)) {
                    const type: string[] = doc.data()['industry'] || [];
                    if (industry.length == 0) {
                        const id: string = doc.id
                        office.push(id)
                    }
                    else {
                        for (const t of type) {
                            if (industry.includes(t)) {
                                const id: string = doc.id
                                if (facilityType.length > 0) {
                                    if (interSectionOfArray(facilityType, doc.data()['facilityType'] || []).length > 0) {
                                        office.push(id)
                                    }
                                }
                                else {
                                    office.push(id)
                                }
                                break;
                            }
                        }
                    }
                }
            }
        })
        return office;
    }
    const getEmpData = async (officeData: string[], employmentType: string, qty: number) => {
        const boSnapshot = await getDocs(collection(db, 'BO'));
        const fixSnapshot = await getDocs(collection(db, 'fix'));
        const offices: string[] = []
        for (const item of officeData) {
            const array: string[] = []

            boSnapshot.docs.forEach(
                (doc) => {
                    if (doc.data()['office_id'] === item
                        && doc.data()['organizationId'] === currentOrganizationId.value
                        && (doc.data()['employmentType'] && doc.data()['employmentType'].includes(employmentType))) {
                        array.push(doc.id)
                    }
                }
            )
            let count = 0;
            array.forEach((id) => {
                fixSnapshot.docs.forEach(
                    (doc) => {
                        if (doc.data()['backOrder'] === id
                            && doc.data()['admissionStatus'] === true) {
                            count++;
                        }
                    }
                )
            })
            if (count >= qty) {
                if (!offices.includes(item)) offices.push(item);
            }
        }
        return offices
    }
    const getOffices = async (officeData, dates, type: string, currentOrganization: boolean) => {
        const boSnapshot = await getDocs(collection(db, 'BO'));
        const fixSnapshot = await getDocs(collection(db, 'fix'));
        const [[start, end, qty], otherDate] = dates;
        let offices: string[] = []
        for (const item of officeData) {
            let count = 0
            boSnapshot.docs.forEach(
                (doc) => {
                    if ((doc.data()['office_id'] === item)
                        && (start === '' || doc.data()['dateOfRegistration'] >= convertDate(start))
                        && (end === '' || doc.data()['dateOfRegistration'] < convertDate(end))
                        && doc.data()['type'] === type
                        && ((currentOrganization && doc.data()['organizationId'] === currentOrganizationId.value)
                            || (!currentOrganization && doc.data()['organizationId'] !== currentOrganizationId.value))) {
                        count++;
                    }
                })
            if (count > qty) {
                if (!offices.includes(item)) { offices.push(item) };
            }
        }
        officeData = interSectionOfArray(officeData, offices)
        offices = []
        Object.keys(otherDate).forEach((key) => {
            const [oStart, oEnd, oQty] = otherDate[key]
            if (oStart !== '' || oEnd !== '' || oQty !== 0) {
                for (const item of officeData) {
                    const array: string[] = []
                    boSnapshot.docs.forEach(
                        (doc) => {
                            if (doc.data()['office_id'] === item
                                && (start === '' || doc.data()['dateOfRegistration'] >= convertDate(start))
                                && (end === '' || doc.data()['dateOfRegistration'] < convertDate(end))
                                && doc.data()['type'] === type
                                && ((currentOrganization && doc.data()['organizationId'] === currentOrganizationId.value)
                                    || (!currentOrganization && doc.data()['organizationId'] !== currentOrganizationId.value))) {
                                array.push(doc.id)
                            }
                        }
                    )
                    let count = 0;
                    array.forEach((id) => {
                        fixSnapshot.docs.forEach(
                            (doc) => {
                                if (doc.data()['backOrder'] === id) {
                                    if ((oStart === '' || doc.data()[key] >= convertDate(oStart))
                                        && (oEnd === '' || doc.data()[key] < convertDate(oEnd))
                                    ) {
                                        count++;
                                    }
                                }
                            }
                        )
                    })
                    if (count > oQty) {
                        if (!offices.includes(item)) offices.push(item);
                    }
                }
                officeData = interSectionOfArray(officeData, offices)
                offices = []
            }
        })
        return officeData;
    };

    const getTeleAppointmentData = async (constraint: string[]) => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 2);
        const prevDate = convertDate(currentDate.toString())
        const offices: string[] = []
        const teleAppointmentSnapshot = await getDocs(
            query(
                collectionGroup(db,'teleAppointments'),
                where('deleted','==',false),
                where('created_at','>=',prevDate),
                where('organizationId','==',currentOrganizationId.value),
            )
        );
        const notConnectedId:string[] = [];
        teleAppointmentSnapshot.docs.forEach((doc)=>{
            const item = doc.data()['officeId']
            if (constraint.length === 3 || constraint.includes('exist')) {
                if (!offices.includes(item)) { offices.push(item) }
            }
            else if (constraint.length === 2) {
                if (['connected', 'notConnected'].includes(doc.data()['result'])) {
                    if (!offices.includes(item)) { offices.push(item) }
                }
            }
            else {
                if (constraint.includes(doc.data()['result'])) {
                    if (!offices.includes(item)) { offices.push(item) }
                }
                if(doc.data()['result']==='connected'){
                    if (!notConnectedId.includes(item)) { notConnectedId.push(item) }
                }
            }
        })
        if(constraint.length===1 && constraint.includes('notConnected')){
            const office = offices.filter(id=>{if(!notConnectedId.includes(id)){return id}})
            return office;
        }
        return offices;
    };
    const getCFsId = async () => {
        const office: string[] = []
        const cfSnapshot = await getDocs(collectionGroup(db, 'client-factory'));
        cfSnapshot.docs.forEach((doc) => {
            office.push(doc.id)
        })
        return office;
    }
    const searchClients = async (office, from) => {
        let backOrderData = getBackOrderData();
        if (from === 'advance') {
            backOrderData = advanceConditionData.value
        }
        else if (from === 'area') {
            backOrderData = areaConditionData.value
        }
        else if (from === 'map') {
            backOrderData = mapConditionData.value
        }
        else if (from === 'saveCondition') {
            backOrderData = saveConditionData.value
        }
        const dispatchRecordStatus = getDate(backOrderData, 'dispatchRecord')
        const referralResultsStatus = getDate(backOrderData, 'referralResults')
        const dispatchedOtherCompaniesStatus = getDate(backOrderData, 'dispatchedOtherCompanies')
        const otherCompanyReferralResultsStatus = getDate(backOrderData, 'otherCompanyReferralResults')
        const employmentStatus = getEmploymentStatus(backOrderData);
        if (backOrderData['client_name'] !== ''
            || backOrderData['industry'].length > 0) {
                const facilityType:string[]=[];
                for(const key of Object.keys(backOrderData['facilityType'])){
                    facilityType.push(...backOrderData['facilityType'][key])
                }
                const industry:string[]=[];
                backOrderData['industry'].forEach((id)=>{
                    for(const ind of industries.value){
                        if(ind.id == id){
                            industry.push(ind.industryName)
                        }
                    }
                })
            office = interSectionOfArray(office, await getKeywordData(office, backOrderData['client_name'], industry, facilityType))
        }
        if (dispatchRecordStatus.status) {
            office = interSectionOfArray(office, await getOffices(office, dispatchRecordStatus.date, 'dispatch', true))
        }
        if (referralResultsStatus.status) {
            office = interSectionOfArray(office, await getOffices(office, referralResultsStatus.date, 'referral', true))
        }
        if (dispatchedOtherCompaniesStatus.status) {
            office = interSectionOfArray(office, await getOffices(office, dispatchedOtherCompaniesStatus.date, 'dispatch', false))
        }
        if (otherCompanyReferralResultsStatus.status) {
            office = interSectionOfArray(office, await getOffices(office, otherCompanyReferralResultsStatus.date, 'referral', false))
        }
        if (employmentStatus.status) {
            for (const key of Object.keys(employmentStatus.empTypeStatus || {})) {
                const qty = employmentStatus['empTypeStatus'][key];
                if (qty > 0) {
                    office = interSectionOfArray(office, await getEmpData(office, key, qty))
                }
            }
        }
        if (backOrderData['route'].length !== 0) {
            office = interSectionOfArray(office, await getTeleAppointmentData(backOrderData['route']));
        }
        clientFactoryStore.condition = true
        clientFactoryStore.selectedCFsId = office
        router.push('/client-factories')
    }
    const resetAdvance = () => {
        advanceConditionData.value = getBackOrderData();
    }
    const resetMap = () => {
        mapCSelected.value = false;
        mapConditionData.value = getBackOrderData()
    }
    const resetArea = () => {
        areaCSelected.value = false;
        areaConditionData.value = getBackOrderData();
    }
    const resetAdvanceMap = () => {
        advanceMapCFs.value = [];
        advanceMapSelected.value = false;
    }
    const resetAdvanceArea = () => {
        advanceAreaCFs.value = [];
        advanceAreaSelected.value = false;
    }
    return { getCFsId, getCombineId, searchClients, mapCSelected, areaCSelected, advanceConditionData, mapConditionData, areaConditionData, saveConditionData, advanceMapSelected, advanceMapCFs, advanceAreaSelected, advanceAreaCFs,resetAdvance, resetMap, resetArea, resetAdvanceMap, resetAdvanceArea }
})