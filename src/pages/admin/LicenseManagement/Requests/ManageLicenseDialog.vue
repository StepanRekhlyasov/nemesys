<template>
  <q-dialog v-bind="$attrs">
    <q-card class="card">
      <q-card-section>
        <q-inner-loading :showing="loading" color="accent" class="loading" :transition-duration="0" />
        <div class="text-weight-bolder text-h6">
          <template v-if="props.licenseRequest.status === 'approved'">
            {{ props.licenseRequest.requestType === 'Addition' ? t('menu.admin.licenseManagement.additionHeader') : t('menu.admin.licenseManagement.deleteHeader') }}
          </template>
          <template v-if="props.licenseRequest.status === 'denied'">
            {{ props.licenseRequest.requestType === 'Addition' ? t('menu.admin.licenseManagement.additionHeaderDeny') : t('menu.admin.licenseManagement.deleteHeaderDeny') }}
          </template>
        </div>
        <div class="q-mt-md">
          {{ t('menu.admin.licenseManagement.userInfo') }}
        </div>
        <div class="q-mt-sm">
          {{ `${props.dialogData.organizationCodeAndName} ${props.dialogData.userName} / ${props.dialogData.branchName}
                    ${t('menu.admin.licenseManagement.branch')}` }}
        </div>
        <div class="q-mt-md">
          {{ t('menu.admin.licenseManagement.details') }}
        </div>
        <div class="q-mt-sm">
          {{ `${t('menu.admin.licenseManagement.targetBranch')} ${props.dialogData.organizationCodeAndName}` }}
          <b>{{ `${props.dialogData.branchName} ${t('menu.admin.licenseManagement.branch')}` }}</b>
        </div>

        <div class="q-mt-sm">
          {{ `${t('menu.admin.licenseManagement.numberOfSlots')} ${currentSlotsCount} →` }}
          <b>{{ changedSlotsCount }}</b>
        </div>
        <div class="q-mt-sm">
          {{ `${t('menu.admin.licenseManagement.licenseFee')} ¥${currentLicenceFee} →` }}
          <b>{{ `¥${changedLicenceFee}` }}</b>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="q-pt-none">
        <DefaultButton :label-key="props.licenseRequest.status === 'approved'?'menu.admin.licenseManagement.execution':'menu.admin.licenseManagement.deny'" :disable="loading" @click="async () => {
            await execute()
          }" />
        <DefaultButton :label-key="'menu.admin.licenseManagement.cancel'" clear @click="() => {
            emit('onDialogHide', false)
          }" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialogProps } from 'quasar';
import { LicenseRequest } from '../types/LicenseRequest';
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import { useLicense } from 'src/stores/license';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBranch } from 'src/stores/branch';

interface ManageLicenseDialogProps extends QDialogProps {
  licenseRequest: LicenseRequest
  dialogData: {
    organizationCodeAndName: string,
    branchName: string,
    userName: string,
    priceForOneUserInYen: number
  }
}
const { t } = useI18n({ useScope: 'global' });
const branchStore = useBranch()
const props = defineProps<ManageLicenseDialogProps>()
const currentSlotsCount = ref<number>(0)
const changedSlotsCount = ref<number>(0)
const currentLicenceFee = ref<number>(0)
const changedLicenceFee = ref<number>(0)
const emit = defineEmits<{
  (e: 'onDialogHide', v: boolean),
  (e: 'refesh')
}>()
const loading = ref(true)
const licenceStore = useLicense()


onMounted(async () => {
  await fetchData()
})



async function execute() {
  loading.value = true
  if (currentSlotsCount.value == changedSlotsCount.value || currentLicenceFee.value == changedLicenceFee.value) {
    return
  }

  try {
    await licenceStore.execute(props.licenseRequest)
    ;
  } catch (error) {
    Alert.warning(error);
  }
  loading.value = false
  emit('onDialogHide', false)
  emit('refesh')
}

async function fetchData() {
  loading.value = true
  const { priceForOneUserInYen } = props.dialogData
  const { organizationId, businessId, branchId, requestQuantity } = props.licenseRequest
  const requestQuantityChecked = typeof requestQuantity === 'string'? parseInt(requestQuantity) : requestQuantity

  currentSlotsCount.value = (await branchStore.getBranch(organizationId, businessId, branchId)).licensesSlots
  currentLicenceFee.value = await branchStore.calculateLicenceFee(organizationId)

  if(typeof currentSlotsCount.value === 'string'){
    currentSlotsCount.value = parseInt(currentSlotsCount.value)
  }

  if (props.licenseRequest.requestType == 'Addition') {
    changedSlotsCount.value = requestQuantityChecked + currentSlotsCount.value
    changedLicenceFee.value = currentLicenceFee.value + (requestQuantityChecked * priceForOneUserInYen)
  } else {
    changedSlotsCount.value = currentSlotsCount.value - requestQuantityChecked
    changedLicenceFee.value = currentLicenceFee.value - (requestQuantityChecked * priceForOneUserInYen)
    if (changedSlotsCount.value < 0) {
      changedSlotsCount.value = 0
    }
    if (changedLicenceFee.value < 0) {
      changedLicenceFee.value = 0
    }

  }

  loading.value = false
}




</script>

<style scoped lang="scss">
@import "src/css/imports/variables";

.card {
  max-width: 40vw;
  height: 300px;
  min-width: 300px;
  color: $accent;
}

.loading {
  background: rgba(255, 255, 255, 1)
}
</style>
