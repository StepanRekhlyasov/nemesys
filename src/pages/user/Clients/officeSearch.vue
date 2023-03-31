<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-3">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.officeSearch') }}</div>
      </q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class="no-padding table">
        <q-list bordered separator padding class="rounded-borders text-primary bg-grey-3">

          <q-item clickable v-ripple :active="link === item.link" @click="openLink(item)" active-class="my-menu-link"
            v-for="item in items" :key="item.link"><!--style="border-left: 5px solid #eeeeee"-->
            <q-item-section>
              <div class="row">
                {{ item.name }}
                <span v-if="item.hint" class="q-pl-lg text-caption text-weight-light">{{ item.hint }}</span>
              </div>
            </q-item-section>
          </q-item>

        </q-list>
      </q-card-section>
    </q-card>


    <q-drawer v-model="drawerRight" show class="bg-grey-3" :width="900" :breakpoint="500" side="right" overlay elevated
      bordered>
      <q-scroll-area class="fit text-left">
        <q-card class="no-shadow bg-grey-3">
          <q-card-section class="text-white bg-primary">
            <div v-if="link == 'addOffice'">
              <div class="q-ml-lg">{{ previewData.client_name }}</div>
              <div class="text-h6">
                <q-btn dense flat icon="close" @click="drawerRight = false" />
                {{ previewData.name }}
                <q-btn :label="$t('client.add.officeReg')" text-color="primary" color="white"
                  class="q-ml-lg text-weight-bold" @click="officeReg" />

              </div>
            </div>
            <div v-else-if="link == 'addClient'">
              <div class="text-h6">
                <q-btn dense flat icon="close" @click="drawerRight = false" />
                {{ previewData.name }}
                <q-btn :label="$t('menu.clientReg')" text-color="primary" color="white"
                  class="q-ml-lg text-weight-bold" @click="clientReg" />

              </div>
            </div>
            <div class="text-h6" v-else-if="link">
              <q-btn dense flat icon="close" @click="drawerRight = false" />
              {{ $t('menu.' + link) }} 
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-grey-1 q-pa-none">
            <MapSearch v-if="link == 'mapSearch'" theme="primary"/>
            <AreaSearch theme="primary" v-else-if="link == 'areaSearch'" />
            <advanceSearch v-else-if="link == 'advancedSearch'" />
            <addClient v-else-if="link == 'addClient'" ref="clientRef" @updateData="updateData"/>
            <addOffice v-else-if="link == 'addOffice'" ref="addOfficeRef" @updateData="updateData"/>
          </q-card-section>
        </q-card>

      </q-scroll-area>
    </q-drawer>

  </div>
</template>


<script>
import { useI18n } from 'vue-i18n';
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   getFirestore,
// } from 'firebase/firestore';
import { ref, computed } from 'vue';
import MapSearch from 'src/components/MapSearch.vue';
import AreaSearch from 'src/components/AreaSearch.vue';
import advanceSearch from './components/advanceSearch.vue';
import addClient from './components/addClient.vue';
import addOffice from './components/addOffice.vue';

//import { useRouter } from 'vue-router';

// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'officeSearch',
  components: {
    MapSearch,
    AreaSearch,
    advanceSearch,
    addClient,
    addOffice,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const link = ref('');
    const drawerRight = ref(false);
    const addOfficeRef = ref();
    const clientRef = ref();
    const previewData = ref({});

    return {
      link,
      drawerRight,
      items: computed(() => {
        return [
          {
            name: t('menu.mapSearch'),
            link: 'mapSearch'
          },
          {
            name: t('menu.areaSearch'),
            link: 'areaSearch'
          },
          {
            name: t('menu.advancedSearch'),
            link: 'advancedSearch'
          },
          {
            name: t('menu.addOffice'),
            link: 'addOffice',
            hint: t('menu.addOfficeHint'),
          },
          {
            name: t('menu.addClient'),
            link: 'addClient',
            hint: t('menu.addClientHint'),
          }
        ]
      }),
      addOfficeRef,
      clientRef,
      previewData,

      openLink(item) {
        link.value = item.link
        previewData.value = {};
        drawerRight.value = true
      },
      officeReg() {
        addOfficeRef.value.validate()
      },
      clientReg() {
        clientRef.value.validate()
      },
      updateData(data){
        previewData.value.name = data.name;
        previewData.value.client_name = data.client_name;
      }


    };
  },
};
</script>

<style lang="sass">
.my-menu-link
  border-left: 5px solid #06445F !important
  background: white
</style>