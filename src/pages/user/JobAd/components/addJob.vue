
<template>
<q-drawer v-model="drawerRight" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay
   elevated bordered>
  <q-scroll-area class="fit text-left">
  <q-card class="no-shadow bg-grey-3">
    <q-form ref="jobForm" @submit="saveJob">
      <q-card-section class="text-white bg-primary rounded-borders">
        <div class="row">
          <div class="col-12 flex flex-inline">
            <q-btn dense flat icon="close" @click="drawerRight = !drawerRight" />
            <div class="q-mr-sm">
              <div>
                {{ transactionText }}
                <span v-if="projectText">/ {{ projectText }}</span>
              </div>
              <div class="text-h6">{{ selectedJobData['name'] }}</div>
            </div>
            <q-btn size="sm" style="background: white; color: #085374; height: 30px"
              :label="selectedJobData['id'] ? $t('job.jobUpdate') : $t('job.jobReg')" type="submit" />
            <q-btn outline size="sm" :label="$t('job.autoJobCreation')" class="q-ml-md" style="height: 30px" />
          </div>
        </div>
      </q-card-section>
      <!-- <--Basic Info-->

      <q-card-section v-if="drawerRight">
        <div class="row text-primary text-body1">
          ■ {{ $t('job.add.basicInfo') }}
        </div>
          <basic-info/>

        <!-- job Content -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.jobContent') }}
        </div>
        <div v-for="item in jobItems" :key="item['id']">
          <div class="row q-pt-sm">
            <div class="col-4">
              {{ item['name'] }}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input  outlined v-model="selectedJobData['jobContent'][item?.['name']]"
                @click="openJobOptionDrawer(jobItemOptions[item['id']], item['name'],item['id'])" dense />
            </div>
          </div>
        </div>

        <!-- Employment Contract -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.employmentContract') }}
        </div>

        <employment-contract/>

        <!-- Employment Conditions -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.employmentConditions') }}
        </div>

        <employment-condition/>

        <!-- Client Office Common Information -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeCommonInformation') }}
        </div>

        <CFCommonInformation :client="clientList" :office="officeList" ref="cfCommonInfoForm"/>

        <!-- BackOrder Common Information -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boCommonInformation') }}
        </div>

        <BoCommonInformation :boid="boid" ref="boCommonInfoForm"/>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeSpecificInformation') }}
        </div>
        <div class="row" v-for="items in industriesData" :key="items['id']">
        <div class="col-6" v-for="underItem in items['uniqueItems']['typeSpecificItems']" :key="underItem['id']">
          <div class="q-pr-sm">
            {{ underItem['title'] }}
          </div>
          <div class="q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['uniqueItems']" hide-bottom-space />
          </div>
        </div>
      </div>

        <!-- BackOrder Specific Information -->

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boSpecificInformation') }}
        </div>

         <BOSpecificInformation/>

      </q-card-section>
    </q-form>
    <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale" class="my-dialog">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <q-list dense bordered padding class="rounded-borders">
            <q-item clickable v-ripple v-for="(options, index) in itemOptions" :key="options['id']"
              >
              <q-btn icon="edit" size="md" color="primary" flat  @click="startEditing(index)"/>
              <div class="text-h6 q-ml-md"  v-if="!isEditing(index)" @click="selectJobOption(options,jobItemId)">
                 {{ options['name'] }}
              </div>
              <q-input v-model="options['name']" dense v-if="isEditing(index)"  @blur="stopEditing()" @keyup.enter="stopEditing()" />
            </q-item>
            <div class="row">
                <q-btn icon="mdi-plus-thick" size="md" color="primary"  :label="$t('common.addNew')" flat class="q-ml-md q-mt-sm text-bold" @click="addNewField"/>
              </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
  </q-scroll-area>
  </q-drawer>
