<template>
  <q-page v-if="statusParams">
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t(statusParams.i18n) }}</div>
    </q-card-section>
    <q-separator color="white" size="2px" />
    <q-card-section class="bg-grey-3">
      <div class="row q-pt-md q-gutter-sm">
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.branch") }}</p>
          <MySelect 
            @update="()=>{
              applicantStore.state.needsApplicantUpdateOnMounted = true
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantProgressFilter['branchIncharge']"
            :optionToFetch="'branchIncharge'"
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <MySelect 
            @update="()=>{
              applicantStore.state.needsApplicantUpdateOnMounted = true
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantProgressFilter.userInCharge"
            :optionToFetch="'usersInCharge'"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <MySelect 
            @update="()=>{
              applicantStore.state.needsApplicantUpdateOnMounted = true
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantProgressFilter['prefecture']"
            :options="prefectureList"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.month") }}</p>
          <YearMonthPicker 
            v-model="applicantStore.state.applicantProgressFilter['currentStatusMonth']" 
            height="40px" 
            width="200px" 
          />
        </div>
      </div>
    <div class="q-pt-md">
      <q-scroll-area style="height: 80vh; max-width: 90vw">
          <ApplicantTable 
            :status="statusParams.firestore" 
            :rows="applicantsForTable" 
            :loading="loading" 
            @openDrawer="(applicant : Applicant)=>detailsDrawer?.openDrawer(applicant)" 
            @sortQuery="(param)=>{
              paginationRef?.setOrder(param);
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }"
            @onLoadingStart="loading = true"
            @onLoadingEnd="loading = false"
          />
          <TablePagination
            :isAdmin="false"
            ref="paginationRef"
            :pagination="pagination"
            @on-loading-state-change="(v : boolean) => loading = v"
            @on-data-update="async (newData) => {
              applicantOrFixData = newData as Applicant[] | ApplicantFix[]
            }"
          />
      </q-scroll-area>
    </div>
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer" @statusUpdated="paginationRef?.queryFirstPage()" />
  </q-page>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { statusStringMask } from './const/applicantStatuses'
import { useRouter } from 'vue-router';
import { useApplicant } from 'src/stores/applicant';
import { limitQuery } from './const/applicantColumns';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { QueryFieldFilterConstraint, orderBy, where } from 'firebase/firestore';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import { Applicant, ApplicantFix, ApplicantStatus, ApplicantWithFix } from 'src/shared/model';
import MySelect from 'src/components/inputs/MySelect.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { useOrganization } from 'src/stores/organization';
import ApplicantTable from './components/ApplicantTable.vue';

const loading = ref(false)
const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null);
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)


/** check if status url is correct */
const route = useRoute()
const statusParams = statusStringMask[route.params.status as string]
if(!statusParams){
  const router = useRouter()
  router.push('/applicant-progress')
}

/** stores */
const applicantStore = useApplicant();
const organization = useOrganization()

/** getters */
const applicantsForTable = ref<ApplicantWithFix[]>([])
const applicantOrFixData = ref<Applicant[] | ApplicantFix[]>([])
const paginationConstraints = computed(()=>{
  let result = <QueryFieldFilterConstraint[]>[]
  for (const [key, value] of Object.entries(applicantStore.state.applicantProgressFilter)){
    if(value){
      result.push(where(key, '==', value))
    }
  }
  return [where('status', '==', statusParams.firestore), where('deleted', '==', false)].concat(result)
})

const path = [ApplicantStatus.WAIT_CONTACT, ApplicantStatus.WAIT_ATTEND, ApplicantStatus.WAIT_FIX].includes(statusParams.firestore)?'applicants':'fix'
const pagination = ref({
  rowsPerPage: limitQuery,
  path: path,
  order: orderBy('currentStatusTimestamp', 'asc'),
  constraints: paginationConstraints.value
});

watch(()=>applicantStore.state.applicantProgressFilter['currentStatusMonth'], (newVal, oldVal)=>{
  if(newVal!=oldVal) {
    applicantStore.state.needsApplicantUpdateOnMounted = true
    paginationRef.value?.setConstraints(paginationConstraints.value);
    paginationRef.value?.queryFirstPage()
  }
})
watch(()=>organization.currentOrganizationId, (newVal)=>{
  applicantStore.state.applicantProgressFilter.organizationId = newVal
  applicantStore.state.applicantProgressFilter.branchIncharge = ''
  applicantStore.state.applicantProgressFilter.userInCharge = ''
  paginationRef.value?.setConstraints(paginationConstraints.value);
  paginationRef.value?.queryFirstPage()
})
watch(()=>applicantOrFixData.value, async (newVal)=>{
  loading.value = true
  if([ApplicantStatus.WAIT_CONTACT, ApplicantStatus.WAIT_ATTEND, ApplicantStatus.WAIT_FIX].includes(statusParams.firestore as ApplicantStatus)){
    applicantsForTable.value = newVal as Applicant[]
    return
  }
  const newResult : ApplicantWithFix[] = await Promise.all((newVal as ApplicantFix[]).map(async (row)=>{
    if(applicantStore.state.applicants[row.applicant_id]){
      return {...applicantStore.state.applicants[row.applicant_id], fix: row}
    }
    return {...await applicantStore.getApplicantById(row.applicant_id), fix: row}
  }))
  applicantsForTable.value = []
  applicantsForTable.value = newResult
  loading.value = false
})
</script>
<style scoped>
.pagination {
  padding: 0!important;
  margin-top: 16px;
}
</style>
