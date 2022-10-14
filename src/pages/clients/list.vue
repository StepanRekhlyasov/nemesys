<template>
  <div class="q-pa-sm">
    <q-breadcrumbs class="text-brown">
      <template v-slot:separator>
        <q-icon size="1.5em" name="chevron_right" color="primary"></q-icon>
      </template>

      <q-breadcrumbs-el :label="$t('client.list.client')" icon="mdi-domain" @click="$router.push('/clients')"
        class="cursor-pointer"></q-breadcrumbs-el>
      <q-breadcrumbs-el :label="$t('client.list.search')"></q-breadcrumbs-el>
    </q-breadcrumbs>

    <!-- <GoogleMap :api-key="apiKey" style="width: 100%; height: 500px" :center="center" :zoom="18">
        <Marker :options="{ position: center }" />
      </GoogleMap> -->

    <q-card class="q-mt-sm">
      <q-toolbar class="bg-primary text-white shadow-2 rounded-borders">
        <q-tabs v-model="tab" shrink stretch dense :breakpoint="0">
          <q-tab name="conditionSearch" :label="$t('client.list.conditionSearch')" />
          <!-- <q-tab name="searchResults" :label="$t('client.list.searchResults')" /> -->
          <q-tab name="corporateSearch" :label="$t('client.list.corporateSearch')" />
        </q-tabs>
      </q-toolbar>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="conditionSearch">
          <div class="row full-width">
            <div class="col-4">
              <q-input outlined dense :label="$t('client.list.keywordSearch')" />
              <!-- v-model="editofficeData['tel']" -->
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="primary" icon="search" :label="$t('client.list.searchButton')" />
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="secondary" icon="save" :label="$t('client.list.saveKeywords')" />
            </div>
          </div>

          <div class="row full-width q-mt-md">
            <div class="col-12">
              <q-btn no-caps color="primary" icon="add" :label="$t('client.list.advancedSearch')"
                @click="advanceSearchDialog = true" />
              <q-btn class="q-ml-lg" no-caps color="primary" icon="add" :label="$t('client.list.searchFromMap')"
                @click="mapSearchDialog = true" />
              <q-btn class="q-ml-lg" no-caps color="primary" icon="add" :label="$t('client.list.searchFromPref')"
                @click="areaSearchDialog = true" />
            </div>

          </div>
          <!-- <div class="row full-width q-mt-md">
            <q-btn no-caps color="primary" icon="add" :label="$t('client.list.searchFromMap')"  @click="mapSearchDialog = true" />
          </div>
          <div class="row full-width q-mt-md">
            <div class="col-3">
              <q-btn no-caps color="primary" icon="add" :label="$t('client.list.searchFromPref')" @click="areaSearchDialog = true"/>
            </div>
          </div> -->
        </q-tab-panel>

        <q-tab-panel name="searchResults">

        </q-tab-panel>

        <q-tab-panel name="corporateSearch">
          <div class="row full-width">
            <div class="col-4">
              <q-input outlined dense :label="$t('client.list.keywordSearch')" />
              <!-- v-model="editofficeData['tel']" -->
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="primary" icon="search" :label="$t('client.list.searchButton')" />
            </div>
          </div>

          <div class="row full-width q-mt-md">
            <q-btn no-caps color="green" icon="add" :label="$t('client.list.addNewClient')"
              @click="addClientDialog = true" />
          </div>

        </q-tab-panel>

      </q-tab-panels>
    </q-card>

    <q-card class="q-pa-sm q-mt-xs">

      <q-table dense :rows="officeData" :columns="columns" row-key="id" separator="cell"
        :selected-rows-label="getSelectedString" selection="multiple" v-model:selected="selectedRows"
        v-model:pagination="pagination" hide-pagination>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <q-btn flat dense no-caps @click="$router.push('/clientDetail/' +  props.row.clientId)" color="primary"
              :label="props.value" class="q-pt-none q-pb-none text-caption" />
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <template v-if="props.value">
              <q-icon size="1.5em" :name="'mdi-emoticon-' + item" :color="colors[item]" v-for="item in props.value"
                :key="item"></q-icon>
            </template>
          </q-td>
        </template>
        <template v-slot:body-cell-tel="props">
          <q-td :props="props">
            <q-btn flat dense no-caps @click="$router.push('/clientDetail/' +  props.row.clientId)" color="primary"
              :label="props.value" class="q-pt-none q-pb-none text-caption" />
          </q-td>
        </template>
        <template v-slot:body-cell-fax="props">
          <q-td :props="props">
            <q-btn flat dense no-caps @click="$router.push('/clientDetail/' +  props.row.clientId)" color="primary"
              :label="props.value" class="q-pt-none q-pb-none text-caption" />
          </q-td>
        </template>

        <!-- <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="mdi-account-arrow-right-outline"
            @click="$router.push('/clientDetail/' + props.row.id)"
          ></q-btn>
        </q-td>
      </template> -->
      </q-table>
      <div class="row justify-center q-mt-sm">
        <q-pagination v-model="pagination.page" size="sm" :max="pagesNumber" direction-links boundary-links
          icon-first="skip_previous" icon-last="skip_next" icon-prev="fast_rewind" icon-next="fast_forward" />
      </div>
    </q-card>

    <q-dialog v-model="advanceSearchDialog" persistent>
      <advanceSearch @closeDialog="advanceSearchDialog = false" />
    </q-dialog>
    <q-dialog v-model="mapSearchDialog" persistent>
      <mapSearch @closeDialog="mapSearchDialog = false" />
    </q-dialog>
    <q-dialog v-model="areaSearchDialog" persistent>
      <areaSearch @closeDialog="areaSearchDialog = false" />
    </q-dialog>
    <q-dialog v-model="addClientDialog" persistent>
      <addClient @closeDialog="addClientDialog = false" />
    </q-dialog>

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
import advanceSearch from './components/advanceSearch.vue';
import areaSearch from './components/areaSearch.vue';
import mapSearch from './components/mapSearch.vue';
import addClient from './components/addClient.vue';

// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'clientsList',
  components: {
    //GoogleMap, Marker
    advanceSearch,
    areaSearch,
    mapSearch,
    addClient
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const center = { lat: 40.689247, lng: -74.044502 };
    const apiKey = '';
    const tab = ref('conditionSearch');
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
          label: t('client.add.clientName'),
          align: 'left',
          field: 'name',
          sortable: false,
        },
        {
          name: 'office_name',
          align: 'center',
          label: t('client.add.officeName'),
          field: 'office_name',
          sortable: true,
        },
        {
          name: 'address1',
          align: 'center',
          label: t('client.list.address'),
          field: 'address1',
          sortable: true,
        },
        {
          name: 'distance',
          label: t('client.list.distance'),
          field: 'distance',
          sortable: true,
        },
        // { name: 'score', label: t('client.list.score'), field: 'score' },
        { name: 'tel', label: t('client.list.phone'), field: 'tel' },
        { name: 'fax', label: t('client.list.fax'), field: 'fax' },
        {
          name: 'basicContractConclusion',
          label: t('client.list.basicContractConclusion'),
          field: 'basicContractConclusion',
          sortable: true,
          //sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
        },
        {
          name: 'jobPostings',
          label: t('client.list.jobPostings'),
          field: 'jobPostings',
          sortable: true
        },
        {
          name: 'contactMorning',
          label: t('client.list.contactMorning'),
          field: 'contactMorning',
          sortable: true
        },
        {
          name: 'contactAfternoon',
          label: t('client.list.contactAfternoon'),
          field: 'contactAfternoon',
          sortable: true
        },
        {
          name: 'contactEvening',
          label: t('client.list.contactEvening'),
          field: 'contactEvening',
          sortable: true
        },
        {
          name: 'dispatchIndex',
          label: t('client.list.dispatchIndex'),
          field: 'dispatchIndex',
          sortable: true,
        },
        {
          name: 'referralMetrics',
          label: t('client.list.referralMetrics'),
          field: 'referralMetrics',
          sortable: true
        },
        {
          name: 'status',
          label: t('client.list.status'),
          field: 'status',
          sortable: true
        },
        {
          name: 'numDispatchedBOs',
          label: t('client.list.numDispatchedBOs'),
          field: 'numDispatchedBOs',
          sortable: true
        },
        {
          name: 'numInhouseDispatchedFIX',
          label: t('client.list.numInhouseDispatchedFIX'),
          field: 'numInhouseDispatchedFIX',
          sortable: true
        },
        {
          name: 'numInhouseDispatchedJobs',
          label: t('client.list.numInhouseDispatchedJobs'),
          field: 'numInhouseDispatchedJobs',
          sortable: true
        },
        { name: 'actions', label: '', field: '', align: 'center' },
      ];
    });

    const officeData = ref([]);

    const advanceSearchDialog = ref(false);
    const areaSearchDialog = ref(false);
    const mapSearchDialog = ref(false);
    const addClientDialog = ref(false);
    const selectedRows = ref([]);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 25
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

      //dialog
      advanceSearchDialog,
      areaSearchDialog,
      mapSearchDialog,
      addClientDialog,

      getSelectedString() {
        return selectedRows.value.length === 0 ? '' : `${selectedRows.value.length} record${selectedRows.value.length > 1 ? 's' : ''} selected of ${officeData.value.length}`
      },
      pagesNumber: computed(() => {
        let val = Math.ceil(officeData.value.length / pagination.value.rowsPerPage);
        if (val < 5) {
          return val;
        }
        return val;
      })
    };
  },
};
</script>
