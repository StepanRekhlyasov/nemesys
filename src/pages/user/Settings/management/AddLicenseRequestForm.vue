<template>
  <q-form @submit="addLicenseRequest">

    <DialogHeader header-key="menu.admin.licenseManagement.licenseRequest" />

    <q-card-section class="q-pb-none">

      <DialogItemContainer name-key="menu.admin.licenseManagement.targetSystem">
        <q-select :options="targetSystemOptions" v-model:model-value="targetSystem" outlined dense :disable="loading"
          :rules="[creationRule]" />
      </DialogItemContainer>

      <DialogItemContainer name-key="menu.admin.licenseManagement.requestType">
        <q-select :options="requestTypeOptions" v-model:model-value="requestType" outlined dense :disable="loading"
          :rules="[creationRule]" />
      </DialogItemContainer>

      <DialogItemContainer name-key="menu.admin.licenseManagement.numberOfSlots">
        <q-input v-model:model-value="numberOfSlots" outlined dense type="number" min="1" :disable="loading"
          :rules="[creationRule]" />
      </DialogItemContainer>

    </q-card-section>
    <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
      <q-btn :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading" />
    </q-card-actions>
  </q-form>
</template>

<script setup lang="ts">
import { getAuth } from '@firebase/auth';
import { serverTimestamp, Timestamp } from '@firebase/firestore';
import DialogHeader from 'src/components/dialog/DialogHeader.vue';
import { creationRule } from 'src/components/handlers/rules';
import DialogItemContainer from 'src/components/organization/DialogItemContainer.vue';
import { LicenseRequest, requestType as requestTypeOptions, targetSystem as targetSystemOptions } from 'src/pages/admin/LicenseManagement/types/LicenseRequest';
import { Branch } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useLicense } from 'src/stores/license';
import { useOrganization } from 'src/stores/organization';
import { ref } from 'vue';

const loading = ref(false)
const organization = useOrganization()
const requestType = ref<LicenseRequest['requestType']>()
const targetSystem = ref<LicenseRequest['targetSystem']>()
const numberOfSlots = ref<number>()
const license = useLicense()
const props = defineProps<{
  branch?: Branch
}>()
const emit = defineEmits(['closeDialog'])

async function addLicenseRequest() {
  loading.value = true
  try {
    if (!props.branch) {
      throw new Error('no branch')
    }
    const userId = getAuth().currentUser?.uid
    if (!userId) {
      throw new Error('no user')
    }

    if (!targetSystem.value || !numberOfSlots.value || !requestType.value) {
      throw new Error('no data')
    }

    const licenseRequest: Omit<LicenseRequest, 'id'> = {
      organizationId: organization.currentOrganizationId,
      businessId: props.branch.businessId,
      branchId: props.branch.id,
      targetSystem: targetSystem.value,
      requestType: requestType.value,
      requestQuantity: numberOfSlots.value,
      requestDate: serverTimestamp() as Timestamp,
      requestUserId: userId
    }
    await license.createLicenseRequest(licenseRequest)
    Alert.success()
  } catch (error) {
    console.log(error)
    Alert.warning(error)
  }
  loading.value = false
  emit('closeDialog')
}
</script>

<style scoped lang="scss"></style>
