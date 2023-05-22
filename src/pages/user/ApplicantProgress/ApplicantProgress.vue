<template>
  <q-page>
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t("applicant.progress.title") }}</div>
    </q-card-section>
    <q-separator color="white" size="2px" />
    <q-card-section class="bg-grey-3">
      <div class="row q-pt-md q-gutter-sm">
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.branch") }}</p>
          <q-select
            outlined
            dense
            :options="[]"
            v-model="applicantStore.state.applicantFilter['branch']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
            clearable
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <q-select
            outlined
            dense
            :options="usersInChargeOptions"
            v-model="applicantStore.state.applicantFilter['attendeeUserInCharge']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            @update:model-value="fetchResults()"
            emit-value
            map-options
            clearable
            :disable="loading"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureList"
            v-model="applicantStore.state.applicantFilter['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
            @update:model-value="fetchResults()"
            clearable
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.month") }}</p>
          <YearMonthPicker 
            v-model="applicantStore.state.applicantFilter['currentStatusMonth']" 
            height="40px" 
            width="100%" 
            :disable="loading"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.entry") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="countApplicantsStatuses.entry" />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.retire") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="countApplicantsStatuses.retired" />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.working") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="countApplicantsStatuses.working" />
        </div>
      </div>
      <div class="q-pt-md">
        <q-scroll-area style="height: 80vh; max-width: 90vw">
          <div class="row no-wrap justify-between">
            <ApplicantColumn
              v-for="column in columns"
              :key="column.id"
              :column="column"
              :loading="columnsLoading[column.status]"
              @showMore="(status)=>{fetchResultsHandler(status, true)}"
              @select-applicant="(applicant)=>{
                detailsDrawer?.openDrawer(applicant)
              }"
            />
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
  import { prefectureList } from 'src/shared/constants/Prefecture.const';
  import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
  
  /** consts */
  const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null)
  const perQuery = ref<number>(limitQuery)
  const countApplicantsStatuses = ref({
    entry: 0,
    retired: 0,
    working: 0
  })
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
  const usersInChargeOptions = computed(()=>{
    return applicantStore.state.usersInCharge.map((doc) => {
      return {
        label: doc.displayName,
        value: doc.id
      }
    });
  });

  /** stores */
  const applicantStore = useApplicant();

  /** getters */
  const applicantsByColumn = computed(() => applicantStore.state.applicantsByColumn);

  /** fetchers */
  const fetchResultsHandler = async (status : string, fetchMore = false) => {
    columnsLoading.value[status] = true
    await applicantStore.getApplicantsByStatus(status, applicantStore.state.applicantFilter, perQuery.value, fetchMore)
    columnsLoading.value[status] = false
  }
  const fetchResults = async () => {
    COLUMN_STATUSES.map(async (status)=>{
      fetchResultsHandler(status, false)
    })
    COUNT_STATUSES.map(async (status)=>{
      countApplicantsStatuses.value[status] = await applicantStore.countApplicantsByStatus(status, applicantStore.state.applicantFilter)
    })
  }
  onMounted( async ()=>{
    applicantStore.fetchUsersInChrage()
    await fetchResults()
  })
  watch(()=>applicantStore.state.applicantFilter['currentStatusMonth'], (newVal, oldVal)=>{
    if(newVal!=oldVal) fetchResults()
  })
</script>
