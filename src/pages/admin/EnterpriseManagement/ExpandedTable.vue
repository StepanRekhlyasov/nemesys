<template>
  <q-td auto-width colspan="100%" class="container">
    <!-- <q-btn @click="async () => await manageUserAvailability({ enabled: true, branchId: '' })" label="apiTest" /> -->
    <q-table flat :columns="columns" square :rows="[{}]" hide-pagination :loading="loading">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing size="sm" color="accent" />
      </template>

      <template v-slot:body>
        <template v-for="(organizationItem) in data?.organization">
          <template v-for="(buisnesesItem, buisnesesIndex) in organizationItem.buisneses">
            <q-tr v-for="(branchItem, branchInex) in buisnesesItem.branches" :key="branchInex">

              <q-td v-if="buisnesesIndex == 0 && branchInex == 0" v-bind:rowspan="organizationItem.totalBranches">
                <div class="column items-start">
                  {{ organizationItem.organizationIdAndName }}
                  <q-toggle v-model="organizationItem.working" :label="t('menu.admin.organizationsTable.working')"
                    left-label color="accent"
                    @update:model-value="async (working) => await onWorkingChange(working, { organizationId: organizationItem.id })" />
                </div>
              </q-td>

              <q-td v-if="branchInex == 0" v-bind:rowspan="buisnesesItem.branches.length">
                <div class="column items-start">
                  {{ buisnesesItem.name }}
                  <q-toggle v-model="buisnesesItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
                    color="accent" @update:model-value="async (working) =>
                      await onWorkingChange(working, { organizationId: organizationItem.id, businessId: buisnesesItem.id })
                    " />
                </div>
              </q-td>

              <q-td v-if="Object.keys(branchItem).length">
                <div class="column items-start">
                  {{ branchItem.name }}
                  <q-toggle v-model="branchItem.working" :label="t('menu.admin.organizationsTable.working')" left-label
                    color="accent"
                    @update:model-value="async (working) => await onWorkingChange(working, { organizationId: organizationItem.id, businessId: buisnesesItem.id, branchId: branchItem.id })" />
                </div>
              </q-td>
              <q-td v-else class="emptyCell">
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
import { QTableProps, QTableSlots, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Buisneses, Row, Table, Availability, AvailabilityApi } from './types/types';
import type { Overwrite } from 'src/shared/types/Overwrite'
import { Business, Branch } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';
import { api } from 'src/boot/axios';
import { getAuth } from '@firebase/auth';
import { Alert } from 'src/shared/utils/Alert.utils';

type Props = Overwrite<Parameters<QTableSlots['body']>[0], { row: Row }>

interface ExpandedTableProps {
  props: Props
}

const auth = getAuth();

const $q = useQuasar();


const organization = useOrganization()

const loading = ref(false)

const db = getFirestore()

const componentProps = defineProps<ExpandedTableProps>()

const { t } = useI18n({ useScope: 'global' });

const data = ref<Table>()



async function manageUserAvailability(availability: Availability) {
  const url = 'https://manage-user-availability-planwvepxa-an.a.run.app'
  const headers = {
    'Content-Type': 'application/json'
  };

  const data: AvailabilityApi = {
    ...availability,
    userId: auth.currentUser?.uid,
  }

  await api.post(url, data,
    {
      headers: headers,
      timeout: 30000,
    }
  )

}

async function onWorkingChange(working: boolean, ids: { organizationId?: string, businessId?: string, branchId?: string }) {


  loading.value = true;
  const { businessId, organizationId, branchId } = ids

  try {

    if (organizationId && !businessId && !branchId) {
      await organization.editOrganization(db, { working }, organizationId)
      await manageUserAvailability({ enabled: working, organizationId })
    }

    if (organizationId && businessId && !branchId) {
      await organization.editBusiness(db, { working }, organizationId, businessId)
    }

    if (organizationId && businessId && branchId) {
      await organization.editBranch(db, { working }, organizationId, businessId, branchId)
      await manageUserAvailability({ enabled: working, branchId })
    }

    if (working) {
      loading.value = false
      Alert.success($q, t);
      return
    }

    const organizations = data?.value?.organization

    if (!organizations) {
      loading.value = false
      Alert.success($q, t);
      return
    }

    for (let i = 0; i < organizations.length; i++) {
      const organizationItem = organizations[i]
      for (let j = 0; j < organizationItem.buisneses.length; j++) {
        const businessItem = organizationItem.buisneses[j]
        if (businessId && businessItem.id !== businessId) {
          continue
        }

        if (branchId) {
          continue
        }
        await organization.editBusiness(db, { working }, organizationItem.id, businessItem.id)
        businessItem.working = working
        for (let k = 0; k < businessItem.branches.length; k++) {
          const branchItem = businessItem.branches[k]
          if (branchId && branchItem.businessId !== branchId) {
            continue
          }
          branchItem.working = working
          await organization.editBranch(db, { working }, organizationItem.id, businessItem.id, branchItem.id)
          await manageUserAvailability({ enabled: working, branchId: branchItem.id })
        }
      }
    }
    Alert.success($q, t);
  } catch (error) {
    Alert.warning($q, t);
  }

  loading.value = false

}





loadTableData()
async function loadTableData() {
  loading.value = true

  const businesses = await organization.getBusinesses(db, componentProps.props.row.id)
  const branches = await organization.getBranches(db, componentProps.props.row.id)

  data.value = toTable(businesses, branches)

  loading.value = false
}

function toTable(businesses: { [id: string]: Business }, branches: { [businessId: string]: Branch[] }) {

  let businessesAndbranches: Buisneses[] = []
  const organizationKey = 'organization'

  let parsedData = {}

  parsedData[organizationKey] = [{}]
  let totalBranches = Object.values(branches).reduce((prev, curr) => {
    return prev += curr.length
  }, 0)

  parsedData[organizationKey][0] = componentProps.props.row
  for (let key in businesses) {
    let objToPush = JSON.parse(JSON.stringify(businesses[key]))
    objToPush.branches = branches[key]

    if (!objToPush.branches) {
      objToPush.branches = [{}]
      totalBranches++
    }

    businessesAndbranches.push(objToPush)
  }
  parsedData[organizationKey][0]['totalBranches'] = totalBranches
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

.emptyCell {
  background: $grey-4;
}
</style>
