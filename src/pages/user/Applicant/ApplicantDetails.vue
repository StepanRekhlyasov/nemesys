<template>
  <q-drawer v-if="applicantStore.state.selectedApplicant" v-model="drawerRight" show class="bg-grey-3" :width="1000"
    :breakpoint="500" side="right" overlay elevated bordered>
    <q-scroll-area class="fit text-left" v-if="selectedApplicant">
      <q-card class="no-shadow bg-grey-3">
        <q-card-section class="text-white bg-primary rounded-borders">
          <div class="row">
            <div class="col-2 flex items-start">
              <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" class="q-mr-md" />
              <div style="height: 90px; max-width: 90px; width: 90px" class="relative-position">
                <q-img v-if="selectedApplicant.imageURL" :src="selectedApplicant.imageURL" spinner-color="white"
                  style="height: 90px; width: 90px" />
                <q-btn v-if="!bo" icon="edit" class="absolute-center" flat @click="chooseFiles" />
                <q-file ref="fileUploadRef" class="hidden" name="applicant_image" v-model="applicantImage" use-chips
                  borderless multiple bg-color="white" @update:model-value="onFileChange" accept=".jpg, image/*">
                </q-file>
              </div>
            </div>
            <div class="col-10">
              <div class="row">
                <div class="col-9 flex items-center">
                  <span class="text-h6 text-weight-bold q-pr-xs">{{ selectedApplicant.name }}</span>{{ age ? `(${age})` :
                    '' }} {{ selectedApplicant.sex && $t('applicant.add.' + selectedApplicant.sex) }}
                  <div class="q-pl-md">
                    <q-select v-if="!bo" :options="statusOption" v-model="applicantStore.state.selectedApplicant.status"
                      color="black" label-color="black" rounded standout bg-color="white" dense
                      @update:model-value="changeApplicantStatus" emit-value map-options class="select_colorFix" />
                    <span v-else class="row" color="black" label-color="black" rounded standout bg-color="white">{{
                      $t(`applicant.statusOption.${applicantStore.state.selectedApplicant.status}`) }}</span>

                  </div>
                </div>
                <div class="col-3">
                  <span class="row">{{ selectedApplicant.prefecture }} {{ selectedApplicant.municipalities }} </span>
                  <span class="row">{{ selectedApplicant.street }} {{ selectedApplicant.apartment }}</span>
                </div>
              </div>
              <div class="row">
                <span class="q-pr-md">
                  {{ $t('applicant.add.applicationDate') }}: {{ myDateFormat(selectedApplicant.applicationDate,
                    'YYYY/MM/DD') }}
                </span>
              </div>
              <div class="row">
                <span class="col-6 ">
                  {{ $t('applicant.add.applicationMedia') }}: {{ selectedApplicant.media ? selectedApplicant.media == 'hr' &&
                    $t('applicant.add.hr') || 'indeed' : '' }}
                </span>
                <span class="col-3 relative-position"><hidden-text v-if="selectedApplicant.phone"
                    :value="'TEL: ' + selectedApplicant.phone" /></span>
                <span class="col-3 q-pl-md">
                  <span class="q-mr-md">{{ $t('applicant.add.occupation') }}</span>
                  {{ selectedApplicant.occupation && $t('applicant.add.' + selectedApplicant.occupation) }}
                </span>
              </div>
              <div class="row">
                <span class="col-6 q-pr-md">
                  {{ $t('applicant.add.applicationMetod') }}: {{ selectedApplicant.applicationMetod ? $t('applicant.add.' +
                    selectedApplicant.applicationMetod) : '' }}
                </span>
                <span class="col-3 relative-position "><hidden-text v-if="selectedApplicant.email"
                    :value="'MAIL: ' + selectedApplicant.email" /></span>
                <span class="col-3 q-pl-md">
                  <span class="q-mr-md">
                    {{ $t('applicant.list.category') }}
                  </span>
                  {{ selectedApplicant.classification ? selectedApplicant.classification.map(applicant =>
                    $t('applicant.list.info.classification.' + applicant.toLowerCase())).join(', ') : '' }}
                </span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section class="bg-white q-ma-md">
          <div class="row q-pb-sm">
            <div class="col-6 row">
              <q-btn @click="assignToBo()" v-if="bo" class="bg-primary text-white q-mb-md col-6"
                :label="$t('applicant.attendant.assignToBo')" />
              <div
                :class="!bo ? 'col-6 text-right text-primary text-weight-regular' : 'col-3 text-right text-primary text-weight-regular'">
                {{ $t('applicant.list.qualification') }}
              </div>
              <div :class="bo ? 'col-3 q-pl-md' : 'col-6 q-pl-md'" v-if="selectedApplicant.qualification">
                {{ selectedApplicant.qualification.map(applic => $t('applicant.qualification.' + applic)).join(', ') }}
              </div>
            </div>
            <div class="col-6 row">
              <span class="col-6 text-right text-primary text-weight-regular">
                {{ $t('applicant.list.experience') }}
              </span>
              <span class="col-3 q-pl-md">
                {{ selectedApplicant.totalMonthes ? Math.floor(selectedApplicant.totalMonthes / 12) + ' ' + $t('common.year') : '' }}
              </span>
              <div v-if="!bo" class="col-3 text-right">
                <q-btn @click="openMapDrawer" outline size="sm" :label="$t('applicant.list.candidate')" color="primary" style="width:82px" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-7 row">
              <div class="col-5 text-right">
                <span class="q-pl-md">
                  <span class="text-primary">{{ $t('office.earlyShift') }}</span>:
                  {{ selectedApplicant.workingHoursEarly }}
                </span>
                <span class="q-pl-md">
                  <span class="text-primary">{{ $t('office.dayShift') }}</span>:
                  {{ selectedApplicant.workingHoursDay }}
                </span>
              </div>
              <div class="col-7">
                <span class="q-pl-md">
                  <span class="text-primary">{{ $t('office.lateShift') }}</span>:
                  {{ selectedApplicant.workingHoursLate }}
                </span>
                <span class="q-pl-md">
                  <span class="text-primary">{{ $t('office.nightShift') }}</span>:
                  {{ selectedApplicant.workingHoursNight }}
                </span>
                <span class="q-pl-md">
                  <span class="text-primary">{{ $t('applicant.list.info.shortTime') }}</span>:
                  {{ selectedApplicant.shortTime ? '✓' : '×' }}
                </span>
              </div>
            </div>
            <div class="col-5 row">
              <span
                class="col-6 text-right text-primary text-weight-regular">{{ $t('applicant.list.availableDays') }}</span>
              <span class="col-3 q-pl-md">{{ selectedApplicant.daysToWork ? selectedApplicant.daysToWork + ' ' +
                $t('applicant.attendant.days') : '' }}</span>
              <div v-if="!bo" class="col-3 text-right">
                <q-btn outline size="sm" :label="$t('task.taskRegister')" color="primary" @click="openTaskRegister = true" />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none" v-if="drawerRight">
          <detail-tabs :bo="bo" :applicant="applicantStore.state.selectedApplicant" />
        </q-card-section>
      </q-card>
    </q-scroll-area>
    <TaskRegister
      :entity="'applicant'"
      :entityData="applicantStore.state.selectedApplicant"
      v-model="openTaskRegister"
      @closeDrawer="openTaskRegister=false"
    />
  </q-drawer>

  <q-drawer v-if="applicantStore.state.selectedApplicant" v-model="boMapDrawer" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
  bordered>
  <q-scroll-area class="fit text-left" v-if="selectedApplicant">
    <q-card class="no-shadow bg-grey-3">
      <q-card-section class="text-white bg-primary rounded-borders">
        <div class="row">
          <q-btn dense flat icon="close" @click="boMapDrawer = false" class="q-mr-md" />
          <span class="text-h6 text-weight-bold q-pr-xs">
                  {{ $t('menu.mapSearch') }}
          </span>
      </div>
      </q-card-section>
      <boMapSearch theme="primary" :applicant="selectedApplicant"/>
    </q-card>
  </q-scroll-area>
