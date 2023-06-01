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
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantProgressFilter['attendeeUserInCharge']"
            :optionToFetch="'usersInCharge'"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <MySelect 
            @update="()=>{
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
        <applicant-table 
          :status="statusParams.firestore" 
          :applicants="applicantsByColumn" 
          :loading="loading" 
          @openDrawer="(applicant : Applicant)=>detailsDrawer?.openDrawer(applicant)" 
          @sortQuery="(param : QueryOrderByConstraint)=>{
            paginationRef?.setOrder(param);
            paginationRef?.setConstraints(paginationConstraints);
            paginationRef?.queryFirstPage()
          }"
        />
        <TablePagination
          :isAdmin="false"
          ref="paginationRef"
          :pagination="pagination"
          @on-loading-state-change="(v) => loading = v"
          @on-data-update="async (newData) => {
            applicantStore.state.applicantsByColumn[statusParams.firestore] = newData
          }"
        />
      </q-scroll-area>
    </div>
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer" />
  </q-page>
</template>
<script setup lang="ts">
import { ComputedRef, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { statusStringMask } from './const/applicantStatuses'
import { useRouter } from 'vue-router';
import { useApplicant } from 'src/stores/applicant';
import { limitQuery } from './const/applicantColumns';
import applicantTable from './components/ApplicantTable.vue'
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { QueryFieldFilterConstraint, QueryOrderByConstraint, orderBy, where } from 'firebase/firestore';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import { Applicant } from 'src/shared/model';
import MySelect from 'src/components/inputs/MySelect.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';

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

/** getters */
const applicantsByColumn : ComputedRef<Applicant[]> = computed(() => applicantStore.state.applicantsByColumn[statusParams.firestore]);
const paginationConstraints = computed(()=>{
  let result = <QueryFieldFilterConstraint[]>[]
  for (const [key, value] of Object.entries(applicantStore.state.applicantProgressFilter)){
    if(value){
      result.push(where(key, '==', value))
    }
  }
  return [where('status', '==', statusParams.firestore)].concat(result)
})
const pagination = ref({
  rowsPerPage: limitQuery,
  path: 'applicants',
  order: orderBy('currentStatusTimestamp', 'asc'),
  constraints: paginationConstraints.value
});

watch(()=>applicantStore.state.applicantProgressFilter['currentStatusMonth'], (newVal, oldVal)=>{
  if(newVal!=oldVal) {
    paginationRef.value?.setConstraints(paginationConstraints.value);
    paginationRef.value?.queryFirstPage()
  }
})
</script>
<style scoped>
.pagination {
  padding: 0!important;
  margin-top: 16px;
}
</style>
