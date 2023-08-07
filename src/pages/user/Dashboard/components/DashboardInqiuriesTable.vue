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
    <DashboardInquiryDetails :id="openId" @readinquiry="(inquiryData)=>readinquiry(inquiryData)" />
  </DashboardInquiryDrawer>
  <q-table
    :columns="columns"
    :rows="tableRows"
    class="dashboardTable"
    :separator="'none'"
    hide-pagination
    v-model:pagination = pagination
  >
  <template v-slot:body-cell-messageDirection="props">
    <q-td :props="props" :class="INQUIRY_STATUS.answered === props.row.status ? 'answered' : ''">
    <span v-if="props.row.type==='inquiry'">{{props.row.status === 'answered' ? $t('inquiry.table.recieved') : $t('inquiry.table.sent') }}</span>
    <span v-else>
      {{
        props.row.updatedDate !== undefined && props.row.updatedDate.seconds > props.row.recievedDate.seconds
          ? $t('clientFactory.drawer.details.update')
          : $t('inquiry.table.recieved')
      }}
    </span>
  </q-td>
  </template>
  <template v-slot:body-cell-recievedDate="props">
  <q-td :props="props" :class="INQUIRY_STATUS.answered === props.row.status ? 'answered' : ''">
    <span v-if="props.row.recievedDate && props.row.updatedDate">
      {{
        props.row.recievedDate.seconds < props.row.updatedDate.seconds
          ? myDateFormat(props.row.updatedDate, 'YYYY-MM-DD HH:mm:ss')
          : myDateFormat(props.row.recievedDate, 'YYYY-MM-DD HH:mm:ss')
      }}
    </span>
    <span v-else>{{ myDateFormat(props.row.recievedDate, 'YYYY-MM-DD HH:mm:ss') }}</span>
  </q-td>
</template>
  <template v-slot:body-cell-type="props">
    <q-td :props="props" :class="INQUIRY_STATUS.answered === props.row.status?'answered':''">
      {{ $t('inquiry.table.' + props.row.type) }}
    </q-td>
  </template>
  <template v-slot:body-cell-readBy="props">
  <q-td :props="props" :class="INQUIRY_STATUS.answered === props.row.status ? 'answered' : ''" class="warningMark">
    <template v-if="Array.isArray(props.row.readBy) && props.row.readBy.includes(currentUserId)">
    </template>
    <template v-else>
        <span>!</span>
    </template>
    <template v-if="props.row.flagExclamation==true && Array.isArray(props.row.readBy) && props.row.readBy.includes(currentUserId) ">!</template>
  </q-td>
</template>
  <template v-slot:body-cell-category="props">
    <q-td :props="props" :class="INQUIRY_STATUS.answered === props.row.status?'answered':''">
      <template v-if="props.row.type === 'releaseNote'">{{ $t('releaseNotes.form.options.' + props.value) }}</template>
      <template v-else>{{props.value}}</template>
    </q-td>
  </template>
  <template v-slot:body-cell="props">
    <q-td style="white-space: break-spaces;" :props="props" @click="openDetails(props.row.id, props.row.type)" class="clickable" :class="INQUIRY_STATUS.answered === props.row.status?'answered':''">
      <span>{{ props.value }}</span>
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
    <template v-if="pagination.rowsPerPage > 0">
      <q-icon color="primary" :name="'arrow_drop_down'" :size="'25px'"  />
      {{ $t('dashboard.openList') }}
    </template>
    <template v-else>
      <q-icon color="primary" :name="'arrow_drop_up'" :size="'25px'"  />
      {{ $t('dashboard.closeList') }}
    </template>
    </q-btn>
  </div>
  <q-dialog v-model="showNote">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ noteSubject }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          {{ noteText }}
        </q-card-section>
      </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { DashboardinquiryRows, dashboardNotificationTableColumns as columns } from '../const/dashboard.const'
import { ref, onMounted, watch, computed  } from 'vue'
import DashboardInquiryDrawer from './inquiry/DashboardInquiryDrawer.vue'
import { useInquiry } from 'src/stores/inquiry'
import { useOrganization } from 'src/stores/organization'
import { myDateFormat } from 'src/shared/utils/utils'
import DashboardCreateInquiry from './inquiry/DashboardCreateInquiry.vue'
import DashboardInquiryDetails from './inquiry/DashboardInquiryDetails.vue'
import { INQUIRY_STATUS } from 'src/pages/admin/InquiryPage/types/inquiryTypes'
import { InquiryData } from 'src/shared/model/Inquiry.model'
import { useReleaseNotes } from 'src/stores/releaseNotes'
import { getAuth } from 'firebase/auth'
import { arrayUnion } from 'firebase/firestore'

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
const releaseNoteStore = useReleaseNotes()
const auth = getAuth();
const currentUserId = auth.currentUser?.uid
const inqueries = ref<DashboardinquiryRows[]>([])
const releaseNotes = ref<DashboardinquiryRows[]>([])
const inquiryStore = useInquiry()
const organization = useOrganization()
const openId = ref<string>('')
const showNote = ref(false)
const noteSubject = ref('')
const noteText = ref('')

const updateInqueries = async () => {
  loading.value = true
  const inqueriesRaw = await inquiryStore.getInqueriesByOrganizationId(organization.currentOrganizationId)
  inqueries.value = inqueriesRaw.map((row)=>{
    return {...row, type: 'inquiry'}
  })
  const docWholeSnap = await inquiryStore.getDeliveredNotifications();
  if (!docWholeSnap.empty) {
    docWholeSnap.docs.forEach(async (item) => {
      releaseNotes.value = [...releaseNotes.value, {
        id: item.id,
        readBy: item.data().readBy,
        status: item.data().status,
        category: item.data().category,
        subject: item.data().subject,
        inquiryContent: item.data().content,
        recievedDate: item.data().dateDelivery,
        updatedDate:item.data().updated_at,
        flagExclamation:item.data().flagExclamation,
        type: 'releaseNote'
      }]
    })
  }
  loading.value = false
}
const tableRows = computed(()=>{
  if(loading.value){
    return []
  }
  const result = [...releaseNotes.value, ...inqueries.value]
  result.sort((a, b)=>{
    if(a.recievedDate && b.recievedDate){
      if(a.recievedDate > b.recievedDate){
        return -1
      } else {
        return 1
      }
    }
    return 0
  })
  return result
})
function openDetails(id : string, type : string){
  if(type === 'inquiry'){
    openId.value = id
    drawerCreate.value = false
    drawerDetails.value = true
  } else {
    const row = tableRows.value.find((row)=>row.id===id)
    if(row){
      showNote.value = true
      inquiryStore.addFlagValue(row.id,row)
      noteSubject.value = row.subject
      noteText.value = row.inquiryContent
      if(currentUserId){
        releaseNoteStore.updateNotificationData(id, {
          readBy: arrayUnion(currentUserId)
        })
        if(!row.readBy){
          row.readBy = []
        }
        (row.readBy as string[]).push(currentUserId)
      }
    }
  }
}

function readinquiry(inquiryData : InquiryData){
  inqueries.value.forEach((row)=>{
    if(row.id === inquiryData.id){
      row.readBy = inquiryData.readBy
      row.status = inquiryData.status
    }
  })
}
onMounted(async ()=>{
  updateInqueries()
})

watch(() => organization.currentOrganizationId, () => {
  drawerCreate.value = false
  drawerDetails.value = false
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
.answered {
  background-color: #0853741f;
  font-weight: 700;
}
.warningMark {
  font-size: 30px;
  line-height: 30px;
  text-align: center;
  width: 44px;
}
</style>
