<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-form class="q-gutter-none" @submit="searchClients">
      <q-card-actions v-if="props.from == ''">
        <q-btn :label="$t('client.list.settingFromMap')" unelevated :color="props.theme"
          class="no-shadow text-weight-bold" icon="add" @click="openMapDrawer" />
        <q-btn :label="$t('client.list.settingFromArea')" unelevated :color="props.theme"
          class="no-shadow text-weight-bold" icon="add" @click="openAreaDrawer" />
        <q-btn :label="$t('client.list.searchByCondition')" type="submit" outline :color="props.theme"
          class="text-weight-bold" />
      </q-card-actions>
      <q-card-actions v-else-if="props.from == 'saveCondition'">
        <q-btn label="update Condition" unelevated :color="props.theme" class="no-shadow text-weight-bold" icon="update"
          @click="updateCondition" />
      </q-card-actions>
      <q-card-actions v-else>
        <q-btn :label="$t('client.list.addConditions')" unelevated :color="props.theme" class="no-shadow text-weight-bold"
          icon="add" @click="addCondition" />
      </q-card-actions>

      <div style="height: 5px;">
        <q-separator v-if="!isLoadingProgress" />
        <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
      </div>
      <q-card-actions v-if="props.from !== 'saveCondition'">
        <q-select outlined v-model="label" :options="conditionList" dense :label="$t('client.list.savedSearchList')"
          @update:model-value="onSelected" style="width: 250px" />
        <q-btn :label="$t('client.list.saveSearchConditions')" outline :color="props.theme"
          class="text-weight-bold q-ml-md" @click="saveSearchConditions" />
        <q-btn outline color="red" v-if="props.from == '' && advanceSearch.advanceMapSelected">
          MapCFs: {{ advanceSearch.advanceMapCFs.length }}
          <q-icon name="close" @click="advanceSearch.resetAdvanceMap" />
        </q-btn>
        <q-btn outline color="red" v-if="props.from == '' && advanceSearch.advanceAreaSelected">
          AreaCFs: {{ advanceSearch.advanceAreaCFs.length }}
          <q-icon name="close" @click="advanceSearch.resetAdvanceArea" />
        </q-btn>
      </q-card-actions>
      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.keyboard') }}
              </q-item-label>
              <q-input outlined dense v-model="backOrderData['client_name']" :placeholder="$t('client.list.keyboard')" />
            </q-item-section>
          </q-item>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientType') }}
              </q-item-label>
              <div style="flex">
                <span v-for="industry in industries" :key="industry.id">
                <q-checkbox v-model="backOrderData['industry']" dense :label="industry.industryName"
                  :val="industry.industryName" />
                <!-- <q-item v-if="backOrderData['industry'].includes(industry.industryName)">
                  <div class="q-gutter-sm">
                    <q-item-label class="q-pb-xs">{{
                      $t('client.add.facilityType')
                    }}</q-item-label>
                    <q-checkbox size="xs" v-model="backOrderData['facilityType'][industry.industryName]" :val="option.title" :label="option.title"
                      v-for="option in industry.uniqueItems.facilityForms" :key="option.order" :disable="backOrderData['industry'].length == 0" />
                  </div>
                </q-item> -->
                </span>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.presenceContract') }}
              </q-item-label>
              <div>
                <q-checkbox v-model="backOrderData['basic_contract_signed']" dense :label="$t('common.yesShort')" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row">
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.availJobPostings') }}
                  </q-item-label>
                  <div class="q-mt-sm">
                    <q-checkbox v-model="backOrderData['avail_job_postings']" dense :label="$t('common.yesShort')" />
                  </div>
                </div>
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.postingStartDate') }}
                  </q-item-label>
                  <div>
                    <q-input outlined dense v-model="backOrderData['postingStartDate']" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="backOrderData['postingStartDate']">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="props.theme" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="col-1 text-center self-center q-pt-sm ">～</div>
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.postingEndDate') }}
                  </q-item-label>
                  <div>
                    <q-input outlined dense v-model="backOrderData['postingEndDate']" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="backOrderData['postingEndDate']">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" :color="props.theme" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

            </q-item-section>
          </q-item>

          <q-separator />

          <div v-if="actionsType !== ActionsType.ADMIN">
            <q-item-label class="row q-ml-md q-mt-md">
              {{ $t('client.list.evaluationRank') }}
            </q-item-label>

            <q-item-label class="row q-ml-md q-pt-sm">
              {{ $t('client.list.dispatchIndex') }}
            </q-item-label>
            <q-item-label class="row q-ml-md text-caption">
              {{ $t('client.list.point') }}
            </q-item-label>
            <div class="row q-ml-md q-mt-xs">
              <div class="col-3">
                <q-input outlined dense v-model="backOrderData['dispatchIndex']" type="number">
                  <template v-slot:append>
                    <span class="text-caption">{{ $t('common.above') }}</span>
                  </template>
                </q-input>
              </div>
            </div>


            <q-item-label class="row q-ml-md q-pt-md">
              {{ $t('client.list.referralMetrics') }}
            </q-item-label>
            <q-item-label class="row q-ml-md text-caption">
              {{ $t('client.list.point') }}
            </q-item-label>
            <div class="row q-ml-md">
              <div class="col-3">
                <q-input outlined dense v-model="backOrderData['referralMetrics']" type="number">
                  <template v-slot:append>
                    <span class="text-caption">{{ $t('common.above') }}</span>
                  </template>
                </q-input>
              </div>
            </div>

            <q-item class="q-mt-sm">
              <q-item-section>
                <q-item-label>
                  {{ $t('client.list.status') }}
                </q-item-label>
                <div>
                  <q-checkbox v-model="backOrderData['status']" dense val="excited">
                    <q-icon size="1.5em" name="mdi-emoticon-excited" color="green"></q-icon>
                  </q-checkbox>
                  <q-checkbox v-model="backOrderData['status']" dense val="happy" class="q-ml-md">
                    <q-icon size="1.5em" name="mdi-emoticon-happy" color="light-green"></q-icon>
                  </q-checkbox>
                  <q-checkbox v-model="backOrderData['status']" dense val="neutral" class="q-ml-md">
                    <q-icon size="1.5em" name="mdi-emoticon-neutral" color="yellow-8"></q-icon>
                  </q-checkbox>
                  <q-checkbox v-model="backOrderData['status']" dense val="wink" class="q-ml-md">
                    <q-icon size="1.5em" name="mdi-emoticon-wink" color="yellow-10"></q-icon>
                  </q-checkbox>
                  <q-checkbox v-model="backOrderData['status']" dense val="sad" class="q-ml-md">
                    <q-icon size="1.5em" name="mdi-emoticon-sad" color="amber-10"></q-icon>
                  </q-checkbox>
                  <q-checkbox v-model="backOrderData['status']" dense val="angry" class="q-ml-md">
                    <q-icon size="1.5em" name="mdi-emoticon-angry" color="red"></q-icon>
                  </q-checkbox>
                </div>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>
          <div class="q-pt-sm" v-for="dispatch in dispatchOp" :key="dispatch.value" :class="dispatch.class">
            <q-item-label class="q-pl-md">
              {{ dispatch.name }}
            </q-item-label>

            <q-item v-for="record in recordOp" :key="record.value">
              <q-item-section>
                <q-item-label>
                  {{ record.name }}
                </q-item-label>

                <div class="row">
                  <div class="col-2">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ $t('client.list.postingStartDate') }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData[dispatch.value]['postingStartDate'][record.value]"
                        mask="date" clearable clear-icon="close">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="backOrderData[dispatch.value]['postingStartDate'][record.value]">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup :label="$t('common.close')" :color="props.theme" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="col-1 text-center self-center q-pt-sm ">～</div>
                  <div class="col-2">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ $t('client.list.postingEndDate') }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData[dispatch.value]['postingEndDate'][record.value]"
                        mask="date" clearable clear-icon="close">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="backOrderData[dispatch.value]['postingEndDate'][record.value]">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup :label="$t('common.close')" :color="props.theme" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="col-2 q-pl-md">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ record.label }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData[dispatch.value]['quantity'][record.value]"
                        type="number" />
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
          </div>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.pastEmploymentRecord') }}
              </q-item-label>
              <div v-for="employee in numEmployees" :key="employee.value">
                <q-item-label class="q-pb-xs text-caption">
                  {{ employee.name }}
                </q-item-label>
                <div class="row q-pb-sm">
                  <div class="col-2">
                    <q-input outlined dense v-model="backOrderData[employee.value]" type="number">
                      <template v-slot:after>
                        <span class="text-caption">{{ $t('common.moreThan') }}</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.historySearch') }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t('client.list.appointLastMonths') }}
              </q-item-label>
              <div class="q-gutter-sm q-mt-xs">
                <q-checkbox v-model="backOrderData['route']" dense val="exist" :label="$t('client.list.allTeleAppointedCompanies')" />
                <q-checkbox v-model="backOrderData['route']" dense val="connected" :label="$t('client.list.connectedCompanies')" />
                <q-checkbox v-model="backOrderData['route']" dense val="notConnected" :label="$t('client.list.companiesOutService')"/>
              </div>
            </q-item-section>
          </q-item>


        </q-list>

      </q-card-section>
    </q-form>
    <q-dialog v-model="confirmSaveDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 400px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-card-section>
            <q-input v-model="conditionName" label="Enter Condition Name" style="width:200px" />
          </q-card-section>
          <!-- <q-avatar icon="save" :color="props.theme" text-color="white" size="md" />
            <span class="q-ml-sm">Do you really want save?</span> -->
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" color="red" v-close-popup />
          <q-btn flat :label="$t('common.save')" :color="props.theme" @click="saveCondition" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults, defineEmits, computed, watch, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ActionsType } from './types'
