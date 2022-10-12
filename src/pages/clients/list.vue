<template>
  <div class="text-caption text-weight-medium q-pa-sm">
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
          <q-tab name="searchResults" :label="$t('client.list.searchResults')" />
          <q-tab name="corporateSearch" :label="$t('client.list.corporateSearch')" />
        </q-tabs>
      </q-toolbar>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="conditionSearch">
          <div class="row full-width">
            <div class="col-4">
              <q-input outlined dense :label="$t('client.list.keywordSearch')" /> <!-- v-model="editClientData['tel']" -->
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="primary" icon="search" :label="$t('client.list.searchButton')" />
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="secondary" icon="save" :label="$t('client.list.saveKeywords')" />
            </div>
          </div>

          <div class="row full-width q-mt-md">
            <q-btn no-caps color="primary" icon="add" :label="$t('client.list.advancedSearch')" @click="advanceSearchDialog = true" />
          </div>
          <div class="row full-width q-mt-md">
            <q-btn no-caps color="primary" icon="add" :label="$t('client.list.searchFromMap')"  @click="mapSearchDialog = true" />
          </div>
          <div class="row full-width q-mt-md">
            <div class="col-3">
              <q-btn no-caps color="primary" icon="add" :label="$t('client.list.searchFromPref')" @click="areaSearchDialog = true"/>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="searchResults">

        </q-tab-panel>

        <q-tab-panel name="corporateSearch">
          <div class="row full-width">
            <div class="col-4">
              <q-input outlined dense :label="$t('client.list.keywordSearch')" /> <!-- v-model="editClientData['tel']" -->
            </div>
            <div class="col-3 q-pl-sm">
              <q-btn no-caps color="primary" icon="search" :label="$t('client.list.searchButton')" />
            </div>
          </div>

          <div class="row full-width q-mt-md">
            <q-btn no-caps color="green" icon="add" :label="$t('client.list.addNewClient')"  @click="addClientDialog = true"/>
          </div>

        </q-tab-panel>

      </q-tab-panels>
      </q-card>



    <!-- <div class="row q-pb-sm q-pl-sm">
      <div
        v-html="$t('menu.clientList')"
        class="text-h5 text-weight-bolder"
      ></div>
    </div>
    <q-table
      dense
      :rows="clientData"
      :columns="columns"
      row-key="id"
      :pagination="initialPagination"
      separator="cell"
      class="q-ma-sm"
    >
      <template v-slot:body-cell-actions="props">
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
      </template>
    </q-table> -->


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
import { ref } from 'vue';
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

    const columns = [
      {
        name: 'name',
        required: true,
        label: t('client.list.destination'),
        align: 'left',
        field: 'name',
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
      { name: 'score', label: t('client.list.score'), field: 'score' },
      { name: 'tel', label: t('client.list.phone'), field: 'tel' },
      { name: 'fax', label: t('client.list.fax'), field: 'fax' },
      {
        name: 'faxResponseRate',
        label: t('client.list.faxResponseRate'),
        field: 'calcium',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'boStatus',
        label: t('client.list.boStatus'),
        field: 'iron',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'achievement',
        label: t('client.list.achievement'),
        field: 'iron',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      {
        name: 'achievementPast',
        label: t('client.list.achievementPast'),
        field: 'iron',
        sortable: true,
        sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      },
      { name: 'actions', label: '', field: '', align: 'center' },
    ];

    const clientData = ref([]);

    const advanceSearchDialog = ref(false);
    const areaSearchDialog = ref(false);
    const mapSearchDialog = ref(false);
    const addClientDialog = ref(false);


    loadClientData();
    function loadClientData() {
      const q = query(collection(db, 'clients'), where('deleted', '==', false));
      onSnapshot(q, (querySnapshot) => {
        const clients = [];
        querySnapshot.forEach((doc) => {
          clients.push({ id: doc.id, ...doc.data() });
        });
        clientData.value = clients;
      });
    }


    return {
      columns,
      clientData,
      center,
      apiKey,
      tab,

      //dialog
      advanceSearchDialog,
      areaSearchDialog,
      mapSearchDialog,
      addClientDialog,

      initialPagination: {
        sortBy: 'desc',
        descending: false,
        rowsPerPage: 25,
        // rowsNumber: xx if getting data from a server
      },
    };
  },
};
</script>
