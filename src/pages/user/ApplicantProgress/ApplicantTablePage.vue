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
            v-model="applicantStore.state.applicantFilter['branch']"
            :options="[]"
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <MySelect 
            @update="()=>{
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantFilter['attendeeUserInCharge']"
            :options="usersInChargeOptions"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <MySelect 
            @update="()=>{
              paginationRef?.setConstraints(paginationConstraints);
              paginationRef?.queryFirstPage()
            }" 
            v-model="applicantStore.state.applicantFilter['prefecture']"
            :options="prefectureList"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.month") }}</p>
          <YearMonthPicker 
            v-model="applicantStore.state.applicantFilter['currentStatusMonth']" 
            height="40px" 
            width="200px" 
          />
        </div>
      </div>
    <div class="q-pt-md">
      <q-scroll-area style="height: 80vh; max-width: 90vw">
        <applicant-table :status="statusParams.firestore" :applicants="applicantsByColumn" :loading="loading" @openDrawer="(applicant : Applicant)=>detailsDrawer?.openDrawer(applicant)" />
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
import { ComputedRef, computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { statusStringMask } from './const/applicantStatuses'
import { useRouter } from 'vue-router';
import { useApplicant } from 'src/stores/applicant';
import { useMetadata } from 'src/stores/metadata';
import { limitQuery } from './const/applicantColumns';
import applicantTable from './components/ApplicantTable.vue'
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { QueryFieldFilterConstraint, orderBy, where } from 'firebase/firestore';
import ApplicantDetails from 'src/pages/user/Applicant/ApplicantDetails.vue';
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import { Applicant } from 'src/shared/model';
import MySelect from 'src/components/inputs/MySelect.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';

const loading = ref(false)
const paginationRef = ref<InstanceType<typeof TablePagination> | null>(null);
const prefectureOptions = ref<{label: string, value: string | number}[]>([]);
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)

/** check if status url is correct */
const route = useRoute()
const statusParams = statusStringMask[route.params.status as string]
if(!statusParams){
  const router = useRouter()
  router.push('/applicant-progress')
}

/** stores */
const metadataStore = useMetadata();
const applicantStore = useApplicant();

/** consts */
const usersInChargeOptions = computed(()=>{
  return applicantStore.state.usersInCharge.map((doc) => {
    return {
      label: doc.displayName,
      value: doc.id
    }
  });
});
const paginationConstraints = computed(()=>{
  let result = <QueryFieldFilterConstraint[]>[]
  for (const [key, value] of Object.entries(applicantStore.state.applicantFilter)){
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

/** getters */
const applicantsByColumn : ComputedRef<Applicant[]> = computed(() => applicantStore.state.applicantsByColumn[statusParams.firestore]);

onMounted( async ()=>{
  applicantStore.fetchUsersInChrage()
  if(applicantStore.state.prefectureList.length){
    prefectureOptions.value = applicantStore.state.prefectureList
  } else {
    const metadataData = await metadataStore.getPrefectureJP()
    const prefKeys = Object.keys(metadataData)
    prefKeys.sort()
    prefectureOptions.value = prefKeys.map((item)=>{
      return {
        label: 'prefectures.' + item,
        value: item
      }
    })
    prefectureOptions.value.unshift({
      label: 'common.all',
      value: 0
    })
    applicantStore.state.prefectureList = prefectureOptions.value
  }
})
watch(()=>applicantStore.state.applicantFilter['currentStatusMonth'], (newVal, oldVal)=>{
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