</q-drawer>

</template>
<script setup lang="ts">
import { useApplicant } from 'src/stores/applicant';
import { computed, onMounted, ref, watch } from 'vue';
import detailTabs from '../Applicant/components/detailTabs.vue';
import { getDownloadURL, getStorage, ref as refStorage, uploadBytes } from 'firebase/storage';
import { QFile } from 'quasar';
import { statusList, orderOfStatus } from 'src/shared/constants/Applicant.const';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { Applicant } from 'src/shared/model';
import hiddenText from 'src/components/hiddingText.component.vue';
import TaskRegister from './components/TaskRegister.vue';
import { myDateFormat } from 'src/shared/utils/utils';
import { Alert } from 'src/shared/utils/Alert.utils';
import { BackOrderModel } from 'src/shared/model';
import { getAuth } from 'firebase/auth';
import { serverTimestamp, DocumentData } from 'firebase/firestore';
import { useBackOrder } from 'src/stores/backOrder';
import boMapSearch from './components/boMapSearch.vue';
import { boMapDrawerValue } from './const';
import { ApplicantStatus } from 'src/shared/model';
const applicantStore = useApplicant()
const drawerRight = ref(false)
const statusOption  = ref<({
    label: string;
    value: ApplicantStatus;
}|undefined)[]>([])
const setStatusOption = () => {
  statusOption.value =
  [
  [...statusList.value].find(dic => dic.value == ApplicantStatus.UNSUPPORTED),
  [...statusList.value].find(dic => dic.value == ApplicantStatus.RETIRED),
  ]
  const preStatus = [...statusList.value].filter(dic => applicantStore.state.selectedApplicant?.status && orderOfStatus[dic.value] <= orderOfStatus[applicantStore.state.selectedApplicant?.status])
  if(preStatus) statusOption.value = statusOption.value.concat(preStatus)
}
onMounted(()=>{
  setStatusOption()
})