import { facilityList } from 'src/shared/constants/Organization.const';
import { useAdvanceSearch, getBackOrderData } from 'src/stores/advanceSearch';
import { useAdvanceSearchAdmin } from 'src/stores/advanceSearchAdmin';
import { useSaveSearchCondition } from 'src/stores/saveSearchCondition'
import { useSaveSearchConditionAdmin } from 'src/stores/saveSearchConditionAdmin'
import { getFirestore, getDocs, collectionGroup } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { useIndsutry } from 'src/stores/industry';
const db = getFirestore();
const props = withDefaults(defineProps<{
  actionsType?: ActionsType
  from: string,
  rowId: string,
  theme: string
}>(), {
  actionsType: ActionsType.CLIENT,
  from: '',
  rowId: '',
  theme: 'primary'
})
const emit = defineEmits<{
  (e: 'openMapDrawer')
  (e: 'openAreaDrawer')
  (e: 'hideCSDrawer')
}>()


const industryStore = useIndsutry();
const { industries } = storeToRefs(industryStore)
const advanceSearch = props.actionsType === ActionsType.CLIENT ? useAdvanceSearch() : useAdvanceSearchAdmin();
const saveSearchCondition = props.actionsType === ActionsType.CLIENT ? useSaveSearchCondition() : useSaveSearchConditionAdmin();
const isLoadingProgress = ref(false)
const { t } = useI18n({ useScope: 'global' });
let backOrderData = advanceSearch.advanceConditionData
if (props.from === 'map') {
  backOrderData = advanceSearch.mapConditionData;
}
else if (props.from === 'area') {
  backOrderData = advanceSearch.areaConditionData;
}
else if (props.from === 'saveCondition') {
  backOrderData = advanceSearch.saveConditionData;
}

