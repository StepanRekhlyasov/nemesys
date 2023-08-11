<template>
  <q-card-section class="bg-grey-3">
    <div class="row q-pt-md q-gutter-sm progressInputsWrapper">
      <div class="col-2">
        <p class="q-ml-md inputLabel text-capitalize">{{ $t("inquiry.table.status") }}</p>
        <q-select 
          outlined 
          dense 
          :options="statusOptions" 
          v-model="filter.status"
          bg-color="white" 
          :label = "$t('common.pleaseSelect')" 
          emit-value 
          map-options 
          color="accent" 
          clearable
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel">{{ $t("inquiry.table.category") }}</p>
        <q-input
          v-model="filter.category"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel">{{ $t("releaseNotes.form.subject") }}</p>
        <q-input
          v-model="filter.subject"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel">{{ $t("menu.admin.organizationsTable.organizationId") }}</p>
        <q-input
          v-model="filter.companyID"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
      <div class="col-2">
        <p class="q-ml-md inputLabel">{{ $t("menu.admin.organizationsTable.organizationName") }}</p>
        <q-input
          v-model="filter.companyName"
          dense
          bg-color="white"
          color="accent"
          outlined
          :label="$t('common.keyboard')"
        />
      </div>
    </div>
  </q-card-section>
  <q-card-section class="q-pa-none">
    <q-table
      :columns="inquiresTableColumns"
      :rows="inquiresTableRows"
      row-key="id"
      v-model:pagination="pagination"
      class="no-shadow bg-grey-2"
      color="primary"
      table-header-style="background-color: #ffffff"
      :loading="loading"
    >
      <template v-slot:body="props">
        <q-tr :props="props"  :style="props.row.status === INQUIRY_STATUS.unanswered || props.row.status === '未返信' ? 'background: #F7F0F7' : 'background: #fff'">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <q-btn v-if="col.name === 'edit'" icon="edit" flat
              @click="() => editInquiry(props.row)" color="accent" 
            />
            <span v-else-if="col.name === 'status'" >
              {{ $t('inquiry.'+props.row.status) }}
            </span>
            <span v-else>{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card-section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useInquiry } from 'src/stores/inquiry';
import { cloneToRaw } from 'src/shared/utils/utils';
import { InquiryDataRow } from 'src/shared/model';
import { INQUIRY_STATUS } from '../types/inquiryTypes';
import { inquiresTableColumns as columns, statusOptions } from '../const/inquiry.const'

const inquiresTableColumns = computed(()=>{
  return columns.value
})
const inquiryStore = useInquiry()
const loading = ref(true)
const filter = ref({
  status : '',
  category : '',
  subject : '',
  companyID : '',
  companyName : '',
})

const inquiresTableRows = computed(() => {
  let result = inquiryStore.state.wholeInquiresData
  for(const [key, value] of Object.entries(filter.value)){
    result = result.filter((row)=>{
      if(filter.value[key]){
        if(key === 'status'){
          return row[key].toLowerCase() === value.toLowerCase()
        } else {
          return row[key].toLowerCase().includes(value.toLowerCase())
        }
      } else {
        return row
      }
    })
  }
  return result
});



const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
});

onMounted(async () => {
    await inquiryStore.getAllInquires()
    loading.value = false
});

const editInquiry = (row: InquiryDataRow) => {
  inquiryStore.setCurrentOrganisationInfo(row.organisation)
  inquiryStore.setCurrentRowData(cloneToRaw(row))
  inquiryStore.openDrawer(true)
}
</script>
<style lang="scss" scoped>
.progressInputsWrapper{
  .q-field__inner{
    background: #fff;
  }
  .inputLabel,
  .q-field__native {
    white-space: nowrap;
  }
}
</style>
