<template>
  <q-card style="width: 1000px; max-width: 40vw" class="no-scroll">
    <q-form  @submit="addBranch">
      <q-card-section>
        {{$t('settings.branch.addBranch')}}
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pb-none">
        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.branch.name') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-input
              v-model="branchData['name']"
              name="name"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right self-center q-pr-sm">
            {{ $t('client.backOrder.reqQualification') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-select outlined dense :options="prefectureOption" v-model="branchData['prefectures']"
              bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm q-pt-sm">
            {{ $t('settings.branch.phone') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input
              v-model="branchData['tel']"
              :disable="loading"
              mask="phone"
              type="tel"
              name="tel"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm q-pt-sm">
            {{ $t('settings.branch.hiddenFlag') }}
          </div>
          <div class="col-9 q-pl-sm">
          <q-checkbox
            v-model="branchData['hidden']"
            :label="$t('settings.branch.hide')"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
            class="q-pr-md"/>
          </div>
        </div>

      <div class="row q-pb-sm">
        <div class="col-3 text-right q-pr-sm q-pt-sm">
          {{ $t('settings.branch.flag') }}
        </div>
        <div class="col-9 q-pl-sm">
          <q-checkbox
            v-model="branchData['flag']"
            checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
            class="q-pr-md"/>
        </div>
      </div>
      </q-card-section>
      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn v-if="!editBranch?.id" :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
        <q-btn v-if="editBranch?.id" :label="$t('common.edit')" color="primary" class="no-shadow" :loading="loading" @click="saveBranch"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { ref, SetupContext } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { getOrganizationId } from 'src/shared/utils/utils';

export default {
  name: 'BranchCreateForm',
  props: {
    editBranch: {
      type: Object,
      required: false
    }
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const auth = getAuth();
    const branchData = ref(props.editBranch || {
      hidden: false
    })
    const loading = ref(false)
    const prefectureOption = ref(prefectureList);
    return {
      branchData,
      loading,
      prefectureOption,

      async addBranch(){
        loading.value = true;
        let data = JSON.parse(JSON.stringify(branchData.value));
        try {
            const active_organization_id = getOrganizationId($q);
            data['created_at'] = serverTimestamp();
            data['updated_at'] = serverTimestamp();
            data['created_user'] = auth.currentUser?.uid;
            data['deleted'] = false;

            const clientRef = collection(db, 'organization/'+active_organization_id+'/branch/');
            await addDoc(clientRef, data);

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      },
      async saveBranch() {
        loading.value = true;
        const data = branchData.value
        try {
            const active_organization_id = getOrganizationId($q);
            const boRef = doc(db, 'organization/'+active_organization_id+'/branch/'+props.editBranch?.id);
            await updateDoc(boRef, {
              updated_at: serverTimestamp(),
              hidden: data.hidden,
              name: data.name,
              prefectures: data.prefectures,
              tel: data.tel,
              flag: data.flag
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
