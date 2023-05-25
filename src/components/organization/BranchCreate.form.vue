<template>
  <q-form @submit="addBranch">

    <DialogHeader header-key="settings.branch.addBranch" />

    <q-card-section class="q-pb-none">

      <DialogItemContainer name-key="settings.branch.name">
        <q-input v-model="branchData['name']" name="name" :disable="loading" outlined dense :rules="[creationRule]"
          :color="color" />
      </DialogItemContainer>

      <DialogItemContainer name-key="client.backOrder.reqQualification">
        <q-select outlined dense :options="prefectureOption" v-model="branchData['prefecture']" bg-color="white"
          :label="$t('common.pleaseSelect')" emit-value map-options :rules="[creationRule]" :disable="loading"
          :color="color" />
      </DialogItemContainer>

      <DialogItemContainer name-key="settings.branch.phone">
        <q-input v-model="branchData['phone']" :disable="loading" mask="phone" type="tel" name="tel" outlined dense
          :color="color" />
      </DialogItemContainer>

      <DialogItemContainer name-key="settings.branch.business" v-if="!branchData['businessId']">
        <SelectBusinesses @on-business-change="(id) => { businessId = id }" :organization-id="defaultOrganizationid"
          :color="color" />
      </DialogItemContainer>


      <DialogItemContainer name-key="settings.branch.branchFlag">
        <q-select v-model="branchFlag" :options="flagOptions" option-value="flag" option-label="label" emit-value
          map-options dense outlined :disable="loading" :color="color" />
      </DialogItemContainer>

      <DialogItemContainer name-key="settings.branch.hiddenFlag">
        <q-checkbox v-model="branchData['hidden']" :label="$t('settings.branch.hide')"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md"
          :disable="loading" :color="color" />
      </DialogItemContainer>

      <DialogItemContainer name-key="menu.admin.organizationsTable.working">
        <q-checkbox v-model="branchData['working']" checked-icon="mdi-checkbox-intermediate"
          unchecked-icon="mdi-checkbox-blank-outline" class="q-pr-md" :disable="loading" :color="color" />
      </DialogItemContainer>

    </q-card-section>
    <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
      <q-btn v-if="!editBranch?.id" :label="$t('common.addNew')" :color="color" class="no-shadow" type="submit"
        :loading="loading" />
      <q-btn v-if="editBranch?.id" :label="$t('common.edit')" :color="color" class="no-shadow" :loading="loading"
        @click="saveBranch" />
    </q-card-actions>

  </q-form>
</template>

<script lang="ts">
import { collection, doc, getFirestore, serverTimestamp, setDoc, updateDoc } from '@firebase/firestore';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { ref, SetupContext } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { useOrganization } from 'src/stores/organization';
import { branchFlags } from 'src/shared/model';
import SelectBusinesses from 'src/pages/user/Settings/management/components/SelectBusinesses.vue'
import { creationRule } from 'src/components/handlers/rules';
import DialogItemContainer from 'src/components/organization/DialogItemContainer.vue';
import { flagOptions } from 'src/components/handlers/flagOptions';
import DialogHeader from '../dialog/DialogHeader.vue';

export default {
  name: 'BranchCreateForm',
  props: {
    editBranch: {
      type: Object,
      required: false
    },
    defaultOrganizationid: {
      type: String
    },
    color: {
      type: String
    }
  },
  components: {
    SelectBusinesses,
    DialogItemContainer,
    DialogHeader
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const auth = getAuth();
    const branchData = ref(props.editBranch || {
      hidden: false,
      working: true
    })
    const loading = ref(false)
    const prefectureOption = ref(prefectureList);
    const organization = useOrganization()
    const branchFlag = ref<branchFlags>(branchData.value['flag'] ?? branchFlags.All)

    const businessId = ref<string>()

    const currentOrganizationId = props.defaultOrganizationid ?? organization.currentOrganizationId


    return {
      businessId,
      flagOptions,
      branchFlag,
      branchData,
      loading,
      prefectureOption,

      async addBranch() {
        loading.value = true;
        let data = JSON.parse(JSON.stringify(branchData.value));
        try {
          data['created_at'] = serverTimestamp();
          data['updated_at'] = serverTimestamp();
          data['created_user'] = auth.currentUser?.uid;
          data['flag'] = branchFlag.value
          data['deleted'] = false
          data['businessId'] = businessId.value
          data['priceForOneUserInYen'] = 10000
          data['licensesSlots'] = 0
          const clientRef = collection(db, `organization/${currentOrganizationId}/businesses/${businessId.value}/branches`);
          const docRef = doc(clientRef)
          data['id'] = docRef.id
          await setDoc(docRef, data)
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
          const boRef = doc(db, `organization/${organization.currentOrganizationId}/businesses/${props?.editBranch?.businessId}/branches/${props.editBranch?.id}`);
          await updateDoc(boRef, {
            updated_at: serverTimestamp(),
            hidden: data.hidden,
            name: data.name,
            prefecture: data.prefecture,
            phone: data.phone,
            flag: branchFlag.value,
            working: data.working
          })
          context.emit('closeDialog');
          Alert.success($q, t);
          loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      },
      creationRule
    }
  }
}
</script>

<style></style>
