<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { tableColumnsSavedCriteriaList, searchData, checkValidity } from './const/index';
import { getFirestore, orderBy, doc, deleteDoc, DocumentData } from 'firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';
import TablePagination from 'src/pages/user/Applicant/components/TablePagination.vue';
import { prefectureLocaleKey } from 'src/shared/constants/Prefecture.const';
import { useApplicantSaveSearch } from 'src/stores/applicantSaveSearch'
import searchEditDrawer from 'src/pages/user/Applicant/components/seachEditDrawer.vue'
import { useRouter } from 'vue-router';
import { updateSharedVariable } from './components/search/searchData'
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';

const router = useRouter()
const saveSearch = useApplicantSaveSearch()
const tableData = ref<DocumentData>([])
const rowForEdit = ref<DocumentData>({})
const isSaving = ref<boolean>(false)
const { t } = useI18n({ useScope: 'global' });
const db = getFirestore();
const drawerRight = ref<boolean>(false);
const loading = ref<boolean>(false)
const searchKeyword = ref<string | null>(null);
const pagination = ref({
  page: 1,
  rowsPerPage: 100,
  path: 'applicantSaveSearch',
  order: orderBy('created_at', 'asc'),
});

const loadPagination = ref<number>(0);

onMounted(async () => {
  await getSearchData();
});

const getSearchData = async () => {
  loading.value = true;
  tableData.value = (await saveSearch.getSaveSearch()).sort((a, b) => b.created_at.seconds - a.created_at.seconds)
  loading.value = false;
}

watchCurrentOrganization(async () => {
  await getSearchData()
})

