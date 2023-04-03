<template>
  <q-page>
    <div class="q-pa-md">
      <div v-if="isLoading" class="q-pt-xl">
        <q-spinner color="primary" size="3em" />
      </div>
      <div v-else>
        <div class="flex justify-center q-mt-md">
          <ManageCard :columns="columns" :tags="tags" />
        </div>
        <q-scroll-area style="height: 80vh; max-width: 90vw">
          <div class="row no-wrap">
            <Column
              v-for="column in columns"
              :key="column.id"
              :column="column"
              :columns="columns"
              :tags="tags"
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
//import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted } from 'vue';
//import { useQuasar } from 'quasar';
//import api from '../../firebaseData/dashboard.js';
import Column from './components/Column.vue';
import ManageCard from './components/ManageCard.vue';
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';

export default {
  name: 'DashboardPage',
  components: {
    Column,
    ManageCard,
  },

  props: {},

  computed: {},

  setup() {
    //const { t, te } = useI18n({ useScope: 'global' });
    //const $q = useQuasar();
    const unsubscribe = ref();

    const columns = ref<object[]>([]);
    const isLoading = ref(true);

    const tags = ref(['tagA', 'tagB', 'tagC', 'tagD']);

    onMounted(() => {
      const db = getFirestore();
      const q = query(
        collection(db, 'kabanGroup'),
        where('deleted', '==', false)
      );
      unsubscribe.value = onSnapshot(q, (snapshot) => {
        let items: { id: string }[] = [];
        snapshot.docChanges().forEach((change) => {
          console.log('group: ' + change.doc.id);
          if (change.type === 'added') {
            items.push({ ...{ id: change.doc.id }, ...change.doc.data() });
          } else if (change.type === 'modified') {
            // let index = columns.value.findIndex(
            //   (x: { id: string }) => x.id === change.doc.id
            // );
            // if (index > -1) {
            //   columns.value[index] = {
            //     ...{ id: change.doc.id },
            //     ...change.doc.data(),
            //   };
            // }
          } else if (change.type === 'removed') {
            // let index = columns.value.findIndex(
            //   (x: { id: string }) => x.id === change.doc.id
            // );
            // if (index > -1) {
            //   columns.value.splice(index, 1);
            // }
          }
        });
        columns.value = [...columns.value, ...items];
        isLoading.value = false;
      });
    });

    onUnmounted(() => {
      unsubscribe.value();
    });

    return {
      columns,
      isLoading,
      tags,
    };
  },
};
</script>
