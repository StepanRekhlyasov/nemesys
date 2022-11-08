<template>
  <div class="row no-shadow full-height">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{$t('menu.advancedSearch')}}</div>
      </q-card-section>
      <q-separator color="white"  size="2px"/>
      <q-card-section class="bg-grey-3">
        <div class="text-subtitle2">検索条件 / 東京都全域, 今の時間帯のテレアポ接電率:高い</div>
        <div class="row q-mt-xs">
          <div class="q-gutter-md" style="max-width: 150px">
            <q-select outlined dense class="bg-white">
              <template v-slot:prepend>
                <q-icon name="filter_alt" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="q-gutter-md q-ml-sm" style="max-width: 250px">
            <q-select outlined dense class="bg-white">

            </q-select>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="no-padding client_table">
        <q-table
          :columns="columns"
          :rows="officeData"
          row-key="name"
          selection="multiple"
          v-model:selected="selected"
          v-model:pagination="pagination"
          hide-pagination
        >
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="q-pa-none" >
            <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary"
              :label="props.value" class="q-pa-none text-body1" />
            <div>
              {{ props.row.address1 }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-icon size="1.5em" name="mdi-emoticon-neutral" color="yellow-8"></q-icon>
          </q-td>
        </template>

        <template v-slot:body-cell-office="props">
          <q-td :props="props">
            <template v-if="props.row.office_location">
              {{props.row.office_location}}
              <div>
                100.0m
              </div>
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-tel="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            {{props.row.tel}}
          </q-td>
        </template>

        <template v-slot:body-cell-fax="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            <q-btn disable unelevated color="grey" :label="$t('client.list.faxNotAvailable')"></q-btn>
          </q-td>
        </template>teleAppointmentInfo

        <template v-slot:body-cell-presenceContract="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            契約 未締結
            <br />
            求人 情報なし
          </q-td>
        </template>ああああああ

        <template v-slot:body-cell-teleAppointmentInfo="props">
          <q-td :props="props" class="no-wrap q-pa-none">
            2022/10/01 15:30
            <br />
            接電
          </q-td>
        </template>

        <template v-slot:body-cell-contactPeroneName="props">
          <q-td :props="props" class="no-wrap">
            ああああああ
          </q-td>
        </template>


        </q-table>
        <div class="row justify-start q-mt-md pagination">
          <q-pagination
            v-model="pagination.page"
            color="grey-8"
            padding="5px 16px"
            gutter="md"
            :max="(officeData.length/pagination.rowsPerPage) >= 1 ?  officeData.length/pagination.rowsPerPage : 1"
            direction-links
            outline
          />
        </div>
      </q-card-section>
    </q-card>

      <!-- <div>
        <p class="text-h6">Select the client</p>
        <p>You will be able to check the requisitions by selecting the client</p>
      </div> -->

      <q-drawer side="right" v-model="drawerRight" show-if-above bordered :width="1000" :breakpoint="500"
        class="bg-grey-3" overlay elevated v-if="selectedClient">
        <q-scroll-area class="fit text-left">
          <q-card>
            <q-card-section class="text-white" style="background-color: #175680;">
              <div class="text-h6">
                <q-btn dense flat icon="close" @click="drawerRight = false" />
                {{ selectedClient.name }}
                <div class="q-ml-md">{{ selectedClient.office_name }} </div>
              </div>
            </q-card-section>
            <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-4 text-right"> {{$t('client.list.businessAddress') }} </div>
                  <div class="col-8 q-pl-md"> {{ selectedClient.address1 }}  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-right"> TEL </div>
                  <div class="col-8 q-pl-md"> {{ selectedClient.tel }}  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-right"> FAX </div>
                  <div class="col-8 q-pl-md"> {{ selectedClient.fax }}  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-right"> {{$t('client.list.presenceContract') }} </div>
                  <div class="col-8 q-pl-md">  </div>
                </div>
                <div class="row">
                  <div class="col-4 text-right"> {{$t('client.list.tradingPerformance') }} </div>
                  <div class="col-8 q-pl-md"> </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-4 text-right"> {{$t('client.list.officesConcludedBasicContract') }} </div>
                  <div class="col-8 q-pl-md"> </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row">
              <div class="col-3 text-center text-primary"> {{$t('client.list.contactTendency') }} </div>
              <div class="col-9 q-pl-md"> 午前：△　午後：〇　夕方：- </div>
            </div>
            <div class="row">
              <div class="col-3 text-center text-primary"> {{$t('client.add.officeMemo') }} </div>
              <div class="col-9 q-pl-md"> 各社用のメモ。主任はｘｘｘ様。</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <detailComponent />
          </q-card-section>
            <!-- {{ selectedClient }} -->
          </q-card>
        </q-scroll-area>
      </q-drawer>
  </div>
</template>


<script>
import { useI18n } from 'vue-i18n';
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { ref, computed, onBeforeUnmount } from 'vue';
import detailComponent from './components/detail.vue';

//import { useRouter } from 'vue-router';

// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'clientsList',
  components: {
    detailComponent
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const center = { lat: 40.689247, lng: -74.044502 };
    const apiKey = '';
    const tab = ref('conditionSearch');
    const selected = ref([])
    //const router = useRouter();

    const colors = {
      excited: 'green',
      happy: 'light-green',
      neutral: 'yellow-8',
      wink: 'yellow-10',
      sad: 'amber-10',
      angry: 'red',
    };

    const columns = computed(() => {
      return [
        {
          name: 'name',
          required: true,
          label: t('client.add.officeName') + ' | ' + t('client.add.clientName'),
          align: 'left',
          field: 'name',
          sortable: false,
        },{
          name: 'office',
          required: true,
          label: t('client.list.officeLocation') + ' | ' + t('client.list.distanceStartingPoint') ,
          align: 'left',
          field: 'office_location',
          sortable: false,
        },{
          name: 'tel',
          required: true,
          label: t('client.add.phoneNumber') ,
          align: 'left',
          field: 'tel',
          sortable: false,
        },{
          name: 'fax',
          align: 'center',
          label: t('client.add.faxNumber'),
          field: 'fax',
          sortable: false,
        },{
          name: 'presenceContract',
          label: t('client.list.presenceContract') + ' | ' + t('client.list.jobPostings'),
          align: 'left',
          field: 'presenceContract',
          sortable: false,
        },{
          name: 'teleAppointmentInfo',
          align: 'left',
          label: t('client.list.teleAppointmentInfo'),
          field: 'teleAppointmentInfo',
          sortable: false,
        },{
          name: 'contactPeroneName',
          align: 'left',
          label: t('client.list.contactPeroneName'),
          field: 'contactPeroneName',
          sortable: false,
        }

      ];
    });

    const officeData = ref([]);
    const selectedClient = ref(null);

    const advanceSearchDialog = ref(false);
    const areaSearchDialog = ref(false);
    const mapSearchDialog = ref(false);
    const addClientDialog = ref(false);

    const drawerRight = ref(false);

    const selectedRows = ref([]);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
      // rowsNumber: xx if getting data from a server
    });
    const unsubscribe = ref();
    const unsubscribeOffice = ref([]);


    loadofficeData();
    function loadofficeData() {
      const q = query(collection(db, 'clients'), where('deleted', '==', false));
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        const clients = [];
        querySnapshot.forEach((doc) => {
          clients.push({ clientId: doc.id, ...doc.data() });
        });
        loadOfficeData(clients);
      });
    };

    function loadOfficeData(clients) {
      for (let i = 0; i < unsubscribeOffice.value.length; i++) {
        unsubscribeOffice.value[i]();
      }
      unsubscribeOffice.value = [];
      for (let i = 0; i < clients.length; i++) {
        const q = query(collection(db, 'clients', clients[i]['clientId'], 'office'), where('deleted', '==', false));
        let unsub = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let index = officeData.value.findIndex((p) => p.id == doc.id);
            if (index < 0) {
              officeData.value.push({ id: doc.id, ...doc.data(), ...clients[i] });
            } else {
              officeData.value[index] = { id: doc.id, ...doc.data(), ...clients[i] };
            }
          });
        });
        unsubscribeOffice.value.push(unsub);
      }
      console.log((officeData.value.length/pagination.value.rowsPerPage) > 0 ?  officeData.value.length/pagination.value.rowsPerPage : 1)
    }

    onBeforeUnmount(() => {
      unsubscribe.value();
      for (let i = 0; i < unsubscribeOffice.value.length; i++) {
        unsubscribeOffice.value[i]();
      }
    });

    return {
      columns,
      officeData,
      center,
      apiKey,
      tab,
      colors,
      selectedRows,
      pagination,
      selected,

      //dialog
      advanceSearchDialog,
      areaSearchDialog,
      mapSearchDialog,
      addClientDialog,

      drawerRight,
      selectedClient,

      getSelectedString() {
        return selectedRows.value.length === 0 ? '' : `${selectedRows.value.length} record${selectedRows.value.length > 1 ? 's' : ''} selected of ${officeData.value.length}`
      },
      pagesNumber: computed(() => {
        let val = Math.ceil(officeData.value.length / pagination.value.rowsPerPage);
        if (val < 5) {
          return val;
        }
        return val;
      }),

      openDrawer(data){
        drawerRight.value = true;
        //router.push('/clients/' +  data.clientId)
        selectedClient.value = data;
        console.log(data);
        setTimeout(() => drawerRight.value = true, 300);
      }
    };
  },
};
</script>

<style lang="scss">
.client_table{
  color: $grey-7;
  th  {
    color: $grey-10;
  }
  td  {
    max-width: 200px;
    white-space: pre-wrap;
  }
  tr  {
    background-color: $grey-1;
    &.opened{
      background-color: white;
      border-left: 3px solid $primary;
    }
  }
  .pagination {
    .row button {
      border: 2px solid $grey-10;
      color: $grey-10;
      padding: unset !important;
      height: 40px;
      width: 40px;
      border-radius: 4px;
      background-color: #fff;
      margin-left: 10px;
      &.disabled{
        background-color: $grey-4;
        border-color: $grey-6;
      }
    }
    .q-btn--outline:before{
      border: unset;
    }
  }
  .no-wrap{
    white-space: nowrap;
  }
}
</style>
