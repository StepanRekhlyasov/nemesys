<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, withDefaults, watch } from 'vue';
import { ClientFactoryTableColumn, ClientFactoryTableRow, Pagination } from './types';

const props = withDefaults(defineProps<{
    rows: ClientFactoryTableRow[],
    isFetching: boolean,
    pagination: Pagination,
    tableColumns: ClientFactoryTableColumn[],
    theme?: string,
}>(), {
    theme: 'primary'
})

const emit = defineEmits<{
    (e: 'selectItem', item: ClientFactoryTableRow)
    (e: 'selectedId', item: ClientFactoryTableRow[])
}>()

const { t } = useI18n({ useScope: 'global' });

const selected = ref<ClientFactoryTableRow[]>([])
const selectedAll =ref(false)
const getSelectedString = () => {
    return selected.value.length === 0 ? '' : `${t('common.numberOfSelections')}: ${selected.value.length}`
}

const selectItem = (item: ClientFactoryTableRow) => {
    emit('selectItem', item)
}

watch(()=>selected.value, ()=>{
    emit('selectedId', selected.value)
})

const paginatedAndSortedRows = ref<ClientFactoryTableRow[]>([...props.rows]);

const sortRows = (rows, sortBy:string, descending:boolean) => {
  const collator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true });
  const start = (props.pagination.page - 1) * props.pagination.rowsPerPage;
  const end = start + props.pagination.rowsPerPage;
  if (sortBy === 'distance') {
    return [...props.rows].sort((a, b) => {
      const first = a.distance.toString();
      const second = b.distance.toString();
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    }).slice(start,end);
  }
  if (sortBy === 'name') {
    return [...props.rows].sort((a, b) => {
      const first = a.office.name?a.office.name:'';
      const second = b.office.name?b.office.name:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
  if (sortBy === 'telephone') {
    return [...props.rows].sort((a, b) => {
      const first = a.telephone;
      const second = b.telephone;
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    }).slice(start,end);
  }
  if (sortBy === 'address') {
    return [...props.rows].sort((a, b) => {
      const first = a.address?a.address:'';
      const second = b.address?b.address:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
  if (sortBy === 'fax') {

    return [...props.rows].sort((a, b) => {
      const first = a.fax?a.fax:'';
      const second = b.fax?b.fax:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
  if (sortBy === 'office master') {
    return [...props.rows].sort((a, b) => {
      const first = a.officeMaster;
      const second = b.officeMaster;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
  if (sortBy === 'client master') {
    return [...props.rows].sort((a, b) => {
      const first = a.clientMaster;
      const second = b.clientMaster;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
  if (sortBy === 'basic information') {
    return [...props.rows].sort((a, b) => {
      const first = a.basicInfo;
      const second = b.basicInfo;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    }).slice(start,end);
  }
else
  return rows;

};
watch(()=>[props.rows, props.pagination], () => {
  const sortedRows = sortRows([...props.rows], props.pagination.sortBy, props.pagination.descending);
  const start = (props.pagination.page - 1) * props.pagination.rowsPerPage;
  const end = start + props.pagination.rowsPerPage;
  paginatedAndSortedRows.value = sortedRows.slice(start, end);
}, {immediate: true, deep:true});

watch (()=>selectedAll.value,()=>{
  if(selectedAll.value) selected.value = props.rows
  else selected.value = []
})
</script>

<template>
    <q-table
    :rows="paginatedAndSortedRows.length?paginatedAndSortedRows:rows"
    :columns="tableColumns"
    :rows-per-page-options="[pagination.rowsPerPage]"
    row-key="id"
    :color="theme"
    dense
    :loading="isFetching"
    :bordered="false"
    :selected-rows-label="getSelectedString"
    selection="multiple"
    v-model:selected="selected"
    :sort-method="sortRows"
    hide-pagination>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th align="left">
          <q-checkbox v-model="selectedAll" @click="!selectedAll"  ></q-checkbox>
        </q-th>
        <template v-for="col in props.cols" :key="col.name">
          <q-th :props="props">
            <div v-for="item in col.label.split('/')" :key="item">
              {{ item }}
            </div>
          </q-th>
        </template>
      </q-tr>
    </template>

        <template v-slot:body="props">
            <q-tr :props="props" :class="`wrapper_animate_left_border_${theme === 'primary' ? 'client' : ''} relative-position`">
                <q-td>
                    <q-checkbox @click="!props.selected" v-model="props.selected" :color="theme"/>
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <div v-if="col.name === 'name'" class="column">
                        <span :class="`name text-${theme}`" @click="selectItem(props.row)">
                            <q-icon v-if="col.value.isHead" :color="theme" name="home" class="icon"/>
                            {{ col.value.name }}
                        </span>
                        <span>
                            {{ col.value.clientName }}
                        </span>
                    </div>
                    <span v-else>
                        {{ col.value }}
                    </span>
                </q-td>
            </q-tr>
        </template>

    </q-table>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.table {
    display: flex;
    flex-direction: column;
    .name {
        font-size: 1.2rem;
        cursor: pointer;
    }

    .icon {
       font-size: 1.2rem;
    }
}

.wrapper_animate_left_border_client::after {
    width: 1.2%;
    z-index: 11;
}

.wrapper_animate_left_border::after {
    width: 1.2%;
    z-index: 11;
}
</style>
