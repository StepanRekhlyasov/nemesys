<template>
  <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
   elevated bordered>
   <q-scroll-area class="fit text-left">
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="formatForm" @submit="savePhrase">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close"  @click="drawerRight = !drawerRight" />
                      <div class="q-mr-sm">
                          <div>
                              {{ phraseCategoryText }}
                          </div>
                          <div class="text-h6">{{ selectedJobPhrase['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="selectedJobPhrase['id'] ? $t('phraseSettings.add.phraseUpdate') : $t('phraseSettings.add.phraseReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="drawerRight">
              <div class="row">
                  {{ $t('phraseSettings.add.phraseName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedJobPhrase['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-mt-sm">
                  {{ $t('phraseSettings.add.phraseContent') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedJobPhrase['content']" hide-bottom-space lazy-rules
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
                          v-model="selectedJobPhrase['phraseCategory']" lazy-rules hide-bottom-space
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedJobPhrase['phraseCategory']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-6">
                      <q-select outlined dense :options="mediaOptions" emit-value map-options hide-bottom-space
                          v-model="selectedJobPhrase['media']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedJobPhrase['media']" v-slot:selected>
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
                      <q-input outlined dense v-model="selectedJobPhrase['desc']" hide-bottom-space />
                  </div>
              </div>
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
  </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>
import { Ref,ref, watch, onMounted,computed,ComputedRef } from 'vue';
import { mediaList, phraseCategoryList, jobItemOptionColumns } from 'src/shared/constants/JobAd.const';
import { useJobPhrase } from 'src/stores/jobPhrase'
import { Alert } from 'src/shared/utils/Alert.utils';
import { PhraseDataObject } from 'src/shared/model/Jobs.model';
import { QForm } from 'quasar';

const jobPhraseStore = useJobPhrase()
const drawerRight = ref(false)
const phraseCategoryText = ref('')
const formatForm:Ref<QForm | null | undefined>  = ref();
const phraseCategoryOptions = ref(phraseCategoryList);
const mediaOptions = ref(mediaList);
const columns = ref(jobItemOptionColumns);
const jobItems = ref({});
const jobItemOptions = ref({});
const loading = ref(true);
const selectedJobPhrase = ref<PhraseDataObject | ComputedRef>(
  computed(() => jobPhraseStore.state.selectedJobPhrase)
);

onMounted(async () => {
  selectedJobPhrase.value.phraseCategory = selectedJobPhrase.value['phraseCategory'] || '';
  selectedJobPhrase.value.content = selectedJobPhrase.value['content'] || '';
})

watch(
  () => (selectedJobPhrase.value.phraseCategory),
  (newVal,) => {
      phraseCategoryText.value = '';

      const obj = phraseCategoryList.value.find(o => o.value === newVal);
      if (obj) {
          phraseCategoryText.value = obj.label;
      }
  }
)
const showDrawerWithData = async (data: PhraseDataObject) => {
  if (selectedJobPhrase.value.id && selectedJobPhrase.value.id !== data.id) {
    drawerRight.value = false;
  }
  jobPhraseStore.state.selectedJobPhrase = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  jobPhraseStore.state.selectedJobPhrase={}
  drawerRight.value = true
}
const savePhrase = async () => {
  try {
      if (selectedJobPhrase.value.id) {

          await jobPhraseStore.updateFormData(selectedJobPhrase.value)
          drawerRight.value=false

      } else {
         await jobPhraseStore.addFormData(selectedJobPhrase.value)
         drawerRight.value=false
      }
     Alert.success()
      formatForm.value?.resetValidation();
  } catch (error) {
     Alert.warning(error)
  }

}
defineExpose({ showDrawerWithData ,openDrawer})
</script>