const conditionName = ref('')
const label = ref('')

const onSelected = (newValue) => {
  Object.keys(newValue.value).forEach((key) => {
    backOrderData[key] = newValue.value[key]
  })
}
const conditionList = computed(() => {
  const dropData: object[] = []
  dropData.push({ 'label': 'None', 'value': getBackOrderData() })
  const data = saveSearchCondition.searchConditions;
  data.forEach((data) => {
    const temp = []
    temp['label'] = data['conditionName']
    temp['value'] = data;
    dropData.push(temp)
  })
  return dropData
});
onMounted(async () => {
  await saveSearchCondition.getSaveSearchConditions();
})
const confirmSaveDialog = ref(false);
const facilityOp = facilityList;
const recordOp = computed(() => {
  return [
    { name: t('client.list.numBOs'), value: 'numBOs', label: t('client.list.numBOsAcquired') },
    { name: t('client.list.numFixResults'), value: 'numFixResults', label: t('client.list.numFixResults') },
    { name: t('client.list.jobSearchResults'), value: 'jobSearchResults', label: t('client.list.jobSearchResults') },
    { name: t('client.list.numJobOffers'), value: 'numJobOffers', label: t('client.list.numJobOffers') },
    { name: t('client.list.hiringRecord'), value: 'hiringRecord', label: t('client.list.hiringRecord') },
  ];
});

