<template>
  <q-card-section>
    <div class="contentsOfTransmission">
      <div class="row bg-white cover">
        <p class="text-h7 text-primary">■{{ t('backOrder.sms.sendContent') }}</p>
      </div>

      <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm">
        <div class="col-2 q-pl-xl">
          <p>{{ t('backOrder.sms.template') }}</p>
        </div>
        <div class="col-3 q-pl-sm">
          <q-select class="bg-white" :label="t('common.pleaseSelect')" outlined v-model="template" :options="templates"
            dense clearable />
        </div>
      </div>

      <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm q-pb-sm cover">
        <div class="col-2 q-pl-xl">
          <p>{{ t('backOrder.sms.sendContent') }}</p>
        </div>
        <div class="col-3 cover80">
          <textarea v-model="message" class="bg-white SmsContent" outlined dense :style="{ whiteSpace: 'pre-wrap' }">
          </textarea>
          <div>
            <p>{{ countCharacters(message) }} {{ t('backOrder.sms.characters') }}</p>
          </div>
          <div class="row">
            <q-btn :disable="message === ''" @click="sendMsg" :label="t('backOrder.sms.send')"
              class="bg-primary text-white"></q-btn>
            <q-btn @click="message = ''" :label="t('common.cancel')" class="text-primary q-ml-md"></q-btn>
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
          <q-input v-model="date" dense outlined type="date" class="bg-white" />
        </div>
      </div>
      <div class="row q-mb-sm q-mt-sm">
        <q-btn @click="search" :label="t('common.search')" class="bg-primary text-white"></q-btn>
        <q-btn @click="clear" :label="t('common.clear')" class="text-primary q-ml-md"></q-btn>
      </div>
      <q-table :columns="destinationApplicant" :loading="loading" :rows-per-page="row.length" :rows="row" row-key="id"
        class="no-shadow" table-class="text-grey-8" table-header-class="text-grey-9"
        :rows-per-page-label="t('backOrder.sms.recordsPerPage')">

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
            <q-checkbox v-model="props.row.selected"  :true-value="props.row" :false-value="null"
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
          <q-td v-if="Array.isArray(props.row.classification)" :props="props" class="no-wrap q-pa-none">
            {{ t(`applicant.add.${props.row.occupation}`) }}/
            {{ props.row.classification.map(((row : string)=>t(`applicant.list.info.classification.${row.toLowerCase()}`))).join(', ') }}
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
              {{ t(`applicant.qualification.${q}`) }}
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
import { ref, onMounted, ComputedRef, watch, onBeforeMount } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { destinationApplicant } from 'src/pages/user/Applicant/const/sms';
import { useSMS } from 'src/stores/sms'
import { useApplicant } from 'src/stores/applicant'
import { DocumentData, where } from 'firebase/firestore';
import { statusList, StatusOption } from 'src/shared/constants/Applicant.const';
import { Applicant } from 'src/shared/model/Applicant.model'
import { QSelectProps } from 'quasar';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';


const loading = ref<boolean>(false)
const statusOption = ref<StatusOption | ComputedRef>(statusList)
const selected = ref<Record<string, { selected: boolean; phoneNumber: string | undefined }>>({})
const message = ref<string>('')
const row = ref<Applicant[]>([])
const keyword = ref<string | null>(null)
const status = ref<string | null>(null)
const date = ref<string | null>(null)
const template = ref<string | null>(null)
const getApplicant = useApplicant();
const templates = ref<DocumentData | QSelectProps>([]);
const smsStore = useSMS();
const numberProp = defineProps({
  phoneNumber: String
})

const { t } = useI18n({ useScope: 'global' });

const countCharacters = (message) => {
  const lineBreaks = message.match(/\r\n|\r|\n/g);
  const lineBreakCount = lineBreaks ? lineBreaks.length : 0;
  const characterCount = message.length;
  const totalCount = characterCount + lineBreakCount;
  return totalCount;
}

watch(template, (newTemplate) => {
  if (newTemplate) {
    const subject = newTemplate.subject
    const content = newTemplate.contents
    message.value = `${subject}\n\n${content}`;

  }
  else {
    message.value = ''
  }
})

const sendMsg = async () => {
  try {
    await smsStore.send(message.value, selected.value)

    message.value = ''
  } catch (error) {
    Alert.warning(error)
  }
}

onBeforeMount(async () => {
  row.value = await smsStore.filterData(status.value, keyword.value, date.value);
})

const updateSelected = (rowItem: Applicant) => {
  selected.value[rowItem.id]['selected'] = !selected.value[rowItem.id]['selected']
};

const search = async () => {
  loading.value = true
  row.value = await smsStore.filterData(status.value, keyword.value, date.value);
  loading.value = false
}

const getFormatedData = async () => {
  const data = await getApplicant.getApplicantsByConstraints([where('deleted', '==', false)]);
  return smsStore.getApplicantWithFormatedDate(data)
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
  await fetchData()
});


async function fetchData() {
  templates.value = await smsStore.options
  loading.value = true;
  row.value = await getFormatedData();
  row.value.forEach(data => {
    selected.value[data['id']] = {
      'phoneNumber': data['phone'],
      'selected': false,
    }
  });
  if (numberProp.phoneNumber) {
    row.value = row.value.filter((e) => { 
      if(e.phone === numberProp.phoneNumber) {
        e.selected = e;
        selected.value[e.id]['selected'] = true;
        return true;
      }
      return false;
    });
  }
  loading.value = false
}

watchCurrentOrganization(async () => {
  await fetchData()
})

</script>

<style scoped>
.contentsOfTransmission {
  overflow-x: hidden;
}

.destination {
  width: 950px;
  overflow-x: auto;
}

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

h1 {
  color: Green;
}
</style>

