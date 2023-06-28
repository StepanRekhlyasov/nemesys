<template>
  <DialogWrapper width="475px">
    <q-form @submit="addAccount">
      <div class="q-mt-sm">
        <PageHeader :separator="false" :color="color" class="q-pb-none">
          {{ $t('settings.users.addUser') }}
        </PageHeader>
      </div>

      <q-card-section class="q-pt-none">

        <InputWrapper :text-key="'settings.users.email'">
          <q-input v-model="accountData['email']" name="email" :disable="loading" outlined dense :color="color"
            :rules="[creationRule]" type="email" hide-bottom-space />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.name'">
          <q-input v-model="accountData['name']" name="name" :disable="loading" outlined dense :color="color"
            :rules="[creationRule]" hide-bottom-space />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.password'">
          <q-input v-model="accountData['password']" name="password" :disable="loading" outlined
            :rules="[val => val.length >= 6 || 'Please use minimum 6 characters']" dense :color="color" type="password"
            hide-bottom-space />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.role'">
          <q-select outlined dense v-model="accountData['role']" :options="role" bg-color="white"
            :label="$t('common.pleaseSelect')" emit-value map-options :disable="loading" :color="color" class="q-pa-none "
            :rules="[creationRule]" />
        </InputWrapper>

        <InputWrapper v-if="showBranch()" :text-key="'settings.users.branch_name'" :textPaddingBottom="'20px'">
          <SelectBranch :color="color" :rules="[creationRule]" :organization-id="organization.currentOrganizationId"
            bg-color="white" @update:model-value="(id: string) => {
                accountData['branch_id'] = id
              }" showAvalibleSlots ref="branchRef" />
        </InputWrapper>

        <InputWrapper :text-key="'settings.branch.hiddenFlag'">
          <q-checkbox v-model="accountData['hidden']" :label="$t('settings.branch.hide')" :disable="loading"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :color="color" dense />
        </InputWrapper>

      </q-card-section>
      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn :label="$t('common.addNew')" :color="color" class="no-shadow" type="submit" :loading="loading"
          :disable="disableAdd()" />
      </q-card-actions>
    </q-form>
  </DialogWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { api } from 'src/boot/axios';
import { mapToSelectOptions } from 'src/shared/utils/User.utils';
import { useOrganization } from 'src/stores/organization';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue'
import PageHeader from 'src/components/PageHeader.vue';
import InputWrapper from './InputWrapper.vue';
import SelectBranch from './SelectBranch.vue'
import { creationRule } from 'src/components/handlers/rules';
import { adminRolesIds } from 'src/components/handlers/consts';

const props = defineProps<{
  roles: Record<string, { name: string, displayName?: string }>,
  isAdmin?: boolean
}>()

const emit = defineEmits(['closeDialog'])

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const auth = getAuth();
const accountData = ref({
  hidden: false
})
const role = computed(() => {
  return mapToSelectOptions(props.roles)
})
const branchRef = ref<InstanceType<typeof SelectBranch> | null>(null)

const organization = useOrganization()
const loading = ref(false)
const color: 'accent' | 'primary' = props.isAdmin ? 'accent' : 'primary'

function showBranch() {
  return !adminRolesIds.includes(accountData.value['role']) && !props.isAdmin
}

function disableAdd(){
  if(props.isAdmin){
    return false
  }
  return !branchRef.value?.availableSlots || branchRef.value?.availableSlots <= 0
}

async function addAccount() {
  const url = 'https://create-user-account-planwvepxa-an.a.run.app'
  const headers = {
    'Content-Type': 'application/json'
  };

  loading.value = true;
  const data = accountData.value
  const isAdminRole = () => adminRolesIds.includes(data['role'])

  api.post(
    url,
    {
      userId: auth.currentUser?.uid, //userId of user who is creating new user
      name: data['name'], // name for new user
      password: data['password'], // password for new user
      email: data['email'], // email address for new user
      branch: isAdminRole() ? undefined : data['branch_id'], // optional at present
      role: data['role'], // optional OR docId from roles collection like LGrpWMKEG91IQXMJb069
      organization_ids: isAdminRole() ? undefined : [organization.currentOrganizationId],
      hidden: data.hidden,
    },
    {
      headers: headers,
      timeout: 30000,
    }
  )
    .then((response) => {
      if (response.status === 200) {
        emit('closeDialog');
        Alert.success($q, t);
        loading.value = false;
      } else {
        Alert.warning($q, t);
        loading.value = false;
        console.error(response.statusText)
      }
    })
    .catch((error) => {
      Alert.warning($q, t);
      loading.value = false;
      console.error('Failed to create user', error);
    });
}
</script>

<style  lang="scss" scoped>
.q-input {
  width: 259px;
}

.q-select {
  width: 160px;
}
</style>
