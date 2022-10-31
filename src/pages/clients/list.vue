<template>
  <div>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered separator>
      <q-item>
        <q-item-section class="text-h6">{{$t('client.list.client')}} </q-item-section>
      </q-item>
      <q-item clickable v-ripple class="q-pa-none">
        <q-item-section>
          <q-input square outlined placeholder="Search by client" height="auto">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Item with caption</q-item-label>
          <q-item-label caption>Caption</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label overline>OVERLINE</q-item-label>
          <q-item-label>Item with caption</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
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


// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'clientsList',
  components: {
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