</template>
<script lang="ts" setup>
import { ref,Ref, watch, onMounted, onBeforeUnmount,computed,ComputedRef } from 'vue';
import { DocumentData } from 'firebase/firestore';
import { useJobSearch } from 'src/stores/jobSearch'
import { Alert } from 'src/shared/utils/Alert.utils';
import { QForm } from 'quasar';
import CFCommonInformation from './addJobComponents/CFCommonInformation.vue'
import BoCommonInformation from './addJobComponents/BoCommonInformation.vue';
import BasicInfo from './addJobComponents/BasicInfo.vue'
import EmploymentContract from './addJobComponents/EmploymentContract.vue'
import EmploymentCondition from './addJobComponents/EmploymentCondition.vue'
import BOSpecificInformation from './addJobComponents/BOSpecificInformation.vue'
import { JobData } from 'src/shared/model/Jobs.model';
import {ClientOffice,Client} from 'src/shared/model/Client.model'
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const jobSearchStore = useJobSearch()
const drawerRight = ref(false)
const dialogVisible = ref(false)
const unsubscribe = ref();
const unsubscribeOffice = ref();
const cfCommonInfoForm = ref<InstanceType<typeof CFCommonInformation> | null>(null);
const boCommonInfoForm = ref<InstanceType<typeof BoCommonInformation> | null>(null);
const transactionText:Ref<string> = ref('')
const projectText:Ref<string> = ref('')
const selectedIndustry:DocumentData= ref(null);
const officeList:Ref<ClientOffice[]> = ref([]);
const jobForm:Ref<QForm | null> = ref(null);
const jobItems = ref({});
const jobItemOptions = ref({});
const itemOptions:DocumentData = ref({})
const boid = ref<Array<{ label: string; value: string }>>([]);
const currentJobContent = ref('')
const editingIndex = ref(-1);
const jobItemId = ref({})
const clientList:Ref<Client[]> = ref([]);
const optionId = ref('')
const industriesData:DocumentData = ref({})
const startEditing = (index) => {
  editingIndex.value = index;
};
const isEditing = (index) => {
  return editingIndex.value === index;
};
const stopEditing = () => {
  editingIndex.value = -1;
};

onMounted(async () => {

  clientList.value = await jobSearchStore.loadClientsData()
  selectedJobData.value.transactionType = selectedJobData.value['transactionType'] || '';
  selectedJobData.value.projectType = selectedJobData.value['projectType'] || '';
  selectedJobData.value.client = selectedJobData.value['client'] || '';
  await jobSearchStore.loadJobItemSettingData(jobItemOptions, jobItems)
  await jobSearchStore.loadJobItemData(jobItems)
 industriesData.value = await jobSearchStore.getIndustries()
})
const showDrawerWithData = async (data: JobData) => {
  if (selectedJobData.value.id && selectedJobData.value.id !== data.id) {
    drawerRight.value = false;
  }
  jobSearchStore.state.selectedJob = data;
  drawerRight.value = true
}
const openDrawer = async () => {
  jobSearchStore.state.selectedJob={}
  jobSearchStore.state.selectedJob['jobContent']={}
  drawerRight.value = true
}

const saveJob = async () => {
  try {
    if (selectedJobData.value.id) {
      await jobSearchStore.updateFormData(selectedJobData.value)
      drawerRight.value=false

    } else {
      await jobSearchStore.addFormData(selectedJobData.value)
      drawerRight.value=false
    }
    jobForm.value?.resetValidation();
  } catch (error) {
    Alert.warning(error)
  }
}
const openJobOptionDrawer = (options, jobContent,itemId) => {
  itemOptions.value = options;
  currentJobContent.value = jobContent;
  jobItemId.value = itemId
  dialogVisible.value = true
}

