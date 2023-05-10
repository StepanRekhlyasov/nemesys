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
            @update:model-value="fetchResults(true)"
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
            @update:model-value="fetchResults(true)"
          />
        </div>
      </div>
    <div class="q-pt-md">
      <q-scroll-area style="height: 80vh; max-width: 90vw">
        <applicant-table :applicants="applicantsByColumn" />
      </q-scroll-area>
    </div>
    </q-card-section>
  </q-page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { statusStringMask } from './const/applicantStatuses'
import { useRouter } from 'vue-router';
import { useApplicant } from 'src/stores/applicant';
import { useMetadata } from 'src/stores/metadata';
import { limitQuery } from './const/applicantColumns';
import { monthsList } from 'src/shared/constants/Common.const';
import applicantTable from './components/ApplicantTable.vue'
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
const prefectureOptions = ref<{label: string, value: string | number}[]>([]);
const perQuery = ref(limitQuery)

/** getters */
const applicantsByColumn = computed(() => applicantStore.state.applicantsByColumn[statusParams.firestore]);

/** fetchers */
const fetchResults = async (reFilter = false) => {
  fetchResultsHandler(false, reFilter)
}
const fetchResultsHandler = async (fetchMore = false, reFilter = false) => {
  if(reFilter || !applicantsByColumn.value.length){
    applicantStore.state.reFilterOnReturn = true
    await applicantStore.getApplicantsByStatus(statusParams.firestore, applicantStore.state.applicantFilter, perQuery.value, fetchMore)
  }
}

onMounted( async ()=>{
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
  fetchResults()
})

</script>