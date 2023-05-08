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
          />
        </div>
        <div class="col-2">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <q-select
            outlined
            dense
            :options="[]"
            v-model="applicantStore.state.applicantFilter['userInCharge']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.prefecture") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureOptions.map((item)=>{return{label:$t(item.label),value:item.value}})"
            :disable="!prefectureOptions.length"
            v-model="applicantStore.state.applicantFilter['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
            @update:model-value="fetchResults()"
          />
        </div>
        <div class="col-1">
          <p class="q-ml-md">{{ $t("applicant.progress.filters.month") }}</p>
          <q-select
            outlined
            dense
            :options="[{label: $t('common.all'),value: 0}].concat(monthsList)"
            v-model="applicantStore.state.applicantFilter['currentStatusMonth']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
            @update:model-value="fetchResults()"
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
            />
          </div>
        </q-scroll-area>
      </div>
    </q-card-section>
  </q-page>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import ApplicantColumn from './components/ApplicantColumn.vue';
  import { APPLICANT_COLUMNS } from './const/applicantColumns';
  import { useApplicant } from 'src/stores/user/applicant';
  import { useMetadata } from 'src/stores/user/metadata';
  import { ApplicantCol } from './types/applicant.types';
  import { COLUMN_STATUSES, COUNT_STATUSES } from './const/applicantColumns';
  import { monthsList } from 'src/shared/constants/Common.const'
  import { limitQuery } from './const/applicantColumns';
  
  /** consts */
  const perQuery = ref<number>(limitQuery)
  const prefectureOptions = ref<{label: string, value: string | number}[]>([]);
  const countApplicantsStatuses = ref({
    entry: 0,
    retired: 0,
    working: 0
  })
  const columns = ref<ApplicantCol[]>(APPLICANT_COLUMNS);
  const columnsLoading = ref({
    'wait_contact': false,
    'wait_attend': false,
    'wait_FIX': false,
    'wait_visit': false,
    'wait_offer': false,
    'wait_entry': false,
    'wait_termination': false,
  })

  /** stores */
  const applicantStore = useApplicant();
  const metadataStore = useMetadata();

  /** getters */
  const applicantsByColumn = computed(() => applicantStore.state.applicantsByColumn);

  /** fetchers */
  const fetchResultsHandler = async (status : string, fetchMore = false) => {
    columnsLoading.value[status] = true
    await applicantStore.getApplicantsByStatus(status, applicantStore.state.applicantFilter, perQuery.value, fetchMore)
    columns.value = columns.value.map(item => {
      if(item.status == status){
        return {...item,
          items: applicantsByColumn.value[item.status]
        }
      }
      return item
    })
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
    fetchResults()
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
</script>
