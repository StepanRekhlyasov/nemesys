<template>
  <DialogWrapper width="420px">
    <q-form @submit="addAccaunt">
      <PageHeader :separator="false" :color="color">
        <q-card-section>
          {{ $t('settings.users.addUser') }}
        </q-card-section>
      </PageHeader>

      <q-card-section>

        <InputWrapper :text-key="'settings.users.email'" style=" white-space: nowrap">
          <q-input v-model="accountData['email']" name="email" :disable="loading" outlined dense :color="color" />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.person_name'">
          <q-input v-model="accountData['displayName']" name="displayName" :disable="loading" outlined dense
            :color="color" />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.passworld'">
          <q-input v-model="accountData['passworld']" name="passworld" :disable="loading" outlined
            :rules="[val => val.length >= 6 || 'Please use minimum 6 characters']" dense :color="color"
            hide-bottom-space />
        </InputWrapper>

        <InputWrapper :text-key="'settings.users.role'">
          <q-select outlined dense v-model="accountData['role']" :options="role" bg-color="white"
            :label="$t('common.pleaseSelect')" emit-value map-options :disable="loading" :color="color"
            class="q-pa-none " />
        </InputWrapper>

        <InputWrapper v-if="!isAdmin" :text-key="'settings.users.branch_name'">
          <q-select outlined dense v-model="accountData['branch_id']" :options="branch" bg-color="white"
            :disable="loading" :label="$t('common.pleaseSelect')" emit-value map-options :color="color" />
        </InputWrapper>

        <InputWrapper :text-key="'settings.branch.hiddenFlag'" >
            <q-checkbox   v-model="accountData['hidden']" :label="$t('settings.branch.hide')" :disable="loading"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :color="color" dense />
        </InputWrapper>

      </q-card-section>
      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn :label="$t('common.addNew')" :color="color" class="no-shadow" type="submit" :loading="loading" />
      </q-card-actions>
    </q-form>
  </DialogWrapper>
</template>

<script lang="ts">
import { computed, ref, SetupContext } from 'vue';
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

export default {
  name: 'ResponsibleCreateForm',
  components: {
    DialogWrapper,
    PageHeader,
    InputWrapper
  },
  props: {
    roles: {
      type: Object,
      required: true
    },
    branches: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
    }
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const auth = getAuth();
    const accountData = ref({
      hidden: false
    })
    const role = computed(() => {
      return mapToSelectOptions(props.roles)
    })
    const branch = computed(() => {
      return mapToSelectOptions(props.branches)
    })
    const organization = useOrganization()
    const loading = ref(false)
    const color: 'accent' | 'primary' = props.isAdmin ? 'accent' : 'primary'
    return {
      color,
      accountData,
      loading,
      role,
      branch,

      async addAccaunt() {
        const url = 'https://create-user-account-planwvepxa-an.a.run.app'
        const headers = {
          'Content-Type': 'application/json'
        };

        loading.value = true;
        const data = accountData.value

        api.post(
          url,
          {
            userId: auth.currentUser?.uid, //userId of user who is creating new user
            displayName: data['displayName'], // name for new user
            password: data['passworld'], // password for new user
            email: data['email'], // email address for new user
            branch: data['branch_id'], // optional at present
            role: data['role'], // optional OR docId from roles collection like LGrpWMKEG91IQXMJb069
            organization_ids: [organization.currentOrganizationId]
          },
          {
            headers: headers,
            timeout: 30000,
          }
        )
          .then((response) => {
            if (response.status === 200) {
              context.emit('closeDialog');
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
      },
    }
  }
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
