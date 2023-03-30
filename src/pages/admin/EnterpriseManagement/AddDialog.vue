<template>
  <q-dialog :model-value="openDialog">
    <DialogWrapper>

      <AddBusiness v-if="dialogType == 'Business'" :organization="organization"
        @closeDialog="() => emit('closeDialog', true)" />

      <BranchCreateForm v-if="dialogType == 'Branch'" :default-organizationid="organization.id"
        @closeDialog="() => emit('closeDialog', true)" color="accent" />

      <AddOrganization v-if="dialogType == 'Organization'" @closeDialog="() => emit('closeDialog', true)"
        @on-organization-added="() => emit('onOrganizationAdded')" />

    </DialogWrapper>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialogProps } from 'quasar';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
import BranchCreateForm from 'src/components/organization/BranchCreate.form.vue';
import AddBusiness from './AddBusiness.vue';
import AddOrganization from './AddOrganization.vue';
import { DialogType, Row } from './types'

const emit = defineEmits<{ (e: 'closeDialog', value: boolean), (e: 'onOrganizationAdded') }>()

interface AddDialogProps extends QDialogProps {
  organization: Row
  openDialog: boolean
  dialogType: DialogType;
}

defineProps<AddDialogProps>()

</script>

