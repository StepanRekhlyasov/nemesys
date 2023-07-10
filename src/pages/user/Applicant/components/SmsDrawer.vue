<template>
  <q-card-section>
    <div class="row bg-white cover">
      <p class="text-h7 text-primary">■{{ t('backOrder.sms.sendContent') }}</p>
    </div>
    <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm">
      <p>{{ t('backOrder.sms.form') }}</p>
    </div>

    <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl">
      <div class="col-2 q-pl-xl">
        <p>{{ t('backOrder.sms.template') }}</p>
      </div>
      <div class="col-3 q-pl-sm">
        <q-select class="bg-white" outlined v-model="template" :options="options" dense />
      </div>
    </div>

    <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm q-pb-sm cover">
      <div class="col-2 q-pl-xl">
        <p>{{ t('backOrder.sms.content') }}</p>
      </div>
      <div class="col-3 cover80">
        <textarea v-model="messsage" class="bg-white SmsContent" outlined dense></textarea>
        <div>
          <p>46 {{ t('backOrder.sms.characters') }}</p>
        </div>
        <div class="row">
          <q-btn :disable="messsage === ''" @click="sendMsg" :label="t('backOrder.sms.send')"
            class="bg-primary text-white"></q-btn>
          <q-btn @click="messsage = ''" :label="t('common.cancel')" class="text-primary q-ml-md"></q-btn>
        </div>
      </div>
    </div>

    <div class="notes">
      <ol>
        <li><strong class="text-negative">{{ t('applicant.smsNotes.note') }}</strong></li>
        <div class="q-ml-sm">
          <li><strong>{{ t('applicant.smsNotes.note1') }}</strong></li>
          <li><strong>{{ t('applicant.smsNotes.note2') }}</strong></li>
          <li><strong>{{ t('applicant.smsNotes.note3') }}</strong></li>
          <li><strong>{{ t('applicant.smsNotes.note4') }}</strong></li>
          <li><strong>{{ t('applicant.smsNotes.note5') }}</strong></li>
        </div>
      </ol>
    </div>


    <div class="destination">
      <div class="row bg-white">
        <p class="text-h7 text-primary">■{{ t('client.list.destination') }} {{ t('report.categories.applicant') }}</p>
      </div>
      <div class="row text-grey">
        <div class="col-4">
        </div>
        <div class="col-4 q-pl-sm">
          {{ t('applicant.add.status') }}
        </div>
        <div class="col-4 q-pl-sm">
          {{ t('applicant.add.applicationDate') }}
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <q-input v-model="keyword" class="bg-white" dense :label="t('common.searchKeyword')" />
        </div>
        <div class="col-4 q-pl-sm">
          <q-select class="bg-white" outlined v-model="status" dense clearable emit-value map-options
            :options="statusOption" />
        </div>
        <div class="col-4 q-pl-sm">
          <q-input v-model="date"  dense outlined type="date" class="bg-white" />
        </div>
      </div>
      <div class="row q-mb-sm q-mt-sm">
        <q-btn @click="search" :label="t('common.search')" class="bg-primary text-white"></q-btn>
        <q-btn @click="clear" :label="t('common.clear')" class="text-primary q-ml-md"></q-btn>
      </div>
      <q-table :columns="destinationApplicant" :loading="loading" :rows-per-page="row.length" :rows="row" row-key="id"
        class="no-shadow" table-class="text-grey-8" table-header-class="text-grey-9">

        <template v-slot:header-cell-staffApplication="props">
          <q-th :props="props" class="q-pa-none">
            <div> {{ $t('applicant.list.name') }} </div>
            <div> {{ $t('applicant.list.info.date') }} </div>
          </q-th>
        </template>

        <template v-slot:header-cell-occupationAdress="props">
          <q-th :props="props" class="q-pa-none">
            <div> {{ $t('applicant.add.occupation') }}/ {{ t('applicant.list.info.classiffication') }} </div>
            <div> {{ $t('applicant.list.info.addres') }} </div>
          </q-th>
        </template>

        <template v-slot:header-cell-qualificationExp="props">
          <q-th :props="props" class="q-pa-none">
            <div> {{ $t('applicant.add.qualification') }}/{{ $t('applicant.list.experience') }} </div>
          </q-th>
        </template>

        <template v-slot:header-cell-lineStation="props">
          <q-th :props="props" class="q-pa-none">
            <div> {{ $t('applicant.attendant.route') }}/{{ $t('applicant.list.station') }} </div>
          </q-th>
        </template>

        <template v-slot:body-cell-selected="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            <q-checkbox v-model="props.row.selected" :true-value="props.row" :false-value="null"
              @click="updateSelected(props.row)" />
          </q-td>
        </template>

        <template v-slot:body-cell-staffApplication="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            {{ props.row.name }}
            <br />
            {{ props.row.applicationDate }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            {{ t(`applicant.statusOption.${props.row.status}`) }}
          </q-td>
        </template>

        <template v-slot:body-cell-occupationAdress="props">
          <q-td v-if="props.row.classification" :props="props" class="no-wrap q-pa-none">
            {{ t(`applicant.add.${props.row.occupation}`) }}/
            {{ t(`applicant.list.info.classification.${props.row.classification.toLowerCase()}`) }}
            <br />
            {{ props.row.address }}
          </q-td>
          <q-td v-else :props="props" class="no-wrap q-pa-none">
            {{ t(`applicant.add.${props.row.occupation}`) }}
            <br />
            {{ props.row.address }}
          </q-td>
        </template>

        <template v-slot:body-cell-qualificationExp="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            <div v-for="q in props.row.qualification" :key="q">
              {{ t(`applicant.add.${q}`) }}
            </div>
            {{ props.row.totalYear }}
          </q-td>
        </template>

        <template v-slot:body-cell-lineStation="props">
          <q-td v-if="props.row.nearestStation" :props="props" class="no-wrap q-pa-none">
            {{ props.row.route }}/ {{ props.row.nearestStation }}
          </q-td>
          <q-td v-else :props="props" class="no-wrap q-pa-none">
            {{ props.row.route }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-card-section>
</template>

<script lang="ts" setup>
import { ref, onMounted, ComputedRef } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { destinationApplicant, options } from 'src/pages/user/Applicant/const/sms';
import { useSMS } from 'src/stores/sms'
import { useApplicant } from 'src/stores/applicant'
import { where } from 'firebase/firestore';
import { statusList, StatusOption } from 'src/shared/constants/Applicant.const';
import { Applicant } from 'src/shared/model/Applicant.model'

const loading = ref<boolean>(false)
const statusOption = ref<StatusOption | ComputedRef>(statusList)
const selected = ref<Record<string, { selected: boolean; phoneNumber: string | undefined}>>({})
const messsage = ref<string>('')
const row = ref<Applicant[]>([])
const keyword = ref<string | null>(null)
const status = ref<string | null>(null)
const date = ref<string | null>(null)
const template = ref<string | null>(null)
const getApplicant = useApplicant();

const { t } = useI18n({ useScope: 'global' });

const sendMsg = async () => {
  try {
    await useSMS().send(messsage.value, selected.value)
    Alert.success()
    messsage.value = ''
  } catch (error) {
    Alert.warning(error)
  }
}

const updateSelected = (rowItem) => {
  selected.value[rowItem.id]['selected'] = !selected.value[rowItem.id]['selected']
};

const search = async () => {
  loading.value = true
  row.value = await useSMS().filterData(status.value, keyword.value, date.value);
  loading.value = false
}

const getFormatedData = async () => {
  const data = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]);
  return useSMS().getApplicantWithFormatedDate(data)
}

const clear = async () => {
  loading.value = true;
  status.value = null
  keyword.value = null
  date.value = null
  row.value = await getFormatedData();
  loading.value = false;
}

onMounted(async () => {
  loading.value = true;
  row.value = await getFormatedData();
  row.value.forEach(data => {
    selected.value[data['id']] = {
      'phoneNumber': data['phone'],
      'selected': false,
    }
  });
  loading.value = false
});

</script>

<style scoped>
.cover {
  width: 100%
}

.cover80 {
  width: 80%
}

.SmsContent {
  border-radius: 5px;
  height: 150px;
  width: 90%;
  padding: 5px;
  resize: none
}
</style>

