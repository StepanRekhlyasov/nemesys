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
              <q-row>
                {{ item.name }}
                <span v-if="item.hint" class="q-pl-lg text-caption text-weight-light">{{ item.hint }}</span>
              </q-row>
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
            <div class="text-h6">
              <q-btn dense flat icon="close" @click="drawerRight = false" />
              {{ $t('menu.' + link) }}
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-grey-1 q-pa-none">
            <mapSearch v-if="link == 'mapSearch'" />
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
import mapSearch from './components/mapSearch.vue';

//import { useRouter } from 'vue-router';

// import { defineComponent } from "vue";
// import { GoogleMap, Marker } from "vue3-google-map";

export default {
  name: 'officeSearch',
  components: {
    mapSearch
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const link = ref('');
    const drawerRight = ref(false);

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
            name: t('menu.addClient'),
            link: 'addClient',
            hint: t('menu.addClientHint'),
          }
        ]
      }),

      openLink(item) {
        link.value = item.link
        drawerRight.value = true
      },

    };
  },
};
</script>

<style lang="sass">
.my-menu-link
  border-left: 5px solid #06445F !important
  background: white
</style>