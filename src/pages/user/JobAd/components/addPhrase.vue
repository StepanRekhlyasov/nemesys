<template>
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="formatForm" @submit="savePhrase">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="hideDrawer" />
                      <div class="q-mr-sm">
                          <div>
                              {{ phraseCategoryText }}
                          </div>
                          <div class="text-h6">{{ phraseData['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="phraseData['id'] ? $t('phraseSettings.add.phraseUpdate') : $t('phraseSettings.add.phraseReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="isDrawer">
              <div class="row">
                  {{ $t('phraseSettings.add.phraseName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="phraseData['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-mt-sm">
                  {{ $t('phraseSettings.add.phraseContent') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="phraseData['content']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>


              <div class="row text-primary text-body1 q-pt-sm">
                  ■  {{ $t('phraseSettings.add.phraseInfo') }}
              </div>


              <div class="row">
                  <div class="col-6">
                      {{ $t('phraseSettings.add.phraseCategory') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-6">
                      {{ $t('jobAd.add.media') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-6 q-pr-sm">
                      <q-select outlined dense :options="phraseCategoryOptions" emit-value map-options
                          v-model="phraseData['phraseCategory']" lazy-rules hide-bottom-space
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!phraseData['phraseCategory']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-6">
                      <q-select outlined dense :options="mediaOptions" emit-value map-options hide-bottom-space
                          v-model="phraseData['media']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!phraseData['media']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row q-mt-sm">
                  {{ $t('phraseSettings.add.phraseDesc') }}
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="phraseData['desc']" hide-bottom-space />
                  </div>
              </div>

              <!-- <div class="row q-mt-md">
                  {{ $t('formatSetting.add.formatting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add" />
              </div> -->
              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('phraseSettings.add.recruitmentItemRefer') }}
              </div>
              <div v-for="item in jobItems" :key="item['id']">
                  <div class="row q-mt-sm">
                      <div class="col-6">
                          {{ $t('phraseSettings.add.recruitmentItemName') }}
                      </div>
                      <div class="col-6">
                          {{ $t('phraseSettings.add.dataType') }}
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-6 q-pr-sm">
                          <q-input outlined dense v-model="item['name']" color="primary" hide-bottom-space readonly
                              class="primary text-primary" />
                      </div>
                      <div class="col-6">
                          <q-input outlined dense v-model="item['dataType']" hide-bottom-space readonly />
                      </div>
                  </div>

                  <div class="row q-mt-sm">
                      {{ $t('phraseSettings.add.choice') }}
                  </div>

                  <q-table :columns="columns" :rows="jobItemOptions[item['id']]" row-key="id"
                      class="no-shadow q-mt-sm" hide-pagination dense :loading="loading">
                      <template v-slot:body-cell-edit="props">
                          <q-td :props="props">
                              <q-btn flat round size="sm" icon="menu" color="primary" />
                          </q-td>
                      </template>
                  </q-table>

              </div>



          </q-card-section>
      </q-form>

  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from 'firebase/auth';
import { ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { mediaList, phraseCategoryList, jobItemOptionColumns } from 'src/shared/constants/JobAd.const';

import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';


const props = defineProps({
  selectedPhrase: {
      type: Object,
      required: true
  },
  isDrawer: {
      type: Boolean,
      required: true
  }
}
)

const emit = defineEmits<{
  (e: 'hideDrawer')
}>()

const hideDrawer = () => {
  phraseData.value = { ...phraseDataObject }
  emit('hideDrawer')
}

const db = getFirestore();
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const auth = getAuth();
const phraseDataObject = {
  id: props?.selectedPhrase['id'] || null,
  name: props?.selectedPhrase['name'] || '',
  content: '',
  phraseCategory: '',
  desc: props?.selectedPhrase['desc'] || '',
  media: props?.selectedPhrase['media'] || '',
  recruitmentItemName: props?.selectedPhrase['recruitmentItemName'] || '',
  dataType: props?.selectedPhrase['dataType'] || '',

}
const phraseData = ref({ ...phraseDataObject })
const phraseCategoryText = ref('')
const formatForm = ref();
const phraseCategoryOptions = ref(phraseCategoryList);
const mediaOptions = ref(mediaList);
const columns = ref(jobItemOptionColumns);

const jobItems = ref({});
const jobItemOptions = ref({});

const loading = ref(true);

onMounted(async () => {
  phraseData.value.phraseCategory = props?.selectedPhrase['phraseCategory'] || '';
  phraseData.value.content = props?.selectedPhrase['content'] || '';
})


watch(
  () => (phraseData.value.phraseCategory),
  (newVal,) => {
      phraseCategoryText.value = '';

      const obj = phraseCategoryList.value.find(o => o.value === newVal);
      if (obj) {
          phraseCategoryText.value = obj.label;
      }
  }
)

watch(
  () => (phraseData.value.content),
  async (newVal,) => {
      let parsed = newVal.match(/(?<=\{).+?(?=\})/g);
      if (parsed) {
          for (var i = 0; i < parsed.length; i++) {
              const q = query(collection(db, 'jobItem'), where('deleted', '==', false), where('name', '==', parsed[i]));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach(async (doc) => {
                  let data = doc.data();
                  if (data['dataType']) {
                      data['dataType'] = t('jobItem.dataTypeList.' + data['dataType']);
                  }
                  jobItems.value[doc.id] = data;
                  const qOption = query(collection(db, 'jobItem', doc.id, 'options'), where('deleted', '==', false));
                  const querySnapshotqOption = await getDocs(qOption);
                  let items = []
                  loading.value = true;
                  querySnapshotqOption.forEach((docOption) => {
                      items.push(docOption.data() as never);
                  });
                  jobItemOptions.value[doc.id] = items;
                  loading.value = false;

              });

          }
      }
  }
)


const savePhrase = async () => {
  let data = phraseData.value;
  data['updated_at'] = serverTimestamp();

  try {
      if (data['id']) {
          const formartRef = doc(db, 'jobPhrase/' + data['id']);
          data['updated_by'] = auth.currentUser?.uid;
          await updateDoc(formartRef, data);
          hideDrawer()

      } else {
          data['created_at'] = serverTimestamp();
          data['deleted'] = false;
          data['created_by'] = auth.currentUser?.uid;
          const docRef = doc(collection(db, 'jobPhrase'));
          data['id'] = docRef.id;

          await setDoc(docRef,
              data
          );
          console.log('Document written with ID: ', docRef.id);
          hideDrawer();
      }

      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });
      //phraseData.value = { ...phraseDataObject }
      formatForm.value.resetValidation();
  } catch (error) {
      console.log(error);
      $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: t('failed'),
      });
  }

}
</script>
