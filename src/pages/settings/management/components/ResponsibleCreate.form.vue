<template>
  <q-card style="width: 1000px; max-width: 40vw" class="no-scroll">
    <q-form  @submit="addAccaunt">
      <q-card-section>
        {{$t('settings.branch.addBranch')}}
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pb-none">
        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.users.email') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-input
              v-model="accountData['email']"
              name="email"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.users.person_name') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-input
              v-model="accountData['displayName']"
              name="displayName"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm" v-if="!editAccount?.id">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.users.passworld') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-input
              v-model="accountData['passworld']"
              name="passworld"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.users.role') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-select
              outlined dense
              v-model="accountData['role']"
              :options="role" bg-color="white"
              :label="$t('common.pleaseSelect')"
              emit-value map-options
              :disable="loading" />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.users.branch_name') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-select
              outlined dense
              v-model="accountData['branch_id']"
              :options="branch" bg-color="white"
              :disable="loading"
              :label="$t('common.pleaseSelect')"
              emit-value map-options />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm q-pt-sm">
            {{ $t('settings.branch.hiddenFlag') }}
          </div>
          <div class="col-9 q-pl-sm">
          <q-checkbox
            v-model="accountData['hidden']"
            :label="$t('settings.branch.hide')"
            :disable="loading"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
            class="q-pr-md"/>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn v-if="!editAccount?.id" :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
        <q-btn v-if="editAccount?.id" :label="$t('common.edit')" color="primary" class="no-shadow" :loading="loading" @click="saveAccount"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
import { computed, ref, SetupContext } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { getOrganizationId } from 'src/shared/utils/utils';
import { selectOptions } from 'src/shared/model';
import { api } from 'src/boot/axios';

export default {
  name: 'ResponsibleCreateForm',
  props: {
    editAccount: {
      type: Object,
      required: false
    },
    roles: {
      type: Object,
      required: true
    },
    branches: {
      type: Object,
      required: true
    }
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const auth = getAuth();
    const accountData = ref(props.editAccount || {
      hidden: false
    })
    const role = computed(() =>{
      let list: selectOptions[] = []
      Object.keys(props.roles).map(key => {
        let data =  {
          label: props.roles[key]?.name || '',
          value: key
        }
        list.push(data)
      })
      return list
    })
    const branch = computed(() =>{
      let list: selectOptions[] = []
      Object.keys(props.branches).map(key => {
        let data =  {
          label: props.branches[key]?.name,
          value: key
        }
        list.push(data)
      })
      return list
    })

    const loading = ref(false)
    return {
      accountData,
      loading,
      role,
      branch,

      async addAccaunt(){
        const url = 'https://create-user-account-planwvepxa-an.a.run.app'
        const headers = {
          'Content-Type': 'application/json'
        };

        const data = accountData.value
        const active_organization_id = getOrganizationId($q)

        api.post(
            url,
            {
              userId: auth.currentUser?.uid, //userId of user who is creating new user
              displayName: data['displayName'], // name for new user
              password: data['passworld'], // password for new user
              email: data['email'], // email address for new user
              branch: data['branch_id'], // optional at present
              role: data['role'], // optional OR docId from roles collection like LGrpWMKEG91IQXMJb069
              organization_ids: [active_organization_id]
            },
            {
              headers: headers,
              timeout: 30000 ,
            }
          )
          .then((response) => {
            if (response.status === 200) {
              console.log('Successfully create user');
            } else {
              console.error('Failed to create user');
              console.log(response.statusText)
            }
          })
          .catch((error) => {
            console.error('Failed to create user', error);
          });
      },
      async saveAccount() {
        loading.value = true;
        const data = accountData.value
        try {
            const boRef = doc(db, 'users/'+props.editAccount?.id);
            await updateDoc(boRef, {
              updated_at: serverTimestamp(),
              hidden: !!data.hidden,
              displayName: data.displayName,
              role: data.role,
              branch_id: data.branch_id
            })

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      }
    }
  }
}
</script>

<style>

</style>
