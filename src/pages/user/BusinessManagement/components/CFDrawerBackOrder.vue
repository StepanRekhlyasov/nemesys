<template>
  <q-table
    :columns="columns"
    :rows="backOrderData"
    row-key="id"
    v-model:pagination="pagination"
    hide-pagination
    class="q-py-none no-shadow"
  >
<template v-slot:body-cell-boid="props">
  <q-td :props="props">
    <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary"
        :label="props.row.boid" class="q-pa-none text-body1" />
    <div></div>
  </q-td>
</template>
    <template v-slot:body-cell-select="props">
      <q-td :props="props">
        <q-checkbox v-model="props.row.selected"  />
      </q-td>
    </template>

<template v-slot:header-cell-qualification="props">
  <q-th :props="props">
    {{$t('client.backOrder.reqQualification')}}<br/>
    {{$t('client.backOrder.experienceReq')}}<br/>
   </q-th>
</template>

<template v-slot:header-cell-age="props">
  <q-th :props="props">
    {{$t('client.backOrder.upperAgeLimit')}}<br/>
    {{$t('client.backOrder.employmentStatus')}}<br/>
    {{$t('client.backOrder.dispatchPrice')}}<br/>
  </q-th>
</template>

<template v-slot:header-cell-work="props">
  <q-th :props="props">
    {{$t('client.backOrder.workingDays')}}<br/>
    {{$t('client.backOrder.workingDaysWeek')}}<br/>
  </q-th>
</template>

<template v-slot:header-cell-content="props">
  <q-th :props="props">
    {{$t('client.backOrder.businessContent')}}<br/>
    {{$t('client.backOrder.otherNotes')}}<br/>
  </q-th>
</template>

<template v-slot:header-cell-workingTime="props">
  <q-th :props="props">
    {{$t('client.backOrder.workingHoursEarly')}}<br/>
    {{$t('client.backOrder.workingHoursDay')}}<br/>
    {{$t('client.backOrder.workingHoursLate')}}<br/>
    {{$t('client.backOrder.workingHoursNight')}}<br/>
  </q-th>
</template>

<template v-slot:body-cell-type="props">
  <q-td :props="props" >
    {{props.row.typeCase && $t('client.backOrder.'+props.row.typeCase)}}<br/>
  </q-td>
</template>

<template v-slot:body-cell-qualification="props">
  <q-td :props="props" >
    {{props.row.qualifications}}<br/>
    {{props.row.experience}}
  </q-td>
</template>

<template v-slot:body-cell-age="props">
  <q-td :props="props" >
    {{props.row.ageLimit}}<br/>
    {{props.row.status && $t('client.backOrder.'+props.row.status)}}<br/>
    {{props.row.unitPrice}}
  </q-td>
</template>

<template v-slot:body-cell-work="props">
  <q-td :props="props" >
    {{props.row.posibleDays}} 日／月<br/>
    {{props.row.posibleObsidianDays}}
  </q-td>
</template>

<template v-slot:body-cell-content="props">
  <q-td :props="props" >
    {{props.row.buissnesDescription}}<br/>
    {{props.row.otherNotes}}
  </q-td>
</template>

<template v-slot:body-cell-workingTime="props">
  <q-td :props="props" >
    {{props.row.workingHoursEarly_min}}<br/>
    {{props.row.workingHoursDay_min}}<br/>
    {{props.row.workingHoursLate_min}}<br/>
    {{props.row.workingHoursNight_min}}
  </q-td>
</template>

<template v-slot:top>
      <q-checkbox val="xs" class="q-pt-sm" color="blue" v-model="selected" />
      <div class="q-ml-sm q-pt-sm">{{ $t('common.numberOfSelections') }}: {{ selectedCount() }}</div>
      <q-btn class="no-shadow q-ml-md q-mt-sm q-py-none q-px-md " :label="$t('common.delete')" :class="selectedCount() == 0 ?  'bg-secondary': 'bg-red'" :text-color="selectedCount() > 0 ? 'white' : 'black'" :disable="selectedCount() == 0" @click="deleteSelected()" />
      <q-btn color="primary" text-color="white" icon="mdi-plus-thick" class="no-shadow q-mt-sm q-px-md q-ml-md" dense  :label="$t('common.add')" @click="showAddBO"/>
