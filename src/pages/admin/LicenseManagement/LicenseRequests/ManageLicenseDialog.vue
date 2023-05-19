<template>
  <q-dialog v-bind="$attrs">
    <q-card class="card">
      <q-card-section>
        <q-inner-loading :showing="loading" color="accent" class="loading" :transition-duration="0" />
        <div class="text-weight-bolder text-h6">
          {{ props.licenseRequest.requestType == 'Addition' ? t('menu.admin.licenseManagement.additionHeader') :
            t('menu.admin.licenseManagement.deleteHeader') }}
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
        <DefaultButton :label-key="'menu.admin.licenseManagement.execution'" :disable="loading" @click="async () => {
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
import { useOrganization } from 'src/stores/organization';
import { ref, onMounted } from 'vue';
import DefaultButton from 'src/components/buttons/DefaultButton.vue';
import { useLicense } from 'src/stores/license';

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
const organization = useOrganization()
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
  const { organizationId, businessId, branchId, } = props.licenseRequest

  await licenceStore.execute(props.licenseRequest, changedSlotsCount.value, organizationId, businessId, branchId)
  loading.value = false
  emit('onDialogHide', false)
  emit('refesh')
}

async function fetchData() {

  loading.value = true
  const { priceForOneUserInYen } = props.dialogData
  const { organizationId, businessId, branchId, requestQuantity, } = props.licenseRequest

  currentSlotsCount.value = (await organization.getBranch(organizationId, businessId, branchId)).licensesSlots
  currentLicenceFee.value = await organization.calculateLicenceFee(organizationId)

  if (props.licenseRequest.requestType == 'Addition') {
    changedSlotsCount.value = requestQuantity + currentSlotsCount.value
    changedLicenceFee.value = currentLicenceFee.value + (requestQuantity * priceForOneUserInYen)
  } else {
    changedSlotsCount.value = currentSlotsCount.value - requestQuantity
    changedLicenceFee.value = currentLicenceFee.value - (requestQuantity * priceForOneUserInYen)
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
