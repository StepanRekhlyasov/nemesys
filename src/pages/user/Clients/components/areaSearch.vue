<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-card-actions>
      <q-btn :label="$t('client.list.conditionalSearch')" unelevated color="primary"
        class="no-shadow text-weight-bold" icon="add" />
      <q-btn :label="$t('client.list.searchByCondition')" outline color="primary" class="text-weight-bold" />
    </q-card-actions>

    <q-separator />

    <q-card-section>
      <div class="row">
        <div class="col-6">
          <q-input outlined dense v-model="address" :placeholder="$t('client.list.addressHint')" />
        </div>
        <div class="col-6 q-pl-sm">
          <q-btn :label="$t('common.search')" unelevated color="primary" class="no-shadow text-weight-bold" />
          <q-btn :label="$t('common.clear')" outline color="primary" class="text-weight-bold q-ml-sm"
            @click="address = ''" />
        </div>
      </div>
    </q-card-section>

    <q-list bordered class="rounded-borders">
      <q-expansion-item expand-separator :label="region" v-for="region in Object.keys(regionList)" :key="region">
        <div class="row" v-for="prefecture in regionList[region]" :key="prefecture">
          <div class="col-1 text-right">
            <q-checkbox size="sm" v-model="prefectures" :val="Object.keys(prefecture)[0]"></q-checkbox>
          </div>
          <div class="col-11">
            <q-expansion-item dense dense-toggle expand-separator :label="Object.keys(prefecture)[0]"
              :style="{ backgroundColor: 'bg-white' }">
              <div class="bg-white q-pt-sm q-pb-sm">
                <q-checkbox dense size="sm" v-model="wards" :val="ward" :label="ward"
                  v-for="ward in prefecture[Object.keys(prefecture)[0]]" :key="ward.value" class="q-pr-sm" />
              </div>
            </q-expansion-item>
          </div>
        </div>
      </q-expansion-item>
    </q-list>

    <q-separator />

  </q-card>
</template>

<script>
import { watch, ref, onMounted } from 'vue'; //ref,
//import { useQuasar } from 'quasar';
//import { useI18n } from 'vue-i18n';

import { doc, getDoc, getFirestore } from 'firebase/firestore';

export default {
  name: 'areaSearch',

  setup() {
    //const { t } = useI18n({ useScope: 'global' });
    const confirmSaveDialog = ref(false);
    //const $q = useQuasar();
    const db = getFirestore();
    const regionList = ref([]);
    const prefectures = ref([]);
    const wards = ref([]);

    const address = ref('');

    watch(
      () => (prefectures.value),
      (newVal, oldVal) => {
        let addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
        let removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
        let regList = Object.keys(regionList.value);
        for (let i = 0; i < regList.length; i++) {
          let prefecture = regionList.value[regList[i]];
          for (let j = 0; j < prefecture.length; j++) {
            let pref = Object.keys(prefecture[j])[0];
            if (addedItem.includes(pref)) {
              for (let k = 0; k < prefecture[j][pref].length; k++) {
                const index = wards.value.indexOf(prefecture[j][pref][k]);
                if (index == -1) {
                  wards.value.push(prefecture[j][pref][k])
                }
              }
            }
            else if (removedItem.includes(pref)) {
              for (let k = 0; k < prefecture[j][pref].length; k++) {
                const index = wards.value.indexOf(prefecture[j][pref][k]);
                if (index > -1) {
                  wards.value.splice(index, 1);
                }
              }
            }
          }
        }

      },
    );

    const searchClients = async () => {
      return false;
    };

    onMounted(async () => {
      const docRef = doc(db, 'metadata', 'regionData');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        regionList.value = docSnap.data();
      }
    });



    return {
      confirmSaveDialog,
      regionList,
      prefectures,
      wards,

      address,

      searchClients,

    }
  }
}
</script>
