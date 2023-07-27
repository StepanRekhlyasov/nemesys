<template>
  <q-drawer
    v-model="drawerRight"
    show
    class="bg-grey-3"
    :width="1000"
    :breakpoint="500"
    side="right"
    overlay
    elevated
    bordered
  >
    <q-scroll-area class="fit text-left">
      <q-card class="no-shadow bg-grey-3">
        <q-form ref="formatForm" @submit="saveFormat">
          <q-card-section class="text-white bg-primary rounded-borders">
            <div class="row">
              <div class="col-12 flex flex-inline">
                <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
                <div class="q-mr-sm">
                  <div>
                    {{ transactionText }}
                    <span v-if="projectText">/ {{ projectText }}</span>
                  </div>
                  <div class="text-h6">{{ selectedFormat['name'] }}</div>
                </div>
                <q-btn
                  size="sm"
                  style="background: white; color: #085374; height: 30px"
                  :label="selectedFormat['id'] ? $t('formatSetting.add.formatUpdate') : $t('formatSetting.add.formatReg')"
                  type="submit"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section v-if="drawerRight">
            <div class="row">
              {{ $t('formatSetting.add.formatName') }}
              <span class="text-red-5">*</span>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="selectedFormat['name']"
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                />
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
                <q-select
                  outlined
                  dense
                  :options="transactionTypeOptions"
                  emit-value
                  map-options
                  v-model="selectedFormat['transactionType']"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                >
                  <template v-if="!selectedFormat['transactionType']" v-slot:selected>
                    <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                  </template>
                </q-select>
              </div>
              <div class="col-4 q-pr-sm">
                <q-select
                  outlined
                  dense
                  :options="projectTypeOptions"
                  emit-value
                  map-options
                  v-model="selectedFormat['projectType']"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                >
                  <template v-if="!selectedFormat['projectType']" v-slot:selected>
                    <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                  </template>
                </q-select>
              </div>
              <div class="col-4">
                <q-select
                  outlined
                  dense
                  :options="mediaOptions"
                  emit-value
                  map-options
                  v-model="selectedFormat['media']"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '']"
                >
                  <template v-if="!selectedFormat['media']" v-slot:selected>
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
                <q-input outlined dense v-model="selectedFormat['desc']" hide-bottom-space />
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
                  <q-input outlined dense v-model="selectedFormat[item.value]" hide-bottom-space v-if="item.type == 'text'" />
                  <q-select
                    outlined
                    dense
                    :options="options[item.option]"
                    emit-value
                    map-options
                    v-model="selectedFormat[item.value]"
                    v-else-if="item.type == 'select'"
                    option-value="id"
                    option-label="name"
                  >
                    <template v-if="!selectedFormat[item.value]" v-slot:selected>
                      <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>

          </q-card-section>
        </q-form>
      </q-card>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts" setup>

import { Ref,ref, watch, onMounted, onBeforeUnmount,computed ,ComputedRef} from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { mediaList, formatSettingItemList } from 'src/shared/constants/JobAd.const';
import { useFormatSetting } from 'src/stores/formatSetting'
import { Alert } from 'src/shared/utils/Alert.utils';
import {MediaList} from 'src/shared/model/Jobs.model'
import { DocumentData } from 'firebase/firestore';
import {FormatData} from 'src/shared/model/Jobs.model'

const formatSettingStore = useFormatSetting()
const drawerRight = ref(false);
const transactionText = ref('')
const projectText = ref('')
const formatForm = ref();
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const formatSettingItems = ref(formatSettingItemList);
const mediaOptions:Ref<MediaList[]> = ref(mediaList);
const unsubscribePhrase = ref();
const options:DocumentData = ref({});
const drawerValue = ref<boolean>(false);
const selectedFormat = ref<FormatData | ComputedRef>(
  computed(() => formatSettingStore.state.selectedFormat)
);

onMounted(async () => {
  const done = await formatSettingStore.getPhraseData(options);
  options.value = done;
  console.log(options.value)
});


onBeforeUnmount(() => {
  if (unsubscribePhrase.value) {
      unsubscribePhrase.value();
  }

})
const showDrawerWithData = async (data: FormatData) => {
  if (selectedFormat.value.id && selectedFormat.value.id !== data.id) {
    drawerRight.value = false;
  }
  formatSettingStore.state.selectedFormat = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  formatSettingStore.state.selectedFormat={}
  drawerRight.value = true
}
const saveFormat = async () => {
  try {
      if (selectedFormat.value['id']) {
          await formatSettingStore.updateFormData(selectedFormat.value)
          drawerRight.value=false
      } else {
         await formatSettingStore.addFormData(selectedFormat.value)
         drawerRight.value=false
      }
      Alert.success()
      formatForm.value.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }
}
watch(
  () => (selectedFormat.value['Transactiontype']),
  (newVal,) => {
      transactionText.value = '';

      const objTrans = applicantClassification.value.find(o => o.value === newVal);
      if (objTrans) {
          transactionText.value = objTrans.label;
      }
  }
)

watch(
  () => (selectedFormat.value['projectType']),
  (newVal,) => {
      projectText.value = '';

      const objProject = occupationList.value.find(o => o.value === newVal);
      if (objProject) {
          projectText.value = objProject.label;
      }
  }
)
watch(drawerRight, () => {
  drawerValue.value = drawerRight.value;
})

defineExpose({ showDrawerWithData ,openDrawer})
</script>
