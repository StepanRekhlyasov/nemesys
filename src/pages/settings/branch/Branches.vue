<template>
  <div class="branches-page text-caption text-weight-medium">
    <div class="navigation q-pt-md q-pl-md q-pr-md">
      <div v-html="$t('menu.branches')" class="text-h5"></div>
    </div>
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pb-md q-pr-md">
        <div v-html="$t('menu.branches')" class="card-title"></div>
        <q-btn color="primary" text-color="white" @click="openModal = true">
          {{ $t('settings.branch.addBranch') }}
        </q-btn>
      </div>
    </q-card>
    <q-card class="q-ma-md q-pt-md q-pl-md q-pb-md q-pr-md">
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
  <q-dialog v-model="openModal" persistent>
    <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{$t('settings.branch.create_branch')}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form
            ref="branchForm">
            <div class="row q-gutter-md">
              <q-input class="col" :label="$t('settings.branch.name')" stack-label v-model="branchModalData['name']" />
              <q-toggle class="col" :label="$t('settings.branch.office')"  v-model="branchModalData['office']"/>
            </div>
            <div class="row q-gutter-md">
              <q-input class="col" :label="$t('settings.branch.prefectures')" stack-label v-model="branchModalData['prefectures']" />
              <q-input class="col" :label="$t('settings.branch.municipalities')" stack-label v-model="branchModalData['municipalities']" />
            </div>
            <div class="row">
              <q-input class="col" :label="$t('settings.branch.addres')" stack-label v-model="branchModalData['addres']" />
            </div>
            <div class="row q-gutter-md">
              <q-input class="col" :label="$t('settings.branch.phone')" stack-label v-model="branchModalData['phone']" />
              <q-input class="col" :label="$t('settings.branch.fax')" stack-label v-model="branchModalData['fax']" />
            </div>
            <div class="row q-gutter-md">
              <q-input class="col" :label="$t('settings.branch.email')" stack-label v-model="branchModalData['email']" />
              <div class="col"></div>
            </div>
            <div class="row q-gutter-md">
              <q-toggle class="col" :label="$t('settings.branch.car_commuting')"  v-model="branchModalData['car_commuting']"/>
              <q-toggle class="col" :label="$t('settings.branch.eat_cigarettes')"  v-model="branchModalData['eat_cigarettes']"/>
            </div>
            <div class="row q-gutter-md">
              <q-toggle class="col" :label="$t('settings.branch.garage')"  v-model="branchModalData['garage']"/>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="close" v-close-popup />
          <q-btn flat label="Ok" v-close-popup />
        </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { Branch } from '../../../shared/model/Branch.model';
  import { dataTimeFormat } from '../../../shared/constants/Table.const';
  import { useI18n } from 'vue-i18n';
  import { Ref, ref } from 'vue';
  import { QTableColumn } from 'quasar';
  import { serverTimestamp } from '@firebase/firestore';
  export default {
    name: 'BranchesPage',
    setup() {
      const { t } = useI18n({ useScope: 'global' });
      const openModal = ref(false);
      const branchForm = ref(null);
      const branchDataSample = {
        office: false,
        car_commuting: false,
        eat_cigarettes: false,
        garage: false
      };
      const branchModalData = ref(JSON.parse(JSON.stringify(branchDataSample)));

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
        openModal,
        branchForm,
        branchModalData,
        initialPagination: {
          sortBy: 'desc',
          descending: false,
          rowsPerPage: 25,
        },
        onSubmit() {
          let data = branchModalData.value;
          data['created_at'] = serverTimestamp();
          data['updated_at'] = serverTimestamp();
          data['deleted'] = false;
        }
      }
    },
  }

</script>

<style lang="scss">
@import 'src/css/imports/colors';

</style>
