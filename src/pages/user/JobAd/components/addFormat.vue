<template>
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="formatForm" @submit="saveFormat">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="hideDrawer" />
                      <div class="q-mr-sm">
                          <div>
                              {{ transactionText }}
                              <span v-if="projectText">/ {{ projectText }}</span>
                          </div>
                          <div class="text-h6">{{ formartData['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="formartData['id'] ? $t('formatSetting.add.formatUpdate') : $t('formatSetting.add.formatReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="isDrawer">
              <div class="row">
                  {{ $t('formatSetting.add.formatName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="formartData['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-pt-sm">
                  {{ $t('formatSetting.add.formatInfo') }}
              </div>


              <div class="row">
                  <div class="col-4">
                      {{ $t('job.add.transactionType') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('job.projectType') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-4">
                      {{ $t('jobAd.add.media') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="transactionTypeOptions" emit-value map-options
                          v-model="formartData['transactionType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!formartData['transactionType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4 q-pr-sm">
                      <q-select outlined dense :options="projectTypeOptions" emit-value map-options
                          v-model="formartData['projectType']" lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!formartData['projectType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-4">
                      <q-select outlined dense :options="mediaOptions" emit-value map-options
                          v-model="formartData['media']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!formartData['media']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row">
                  {{ $t('formatSetting.add.formatDesc') }}
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="formartData['desc']" hide-bottom-space />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm">
                  ■ {{ $t('formatSetting.add.formatting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add" />
              </div>


              <div v-for="item in formatSettingItems" :key="item.value">
                  <div class="row q-pt-sm">
                      <div class="col-4">
                          {{ item.name }}
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-12">
                          <q-input outlined dense v-model="formartData[item.value]" hide-bottom-space
                              v-if="item.type == 'text'" readonly />
                          <q-select outlined dense :options="options[item.option]" emit-value map-options
                              v-model="formartData[item.value]" v-else-if="item.type == 'select'" option-value="id"
                              option-label="name">
                              <template v-if="!formartData[item.value]" v-slot:selected>
                                  <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                              </template>
                          </q-select>
                      </div>
                  </div>
              </div>

          </q-card-section>
      </q-form>
  </q-card>
</template>

<script lang="ts" setup>

import { Ref,ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { mediaList, formatSettingItemList } from 'src/shared/constants/JobAd.const';
import { useFormatSetting } from 'src/stores/formatSetting'
import { Alert } from 'src/shared/utils/Alert.utils';
import {MediaList} from 'src/shared/model/Jobs.model'
import { DocumentData } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';

const formatSettingStore = useFormatSetting()
const props = defineProps({
  selectedFormat: {
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
  formartData.value = { ...formartDataObject }
  emit('hideDrawer')
}
const organization = useOrganization()
const formartDataObject = {
  id: props?.selectedFormat['id'] || null,
  name: props?.selectedFormat['name'] || '',
  transactionType: '',
  projectType: '',
  desc: props?.selectedFormat['desc'] || '',
  media: props?.selectedFormat['media'] || '',
  organizationId:organization.currentOrganizationId,
}
const formartData = ref({ ...formartDataObject })
const transactionText = ref('')
const projectText = ref('')
const formatForm = ref();
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const formatSettingItems = ref(formatSettingItemList);
const mediaOptions:Ref<MediaList[]> = ref(mediaList);
const unsubscribePhrase = ref();
const options:DocumentData = ref({});

onMounted(async () => {
  formartData.value.transactionType = props?.selectedFormat['transactionType'] || '';
  formartData.value.projectType = props?.selectedFormat['projectType'] || '';

  formatSettingItems.value.forEach(item => {
      formartData.value[item.value] = props?.selectedFormat[item.value] || '';
  });
  const done = await formatSettingStore.getPhraseData(options)
  options.value = done
})

onBeforeUnmount(() => {
  if (unsubscribePhrase.value) {
      unsubscribePhrase.value();
  }

})

watch(
  () => (formartData.value.transactionType),
  (newVal,) => {
      transactionText.value = '';

      const objTrans = applicantClassification.value.find(o => o.value === newVal);
      if (objTrans) {
          transactionText.value = objTrans.label;
      }
  }
)

watch(
  () => (formartData.value.projectType),
  (newVal,) => {
      projectText.value = '';

      const objProject = occupationList.value.find(o => o.value === newVal);
      if (objProject) {
          projectText.value = objProject.label;
      }
  }
)

const saveFormat = async () => {
  try {
      if (formartData.value.id) {
          await formatSettingStore.updateFormData(formartData.value)
          hideDrawer()

      } else {
         await formatSettingStore.addFormData(formartData.value)
         hideDrawer()
      }

      Alert.success()
      formatForm.value.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }
}

</script>
