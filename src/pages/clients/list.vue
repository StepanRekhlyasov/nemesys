<template>
  <div class="text-caption text-weight-medium q-pa-sm">
    <!-- <GoogleMap :api-key="apiKey" style="width: 100%; height: 500px" :center="center" :zoom="18">
        <Marker :options="{ position: center }" />
      </GoogleMap> -->

    <div class="row q-pb-sm q-pl-sm">
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
    </q-table>
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
// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'clientsList',
  //components: { GoogleMap, Marker },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const center = { lat: 40.689247, lng: -74.044502 };
    const apiKey = '';

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
