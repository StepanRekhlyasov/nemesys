<template>
  <q-form @submit="addLicenseRequest">

    <DialogHeader header-key="menu.admin.licenseManagement.licenseRequestAdd" />

    <q-card-section class="q-pb-none">

      <div class="row q-pb-sm">
        <div class="col-5 text-right q-pr-sm q-pt-sm">
          {{ $t('menu.admin.licenseManagement.targetSystem') }}
        </div>
        <div class="col-7 q-pl-sm">
          <div class="q-my-sm" >{{ targetSystem }}</div>
        </div>
      </div>
      <div class="row q-pb-sm">
        <div class="col-5 text-right q-pr-sm  q-pt-sm">
          {{ $t('menu.admin.licenseManagement.requestType') }}
        </div>
        <div class="col-7 q-pl-sm ">
          <q-select :options="requestTypeOptions" v-model:model-value="requestType" outlined dense :disable="loading"
          :rules="[creationRule]" emit-value map-options hide-bottom-space/>
        </div>
      </div>
      <div class="row q-pb-sm">
        <div class="col-5 text-right q-pr-sm  q-pt-sm">
          {{ $t('menu.admin.licenseManagement.numberOfSlots') }}
        </div>
        <div class="col-7 q-pl-sm ">
          <q-input v-model.number:model-value="numberOfSlots" outlined dense type="number" min="1" :disable="loading"
          :rules="[creationRule]" hide-bottom-space/>
        </div>
      </div>

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
import { LicenseRequest, requestTypeOptions } from 'src/pages/admin/LicenseManagement/types/LicenseRequest';
import { Branch } from 'src/shared/model';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useLicense } from 'src/stores/license';
import { useOrganization } from 'src/stores/organization';
import { ref } from 'vue';

const loading = ref(false)
const organization = useOrganization()
const requestType = ref<LicenseRequest['requestType']>()
const targetSystem = ref<LicenseRequest['targetSystem']>('nemesys')
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
      requestUserId: userId,
      status: 'new'
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