const emit = defineEmits(['statusUpdated'])
const fileUploadRef = ref<InstanceType<typeof QFile> | null>(null);
const age = computed(() => selectedApplicant.value && selectedApplicant.value['dob'] ? RankCount.ageCount(myDateFormat(selectedApplicant.value['dob'])) : '0')
const openDrawer = async (data: Applicant) => {
  if (selectedApplicant.value?.id && selectedApplicant.value.id !== data.id) {
    drawerRight.value = false;
  }
  applicantStore.state.selectedApplicant = data;
  setTimeout(() => drawerRight.value = true, 300);
}

const openTaskRegister = ref(false)

const boMapDrawer = ref<boolean>(false)
const backOrderStore = useBackOrder();

const openMapDrawer = () => {
  boMapDrawer.value = true;
}

watch(boMapDrawer,()=>{
  boMapDrawerValue.value = boMapDrawer.value;
})

watch(applicantStore.state,()=>{
  setStatusOption()
})

const assignToBo = async () => {
  const data = ref<DocumentData>({
    applicant_id: selectedApplicant.value?.id,
    backOrder: props.bo?.id,
    client: props.bo?.client_id,
    office: props.bo?.office_id,
    deleted: false,
    created_by: getAuth().currentUser?.uid,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  try {
    backOrderStore.addToFix(data)
  } catch (error) {
    Alert.warning(error);
  }
}

const props = defineProps<{
  bo?: BackOrderModel,
}>()

defineExpose({ openDrawer })
const changeApplicantStatus = async () => {
  try {
    await applicantStore.updateApplicant({ status: selectedApplicant.value?.status })
    emit('statusUpdated')
    ;
  } catch (error) {
    Alert.warning(error);
  }
}
const chooseFiles = () => {
  fileUploadRef.value?.pickFiles()
}
const selectedApplicant = computed(() => applicantStore.state.selectedApplicant)
const applicantImage = ref([])

const onFileChange = async (image) => {
  if (selectedApplicant.value && image && image.length > 0) {
    const file = image[0];
    const storage = getStorage();
    const storageRef = refStorage(storage, 'applicants/' + selectedApplicant.value.id + '/image/' + file['name']);
    try {
      const ret = {}
      const snapshot = await uploadBytes(storageRef, file)
      ret['imagePath'] = snapshot.ref.fullPath;
      ret['imageURL'] = await getDownloadURL(storageRef)
      await applicantStore.updateApplicant(ret)
      ;
    }
    catch (error) {
      Alert.warning(error);
    }
  }
}
</script>
<style lang="scss">
.select_colorFix {
  .q-field__native {
    color: #000 !important;
  }

  .q-field__append {
    color: #000 !important;
  }
}</style>
