<template>
  <DialogWrapper>
    <DialogHeader header-key="menu.admin.organizationsTable.addBusiness" />
    <q-card-section>
      <q-form @submit="addBusiness">

        <DialogItemContainer name-key="menu.admin.organizationsTable.businessName">
          <q-input v-model="name" outlined dense color="accent" :rules="[creationRule]" :disable="loading" />
        </DialogItemContainer>


        <DialogItemContainer name-key="menu.admin.organizationsTable.working" class="items-end">
          <q-checkbox v-model="working" checked-icon="mdi-checkbox-intermediate"
            unchecked-icon="mdi-checkbox-blank-outline" color="accent" dense :disable="loading" />
        </DialogItemContainer>

        <q-card-actions :align="'center'">
          <q-btn :label="t('common.addNew')" color="accent" type="submit" :loading="loading" />
        </q-card-actions>

      </q-form>
    </q-card-section>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { getFirestore } from '@firebase/firestore';
import DialogItemContainer from 'src/components/organization/DialogItemContainer.vue';
import { useI18n } from 'vue-i18n';
import { Row } from './types'
import { ref } from 'vue'
import { Business } from 'src/shared/model';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue'
import DialogHeader from 'src/components/dialog/DialogHeader.vue';
import { creationRule } from 'src/components/handlers/rules';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useBusiness } from 'src/stores/business';

interface AddBusinessProps {
  organization: Row
}

const name = ref<string>('')
const working = ref(true)
const props = defineProps<AddBusinessProps>()
const { t } = useI18n({ useScope: 'global' });
const db = getFirestore()
const emit = defineEmits<{ (e: 'closeDialog') }>()
const businessStore = useBusiness()
const loading = ref(false)

async function addBusiness() {
  loading.value = true;
  const business: Omit<Business, 'id'> = {
    name: name.value,
    working: working.value
  }

  try {
    await businessStore.addBusiness(db, business, props.organization.id)
    Alert.success();
  } catch (error) {
    Alert.warning(error);
  }
  emit('closeDialog')
  loading.value = false
}
</script>

