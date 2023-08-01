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
      
      <template v-slot:body-cell-backOrder="props">
        <q-td :props="props">
          <q-spinner color="primary" class="row" v-if="backOrderLoading[props.row.backOrder]"></q-spinner>
          <span class="row" v-else>{{ backOrderList[props.row.backOrder]?.boId?backOrderList[props.row.backOrder]?.boId:'-' }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-chargeOfAdmission="props">
        <td :props="props">
          {{ usersListOption
            .filter(user => user.value === props.row['chargeOfAdmission'])
            .map(user => user.label).join('')  }}
        </td>
      </template>

        <template v-slot:body-cell-memo="props">
          <q-td :props="props" style="white-space: break-spaces;">
            <q-input v-if="isRowSelected(props.rowIndex) && !bo" type="textarea" outlined dense v-model="editableContect['memo']" />
            <template v-if="!isRowSelected(props.rowIndex)">
              {{ props.row.memo }}
            </template>
          </q-td>
        </template>

      <template v-if="!bo" v-slot:body-cell-edit="props">
        <EditButton :props="props" color="primary"
          :on-edit="() => { editableContect.memo = props.row.memo }"
          :on-save="() => { props.row.memo = editableContect.memo; saveFixMemo(props.row) }" @onEditableRowChange="(row) => editableRow = row"
          :editable-row="editableRow" :key="props.rowIndex" />
      </template>
    </q-table>
  </q-card>
</template>

<script setup  lang="ts">
import { computed, Ref, ref, watch} from 'vue';
import { useI18n } from 'vue-i18n';
import { ApplicantFix, BackOrderModel, selectOptions, UserPermissionNames } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';
import { useApplicant } from 'src/stores/applicant';
import { useFix } from 'src/stores/fix';
import { useUserStore } from 'src/stores/user';
import { useBackOrder } from 'src/stores/backOrder';
import EditButton from 'src/components/EditButton.vue';
const props = defineProps({
  applicant: {
    type: Object,
    required: true
  }
})
const { t } = useI18n({ useScope: 'global' });
const organization = useOrganization();
const applicantStore = useApplicant();
const backOrderStore = useBackOrder();
const fixStore = useFix();
const userStore = useUserStore()
const list: Ref<ApplicantFix[]> = ref([])
const usersListOption: Ref<selectOptions[]> = ref([])
const editableRow = ref(-1)
const editableContect = ref({})

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
      field: 'backOrder',
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
    },{
      name: 'edit',
      field: '',
      label: '',
      align: 'left',
    },
  ];
});

const backOrderList = ref<{[id: string] : BackOrderModel}>({})
const backOrderLoading = ref<{[id: string] : boolean}>({})

const getBoId = async (id : string) => {
  backOrderLoading.value[id] = true
  const bo = await backOrderStore.getBoById(id)
  backOrderList.value[bo.id] = bo
  backOrderLoading.value[id] = false
}

watch(()=>list.value, (newValue)=>{
  newValue.forEach((row)=>{
    getBoId(row.backOrder)
  })
})

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

function isRowSelected(row) {
  return row == editableRow.value
}

async function saveFixMemo(row) {
  loading.value = true;
  try {
    console.log(row);
    await fixStore.updateFix(row.id,{memo:row.memo});
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>

<style>

</style>
