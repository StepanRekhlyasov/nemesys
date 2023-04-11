<template>
  <DialogWrapper>
    <DialogHeader header-key="menu.admin.organizationsTable.addOrganization" />
    <q-card-section>
      <q-form @submit="addOrganization">

        <DialogItemContainer name-key="menu.admin.organizationsTable.organizationCode">
          <q-input v-model="organization.code" outlined dense color="accent" :disable="loading"
            :rules="[organizationCodeRule, isCodeUniqueRule]" debounce="1000" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.organizationName">
          <q-input v-model="organization.name" outlined dense color="accent" :rules="[creationRule]" :disable="loading" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.staffName">
          <q-input v-model="organization.staff_name" outlined dense color="accent" :rules="[creationRule]"
            :disable="loading" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.phoneNumber">
          <q-input v-model="organization.tel" outlined dense color="accent" :rules="[creationRule]" :disable="loading"
            type="tel" mask="phone" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.fax">
          <q-input v-model="organization.fax" outlined dense color="accent" :rules="[creationRule]" :disable="loading"
            type="tel" mask="phone" />
        </DialogItemContainer>


        <DialogItemContainer name-key="menu.admin.organizationsTable.email">
          <q-input v-model="organization.mailaddress" outlined dense color="accent" :rules="[creationRule]"
            :disable="loading" type="email" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.operator">
          <SelectUser :model-value="user"
            @update:model-value="(newUser: User) => { organization.operatorUser = newUser.id; user = newUser }"
            :disable="loading" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.invoiceRequest">
          <q-select v-model:model-value="organization.invoiceRequest" :options="invoiceRequests" color="accent" outlined
            dense :rules="[creationRule]" :disable="loading" />
        </DialogItemContainer>

        <DialogItemContainer name-key="menu.admin.organizationsTable.working">
          <q-checkbox v-model="organization.working" color="accent" :disable="loading" />
        </DialogItemContainer>

        <q-card-actions :align="'center'">
          <q-btn :label="$t('common.addNew')" color="accent" type="submit" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card-section>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import DialogHeader from 'src/components/dialog/DialogHeader.vue';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';
import { creationRule, organizationCodeRule, isCodeUniqueRule } from 'src/components/handlers/rules';
import DialogItemContainer from 'src/components/organization/DialogItemContainer.vue';
import { invoiceRequests, Organization, User } from 'src/shared/model';
import { ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { useOrganization } from 'src/stores/organization';
import { getFirestore } from '@firebase/firestore';
import SelectUser from './SelectUser.vue'
import { useMail } from 'src/stores/email';
import { toDate } from 'src/shared/utils/utils';

const organization = ref<Organization>({ working: true } as Organization)
const loading = ref(false)
const emit = defineEmits<{ (e: 'closeDialog'), (e: 'onOrganizationAdded') }>()
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const organizationStore = useOrganization()
const db = getFirestore()
const user = ref<User>()
const email = useMail()
async function addOrganization() {

  loading.value = true
  try {
    await organizationStore.addOrganization(db, organization.value)
    const createdAt = toDate((await organizationStore.getOrganizationByCode(organization.value.code)).createdAt)
    const subject = 'Your organization has been started to use Nemesys.'
    const content = {
      html: `Organization name: ${organization.value.name} <br/> Organization code: ${organization.value.code} <br/> Created at: ${createdAt}`
    }
    await email.send(organization.value.mailaddress, subject, content)
    Alert.success($q, t);
  } catch (error) {
    Alert.warning($q, t);
  }

  loading.value = false
  emit('closeDialog')
  emit('onOrganizationAdded')
}

</script>


