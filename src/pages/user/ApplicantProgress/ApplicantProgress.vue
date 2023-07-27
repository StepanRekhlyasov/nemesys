<template>
  <q-page>
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t("applicant.progress.title") }}</div>
    </q-card-section>
    <q-separator color="white" size="2px" />
    <q-card-section class="bg-grey-3">
      <div class="row q-pt-md q-gutter-sm applicant__inputWrapper">
        <div class="col-2">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.filters.branch") }}</p>
          <MySelect 
            @update="fetchResults()" 
            v-model="applicantStore.state.applicantProgressFilter['branchIncharge']"
            :optionToFetch="'branchIncharge'"
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <MySelect 
            @update="fetchResults()" 
            v-model="applicantStore.state.applicantProgressFilter.userInCharge"
            :optionToFetch="'usersInCharge'"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <MySelect 
            @update="fetchResults()" 
            v-model="applicantStore.state.applicantProgressFilter['prefecture']"
            :options="prefectureList"
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.filters.month") }}</p>
          <YearMonthPicker 
            v-model="applicantStore.state.applicantProgressFilter['currentStatusMonth']" 
            height="40px" 
            width="100%" 
            :disable="loading"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.entry") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="applicantStore.state.applicantRowsCount.wait_entry" />
        </div>
        <div class="col-1">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.retire") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="applicantStore.state.applicantRowsCount.retired" />
        </div>
        <div class="col-1">
          <p class="q-ml-md inputLabel">{{ $t("applicant.progress.working") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="applicantStore.state.applicantRowsCount.working" />
        </div>
      </div>
      <div class="q-pt-md">
        <q-scroll-area class="applicantColumnsWrapper" :visible="false">
          <div class="row no-wrap justify-between" style="gap:10px">
            <template v-for="column in columns" :key="column.id">
              <ApplicantColumn
                :column="column"
                :loading="columnsLoading[column.status]"
                @showMore="(status)=>{fetchResultsHandler(status as ApplicantStatus, true)}"
                @select-applicant="(applicant)=>{
                  detailsDrawer?.openDrawer(applicant)
                }"
              />
              </template>
          </div>
        </q-scroll-area>
      </div>
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer" />
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import ApplicantColumn from './components/ApplicantColumn.vue';
import { APPLICANT_COLUMNS } from './const/applicantColumns';
import { useApplicant } from 'src/stores/applicant';
import { COLUMN_STATUSES, COUNT_STATUSES } from './const/applicantColumns';
import { limitQuery } from './const/applicantColumns';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
import MySelect from 'src/components/inputs/MySelect.vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { ApplicantStatus } from 'src/shared/model';

/** consts */
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
const perQuery = ref<number>(limitQuery)
const columns = computed(()=>APPLICANT_COLUMNS.map(item => {
  return {...item,
    items: applicantsByColumn.value[item.status]
  }
}))
const columnsLoading = computed(() => applicantStore.state.columnsLoading);
const loading = computed(()=>{
  for (const value of Object.values(columnsLoading.value)){
    if(!value){
      return false
    }
  }
  return true
})

/** stores */
const applicantStore = useApplicant();

/** getters */
const applicantsByColumn = computed(() => applicantStore.state.applicantsByColumn);

/** fetchers */
const fetchResultsHandler = async (status : ApplicantStatus, fetchMore = false) => {
  await applicantStore.getApplicantsByColumns(status, applicantStore.state.applicantProgressFilter, perQuery.value, fetchMore)
}
const fetchResults = async () => {
  COLUMN_STATUSES.map(async (status)=>{
    fetchResultsHandler(status, false)
  })
  COUNT_STATUSES.map(async (status)=>{
    await applicantStore.countApplicantsByStatus(status, applicantStore.state.applicantProgressFilter)
  })
}
onMounted( async ()=>{
  COLUMN_STATUSES.forEach(async (status)=>{
    if(typeof applicantStore.state.applicantRowsCount[status] === 'undefined' || applicantStore.state.needsApplicantUpdateOnMounted){
      fetchResultsHandler(status, false)
    }
  })
  applicantStore.state.needsApplicantUpdateOnMounted = false
  COUNT_STATUSES.forEach(async (status)=>{
    await applicantStore.countApplicantsByStatus(status, applicantStore.state.applicantProgressFilter)
  })
})
watch(()=>applicantStore.state.applicantProgressFilter.currentStatusMonth, (newVal, oldVal)=>{
  if(newVal!=oldVal) fetchResults()
})
</script>
<style lang="scss">
.applicant__inputWrapper{
  .q-field__inner{
    background: #fff;
  }
  .inputLabel,
  .q-field__native {
    white-space: nowrap;
  }
}
.applicantColumnsWrapper{
  max-width: 1300px;
  width: 100%;
  height: 80vh;
}
</style>