const dispatchOp = computed(() => {
  return [
    { name: t('client.list.dispatchRecord'), value: 'dispatchRecord', class: '' },
    { name: t('client.list.referralResults'), value: 'referralResults', class: '' },
    { name: t('client.list.dispatchedOtherCompanies'), value: 'dispatchedOtherCompanies', class: 'bg-yellow-1' },
    { name: t('client.list.otherCompanyReferralResults'), value: 'otherCompanyReferralResults', class: 'bg-yellow-1' },
  ];
});

const numEmployees = computed(() => {
  return [
    { name: t('client.list.numFullTimeEmployees'), value: 'numFullTimeEmployees' },
    { name: t('client.list.numPartTimeEmployees'), value: 'numPartTimeEmployees' },
    { name: t('client.list.numTempEmployees'), value: 'numTempEmployees' },
  ];
});
watch(
  () => (backOrderData.industry),
  (newVal) => {
    if (newVal.length == 0) {
      backOrderData.facilityType = [];
    }
  },
);
const saveSearchConditions = async () => {
  confirmSaveDialog.value = true;
}
const saveCondition = async () => {
  confirmSaveDialog.value = false;
  backOrderData['conditionName'] = conditionName.value
  if (props.from === '') {
    saveSearchCondition.saveSearchCondition(advanceSearch.advanceConditionData)
  }
  else if (props.from === 'map') {
    saveSearchCondition.saveSearchCondition(advanceSearch.mapConditionData)
  }
  else {
    saveSearchCondition.saveSearchCondition(advanceSearch.areaConditionData)
  }
}
const addCondition = () => {
  if (props.from == 'map') {
    advanceSearch.mapCSelected = true
  }
  else if (props.from == 'area') {
    advanceSearch.areaCSelected = true
  }
  hideCSDrawer()
}
const updateCondition = async () => {
  await saveSearchCondition.updateSaveSearchCondition(props.rowId, backOrderData)
  hideCSDrawer()
}
const openMapDrawer = () => {
  emit('openMapDrawer')
}
const openAreaDrawer = () => {
  emit('openAreaDrawer')
}
const hideCSDrawer = () => {
  emit('hideCSDrawer')
}
const searchClients = async () => {
  isLoadingProgress.value = true;
  let office: string[] = [];
  let cIds = {}
  if (advanceSearch.advanceMapSelected || advanceSearch.advanceAreaSelected) {
    office = advanceSearch.getCombineId() || [];
  }
  else {
    // const cfSnapshot = props.actionsType === ActionsType.CLIENT ? await getDocs(collectionGroup(db, 'modifiedCF')) : await getDocs(collectionGroup(db, 'client-factory'));
    const cfSnapshot = await getDocs(collectionGroup(db, 'client-factory'));
    cfSnapshot.docs.forEach((doc) => {
      office.push(doc.id)
        cIds[doc.id] = doc.data()['clientID']
    })
  }
  await advanceSearch.searchClients(office, cIds, 'advance');
  isLoadingProgress.value = false
};

</script>
  
  