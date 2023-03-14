<template>
  <q-td auto-width colspan="100%" class="container">
    <q-table flat :columns="columns" square :rows="[{}]" hide-pagination :loading="loading">

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="accent" />
      </template>

      <template v-slot:body>
        <template v-for="(organizationItem) in data?.organization">
          <template v-for="(buisnesesItem, buisnesesIndex) in organizationItem.buisneses">
            <q-tr v-for="(branchItem, branchInex) in buisnesesItem.branches" :key="branchInex">

              <q-td v-if="buisnesesIndex == 0 && branchInex == 0" v-bind:rowspan="organizationItem.totalBranches">
                <div class="column items-start">
                  {{ organizationItem.organizationIdAndName }}
                  <q-toggle v-model="organizationItem.working" :label="t('menu.admin.organizationsTable.working')"
                    left-label color="accent" disable />
                </div>
              </q-td>

              <q-td v-if="branchInex == 0" v-bind:rowspan="buisnesesItem.branches.length">
                <div class="column items-start">
                  {{ buisnesesItem.name }}
                  <q-toggle v-model="buisnesesItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
                    color="accent" disable />
                </div>
              </q-td>

              <q-td>
                <div class="column items-start">
                  {{ branchItem.name }}
                  <q-toggle v-model="branchItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
                    color="accent" disable />
                </div>
              </q-td>

            </q-tr>
          </template>
        </template>
      </template>
    </q-table>
  </q-td>
</template>

<script setup lang="ts">
import { getFirestore } from '@firebase/firestore';
import { QTableProps, QTableSlots } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Row } from './types/types';
import type { Overwrite } from 'src/shared/types/Overwrite'
import { Business, Branch } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';

type Props = Overwrite<Parameters<QTableSlots['body']>[0], { row: Row }>

interface ExpandedTableProps {
  props: Props
}

interface Table {
  organization: {
    totalBranches: number,
    organizationIdAndName: string,
    working: boolean,
    buisneses: Buisneses[]
  }[]
}

type Buisneses = {
  working: boolean,
  name: string,
  branches: Branch[]
}

const organization = useOrganization()

const loading = ref(false)

const db = getFirestore()

const componentProps = defineProps<ExpandedTableProps>()

const { t } = useI18n({ useScope: 'global' });

const data = ref<Table>()


loadTableData()
async function loadTableData() {
  loading.value = true

  const businesses = await organization.getAllBusinesses(db, componentProps.props.row.id)
  const branches = await organization.getBranches(db, componentProps.props.row.id)

  data.value = toTable(businesses, branches)

  loading.value = false
}

function toTable(businesses: { [id: string]: Business }, branches: { [businessId: string]: Branch[] }) {

  let businessesAndbranches: Buisneses[] = []
  const organizationKey = 'organization'

  let parsedData = {}

  parsedData[organizationKey] = [{}]
  const totalBranches = Object.values(branches).reduce((prev, curr) => {
    return prev += curr.length
  }, 0)
  parsedData[organizationKey][0]['totalBranches'] = totalBranches
  parsedData[organizationKey][0]['organizationIdAndName'] = componentProps.props.row.organizationIdAndName
  parsedData[organizationKey][0]['working'] = componentProps.props.row.working

  for (let key in businesses) {
    let objToPush = JSON.parse(JSON.stringify(businesses[key]))
    objToPush.branches = branches[key]
    businessesAndbranches.push(objToPush)
  }

  parsedData[organizationKey][0]['buisneses'] = businessesAndbranches

  return parsedData as Table
}

const columns = computed<QTableProps['columns']>(() => [
  {
    name: 'organizationName',
    label: t('menu.admin.organizationsTable.organizationName'),
    field: 'organizationName',
    align: 'left',

  },
  {
    name: 'buisnesses',
    label: t('menu.admin.organizationsTable.businessName'),
    field: 'buisnesses',
    align: 'left',


  },
  {
    name: 'branchName',
    label: t('menu.admin.organizationsTable.branchName'),
    field: 'branchName',
    align: 'left',
  }
])
</script>

<style scoped lang="scss">
.header {
  background-color: $accent;
  color: white;
}

.container {
  padding: 0;
}

table,
th,
td {
  border: 1px solid black;
}
</style>
