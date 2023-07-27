<template>
  <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
          <span class="text-h6">{{ $t('job.jobItemSettings') }} </span>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="bg-grey-3">
          <div class="row">
              <div class="col-6">
                  検索条件 / 案件種別：看護</div>
          </div>
          <div class="row">
              <div class="col-6">
                  <q-btn outline color="primary" :label="$t('job.changeSearchCondition')" />
              </div>
              <div class="col-6 text-right">
                  <q-btn color="primary" :label="$t('jobItem.addNew')" icon="add" @click="openAddDrawer" />
              </div>
          </div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
          <q-table :columns="columns" :rows="phraseList" row-key="id" selection="multiple" class="no-shadow"
              v-model:selected="selected" v-model:pagination="pagination" hide-pagination :loading="loading">
              <template v-slot:header-cell-name="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('jobItem.jobItemID') }} </div>
                      <div> {{ $t('phraseSettings.add.recruitmentItemName') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-updatedBy="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('regionSalary.list.updatedBy') }} </div>
                      <div> {{ $t('regionSalary.list.updatedDate') }} </div>
                  </q-th>
              </template>
              <template v-slot:header-cell-author="props">
                  <q-th :props="props" class="q-pa-none">
                      <div> {{ $t('job.author') }} </div>
                      <div> {{ $t('job.creationDate') }} </div>
                  </q-th>
              </template>
              <template v-slot:body-cell-edit="props">
                  <q-td :props="props">
                      <q-btn flat round size="sm" icon="edit" color="primary" @click="openDrawer(props.row)" />
                  </q-td>
              </template>
              <template v-slot:body-cell-category="props">
                  <q-td :props="props">
                      {{ getPhraseCategory(props.row.phraseCategory) }}
                  </q-td>
              </template>
              <template v-slot:body-cell-dataType="props">
                  <q-td :props="props">
                      {{ getDataType(props.row.dataType) }}
                  </q-td>
              </template>
              <template v-slot:body-cell-name="props">
                  <q-td :props="props">
                      {{ props.row.id }}
                      <div>{{ props.row.name }}</div>
                  </q-td>
              </template>
              <template v-slot:body-cell-author="props">
                  <q-td :props="props">
                      <span v-if="props.row.created_by">{{ userData[props.row.created_by] }} <br></span>
                      {{ toDate(props.row.created_at ) }}
                  </q-td>
              </template>
              <template v-slot:body-cell-updatedBy="props">
                  <q-td :props="props">
                      <span v-if="props.row.created_by">{{ userData[props.row.created_by] }} <br></span>
                      {{ toDate(props.row.updated_at ) }}
                  </q-td>
              </template>
              <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                      <q-btn flat round size="sm" icon="content_copy" />
                  </q-td>
              </template>
          </q-table>
          <div class="row justify-start q-mt-md pagination">
              <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
                  :max="(phraseList.length / pagination.rowsPerPage) >= 1 ? phraseList.length / pagination.rowsPerPage : 1"
                  direction-links outline />
          </div>
      </q-card-section>
      <addJobItemComponent ref="jobItemDrawer" />
  </q-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import addJobItemComponent from './components/addJobItem.vue';
import { jobItemColumns, phraseCategoryList, dataTypeList } from 'src/shared/constants/JobAd.const';
import { toDate } from 'src/shared/utils/utils';
import { useJobItemSetting } from 'src/stores/jobItemSetting'
import { DocumentData } from 'firebase/firestore';
import { QTableProps } from 'quasar';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const jobItemDrawer = ref<InstanceType<typeof addJobItemComponent> | null>(null);

const selectedPhrase = ref({ key: 'null' });
const columns = ref(jobItemColumns);
const phraseList:DocumentData = ref([]);
const selected = ref([]);
const loading = ref(true);
const jobItemSettingStore = useJobItemSetting()
const userData = ref({});
defineProps<{
  columns: QTableProps['columns'];
  phraseList:QTableProps['rows']
}>();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 30
});

const openDrawer = async (data) => {
  data['key'] = data.id;
  selectedPhrase.value = data;
  jobItemDrawer.value?.showDrawerWithData(data);
};
const fetchItemSettingData = async () => {
  loading.value = true;
  const data = await jobItemSettingStore.loadJobItemSettingData();
  phraseList.value = data.map((row) => {
    return { ...row };
  });
  loading.value = false;
};
const openAddDrawer = async () => {
  jobItemDrawer.value?.openDrawer();
};


const getPhraseCategory = (phraseCategory: string) => {
  let phraseCategoryText = '';
  if (phraseCategory) {
      const obj = phraseCategoryList.value.find(o => o.value === phraseCategory);
      if (obj) {
          phraseCategoryText = obj.label;
      }
  }
  return phraseCategoryText;
}

const getDataType = (dataType: string) => {
  let dataTypeListText = '';
  if (dataType) {
      const obj = dataTypeList.value.find(o => o.value === dataType);
      if (obj) {
          dataTypeListText = obj.label;
      }
  }
  return dataTypeListText;
}
watchCurrentOrganization(async () => {
  loading.value = true;
  fetchItemSettingData()
  loading.value = false;
})

onMounted(() => {
  fetchItemSettingData();
});
</script>
