import { collection, doc, endAt, getDoc, getDocs, getFirestore, orderBy, PartialWithFieldValue, query, startAt, updateDoc, where ,getCountFromServer } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Applicant, ApplicantFix, User, UserPermissionNames } from 'src/shared/model';
import { ConstraintsType, dateToTimestampFormat } from 'src/shared/utils/utils';
import { i18n } from 'boot/i18n';
import { adminRolesIds, ADMIN_ORGANIZATION_CODE } from 'src/components/handlers/consts';
import { useOrganization } from './organization';
import { useRole } from './role';
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
const { t } = i18n.global

interface userStore {
  currentUser?: User
}

export const useUserStore = defineStore('user', () => {
  const db = getFirestore();
  const roleStore = useRole();
  const auth = getAuth();
  const state = ref<userStore>({})

  async function getCurrentUser(){
    let user: User | undefined = undefined;
    if (auth.currentUser?.uid) {
      user = await getUserById(auth.currentUser.uid)
      state.value.currentUser = user;
    }
  }

  async function getAllUsers(active_organization_id?: string, queryText?: string) {
    const constraints: ConstraintsType = [
      where('deleted', '==', false),
      orderBy('displayName'),
    ]

    if (active_organization_id) {
      constraints.push(where('organization_ids', 'array-contains', active_organization_id))
    }

    if (queryText) {
      constraints.push(startAt(queryText || ''), endAt(queryText + '\uf8ff'),)
    }


    const usersData = await getDocs(query(
      collection(db, 'users'),
      ...constraints
    ))

    const users: User[] = []

    usersData.forEach((user) => {
      if (user.exists()) {
        users.push(user.data() as User)
        users[users.length - 1].id = user.id

      }
    })

    return users
  }

  async function getNumberOfUsers(organizationId?: string) {
    const filters =
      !organizationId
        ? [where('deleted', '==', false)]
        : [where('organization_ids', 'array-contains', organizationId),where('deleted', '==', false)];
    const numOfUsers =  (
      await getCountFromServer(query(collection(db, 'users'), ...filters))
    ).data().count;
    return numOfUsers
  }


  async function getUserById(id: string) {

    const docRef = doc(db, 'users', id)

    const userSnap = await getDoc(docRef)

    if (userSnap.exists()) {
      return userSnap.data() as User
    }

  }

  async function editUser(id: string, user: PartialWithFieldValue<User>) {
    const userRef = doc(db, 'users/' + id);
    await updateDoc(userRef, {
      ...user
    })
  }

  async function checkUserAffiliation(organizationCode: string, userId: string) {
    const user = await getUserById(userId)

    if(!user){
      throw new Error(t('common.userNotFound'))
    }

    if (adminRolesIds.includes(user.role)) {
      if (organizationCode == ADMIN_ORGANIZATION_CODE) {
        return true
      }
      return false
    }

    const organizationRef = collection(db, 'organization/')
    const organizationQuery = query(organizationRef, where('code', '==', organizationCode))

    const querySnapshot = await getDocs(organizationQuery)

    if (querySnapshot.size > 1) {
      throw new Error(t('menu.admin.organizationsTable.codeNotUnique'))
    }

    if (querySnapshot.size == 0) {
      return false
    }

    const organizationId = querySnapshot.docs[0].data().id

    if (!user.organization_ids) {
      return false
    }

    return user.organization_ids.includes(organizationId)

  }

  async function searchUsers(searchText: string) {
    const usersQuery = query(collection(db, 'users'), orderBy('displayName'), startAt(searchText), endAt(searchText + '\uf8ff'))

    const usersDocs = await getDocs(usersQuery);

    return usersDocs.docs.map((organization) => {
      return organization.data() as User
    })


  }

  const getAllUsersInBranch = async (branch_id: string) => {
    const db = getFirestore();
    const user_list: { id: string; name: string }[] = [];
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where('branch_id', '==', branch_id));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      user_list.push({ id: doc.id, name: doc.data().displayName });
    });
    return user_list;
  };

  const getUsersByConstrains = async (constraints?: ConstraintsType) => {
    const organization = useOrganization()
    if(!constraints){
      constraints = [where('deleted', '==', false), where('organization_ids', 'array-contains', organization.currentOrganizationId)]
    }
    const usersData = await getDocs(query(
      collection(db, 'users'),
      ...constraints
    ))
    const users: User[] = []
    usersData.forEach((user) => {
      if (user.exists()) {
        users.push(user.data() as User)
        users[users.length - 1].id = user.id
      }
    })
    return users
  }


  async function getUsersByPermission( permission: UserPermissionNames, queryText?: string, active_organization_id?: string,) {
    const roles = await roleStore.getAllRoles()
    const roleIds: string[] = [];

    roles.forEach((role) => {
      if (role.permission?.includes(permission)) {
        roleIds.push(role.id);
      }
    })

    if (!roleIds.length) {
      return;
    }

    const constraints: ConstraintsType = [where('deleted', '==', false), where('role', 'in', roleIds), orderBy('displayName')]

    if (active_organization_id) {
      constraints.push(where('organization_ids', 'array-contains', active_organization_id))
    }

    if (queryText) {
      constraints.push(startAt(queryText), endAt(queryText + '\uf8ff'),)
    }

    const users =  await getDocs(query(
      collection(db, 'users'),
      ...constraints,
    ))
    return users.docs.map((user)=>{
      return {...user.data(), id: user.id} as User
    })
  }

  async function getSAAFixList(users : { [id: string]: User; }, dateRange : string | { from: string; to: string; } | null){
    let to : Timestamp | undefined, from: Timestamp | undefined

    if(dateRange){
      if(typeof dateRange === 'string'){
        const fromDate = new Date(dateRange)
        const toDate = new Date(new Date(dateRange).setHours(23, 59, 59, 999))
        from = dateToTimestampFormat(fromDate)
        to = dateToTimestampFormat(toDate)
      } else if (dateRange.from && dateRange.to){
        const fromDate = new Date(dateRange.from)
        const toDate = new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))
        from = dateToTimestampFormat(fromDate)
        to = dateToTimestampFormat(toDate)
      }
    }
    const userIDs = Object.keys(users)
    const fixRef = collection(db, 'fix');

    const dateConstaings : {
      fixStatus : ConstraintsType,
      inspectionStatus : ConstraintsType,
      offerStatus : ConstraintsType,
      admissionStatus : ConstraintsType,
    } = {
      fixStatus : [],
      inspectionStatus : [],
      offerStatus : [],
      admissionStatus : [],
    }
    if(from && to){
      dateConstaings.fixStatus = [where('fixDate', '>=', from), where('fixDate', '<=', to)]
      dateConstaings.inspectionStatus = [where('inspectionDate', '>=', from), where('inspectionDate', '<=', to)]
      dateConstaings.offerStatus = [where('offerDate', '>=', from), where('offerDate', '<=', to)]
      dateConstaings.admissionStatus = [where('admissionDate', '>=', from), where('admissionDate', '<=', to)]
    }
    const qFix = query(fixRef, where('chargeOfFix', 'in', userIDs), where('fixStatus', '==', true), ...dateConstaings['fixStatus'])
    const qInspection = query(fixRef, where('chargeOfInspection', 'in', userIDs), where('inspectionStatus', '==', true), ...dateConstaings['inspectionStatus'])
    const qOffer = query(fixRef, where('chargeOfOffer', 'in', userIDs), where('offerStatus', '==', true), ...dateConstaings['offerStatus'])
    const qAdmission = query(fixRef, where('chargeOfAdmission', 'in', userIDs), where('admissionStatus', '==', true), ...dateConstaings['admissionStatus'])


    const [admissionQuerySnapshot, offerQuerySnapshot, inspectionQuerySnapshot, fixQuerySnapshot] = await Promise.all([
      getDocs(qFix),
      getDocs(qInspection),
      getDocs(qOffer),
      getDocs(qAdmission)
    ]);
    const admissionFixes = admissionQuerySnapshot.docs.map((row)=>{ return {...row.data() as ApplicantFix, id: row.id} });
    const offerFixes = offerQuerySnapshot.docs.map((row)=>{ return {...row.data() as ApplicantFix, id: row.id} });
    const inspectionFixes = inspectionQuerySnapshot.docs.map((row)=>{ return {...row.data() as ApplicantFix, id: row.id} });
    const fixFixes = fixQuerySnapshot.docs.map((row)=>{ return {...row.data() as ApplicantFix, id: row.id} });

    interface fixWithApplicant extends ApplicantFix {
      applicant? : Applicant
    }
    const list = [...admissionFixes, ...offerFixes, ...inspectionFixes, ...fixFixes]
    const fixList : { [id: string]: fixWithApplicant } = {};
    const applicantIds : string[] = []
    list.forEach(async (fix)=>{
      fixList[fix.id] = fix
      applicantIds.push(fix.applicant_id)
    })
    if(applicantIds.length){
      const applicantRef = collection(db, 'applicants')
      const applicantQuery = query(applicantRef, where('id', 'in', applicantIds))
      const applicantSnapshot = await getDocs(applicantQuery)
      const applicantList : { [id: string]: Applicant } = {};
      applicantSnapshot.docs.forEach((row)=>{
        applicantList[row.id] = row.data() as Applicant
      })
      for(const fix of Object.values(fixList)){
        fix.applicant = applicantList[fix.applicant_id]
      }
    }
    return Object.values(fixList);
  }

  return {
    state,
    getCurrentUser,
    getAllUsers,
    getUserById,
    editUser,
    checkUserAffiliation,
    searchUsers,
    getAllUsersInBranch,
    getUsersByConstrains,
    getUsersByPermission,
    getNumberOfUsers,
    getSAAFixList
  }
})