const selectJobOption = async(data,id) => {
  if (selectedJobData.value['jobContent'][currentJobContent.value] !== data['name']) {
    selectedJobData.value['jobContent'][currentJobContent.value] = data['name']
  }
  try {
    if (data['id'] && selectedJobData.value['jobContent'][currentJobContent.value] === data['name']) {
      selectedJobData.value['jobContent'][currentJobContent.value] = data['name']
      await jobSearchStore.updateOption(id,data)

      } else {
        selectedJobData.value['jobContent'][currentJobContent.value] = data['name']
         optionId.value = await jobSearchStore.addNewOption(id,data)
         await jobSearchStore.addId(id,data,optionId.value)
      }
      dialogVisible.value = false
  } catch (error) {
      Alert.warning(error)
  }

}
const addNewField = () => {
  itemOptions.value.unshift({ 'name': '' })
  startEditing(0);
};
const getBOCommonInformationData = async (newVal) => {
  const boData = await jobSearchStore.loadBOData();
  if (Array.isArray(boData)) {
    const boidArray = boData
      .filter((data) => data['office_id'] === newVal['id'])
      .map((data) => ({
        label: data['boId'],
        value: data['boId'],
      }));

    boid.value = boidArray;

  }
};
const bOSpecifiedBoidData = async (data) => {
  boCommonInfoForm.value?.getSpecifiedBoidData(data);
};
const cfInfoData = async (data) => {
  cfCommonInfoForm.value?.storeCfInformationData(data);
};
const resetData = async () => {
  selectedJobData.value['prefectures'] = '';
  selectedJobData.value['municipalities'] = '';
  selectedJobData.value['street'] = '';
  selectedJobData.value['buildingName'] = '';
  selectedJobData.value['facility'] = '';
  selectedJobData.value['workingDays'] = ''
  selectedJobData.value['overtimeWork'] = ''
  selectedJobData.value['overtimeRemarks'] = ''
  selectedJobData.value['holidayAnnual'] = ''
  selectedJobData.value['boBenefit'] = ''
  selectedJobData.value['bonus'] = ''
  selectedJobData.value['botransportationExpenses'] = ''
  selectedJobData.value['boEmploymentStatus'] = ''
  selectedJobData.value['boPayDay'] = ''
  selectedJobData.value['payCheck'] = ''
  selectedJobData.value['shiftRemarks'] = ''
  selectedJobData.value['businessContent'] = ''
  selectedJobData.value['numberWorkingDays'] = ''
  selectedJobData.value['retirementAge'] = ''
  selectedJobData.value['boRequiredQualification'] = ''
  selectedJobData.value['experienceReq'] = ''
  selectedJobData.value['experienceRemarks'] = ''
  selectedJobData.value['pickDrop'] = ''
  selectedJobData.value['availabilityOnCallSupport'] = ''
  selectedJobData.value['workingHoursEarly'] = ''
  selectedJobData.value['workingHoursDay'] = ''
  selectedJobData.value['workingHoursLate'] = ''
  selectedJobData.value['workingHoursNight'] = ''
  selectedJobData.value['boId'] = ''
};
onBeforeUnmount(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
  if (unsubscribeOffice.value) {
    unsubscribeOffice.value();
  }

})
watch(
  () => selectedIndustry.value,
  (newValue) => {
    for (const data of industriesData.value) {
      for (const innerData of data.uniqueItems.typeSpecificItems) {
        if (innerData.id === newValue) {
          innerData.title = selectedIndustry.value;
          return;
        }
      }
    }
  }
);
watch(
  () => (selectedJobData.value.cfClient),
    async (newVal,oldVale) => {
    officeList.value = [];
    if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
    }
    if(oldVale){
      selectedJobData.value.cfOffice=''
    }
    if (newVal) {
      officeList.value = await jobSearchStore.loadOfficeData(newVal['id'])
    }
    if (newVal !== oldVale) {
      await resetData()
    }
  }
)
watch(()=>(selectedJobData.value.cfOffice),
  async (newVal)=>{
    if (newVal) {
      await cfInfoData(newVal)
    }
      await getBOCommonInformationData(newVal)
})
watch(
  () => selectedJobData.value['boId'],
  async (newBoid) => {
    if (newBoid) {
  const boData = await jobSearchStore.loadBOData();
  if (Array.isArray(boData)) {
    for (const data of boData) {
    if(data['boId']===newBoid){
      bOSpecifiedBoidData(data)
    }
  }
}
}}
);
defineExpose({ showDrawerWithData ,openDrawer})
</script>
<style >
.my-dialog .q-dialog__backdrop {
  background-color: transparent;
}
</style>

