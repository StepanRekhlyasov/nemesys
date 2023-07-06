<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <span class="text-primary text-h6 q-pt-md"> {{ $t('applicant.attendant.operatingSites') }} </span>
    </q-card-section>

    <q-table :columns="columns" :rows="list" row-key="id" v-model:pagination="pagination" hide-pagination :loading="loading">

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <span class="row">{{
            applicantStore.state.clientList?.
            find(client => client.id == props.row.client)?.name
          }}</span>
          <span class="row">{{
            applicantStore.state.clientList?.
            find(client => client.id == props.row.client)?.office?.
            find(office => office.id == props.row.office)?.name
          }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-chargeOfAdmission="props">
        <td :props="props">
          {{ usersListOption
            .filter(user => user.value === props.row['chargeOfAdmission'])
            .map(user => user.label).join('')  }}
        </td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup  lang="ts">
import { computed, Ref, ref} from 'vue';
import { useI18n } from 'vue-i18n';
import { ApplicantFix, selectOptions, UserPermissionNames } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import { useFix } from 'src/stores/fix';
import { useUserStore } from 'src/stores/user';
const props = defineProps({
  applicant: {
    type: Object,
    required: true
  }
})
const { t } = useI18n({ useScope: 'global' });
const organization = useOrganization();
const applicantStore = useApplicant();
const fixStore = useFix();
const userStore = useUserStore()
const list: Ref<ApplicantFix[]> = ref([])
const usersListOption: Ref<selectOptions[]> = ref([])

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
});
const loading = ref(false);

const columns = computed(() => {
  return [
    {
      name: 'created_at',
      required: true,
      label: t('applicant.attendant.placeOperation'),
      field: 'created_at',
      align: 'left',
    },
    {
      name: 'backOrder',
      required: true,
      label: 'BOID',
      field: 'boId',
      align: 'left',
    },
    {
      name: 'admissionDate',
      required: true,
      label: t('applicant.attendant.startDate'),
      field: 'admissionDate',
      align: 'left',
    },
    {
      name: 'endDate',
      label: t('applicant.attendant.endDate'),
      field: 'endDate',
      align: 'left',
    },
    {
      name: 'chargeOfAdmission',
      label: t('applicant.attendant.companyInCharge'),
      field: 'chargeOfAdmission',
      align: 'left',
    },
    {
      name: 'memo',
      label: t('applicant.attendant.operationMemo'),
      field: 'memo',
      align: 'left',
    },
  ];
});

loadOperationInfo()
async function loadOperationInfo() {
  try {
    loading.value = true;
    list.value = await fixStore.getFixData(props.applicant.id, true);
    loading.value = false;
  } catch (e) {
    console.log(e)
    loading.value = false;
  }
}

loadUser();
async function loadUser() {
  loading.value = true;

  const users = await userStore.getUsersByPermission(UserPermissionNames.UserUpdate, '', organization.currentOrganizationId);
  if(!users){
    return
  }
  usersListOption.value = users.map((user) => {
     return {
        label: user.displayName,
        value: user.id
      }
    });

  loading.value = false;

}
</script>

<style>

</style>
