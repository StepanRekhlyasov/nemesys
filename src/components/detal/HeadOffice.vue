<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary">
      {{ $t('office.headOfficeInformation') }}
      <q-icon name="info" size="sm" />
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row rowBorder" v-for="(rowItem, index) in officeInfo" :key="index"
        :class="index % 2 == 0 ? 'background1' : 'bg-grey-2'">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label }}
        </div>
        <div class="q-pa-sm rightBorder" :class="rowItem.length > 1 ? 'col-3' : 'col-9'">
          {{ officeData[rowItem[0].name] }}
        </div>
        <div class="col-3 q-pa-sm rightBorder" v-if="rowItem.length > 1">
          {{ rowItem[1].label }}
        </div>
        <div class="col-3 q-pa-sm" v-if="rowItem.length > 1">
          {{ officeData[rowItem[1].name] }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-mt-sm">
      {{ $t('office.clientInformation') }}
      <q-icon name="info" size="sm" />
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row rowBorder" v-for="(rowItem, index) in clientInfo" :key="index"
        :class="index % 2 == 0 ? 'background1' : 'bg-grey-2'">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label }}
        </div>
        <div class="q-pa-sm rightBorder" :class="rowItem.length > 1 ? 'col-3' : 'col-9'">
          {{ officeData[rowItem[0].name] }}
        </div>
        <div class="col-3 q-pa-sm rightBorder" v-if="rowItem.length > 1">
          {{ rowItem[1].label }}
        </div>
        <div class="col-3 q-pa-sm" v-if="rowItem.length > 1">
          {{ officeData[rowItem[1].name] }}
        </div>
      </div>
    </q-card-section>


    <q-card-section class="q-pa-xs">
      <div class="row q-mt-xs ">
        {{ $t('office.companyProfile') }}
      </div>

      <div class="row bg-grey-2">
        <div class="col-12 q-pa-sm">
          {{ officeData['companyProfile'] }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary">
      {{ $t('office.latestHistory') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none q-mt-sm">
      <q-table :columns="columns" :rows="historyData" row-key="id" selection="multiple" v-model:selected="selected"
        v-model:pagination="pagination" hide-pagination>

      </q-table>
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-mt-sm">
      {{ $t('office.relatedOffice') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row rowBorder" v-for="(rowItem, index) in relatedOffice" :key="index"
        :class="index % 2 == 0 ? 'background1' : 'bg-grey-2'">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label }}
        </div>
        <div class="q-pa-sm rightBorder" :class="rowItem.length > 1 ? 'col-3' : 'col-9'">
          <q-btn flat dense unelevated color="primary" :label="officeData[rowItem[0].name]" size="sm" />
        </div>
        <div class="col-3 q-pa-sm rightBorder" v-if="rowItem.length > 1">
          {{ rowItem[1].label }}
        </div>
        <div class="col-3 q-pa-sm" v-if="rowItem.length > 1">
          <q-btn flat dense unelevated color="primary" :label="officeData[rowItem[1].name]" size="sm" />
        </div>
      </div>
    </q-card-section>


    <q-card-section class="q-pa-xs">
      <div class="row q-mt-xs">
        {{ $t('office.workingHours') }}
      </div>

      <div class="row q-mt-xs background1 rowBorder">
        <div class="col-3 q-pa-sm" v-for="(colItem, index) in employmentRecord" :key="index"
          :class="index < 3 ? 'rightBorder' : ''">
          {{ colItem.label }}
        </div>
      </div>
      <div class="row bg-grey-2">
        <div class="col-3 q-pa-sm" v-for="(colItem, index) in employmentRecord" :key="index"
          :class="index < 3 ? 'rightBorder' : ''">
          {{ officeData[colItem.name] }}
        </div>
      </div>
    </q-card-section>




  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';

export default {
  name: 'HeadOffice',

  props: {
    client: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const officeData = ref({})
    const historyData = ref([])
    const selected = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });


    const officeInfo = computed(() => {
      return [
        [
          {
            name: 'location',
            label: t('client.add.location'),
          },
        ],
        [
          {
            name: 'tel',
            label: t('office.officeTel'),
          },
          {
            name: 'fax',
            label: 'FAX',
          },
        ],
        [
          {
            name: 'personIncharge',
            label: t('client.list.personIncharge'),
          },
          {
            name: 'position',
            label: t('client.list.position'),
          },
        ],
        [
          {
            name: 'personInChargeTel',
            label: t('office.personInChargeTel'),
          },
          {
            name: 'contactAddress',
            label: t('office.contactAddress'),
          },
        ],
      ];
    });


    const clientInfo = computed(() => {
      return [
        [
          {
            name: 'representativeName',
            label: t('office.representativeName'),
          },
          {
            name: 'established',
            label: t('office.established'),
          },
        ],
        [
          {
            name: 'capital',
            label: t('office.capital'),
          },
          {
            name: 'earnings',
            label: t('office.earnings'),
          },
        ],
        [
          {
            name: 'numOffices',
            label: t('office.numOffices'),
          },
          {
            name: 'numberEmployees',
            label: t('office.numberEmployees'),
          },
        ],
      ];
    });


    const relatedOffice = computed(() => {
      return [
        [
          {
            name: 'office',
            label: t('office.office'),
          },
          {
            name: 'backOrder',
            label: t('office.backOrder'),
          },
        ]
      ];
    });

    const employmentRecord = computed(() => {
      return [
        {
          name: 'fullTimeEmployment',
          label: t('office.fullTimeEmployment'),
        },
        {
          name: 'nonRegularEmployment',
          label: t('office.nonRegularEmployment'),
        },
        {
          name: 'temporaryEmployee',
          label: t('office.temporaryEmployee'),
        },
        {
          name: 'originalOperation',
          label: t('office.originalOperation'),
        },
      ];
    });

    const columns = computed(() => {
      return [
        {
          name: 'created_by',
          required: true,
          label: t('detal.teleAppoint.registredUser'),
          align: 'left',
          field: 'created_by',
          sortable: false,
        },
        {
          name: 'created_at',
          required: true,
          label: t('detal.teleAppoint.date'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'result',
          required: true,
          label: t('detal.teleAppoint.teleAppointmentResult'),
          field: 'result',
          align: 'left',
        },
        {
          name: 'jobResult',
          label: t('detal.teleAppoint.jobResult'),
          field: 'jobResult',
          align: 'left',
        },
        {
          name: 'requiredService',
          label: t('detal.teleAppoint.requiredService'),
          field: 'requiredService',
          align: 'left',
        },
        {
          name: 'remark',
          label: t('detal.teleAppoint.remark'),
          field: 'remark',
          align: 'left',
        },
        {
          name: 'edit',
          align: 'left',
        }
      ];
    });



    loadofficeData()
    function loadofficeData() {
      console.log(props.client)
      officeData.value = {
        location: '東京都　渋谷区　町名番地1111-1111-1111　ビル名',
        tel: '00-0000-0000',
        fax: '00-0000-0000',
        personIncharge: 'いいい',
        position: '施設長',
        personInChargeTel: '000-0000-0000',
        contactAddress: 'xxx@xxx.com',
        representativeName: '田中　一郎',
        established: '2000.07',
        capital: '1,000,000',
        earnings: '１億（2022）',
        numOffices: '20',
        numberEmployees: '120',
        companyProfile: '不動産事業と介護事業を運営・・・・',
        office: '20件',
        backOrder: '3件',
        fullTimeEmployment: '2',
        nonRegularEmployment: '1',
        temporaryEmployee: '6',
        originalOperation: '2',

      }
    }


    return {
      officeInfo,
      officeData,
      clientInfo,
      columns,
      historyData,
      selected,
      pagination,
      relatedOffice,
      employmentRecord,


    };
  },
}
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}

.rowBorder {
  border-bottom: 1px solid white;
  border-top: 1px solid white;
}

.background1 {
  background-color: #E3ECF0;
}
</style>
