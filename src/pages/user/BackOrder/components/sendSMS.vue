<template>
<q-card-section>
  <div class="row bg-white" style="width:100%">
    <p class="text-h7 text-primary">■{{ t('backOrder.sms.SendContent') }}</p>
  </div>
  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm">
    <p>{{t('backOrder.sms.form')}}</p>
  </div>

  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl">
    <div class="col-2 q-pl-xl">
      <p>{{t('backOrder.sms.template')}}</p>
    </div>
      <div class="col-3 q-pl-sm">
        <q-select class="bg-white" outlined v-model="template"
            :options="options"
             dense />
    </div>
  </div>

  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm q-pb-sm" style="width:100%">
    <div class="col-2 q-pl-xl">
      <p>{{t('backOrder.sms.Content')}}</p>
    </div>
      <div class="col-3" style="width:80%">
        <textarea v-model="msg" class="bg-white" outlined dense style="border-radius: 5px; height: 150px; width: 90%; padding: 5px;resize:none"></textarea>
        <div>
          <p>46 {{t('backOrder.sms.characters')}}</p>
        </div>
        <div class="row">
          <q-btn @click="SendMsg" :label="t('backOrder.sms.send')" class="bg-primary text-white"></q-btn>
          <q-btn @click="msg=''" :label="t('common.cancel')" class="text-primary q-ml-md"></q-btn>
        </div>
    </div>
  </div>
  <div class="destination">
    <div class="row bg-white">
      <p class="text-h7 text-primary">■{{ t('client.list.destination') }} {{ t('report.categories.applicant') }}</p>
    </div>
    <div class="row text-grey">
      <div class="col-4">
      </div>
      <div class="col-4 q-pl-sm">
        {{t('applicant.add.status')}}
      </div>
      <div class="col-4 q-pl-sm">
        {{t('applicant.add.applicationDate')}}
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <q-input class="bg-white" dense :label="t('common.searchKeyword')"/>
      </div>
      <div class="col-4 q-pl-sm">
        <q-select class="bg-white" outlined v-model="template" :options="options" dense />
      </div>
      <div class="col-4 q-pl-sm">
        <q-input v-model="date" outlined type="date" class="bg-white"/>
      </div>
    </div>
    <div class="row q-mb-sm">
      <q-btn @click="search" :label="t('common.search')" class="bg-primary text-white"></q-btn>
      <q-btn @click="clear" :label="t('common.clear')" class="text-primary q-ml-md"></q-btn>
    </div>
  <q-table
  :columns="destinationApplicant"
  hide-pagination
  :rows="row"
  row-key="id"
  class="no-shadow"
  table-class="text-grey-8"
  table-header-class="text-grey-9">\

  <template v-slot:header-cell-staffApplication="props">
    <q-th :props="props" class="q-pa-none">
      <div> {{ $t('applicant.list.name') }} </div>
      <div> {{ $t('applicant.list.info.date') }} </div>
    </q-th>
  </template>

  <template v-slot:header-cell-occupationAdress="props">
    <q-th :props="props" class="q-pa-none">
      <div> {{ $t('applicant.add.occupation') }} </div>
      <div> {{ $t('applicant.list.info.addres') }} </div>
    </q-th>
  </template>

  <template v-slot:header-cell-qualificationExp="props">
    <q-th :props="props" class="q-pa-none">
      <div> {{ $t('applicant.add.qualification') }}/{{ $t('applicant.list.experience') }} </div>
    </q-th>
  </template>

  <template v-slot:body-cell-selected="props">
    <q-td :props="props" class="no-wrap q-pa-none">
      <q-checkbox
        v-model="props.row.selected"
        :true-value="props.row"
        :false-value="null"
        @click="updateSelected(props.row)"
      />
    </q-td>
  </template>

  <template v-slot:body-cell-staffApplication="props">
    <q-td :props="props" class="no-wrap q-pa-none">
      {{ props.row.staffName }}
      <br />
      {{ props.row.applicationDate }}
    </q-td>
  </template>

  <template v-slot:body-cell-occupationAdress="props">
    <q-td :props="props" class="no-wrap q-pa-none">
      {{ props.row.occupation }}
      <br />
      {{ props.row.address }}
    </q-td>
  </template>

  <template v-slot:body-cell-qualificationExp="props">
    <q-td :props="props" class="no-wrap q-pa-none">
      {{ props.row.qualification }}/{{ props.row.experience }}
    </q-td>
  </template>

</q-table>

</div>
</q-card-section>

</template>

<script lang="ts" setup>
import { ref,computed,set } from 'vue';
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { destinationApplicant,options } from 'src/pages/user/BackOrder/consts/BackOrder.const';

const selected = ref([])
const msg = ref('')
const row = ref([
  {
    'staffName':'name1',
    'applicationDate':'2021/10/11',
    'staffRank':'A',
    'applicationStatus':'Unsupported',
    'qualification':'Registered Nurse',
    'experience':'3 years',
    'occupation':'Nursing',
    'address':'Shibuya-ku, Tokyo',
    'station':'Shinsen station',
  },
  {
    'staffName':'name2',
    'applicationDate':'2021/10/11',
    'staffRank':'A',
    'applicationStatus':'Unsupported',
    'qualification':'Registered Nurse',
    'experience':'3 years',
    'occupation':'Nursing',
    'address':'Shibuya-ku, Tokyo',
    'station':'Shinsen station',
  },
  {
    'staffName':'name3',
    'applicationDate':'2021/10/11',
    'staffRank':'A',
    'applicationStatus':'Unsupported',
    'qualification':'Registered Nurse',
    'experience':'3 years',
    'occupation':'Nursing',
    'address':'Shibuya-ku, Tokyo',
    'station':'Shinsen station',
  },
  {
    'staffName':'name3',
    'applicationDate':'2021/10/11',
    'staffRank':'A',
    'applicationStatus':'Unsupported',
    'qualification':'Registered Nurse',
    'experience':'3 years',
    'occupation':'Nursing',
    'address':'Shibuya-ku, Tokyo',
    'station':'Shinsen station',
  },
  {
    'staffName':'name3',
    'applicationDate':'2021/10/11',
    'staffRank':'A',
    'applicationStatus':'Unsupported',
    'qualification':'Registered Nurse',
    'experience':'3 years',
    'occupation':'Nursing',
    'address':'Shibuya-ku, Tokyo',
    'station':'Shinsen station',
  },
])

const template = ref(null)

const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });


const SendMsg = ()=>{
  console.log(msg.value)
  console.log(selected.value)
}

const updateSelected = (rowItem) => {
  // const index = row.value.findIndex((r) => r === rowItem);
  // if (index !== -1) {
  //   if (rowItem.selected) {
  //     set(selected.value, index, rowItem);
  //   } else {
  //     set(selected.value, index, null);
  //   }
  // }
  console.log(rowItem);
};

const search = ()=>{
  //
}

const clear = ()=>{
  //
}

</script>