const dltSearch = async (id) => {
  loading.value = true;
  try {
    const docRef = doc(db, 'applicantSaveSearch', id);
    await deleteDoc(docRef);
    await getSearchData()

  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false;
  loadPagination.value = loadPagination.value == 0 ? 1 : 0
};

const callRow = (row: DocumentData) => {
  drawerRight.value = true;
  rowForEdit.value = row
};

const searchApplicants = (row: DocumentData) => {
  updateSharedVariable(row)
  router.push('/applicant/search')
}
const save = async () => {
  isSaving.value = true;
  let edit_data = searchData.value
  let valid = true;
  try {
    checkValidity(edit_data)
  }
  catch (error) {
    valid = false
    Alert.warning(error)
  }
  if (valid) {
    await saveSearch.saveSearch(searchData.value);
    getSearchData();
    drawerRight.value = false;
  }
  isSaving.value = false;
}

const filterData = () => {
  if (searchKeyword.value) {
    loading.value = true;
    const filteredData = tableData.value.filter((item: DocumentData) => item.keyword === searchKeyword.value);
    tableData.value = filteredData
    loading.value = false;
  }
  else {
    getSearchData()
  }
}

const clearSearch = () => {
  searchKeyword.value = null
  getSearchData();
}

</script>

<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-2">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ t('menu.savedSearchConditionsList') }}</div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="bg-grey-3 q-pa-md">
        <div class="text-subtitle1">
          {{ t('common.searchKeyword') }} / {{ t('common.searchCondition') }}
        </div>
        <form class="form q-mt-sm">
          <input v-model="searchKeyword" class="form__input" type="text" :placeholder="t('form.searchPlaceholder')">
          <q-btn @click="filterData" color="primary">
            {{ t('common.search') }}
          </q-btn>
          <q-btn @click="clearSearch()">
            {{ t('common.clear') }}
          </q-btn>
        </form>
      </q-card-section>
      <q-card-section class="no-padding">
        <q-table :rows="tableData" :columns="tableColumnsSavedCriteriaList" row-key="id" flat class="table no-wrap"
          :bordered="false" :square="false" separator="none" v-model:pagination="pagination" hide-pagination
          :loading="loading">
          <template v-slot:body-cell-condition="props">
            <q-td class="no-wrap">
              <div class="row">
                <q-icon size="sm" color="primary" class="flex table__edit-btn" name="edit" @click="callRow(props.row)" />
                <q-icon size="sm" class="table__search-btn" name="search" @click="searchApplicants(props.row)" />
                <q-icon size="1.5rem" color="primary" class="table__delete-btn" name="delete_outline"
                @click="dltSearch(props.row.id)" />
              </div>
              <div>
                <strong v-if="props.row.keyword">{{ `${t('common.searchKeyword')} : ` }}</strong>
                {{props.row.keyword? `${props.row.keyword}/`:'' }}

                <strong v-if="props.row.ageMax || props.row.ageMin">{{ `${t('applicant.list.fixEmployment.age')}(${t('applicant.attendant.years')}) : ` }}</strong>
              {{ props.row.ageMin && props.row.ageMax ?
                `${props.row.ageMin}-${props.row.ageMax}/`
                : (props.row.ageMin ? `${props.row.ageMin}(${t('common.minimum')})/` : (props.row.ageMax ?
                  `${props.row.ageMax}(${t('common.maximum')})/` : ''))
              }}

              <strong v-if="props.row.sex && props.row.sex.length">{{ `${t('applicant.add.sex')} : ` }}</strong>
              {{props.row.sex && props.row.sex.length? `${t(`applicant.add.${props.row.sex[0]}`)}/`:'' }}

              <strong v-if="props.row.staffrank">{{ `${t('applicant.list.rank')} : ` }}</strong>
              {{props.row.staffrank?`${props.row.staffrank}/`:'' }}

              <strong v-if="props.row.classification && props.row.classification.length">{{ `${t('applicant.list.info.classiffication')} : ` }}</strong>
              {{ props.row.classification && props.row.classification.length?`${props.row.classification.map(clsfic=>(t(`applicant.list.info.classification.${clsfic.toLowerCase()}`))).join(',')}/`:'' }}

              <strong v-if="props.row.occupation && props.row.occupation.length">{{ `${t('applicant.add.occupation')} : ` }}</strong>
              {{ props.row.occupation && props.row.occupation.length?`${props.row.occupation.map(occ=>(t(`applicant.add.${occ}`))).join(',')}/`:'' }}

              <strong v-if="props.row.prefecture">{{ `${t('applicant.progress.filters.prefecture')} : ` }}</strong>
              {{props.row.prefecture?`${t(`prefectures.${prefectureLocaleKey[props.row.prefecture]}`)}/`:'' }}

              <strong v-if="props.row.municipalities">{{ `${t('applicant.add.municipalities')} : ` }}</strong>
              {{props.row.municipalities?`${props.row.municipalities}/`:'' }}

              <strong v-if="props.row.route">{{ `${t('applicant.attendant.route')} : ` }}</strong>
              {{props.row.route?`${props.row.route}/`:'' }}

              <strong v-if="props.row.neareststation">{{ `${t('applicant.attendant.nearestStation')} : ` }}</strong>
              {{props.row.neareststation?`${props.row.neareststation}/`:'' }}

              <strong v-if="props.row.qualification && props.row.qualification.length">{{ `${t('applicant.list.qualification')} : ` }}</strong>
              {{ props.row.qualification && props.row.qualification.length?`${props.row.qualification.map(qua=>(t(`applicant.qualification.${qua}`))).join(',')}/`:'' }}

              <strong v-if="props.row.yearsExperienceMin || props.row.yearsExperienceMax">{{ `${t('applicant.list.yearsExperience')} : ` }}</strong>
              {{ props.row.yearsExperienceMin && props.row.yearsExperienceMax ?
                `${props.row.yearsExperienceMin}-${props.row.yearsExperienceMax}/`
                : (props.row.yearsExperienceMin ? `${props.row.yearsExperienceMin}(${t('common.minimum')})/` : (props.row.yearsExperienceMax ?
                  `${props.row.yearsExperienceMax}(${t('common.maximum')})/` : ''))
              }}

              <strong v-if="props.row.availableShift && props.row.availableShift.length">{{ `${t('applicant.list.availableShift')} : ` }}</strong>
              {{ props.row.availableShift && props.row.availableShift.length?`${props.row.availableShift.map(shift=>(t(`applicant.shift.${shift}`))).join(',')}/`:'' }}

              <strong v-if="props.row.daysperweek && props.row.daysperweek.length">{{ `${t('applicant.attendant.daysPerWeek')} : ` }}</strong>
              {{ props.row.daysperweek && props.row.daysperweek.length?`${props.row.daysperweek.map(days=>(t(`weekDay.${days}`))).join(',')}/`:'' }}

              <strong v-if="props.row.workPerWeekMin || props.row.workPerWeekMax">{{ `${t('applicant.attendant.daysToWork')} : ` }}</strong>
              {{ props.row.workPerWeekMin && props.row.workPerWeekMax ?
                `${props.row.workPerWeekMin}-${props.row.workPerWeekMax}/`
                : (props.row.workPerWeekMin ? `${props.row.workPerWeekMin}(${t('common.minimum')})/` : (props.row.workPerWeekMax ?
                  `${props.row.workPerWeekMax}(${t('common.maximum')})/` : ''))
              }}

              <strong v-if="props.row.applicationDateMin || props.row.applicationDateMax">{{ `${t('applicant.add.applicationDate')} : ` }}</strong>
              {{ props.row.applicationDateMin && props.row.applicationDateMax ?
                `${props.row.applicationDateMin} to ${props.row.applicationDateMax}/`
                : (props.row.applicationDateMin ? `${props.row.applicationDateMin}(${t('common.minimum')})/` : (props.row.applicationDateMax ?
                  `${props.row.applicationDateMax}(${t('common.maximum')})/` : ''))
              }}

              <strong v-if="props.row.status">{{ `${t('applicant.add.status')} : ` }}</strong>
              {{ props.row.status? `${t(`applicant.statusOption.${props.row.status}`)}`:'' }}

              </div>
            </q-td>
          </template>
        </q-table>

        <div class="row justify-start q-mt-md pagination q-ml-sm">
          <TablePagination :pagination="pagination" :isAdmin="false" v-model="pagination.page" :key="loadPagination" />
        </div>
      </q-card-section>
    </q-card>
    <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
      bordered>
      <q-card flat class="cover">
        <q-card-section class="text-white bg-primary rounded-borders">
          <div class="row">
            <q-btn dense flat icon="close" @click="drawerRight = false" class="q-mr-md" />
          </div>
        </q-card-section>

        <searchEditDrawer v-if="drawerRight" :rowForEdit="rowForEdit" />

        <q-btn :disable="isSaving" :label="$t('client.list.saveSearchConditions')" @click="save"
          color="primary q-ml-sm" />
      </q-card>
    </q-drawer>
  </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.cover {
  height: 100%
}

.table {
  &__column {}

  &__row {
    position: relative;

    &_name {
      text-decoration: underline;
      color: $main-primary;
      font-size: 1rem;
    }
  }

  &__btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__edit-btn {
    display: block;
    cursor: pointer;
    padding: 5px;
  }

  &__search-btn {
    display: block;
    cursor: pointer;
    padding: 5px;
  }

  &__delete-btn {
    display: block;
    cursor: pointer;
    padding: 5px;
  }
}

.whitespace-nowrap {
  white-space: nowrap;
}

.wrapper_animate_left_border_client::after {
  width: 1.5%;
  z-index: 11;
}

.title {
  color: $main-black;
  font-weight: bold;
  font-size: 1rem;
}

.form {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 40%;

  &__input {
    min-height: 35px;
    border: 1px solid $main-black;
    flex: 0 1 60%;
    border-radius: 4px;
    padding: 1%;
  }

  &__input:focus {
    outline: none;
  }
}

.pagination {
  padding: 2% 2%;
}
</style>