</template>

</q-table>
<Pagination
    :rows="backOrderData"
     @updatePage="pagination.page = $event"
     v-model:pagination="pagination"/>

<q-drawer
		v-model="cteateBoDrawer" :width="1000" :breakpoint="500" side="right"
		overlay elevated bordered>
<createBO :type="typeBoCreate" @close-dialog="cteateBoDrawer=false;"/>
</q-drawer>
<InfoBO ref="infoDrawer"  @openSearchByMap="showSearchByMap=true" @passClientToMapSearch="(clientValue)=>{
		selectedClient = clientValue
}"/>
<SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="showSearchByMap=false"></SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { BackOrderModel,Client } from 'src/shared/model/BackOrder.model';
import { ref, Ref, watch, onMounted, defineProps } from 'vue';
import { useBackOrder } from 'src/stores/backOrder';
import { useQuasar } from 'quasar';
import InfoBO from 'src/pages/user/BackOrder/components/info/InfoBO.vue';
import SearchByMapDrawer from 'src/pages/user/BackOrder/components/info/searchByMapDrawer.vue';
import createBO from 'src/pages/user/BackOrder/components/create/createBO.vue';
import { BackOrderColumns } from 'src/shared/constants/BackOrder.const';
import { Alert } from 'src/shared/utils/Alert.utils';
import Pagination from 'src/components/client-factory/PaginationView.vue';
import {done} from 'src/stores/backOrder'

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{ clientId: string }>();
const selected = ref(false);
const backOrderData: Ref<BackOrderModel[]> = ref([]);
const showSearchByMap = ref(false)
const typeBoCreate:Ref<'referral' | 'dispatch'> = ref('referral')
const selectedBo = ref<BackOrderModel | undefined>();
const selectedClient = ref<Client | undefined>(undefined);
const cteateBoDrawer = ref(false);
const columns = ref(BackOrderColumns);
const loading = ref(false);
const $q = useQuasar();
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5
});

const backOrderStore = useBackOrder();

const showDeleteDialog = async (ids: string[]) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel')
  }).onOk(async () => {
    loading.value=true
    const done = await backOrderStore.deleteBO(ids);
    debugger
    loading.value=false

    if (done) {
      const data=await backOrderStore.getClientBackOrder(props.clientId)
      let boid = data.length;
      backOrderData.value = data.map(row => {
    return { ...row, selected: false, boid: boid-- };
  });
     Alert.success()
    }
  });
};
const showAddBO = () => {
      cteateBoDrawer.value =  true
    }
const deleteSelected = () => {
  const BoItem = backOrderData.value.filter(row => row['selected']);
  let items: string[] = [];
  for (const item of BoItem) {
    items.push(item['id']);
  }
  showDeleteDialog(items);
};

const fetchBOData = async () => {
  loading.value = true;
  const data = await backOrderStore.getClientBackOrder(props.clientId);
  let boid = data.length;
  backOrderData.value = data.map((row) => {
    return { ...row, selected: false, boid: boid-- };
  });
  loading.value = false;
};
const openDrawer = (data) => {
       if(data){
        selectedBo.value = data;
        cteateBoDrawer.value=true;
       }
      }
watch(() => selected.value, (newValue) => {
  for (let i = 0; i < backOrderData.value.length; i++) {
    backOrderData.value[i]['selected'] = newValue;
  }
});
watch(done, async () => {
 await fetchBOData()
  done.value=false
  }
);
onMounted(async() => {
  fetchBOData();
});

const selectedCount = () => {
  return backOrderData.value.filter(row => row['selected']).length;
};
</script>

<style lang="scss">
tbody {
  background-color: #efeded;
}
</style>

