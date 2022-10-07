<template>
  <div class="branches-page text-caption text-weight-medium">
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('menu.branches')" class="text-h5"></div>
        <q-btn color="white" text-color="black">
          {{ $t('settings.branch.addBranch') }}
        </q-btn>
      </div>
    </q-card>
    <q-card class="q-ma-md">
      <q-table
        dense
        :rows="branchData"
        :columns="columns"
        row-key="id"
        :pagination="initialPagination"
        separator="cell"
        class="q-ma-sm"
      >
        <template v-slot:body-cell-hidden="props">
          <q-td :props="props">
            <q-icon v-if="props.value" name="mdi-check"/>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              icon="mdi-account-arrow-right-outline"
              @click="$router.push('/clientDetail/' + props.row.id)"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script lang="ts">
  import { Branch } from '../../shared/model/Branch.model';
  import { dataTimeFormat } from '../../shared/constants/Table.const';
  import { useI18n } from 'vue-i18n';
  import {
    getFirestore,
  } from 'firebase/firestore';
  import { Ref, ref } from 'vue';
  import { QTableColumn } from 'quasar';
  export default {
    name: 'BranchesPage',
    setup() {
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();

      const branchData: Ref<Branch[]> = ref([])
      const columns: QTableColumn[] = [
        {
          name: 'id',
          required: true,
          label: t('settings.branch.id'),
          sortable: true,
          align: 'left',
          field: 'id'
        },{
          name: 'name',
          required: true,
          label: t('settings.branch.name'),
          sortable: true,
          align: 'left',
          field: 'name'
        },{
          name: 'prefectures',
          required: true,
          label: t('settings.branch.prefectures'),
          sortable: true,
          align: 'left',
          field: 'prefectures'
        },{
          name: 'phone',
          required: true,
          label: t('settings.branch.phone'),
          align: 'left',
          field: 'phone'
        },{
          name: 'flug',
          required: true,
          label: t('settings.branch.enable'),
          align: 'left',
          field: 'flug'
        },{
          name: 'hidden',
          required: true,
          label: t('settings.branch.hidden'),
          align: 'left',
          field: 'hidden'
        },{
          name: 'create_at',
          required: true,
          label: t('settings.branch.create_at'),
          align: 'left',
          field: 'create_at',
          format: dataTimeFormat
        },{
          name: 'last_update',
          required: true,
          label: t('settings.branch.last_update'),
          align: 'left',
          field: 'last_update',
          format: dataTimeFormat
        },
        { name: 'actions', label: '', field: '', align: 'center' },
      ]

      const loadBranchData = ():void => {
        branchData.value = [
          {
            id: 1,
            name: '本社',
            prefectures: '東京都',
            flug: '有効',
            hidden: true,
            create_at: new Date('2022-07-26 09:43:42'),
            last_update: new Date('2022-07-26 09:43:42')
          },
          {
            id: 2,
            name: '東京支店',
            prefectures: '東京都',
            flug: '有効',
            hidden: false,
            create_at: new Date('2022-07-26 09:49:00'),
            last_update: new Date('2022-07-26 09:49:33')
          },
          {
            id: 3,
            name: '大阪支店',
            prefectures: '大阪府',
            flug: '有効',
            hidden: false,
            create_at: new Date('2022-07-26 09:49:27'),
            last_update: new Date('2022-07-26 09:49:27')
          },
        ] as Branch[]
      }
      loadBranchData();

      return {
        columns,
        branchData,
      }
    },
  }

</script>

<!-- <style lang="scss">
@import '../../css/app.scss';
.branches-page {
  .text-h5 {
    color: $muted-color;
  }
}
</style> -->
