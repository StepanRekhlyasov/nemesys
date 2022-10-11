<template>
  <div class="text-caption text-weight-medium">
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('menu.users')" class="text-h5"></div>
        <q-btn color="white" text-color="black" to="/system/users/add">
          {{ $t('settings.users.addUser') }}
        </q-btn>
      </div>
    </q-card>
    <q-card class="q-ma-md">
      <q-table
        dense
        :rows="accauntData"
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
        <template v-slot:body-cell-manager="props">
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
              icon="mdi-account-edit-outline"
              @click="$router.push('/clientDetail/' + props.row.id)"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script lang="ts">
  import { Accaunt } from '../../shared/model/Accaunt.model';
  import { dataTimeFormat } from '../../shared/constants/Table.const';
  import { useI18n } from 'vue-i18n';
  import {
    getFirestore,
  } from 'firebase/firestore';
  import { Ref, ref } from 'vue';
  import { QTableColumn } from 'quasar';
  export default {
    name: 'UserList',
    setup() {
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      console.log(db)
      const accauntData: Ref<Accaunt[]> = ref([])
      const columns:QTableColumn[] = [
        {
          name: 'email',
          required: true,
          label: t('settings.users.email'),
          sortable: true,
          align: 'left',
          field: 'email'
        },
        {
          name: 'person_name',
          required: true,
          label: t('settings.users.person_name'),
          sortable: true,
          align: 'left',
          field: 'person_name'
        },
        {
          name: 'branch_name',
          required: true,
          label: t('settings.users.branch_name'),
          align: 'left',
          field: 'branch_name'
        },
        {
          name: 'manager',
          label: t('settings.users.manager'),
          align: 'left',
          field: 'manager'
        },
        {
          name: 'hidden',
          label: t('settings.users.hidden'),
          align: 'left',
          field: 'hidden'
        },
        {
          name: 'create_at',
          label: t('settings.users.create_at'),
          align: 'left',
          field: 'create_at',
          format: dataTimeFormat
        },
        {
          name: 'last_update',
          label: t('settings.users.last_update'),
          align: 'left',
          field: 'last_update',
          format: dataTimeFormat
        },
        { name: 'actions', label: '', field: '', align: 'center' },
      ]
      const loadAccauntData = ():void => {
        accauntData.value = [{
          email: 'master@opus.co.jp',
          person_name: '管理者',
          branch: {
            name: '本社',
            id: 1,
            prefectures: '東京都',
            flug: '有効',
            hidden: false,
            create_at: new Date('2022-07-26 09:43:42'),
            last_update: new Date('2022-07-26 09:43:42')
          },
          manager: true,
          hidden: false,
          create_at: new Date('2022-07-26 09:43:42'),
          last_update: new Date('2022-07-26 09:43:42')
        },{
          email: 'testuser01@opus.co.jp',
          person_name: '大白テ　テストユーザー',
          branch: {
            id: 2,
            name: '東京支店',
            prefectures: '東京都',
            flug: '有効',
            hidden: true,
            create_at: new Date('2022-07-26 09:49:00'),
            last_update: new Date('2022-07-26 09:49:33')
          },
          manager: true,
          hidden: false,
          create_at: new Date('2022-07-26 09:43:42'),
          last_update: new Date('2022-07-26 09:43:42')
        },{
          email: 'testuser02@opus.co.jp',
          person_name: '大白テ　テストユーザー２',
          branch: {
            id: 3,
            name: '大阪支店',
            prefectures: '大阪府',
            flug: '有効',
            hidden: false,
            create_at: new Date('2022-07-26 09:49:27'),
            last_update: new Date('2022-07-26 09:49:27')
          },
          manager: false,
          hidden: false,
          create_at: new Date('2022-07-26 09:43:42'),
          last_update: new Date('2022-07-26 09:43:42')
        }]
      }
      loadAccauntData();

      return {
        accauntData,
        columns,
        initialPagination: {
          sortBy: 'desc',
          descending: false,
          rowsPerPage: 25,
        },
      }
    }
  }
</script>
