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
        <q-inner-loading showing size="sm" color="accent" />
      </template>

      <template v-slot:body>
        <template v-for="tableData in table">
          <template v-for="(organizationItem) in tableData?.organization">
            <template v-for="(buisnesesItem, buisnesesIndex) in organizationItem.buisneses">
              <q-tr v-for="(branchItem, branchInex) in buisnesesItem.branches" :key="branchInex">

                <q-td v-if="buisnesesIndex == 0 && branchInex == 0 " v-bind:rowspan="organizationItem.totalBranches">
                  <div class="column items-start">
                    <slot name="organization" :organizationItem="organizationItem">

                    </slot>
                  </div>
                </q-td>

                <q-td v-if="branchInex == 0" v-bind:rowspan="buisnesesItem.branches.length">
                  <div class="column items-start">
                    {{ buisnesesItem.name }}
                    <slot name="buisneses" :buisnesesItem="buisnesesItem" :organizationItem="organizationItem">

                    </slot>
                  </div>
                </q-td>

                <q-td v-if="Object.keys(branchItem).length ">
                  <div class="column items-start">
                    {{ branchItem.name }}

                    <slot name="branch" :branchItem="branchItem" :buisnesesItem="buisnesesItem"
                      :organizationItem="organizationItem">


                    </slot>
                  </div>
                </q-td>

                <q-td v-else class="emptyCell">
                </q-td>
                <slot name="after" :branchItem="branchItem">

                </slot>
              </q-tr>
            </template>
          </template>
        </template>
      </template>
    </q-table>
  </q-td>
</template>

<script setup lang="ts">

import { QTableProps } from 'quasar';
import { Table } from 'src/pages/admin/EnterpriseManagement/types';

defineProps<{
  columns: QTableProps['columns']
  loading: boolean
  table?: Table[]
}>()

</script>

<style scoped lang="scss">
table,
th,
td {
  border: 1px solid black;
}

.container {
  padding: 0;
  width: 100vw;
}

.header {
  background-color: $accent;
  color: white;
}

.emptyCell {
  background: $grey-4;
}
</style>
