<template>
  <!-- view="lHh Lpr lFf"  hHh lpR fFf -->
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> </q-toolbar-title>
        <ToolbarLanguage />

        <div>
          <q-btn-dropdown unelevated flat color="white" label="Account">
            <q-list>
              <q-item class="bg-grey-3">
                <q-item-section avatar>
                  <q-icon name="account_circle" />
                </q-item-section>

                <q-item-section>
                  <p class="q-pt-md">
                    Logged in as <strong>{{ name }}</strong>
                  </p>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="background: #2a3f54"
      :width="260"
    >
      <q-list
        bordered
        padding
        class="rounded-borders text-white text-subtitle2"
      >
        <q-item-label header>
          <div class="text-h6 q-ma-none text-white">
            <img
              :alt="$t('systemName') + ' Logo'"
              src="~assets/CLI_dot.png"
              style="width: 25px; height: 25px"
              class="q-mr-sm"
            />
            {{ $t('systemName') }}
          </div>
        </q-item-label>
        <template v-for="item in linksList">
          <q-expansion-item
            expand-separator
            :icon="item.icon"
            :label="$t(item.title)"
            default-closed
            v-if="item.children"
            :key="$t(item.title)"
          >
            <EssentialLink
              v-for="link in item.children"
              :key="$t(link.title)"
              v-bind="link"
            />
          </q-expansion-item>
          <EssentialLink
            v-else
            v-bind="item"
            :key="'es' + $t(item.title)"
            :main="true"
          />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// import router from '../router';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EssentialLink from 'components/EssentialLink.vue';
import ToolbarLanguage from 'components/toolbar/ToolbarLanguage.vue';
import { defineComponent, ref } from 'vue';
//import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    ToolbarLanguage,
  },

  setup() {
    //const { t, te } = useI18n({ useScope: 'global' });
    const leftDrawerOpen = ref(false);
    const email = ref('');
    const name = ref('');
    const $q = useQuasar();
    const auth = getAuth();
    const router = useRouter();

    const linksList = [
      {
        title: 'menu.dashboard',
        link: '/dashboard',
        icon: 'mdi-account',
      },
      {
        title: 'menu.clientManagement',
        icon: 'mdi-office-building-outline',
        children: [
          {
            title: 'menu.clientList',
            link: '/clients',
            icon: 'mdi-account-search',
          },
          {
            title: 'menu.clientReg',
            link: '/clientAdd',
            icon: 'mdi-account',
          },
        ],
      },
      {
        title: 'menu.system',
        icon: 'mdi-cog',
        children: [
          {
            title: 'menu.branches',
            link: 'branches',
          },
          {
            title: 'menu.users',
            link: 'users',
          },
        ],
      },
    ];

    // if we want to get the user details, this is how its done
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        //email.value = user.email;
        //name.value = user.displayName;
      }
    });
    const logout = () => {
      getAuth().signOut();
      router
        .push('/auth/login')
        .then(() => {
          $q.notify({ message: 'Sign Out Success.' });
        })
        .catch((error) => console.log('error', error));
    };
    return {
      linksList,
      email,
      name,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
    };
  },
});
</script>

<!-- <style lang="scss">
@import '../css/app.scss';
.q-layout {
  background-color: $gray-bg;
}
</style> -->
