<template>
  <div class="text-caption text-weight-medium q-pa-sm ">
    <div class="row q-pb-sm q-pl-sm">
      <div v-html="$t('menu.clientList')" class="text-h5 text-weight-bolder"></div>
    </div>
    <q-table
      dense
      :rows="clientData"
      :columns="columns"
      row-key="id"
      :pagination="initialPagination"
      separator="cell"
      class="q-ma-sm"
    />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { ref } from 'vue'

export default {

  setup () {
    const { t, te } = useI18n({ useScope: 'global' })
    const db = getFirestore();

    const columns = [
      {
        name: 'name',
        required: true,
        label: t('client.list.destination'),
        align: 'left',
        field: 'name',
        sortable: true
      },
      { name: 'address1', align: 'center', label: t('client.list.address'), field: 'address1', sortable: true },
      { name: 'distance', label: t('client.list.distance'), field: 'distance', sortable: true },
      { name: 'score', label: t('client.list.score'), field: 'score' },
      { name: 'tel', label: t('client.list.phone'), field: 'tel' },
      { name: 'fax', label: t('client.list.fax'), field: 'fax' },
      { name: 'calcium', label: t('client.list.faxResponseRate'), field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
      { name: 'iron', label: t('client.list.boStatus'), field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
      { name: 'iron', label: t('client.list.achievement'), field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
      { name: 'iron', label: t('client.list.achievementPast'), field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
    ]

    const clientData = ref([]);

    loadClientData();
    function loadClientData() {
          const q = query(collection(db, "clients"), where("deleted", "==", false));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const clients = [];
            querySnapshot.forEach((doc) => {
                clients.push({id: doc.id, ...doc.data()});
            });
            clientData.value = clients;
          });
    }

    return {
      columns,
      clientData,

      initialPagination: {
        sortBy: 'desc',
        descending: false,
        rowsPerPage: 25
        // rowsNumber: xx if getting data from a server
      },

    }
  }
}
</script>
