
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

        <CFCommonInformation/>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeSpecificInformation') }}
        </div>
        <div class="row" v-for="items in industriesData" :key="items['id']">
        <div class="col-6" v-for="underItem in items['uniqueItems']['typeSpecificItems']" :key="underItem['id']">
          <div class="q-pr-sm">
            {{ underItem['title'] }}
          </div>
          <div class="q-pr-sm">
            <q-input outlined dense v-model="underItem['dataType']" hide-bottom-space />
          </div>
        </div>
      </div>

       <!-- BackOrder Common Information -->
        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boCommonInformation') }}
        </div>

        <BoCommonInformation/>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boSpecificInformation') }}
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.requiredQualifications') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.qualificationRemarks') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.experienceReq') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.experienceRemarks') }}
          </div>
        </div>
        <div class="row">
           <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="[]"  emit-value map-options
              v-model="selectedJobData['boRequiredQualification']">
              <template v-if="!selectedJobData['boRequiredQualification']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['qualificationRemarks']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="[]"  emit-value map-options
              v-model="selectedJobData['experienceReq']">
              <template v-if="!selectedJobData['experienceReq']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['experienceRemarks']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.pickDrop') }}
          </div>
          <div class="col-3 q-ml-sm">
            {{ $t('backOrder.availabilityOnCallSupport') }}
          </div>
          <div class="col-3">
            {{ $t('office.onCallCorrespondence') }}
          </div>
        </div>
          <div class="row">
           <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="[]"  emit-value map-options
              v-model="selectedJobData['pickDrop']">
              <template v-if="!selectedJobData['pickDrop']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="selectedJobData['availabilityOnCallSupport']">
              <template v-if="!selectedJobData['availabilityOnCallSupport']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="selectedJobData['onCallCorrespondence']" hide-bottom-space />
          </div>
        </div>
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
import BoCommonInformation from './addJobComponents/BoCommonInformation.vue'
import BasicInfo from './addJobComponents/BasicInfo.vue'
import EmploymentContract from './addJobComponents/EmploymentContract.vue'
import EmploymentCondition from './addJobComponents/EmploymentCondition.vue'
import { JobData } from 'src/shared/model/Jobs.model';
const selectedJobData = ref<JobData | ComputedRef>(
  computed(() => jobSearchStore.state.selectedJob)
);
const jobSearchStore = useJobSearch()
const drawerRight = ref(false)
const dialogVisible = ref(false)
const unsubscribe = ref();
const unsubscribeOffice = ref();
const transactionText:Ref<string> = ref('')
const projectText:Ref<string> = ref('')
const selectedIndustry:DocumentData= ref(null);
const jobForm:Ref<QForm | null> = ref(null);
const jobItems = ref({});
const jobItemOptions = ref({});
const itemOptions:DocumentData = ref({})
const currentJobContent = ref('')
const editingIndex = ref(-1);
const jobItemId = ref({})
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
defineExpose({ showDrawerWithData ,openDrawer})
</script>
<style >
.my-dialog .q-dialog__backdrop {
  background-color: transparent;
}
</style>

