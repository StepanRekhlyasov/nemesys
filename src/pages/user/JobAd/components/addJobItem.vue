<template>
  <q-card class="no-shadow bg-grey-3">
      <q-form ref="formatForm" @submit="saveJobItem">
          <q-card-section class="text-white bg-primary rounded-borders">
              <div class="row">
                  <div class="col-12 flex flex-inline">
                      <q-btn dense flat icon="close" @click="hideDrawer" />
                      <div class="q-mr-sm">
                          <div>
                              {{ phraseCategoryText }}
                          </div>
                          <div class="text-h6">{{ jobItem['name'] }}</div>
                      </div>
                      <q-btn size="sm" style="background: white; color: #085374; height: 30px"
                          :label="jobItem['id'] ? $t('jobItem.add.jobItemUpdate') : $t('jobItem.add.jobItemReg')"
                          type="submit" />
                  </div>
              </div>
          </q-card-section>
          <q-card-section v-if="isDrawer">
              <div class="row">
                  {{ $t('phraseSettings.add.recruitmentItemName') }}
                  <span class="text-red-5">*</span>
              </div>
              <div class="row">
                  <div class="col-12">
                      <q-input outlined dense v-model="jobItem['name']" hide-bottom-space lazy-rules
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
                          v-model="jobItem['phraseCategory']" lazy-rules hide-bottom-space
                          :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobItem['phraseCategory']" v-slot:selected>
                              <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
                          </template>
                      </q-select>
                  </div>
                  <div class="col-6">
                      <q-select outlined dense :options="dataTypeOptions" emit-value map-options hide-bottom-space
                          v-model="jobItem['dataType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
                          <template v-if="!jobItem['dataType']" v-slot:selected>
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
                      <q-input outlined dense v-model="jobItem['desc']" hide-bottom-space />
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
                      <q-input outlined  dense v-model="jobItem['dataType']" hide-bottom-space />
                  </div>
              </div>

              <div class="row text-primary text-body1 q-pt-sm" v-if="jobItem.dataType === 'option'">
                  ■ {{ $t('jobItem.add.optionSetting') }}
                  <q-btn color="primary" size="sm" class="q-ml-md" dense :label="$t('common.addNew')" icon="add"
                      @click="addNewItem" :disable="!jobItem.id" />
              </div>
              <q-markup-table
                v-if="jobItem.dataType === 'option'"
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
                          <td></td>

                     </tr>
                   </template>
                   </draggable>
              </q-markup-table>
          </q-card-section>
      </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref, watch, defineProps, onMounted, onBeforeUnmount } from 'vue';
import { dataTypeList, phraseCategoryList, jobItemOptionColumns } from 'src/shared/constants/JobAd.const';
import { useJobItemSetting } from 'src/stores/jobItemSetting'
import { DocumentData } from 'firebase/firestore';
import draggable from 'vuedraggable'

const jobItemSettingStore = useJobItemSetting()
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
  jobItem.value = { ...jobItemObject }
  emit('hideDrawer')
}
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const jobItemObject = {
  id: props?.selectedPhrase['id'] || null,
  name: props?.selectedPhrase['name'] || '',
  content: props?.selectedPhrase['content'] || '',
  phraseCategory: '',
  desc: props?.selectedPhrase['desc'] || '',
  media: props?.selectedPhrase['media'] || '',
  recruitmentItemName: props?.selectedPhrase['recruitmentItemName'] || '',
  dataType: props?.selectedPhrase['dataType'] || '',
}
const jobItem = ref({ ...jobItemObject })
const unsubscribe = ref();
const phraseCategoryText = ref('')
const formatForm = ref();
const phraseCategoryOptions = ref(phraseCategoryList);
const dataTypeOptions = ref(dataTypeList);
const columns = ref(jobItemOptionColumns);
const optionItem:DocumentData = ref([]);
const loading = ref(false);

onMounted(async () => {
  jobItem.value.phraseCategory = props?.selectedPhrase['phraseCategory'] || '';
  if(jobItem.value['id']) {
    optionItem.value = await jobItemSettingStore.fetchJobItemOptionsData(jobItem.value['id'])
    loading.value = false;
  }

})

onBeforeUnmount(() => {
  if (unsubscribe.value) {
      unsubscribe.value();
  }

})

watch(
  () => (jobItem.value.phraseCategory),
  (newVal,) => {
      phraseCategoryText.value = '';

      const obj = phraseCategoryList.value.find(o => o.value === newVal);
      if (obj) {
          phraseCategoryText.value = obj.label;
      }
  }
)

const saveJobItem = async () => {
  try {
      if (jobItem.value.id) {

          await jobItemSettingStore.updateFormData(jobItem.value)
          hideDrawer()

      } else {
         await jobItemSettingStore.addFormData(jobItem.value)
         hideDrawer()
      }

      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });
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


const addNewItem = () => {
  optionItem.value.unshift({ 'name': '' } as never)

}

const addNewOption = async (data: object, updatedName) => {
  try {
    if (data['id']) {
      data['name'] = updatedName;
        await jobItemSettingStore.updateOption(jobItem.value['id'],data)

      } else {
        data['name'] = updatedName;
        await jobItemSettingStore.addNewOption(jobItem.value['id'],data)
      }

      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });
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
