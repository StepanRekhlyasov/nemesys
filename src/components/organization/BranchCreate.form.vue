<template>
  <q-form @submit="addBranch">

    <DialogHeader header-key="settings.branch.addBranch" />

    <q-card-section class="q-pb-none">

      <DialogItemContainer name-key="settings.branch.name">
        <q-input v-model="branchData['name']" name="name" :disable="loading" outlined dense :rules="[creationRule]"
          :color="color" hide-bottom-space />
      </DialogItemContainer>

      <DialogItemContainer name-key="client.backOrder.reqQualification">
        <q-select outlined dense :options="prefectureOption" v-model="branchData['prefecture']" bg-color="white"
          :label="$t('common.pleaseSelect')" emit-value map-options :rules="[creationRule]" :disable="loading"
          :color="color" hide-bottom-space />
      </DialogItemContainer>

      <DialogItemContainer name-key="settings.branch.phone">
        <q-input v-model="branchData['phone']" :disable="loading" mask="phone" type="tel" name="tel" outlined dense
          :color="color" hide-bottom-space />
      </DialogItemContainer>

      <DialogItemContainer name-key="settings.branch.business" v-if="!branchData['businessId']">
        <SelectBusinesses @on-business-change="(id) => { businessId = id }" :organization-id="defaultOrganizationid"
          :color="color" hide-bottom-space />
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
<script setup lang="ts">
import { serverTimestamp } from '@firebase/firestore';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { useOrganization } from 'src/stores/organization';
import SelectBusinesses from 'src/pages/user/Settings/management/components/SelectBusinesses.vue'
import { creationRule } from 'src/components/handlers/rules';
import DialogItemContainer from 'src/components/organization/DialogItemContainer.vue';
import DialogHeader from '../dialog/DialogHeader.vue';
import { useBranch } from 'src/stores/branch';
import { Branch } from 'src/shared/model';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const auth = getAuth();
const props = defineProps<{
  editBranch?: Branch,
  defaultOrganizationid?: string,
  color: string
}>()

const branchData = ref<Partial<Branch>>(props.editBranch || {
  hidden: false,
  working: true
})
const loading = ref(false)
const prefectureOption = ref(prefectureList);
const organization = useOrganization()
const branchStore = useBranch()

const businessId = ref<string>('')

const currentOrganizationId = props.defaultOrganizationid ?? organization.currentOrganizationId
const emit = defineEmits(['closeDialog', 'onCatchError'])

async function addBranch() {
  loading.value = true;
  let data = JSON.parse(JSON.stringify(branchData.value));
  try {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['created_user'] = auth.currentUser?.uid;
    data['deleted'] = false
    data['businessId'] = businessId.value
    data['priceForOneUserInYen'] = 10000
    data['licensesSlots'] = 0
    await branchStore.createBranch(data, currentOrganizationId, businessId.value)
    emit('closeDialog');
    Alert.success($q, t);
    loading.value = false;
  } catch (e) {
    console.log(e)
    Alert.warning($q, t);
    loading.value = false;
  }
}
async function saveBranch() {
  loading.value = true;
  const data = branchData.value
  try {
    const branch = {
      updated_at: serverTimestamp(),
      hidden: data.hidden,
      name: data.name,
      prefecture: data.prefecture,
      phone: data.phone,
      working: data.working
    }
    if (!props?.editBranch?.businessId) {
      throw new Error('no businessId')
    }
    await branchStore.editBranch(branch, currentOrganizationId, props?.editBranch?.businessId, props.editBranch?.id)
    emit('closeDialog');
    Alert.success($q, t);
    loading.value = false;
  } catch (e) {
    emit('onCatchError')
    console.log(e)
    Alert.warning($q, t);
    loading.value = false;
  }
}
</script>

