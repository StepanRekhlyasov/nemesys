<template>
    <q-card-section class="bg-grey-3 flex items-center">
      <p style="font-size:16px; margin:0;" class="text-primary text-bold">■{{ $t('dashboard.notification') }}</p>
      <q-btn class="no-shadow q-ml-md" color="primary" @click="()=>{
        drawerCreate=true
        drawerDetails=false
      }">{{ $t('menu.admin.inquiry') }}</q-btn>
    </q-card-section>
    <DashboardInquiryDrawer v-model="drawerCreate" @closeDrawer="drawerCreate=false">
      <DashboardCreateInquiry @closeDrawer="drawerCreate=false" @inquiryAdded="()=>{
        drawerCreate=false
        updateInqueries()
      }" />
    </DashboardInquiryDrawer>
    <DashboardInquiryDrawer v-model="drawerDetails" @closeDrawer="drawerDetails=false">
      <DashboardInquiryDetails :id="openId" />
    </DashboardInquiryDrawer>
    <q-table 
      :columns="columns" 
      :rows="inqueries" 
      class="dashboardTable"
      :separator="'none'"
      hide-pagination
      v-model:pagination = pagination
    >
    <template v-slot:body-cell-recievedDate="props">
      <q-td :props="props">
        {{timestampToDateFormat(props.row.recievedDate)}}
      </q-td>
    </template>
    <template v-slot:body-cell="props">
      <q-td :props="props" @click="openDetails(props.row.id)" class="clickable">
        {{ props.value }}
      </q-td>
    </template>
    </q-table>
    <q-linear-progress query v-if="loading" color="primary"/>
    <div class="bg-grey-3 flex items-center q-py-sm" v-if="inqueries?.length > 5">
      <q-btn
        unelevated
        dense
        @click="handleExpand()"
      >
        <q-icon v-if="pagination.rowsPerPage > 0" color="primary" :name="'arrow_drop_down'" :size="'25px'"  /> 
        <q-icon v-else color="primary" :name="'arrow_drop_up'" :size="'25px'"  /> 
        {{ $t('dashboard.openList') }} 
      </q-btn>
    </div>
</template>
<script setup lang="ts">
import { dashboardNotificationTableColumns as columns } from '../const/dashboard.const'
import { ref, onMounted, watch } from 'vue'
import DashboardInquiryDrawer from './inquiry/DashboardInquiryDrawer.vue'
import { useInquiry } from 'src/stores/inquiry'
import { useOrganization } from 'src/stores/organization'
import { InquiryData } from 'src/shared/model'
import { timestampToDateFormat } from 'src/shared/utils/utils'
import DashboardCreateInquiry from './inquiry/DashboardCreateInquiry.vue'
import DashboardInquiryDetails from './inquiry/DashboardInquiryDetails.vue'

const pagination = ref({
  rowsPerPage : 5
})
function handleExpand(){
  if(pagination.value.rowsPerPage > 0){
    pagination.value.rowsPerPage = 0
  } else {
    pagination.value.rowsPerPage = 5
  }
}
const loading = ref(false)
const drawerCreate = ref(false)
const drawerDetails = ref(false)
const updateInqueries = async () => {
  loading.value = true
  inqueries.value = await inquiryStore.getInqueriesByOrganizationId(organization.currentOrganizationId)
  loading.value = false
}
const inqueries = ref<InquiryData[]>([])
const inquiryStore = useInquiry()
const organization = useOrganization()
const openId = ref<string>('')
function openDetails(id : string){
  openId.value = id
  drawerCreate.value = false
  drawerDetails.value = true
}

onMounted(async ()=>{
  updateInqueries()
})

watch(() => organization.currentOrganizationId, () => {
  updateInqueries()
})
</script>
<style lang="scss" scoped>
.clickable{
  color: $primary;
  cursor: pointer;
  max-width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover{
    text-decoration: underline;
  }
}
</style>