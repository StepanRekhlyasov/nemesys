<template>
   <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
    elevated bordered>
   <q-scroll-area class="fit text-left">
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="formatForm" @submit="saveJobItem">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
                      <div class="q-mr-sm">
                          <div>
                              {{ phraseCategoryText }}
                          </div>
                          <div class="text-h6">{{ selectedJobItem['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="selectedJobItem['id'] ? $t('jobItem.add.jobItemUpdate') : $t('jobItem.add.jobItemReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="drawerRight">
              <div class="row">
                  {{ $t('phraseSettings.add.recruitmentItemName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedJobItem['name']" hide-bottom-space lazy-rules
                          :rules="[(val) => (val && val.length > 0) || '']" />
                  </div>
              </div>

              <div class="row q-mt-sm">
                  {{ $t('jobItem.add.itemInfo') }}
              </div>

              <div class="row">
                  <div class="col-6">
                      {{ $t('jobItem.category') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-6">
                      {{ $t('phraseSettings.add.dataType') }}
                      <span class="text-red-5">*</span>
                  </div>
              </div>
              <div class="row">
                  <div class="col-6 q-pr-sm">
                      <q-select outlined dense :options="phraseCategoryOptions" emit-value map-options
                          v-model="selectedJobItem['phraseCategory']" lazy-rules hide-bottom-space
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedJobItem['phraseCategory']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-6">
                      <q-select outlined dense :options="dataTypeOptions" emit-value map-options hide-bottom-space
                          v-model="selectedJobItem['dataType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!selectedJobItem['dataType']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="row q-mt-sm">
                  {{ $t('jobItem.add.itemDesc') }}
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="selectedJobItem['desc']" hide-bottom-space />
                  </div>

              </div>

              <div class="row q-mt-sm">
                  {{ $t('jobItem.add.adItemSettings') }}
              </div>

              <div class="column">
                <div>
                      {{ $t('phraseSettings.add.dataType') }}
                      <span class="text-red-5">*</span>
                  </div>
                  <div class="col-6">
                      <q-input outlined  dense v-model="selectedJobItem['dataType']" hide-bottom-space />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm" v-if="selectedJobItem.dataType === 'option'">
                  ■ {{ $t('jobItem.add.optionSetting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add"
                      @click="addNewItem" :disable="!selectedJobItem.id" />
              </div>
              <q-markup-table
                v-if="selectedJobItem.dataType === 'option'"
                class="table"
                :bordered="false"
                :square="false"
                separator="none"
                flat>
                    <thead>
                        <tr>
                            <th class="table__column text-left" :key="item.name" v-for="item in columns">
                                {{ item.label }}
                            </th>
                            <th class="table__column text-left"></th>
                        </tr>
                    </thead>
                    <draggable v-model="optionItem" handle=".handle" tag="tbody" item-key="name" ghost-class="ghost">
                    <template #item="{ element }">
                      <tr>
                        <td scope="row"><q-btn flat round size="sm" icon="menu" color="primary" class="handle"/></td>
                        <td><span v-if="element.name">{{ element.name }}</span>
                          <span v-else>Click here to add name</span>
                          <q-popup-edit v-model="element.name" :title="$t('jobItem.add.optionContentUpdate')" buttons persistent
                              v-slot="scope" :label-set="$t('common.save')" :label-cancel="$t('common.cancel')"
                              @save="addNewOption(element, $event)">
                              <q-input v-model="scope.value" dense autofocus />
                          </q-popup-edit></td>
                          <td>
                            <div>{{ getMatchingCount(element) }}</div>
                        </td>
                     </tr>
                   </template>
                   </draggable>
              </q-markup-table>
          </q-card-section>
      </q-form>
  </q-card>
</q-scroll-area>
</q-drawer>
</template>

<script lang="ts" setup>
import { ref,Ref, watch,computed,ComputedRef, onMounted, onBeforeUnmount } from 'vue';
import { dataTypeList, phraseCategoryList, jobItemOptionColumns } from 'src/shared/constants/JobAd.const';
import { useJobItemSetting } from 'src/stores/jobItemSetting'
import { DocumentData } from 'firebase/firestore';
import draggable from 'vuedraggable'
import {JobOptions} from 'src/shared/model/Jobs.model'
import { Alert } from 'src/shared/utils/Alert.utils';
import {JobItem} from 'src/shared/model/Jobs.model'
import { QForm } from 'quasar';

const jobItemSettingStore = useJobItemSetting()
const unsubscribe = ref();
const phraseCategoryText = ref('')
const formatForm:Ref<QForm | null | undefined> = ref();
const phraseCategoryOptions = ref(phraseCategoryList);
const dataTypeOptions = ref(dataTypeList);
const columns = ref(jobItemOptionColumns);
const optionItem:Ref<JobOptions[]> = ref([]);
const loading = ref(false);
const optionData:DocumentData = ref({})
const drawerRight = ref(false);
const drawerValue = ref<boolean>(false);
const optionId = ref('')
const selectedJobItem = ref<JobItem | ComputedRef>(
  computed(() => jobItemSettingStore.state.selectedJobItem)
);

onMounted(async () => {
  optionData.value=await calculateOptionOccurrence()
  jobItemSettingStore.state.selectedJobItem.phraseCategory = selectedJobItem.value['phraseCategory'] || '';
  if(selectedJobItem.value['id']) {
    optionItem.value = await jobItemSettingStore.fetchJobItemOptionsData(selectedJobItem.value['id'])
    loading.value = false;
  }
})

onBeforeUnmount(() => {
  if (unsubscribe.value) {
      unsubscribe.value();
  }

})

const saveJobItem = async () => {
  try {
      if (selectedJobItem.value.id) {

          await jobItemSettingStore.updateFormData(selectedJobItem.value)
          drawerRight.value=false

      } else {
         await jobItemSettingStore.addFormData(selectedJobItem.value)
         drawerRight.value=false
      }

      Alert.success()
      formatForm.value?.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }

}

const calculateOptionOccurrence = async () => {

  const optionCounts = {};
  const jobs = await jobItemSettingStore.loadJobSearchData();

  if (Array.isArray(jobs)) {
    for (const data of jobs) {
      for (const items in data['jobContent']) {
        const option = data['jobContent'][items];
        if (option in optionCounts) {
      optionCounts[option]++;
    } else {
      optionCounts[option] = 1;
    }
  }
}
  return optionCounts;
}}

const addNewItem = () => {
  optionItem.value.unshift({ 'name': '' })

}
const getMatchingCount = (element) => {
  let currentOptionIndex = 0;
  const optionName = Object.keys(optionData.value);
  while (currentOptionIndex < optionName.length) {
    if (element['name'] === optionName[currentOptionIndex]) {
      return optionData.value[optionName[currentOptionIndex]];
    }
    currentOptionIndex++;
  }

  return 0;
};
const addNewOption = async (data: object, updatedName) => {
  try {
    if (data['id']) {
      data['name'] = updatedName;
        await jobItemSettingStore.updateOption(selectedJobItem.value['id'],data)

      } else {
        data['name'] = updatedName;
      optionId.value=  await jobItemSettingStore.addNewOption(selectedJobItem.value['id'],data)
      await jobItemSettingStore.addId(selectedJobItem.value['id'],data,optionId.value)
      }

      Alert.success()
      formatForm.value?.resetValidation();
  } catch (error) {
      Alert.warning(error)
  }
}
watch(drawerRight, () => {
  drawerValue.value = drawerRight.value;
})
const showDrawerWithData = async (data: JobItem) => {
  if (selectedJobItem.value.id && selectedJobItem.value.id !== data.id) {
    drawerRight.value = false;
  }
  jobItemSettingStore.state.selectedJobItem = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  jobItemSettingStore.state.selectedJobItem={}
  drawerRight.value = true
}
watch(
  () => (selectedJobItem.value.phraseCategory),
  (newVal,) => {
      phraseCategoryText.value = '';

      const obj = phraseCategoryList.value.find(o => o.value === newVal);
      if (obj) {
          phraseCategoryText.value = obj.label;
      }
  }
)
watch(drawerRight, async(newValue) => {
  if (newValue === true) {
    optionItem.value = await jobItemSettingStore.fetchJobItemOptionsData(selectedJobItem.value['id'])
  } else {
  }
});
defineExpose({ showDrawerWithData ,openDrawer})
</script>
<style lang="scss">
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.ghost {
  opacity: 0;
}
</style>
