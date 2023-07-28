<template>
<q-drawer class="bg-white" :width="780" :breakpoint="500" side="right" overlay elevated bordered>
  <q-scroll-area class="fit text-left">
      <q-card class="no-shadow bg-white">
        <q-card-section class="text-white bg-primary">
          <q-btn dense flat icon="close" @click="closeDrawer()" class="q-mr-md" />
          {{$t('task.taskRegister')}}
        </q-card-section>
        <q-card-section class="text-primary">
          <span style="font-size: 25px;" class="q-mr-sm">■</span>{{$t('task.taskRegister')}}
        </q-card-section>
        <q-form class="text-primary q-px-xl" greedy @submit="createTask" ref="myForm">
          <div class="row items-center q-px-xl q-mb-md">
            <div class="col-3 text-right q-pr-md">{{ $t('task.taskType') }}</div>
            <div class="col-9 q-pr-xl">
              <q-select :label="$t('common.pleaseSelect')" :options="taskTypeOptions" v-model="taskType" dense outlined :rules="[creationRule]" emit-value map-options hide-bottom-space/>
            </div>
          </div>
          <div class="row items-center q-px-xl q-mb-md">
            <div class="col-3 text-right q-pr-md">{{ $t('applicant.progress.filters.userInCharge') }}</div>
            <div class="col-9 q-pr-xl">
              <MySelect 
                hide-bottom-space
                v-model="taskUserInCharge"
                :optionToFetch="'usersInCharge'"
                :rules="[creationRule]"
              />
            </div>
          </div>
          <div class="row items-center q-px-xl q-mb-md">
            <div class="col-3 text-right q-pr-md">{{ $t('task.taskContent') }}</div>
            <div class="col-9 q-pr-xl">
              <q-input type="textarea" v-model="taskContent" dense outlined :rules="[creationRule]" hide-bottom-space />
            </div>
          </div>
          <div class="row items-center q-px-xl q-mb-md">
            <div class="col-3 q-pr-md"></div>
            <div class="col-9 q-pr-xl">
              <q-btn color="primary" type="submit" class="q-mr-md" :disable="loading">{{ $t('common.register') }}</q-btn>
              <q-btn @click="closeDrawer">{{ $t('common.cancel') }}</q-btn>
            </div>
          </div>
        </q-form>
      </q-card>
    </q-scroll-area>
</q-drawer>
</template>
<script setup lang="ts">
import MySelect from 'src/components/inputs/MySelect.vue';
import { taskTypeOptions } from '../const/index'
import { ref } from 'vue';
import { creationRule } from 'src/components/handlers/rules';
import { serverTimestamp } from 'firebase/firestore';
import { useOrganization } from 'src/stores/organization';
import { useTask } from 'src/stores/task';
import { Task } from 'src/shared/model/Tasks.model'
import { Alert } from 'src/shared/utils/Alert.utils';
import { QForm } from 'quasar';
import { Applicant, ClientFactory } from 'src/shared/model';

const props = defineProps<{
  entity: 'applicant' | 'office',
  entityData: Applicant | ClientFactory
}>()
const organizationStore = useOrganization()
const taskStore = useTask()
const myForm = ref<InstanceType<typeof QForm>>()
const loading = ref(false)
const taskType = ref('')
const taskContent = ref('')
const taskUserInCharge = ref('')

function closeDrawer() {
  myForm.value?.reset()
  emit('closeDrawer')
}

function resetData() {
  myForm.value?.reset()
  taskType.value = ''
  taskContent.value = ''
  taskUserInCharge.value = ''
  loading.value = false
}

const createTask = async () => {
  loading.value = true
  const saveData : Partial<Task> = {
    taskType: taskType.value,
    taskContent: taskContent.value,
    assignedUserId: taskUserInCharge.value,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    taskStatus: 'new',
    assignedUserName: organizationStore.state.currentOrganizationUsers[taskUserInCharge.value]?.displayName,
    assignedUserBranchId: organizationStore.state.currentOrganizationUsers[taskUserInCharge.value]?.branch_id,
    taskEntity: props.entity
  }
  if(saveData.assignedUserBranchId){
    saveData.assignedUserBranchName = organizationStore.state.currentOrganizationBranches[saveData.assignedUserBranchId].name
  }
  if(props.entity === 'applicant'){
    saveData.applicantId = props.entityData.id
    saveData.applicantName = props.entityData.name
  } else if (props.entity === 'office'){
    saveData.clientId = (props.entityData as ClientFactory).clientID
    saveData.clientName = (props.entityData as ClientFactory).client?.name
    saveData.clientFactoryId = props.entityData.id
    saveData.clientFactoryName = props.entityData.name
  }
  try {
    await taskStore.createTask(saveData)
    Alert.success()
    resetData()
    emit('closeDrawer')
  } catch (error){
    Alert.warning(error)
    loading.value = false
  }
}
const emit = defineEmits(['closeDrawer'])
</script>