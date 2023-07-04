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
            <q-btn :disable="msg==''" @click="SendMsg" :label="t('backOrder.sms.send')" class="bg-primary text-white"></q-btn>
            <q-btn @click="msg=''" :label="t('common.cancel')" class="text-primary q-ml-md"></q-btn>
          </div>
      </div>
    </div>

    <div class="notes">
      <ol>
        <li><strong style="color: red;">{{t('applicant.smsNotes.note')}}</strong></li>
        <div class="q-ml-sm">
          <li><strong>{{t('applicant.smsNotes.note1')}}</strong></li>
          <li><strong>{{t('applicant.smsNotes.note2')}}</strong></li>
          <li><strong>{{t('applicant.smsNotes.note3')}}</strong></li>
          <li><strong>{{t('applicant.smsNotes.note4')}}</strong></li>
          <li><strong>{{t('applicant.smsNotes.note5')}}</strong></li>
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
          {{t('applicant.add.status')}}
        </div>
        <div class="col-4 q-pl-sm">
          {{t('applicant.add.applicationDate')}}
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <q-input v-model="keyword" class="bg-white" dense :label="t('common.searchKeyword')"/>
        </div>
        <div class="col-4 q-pl-sm">
          <q-select class="bg-white" outlined v-model="status" dense clearable emit-value map-options :options="statusOption" />
        </div>
        <div class="col-4 q-pl-sm">
          <q-input v-model="date" :mask="yyyy/mm/dd" dense outlined type="date" class="bg-white"/>
        </div>
      </div>
      <div class="row q-mb-sm q-mt-sm">
        <q-btn @click="search" :label="t('common.search')" class="bg-primary text-white"></q-btn>
        <q-btn @click="clear" :label="t('common.clear')" class="text-primary q-ml-md"></q-btn>
      </div>
    <q-table
    :columns="destinationApplicant"
    :loading="loading"
    :rows-per-page="row.length"
    :rows="row"
    row-key="id"
    class="no-shadow"
    table-class="text-grey-8"
    table-header-class="text-grey-9">

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
        {{ props.row.name }}
        <br />
        {{ props.row.applicationDate }}
      </q-td>
    </template>

    <template v-slot:body-cell-status="props">
      <q-td :props="props" class="no-wrap q-pa-none">
        {{t(`applicant.statusOption.${props.row.status}`)}}
      </q-td>
    </template>

    <template v-slot:body-cell-occupationAdress="props">
      <q-td v-if="props.row.classification" :props="props" class="no-wrap q-pa-none">
        {{ t(`applicant.add.${props.row.occupation}`) }}/ {{t(`applicant.list.info.classification.${props.row.classification}`) }}
        <br />
        {{ props.row.address }}
      </q-td>
      <q-td v-else :props="props" class="no-wrap q-pa-none">
        {{t(`applicant.add.${props.row.occupation}`) }}
        <br />
        {{ props.row.address }}
      </q-td>
    </template>

    <template v-slot:body-cell-qualificationExp="props">
      <q-td :props="props" class="no-wrap q-pa-none">
        <div v-for="qua in props.row.qualification" :key="qua">
          {{ t(`applicant.add.${qua}`) }}
        </div>
        {{ props.row.totalYear }}
      </q-td>
    </template>

    <template v-slot:body-cell-lineStation="props">
      <q-td v-if="props.row.nearestStation" :props="props" class="no-wrap q-pa-none">
        {{props.row.route}}/ {{ props.row.nearestStation }}
      </q-td>
      <q-td v-else :props="props" class="no-wrap q-pa-none">
        {{props.row.route}}
      </q-td>
    </template>
  </q-table>
  </div>
  </q-card-section>

  </template>

  <script lang="ts" setup>
  import { ref,onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
  import { destinationApplicant,options } from 'src/pages/user/Applicant/const/sms';
  import { collection, query, where, getDocs,getFirestore ,addDoc,serverTimestamp} from 'firebase/firestore';
  import { statusList} from 'src/shared/constants/Applicant.const';

  const loading = ref(false)
  const statusOption = ref(statusList)
  const selected = ref({})
  const msg = ref('')
  const row = ref([])
  const keyword = ref(null)
  const status = ref(null)
  const date = ref(null)
  const db = getFirestore()
  const template = ref(null)

  const $q = useQuasar();
  const { t } = useI18n({ useScope: 'global' });


  const SendMsg = async () => {
    try {
      const selectedItems = Object.values(selected.value).filter((item) => item.selected === true);
      if(selectedItems.length==0){
        Alert.warning($q, t)
        return;
      }
      for (const item of selectedItems) {
          await addDoc(collection(db, 'sms'), {
            'to':item.Number,
            'body':msg.value,
            'created_at':serverTimestamp(),
          });
      }
      Alert.success($q, t)
    } catch (error) {
      Alert.warning($q, t)
    }
  };

  const updateSelected = (rowItem) => {
    selected.value[rowItem.id]['selected'] = !selected.value[rowItem.id]['selected']
  };

  const formatDate= (date,filteredData)=> {
  date = date.split('-').join('/')
  return filteredData.value.filter((item) => item.applicationDate === date);
  }

  const search = ()=>{
    loading.value = true;
    if(status.value || keyword.value || date.value){

      let filteredData = row;

    if(status.value)
      filteredData.value = filteredData.value.filter((item) => item.status === status.value);

    if(date.value)
      filteredData.value = formatDate(date.value,filteredData)

    if(keyword.value)
      filteredData.value = filteredData.value.filter((item) => item.name === keyword.value);

    row.value = filteredData.value
    }

      loading.value = false
  }

  const clear = ()=>{
      loading.value = true;
      status.value = null
    keyword.value = null
    date.value = null
    getApplicant()
    loading.value = false;
  }

  const getApplicant =async()=>{
    const collectionRef = collection(db, 'applicants');
    const q = query(collectionRef, where('phone', '!=', null));
    const querySnapshot = await getDocs(q);

    row.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.applicationDate) {
        const timestamp = data.applicationDate;
        const date = timestamp.toDate();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        data.applicationDate = `${year}/${month}/${day}`;
      }
      selected.value[data.id] = {
        'Number':data.phone,
        'selected':false,
      }
      return data;
    });

  }

  onMounted(async () => {
    loading.value = true;
  await getApplicant();
  loading.value = false
  });

  </script>



