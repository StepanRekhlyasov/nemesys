<template>
  <q-layout view="hHh Lpr lFf" class="admin-layout">
    <q-header class="shadow-1">
      <q-toolbar class="bg-white text-black">
        <q-img :src="require('assets/logo_view.png')" style="height: 50px; width: 100px;"/>
        <q-toolbar-title class="text-h4 text-weight-bolder header"> 管理者ページ </q-toolbar-title>
        <ToolbarLanguage :admin="true"/>

        <div class="flex">

          <q-btn-dropdown
            flat
            color="accent"
            class="dropdown" >
            <q-list>
              <q-item class=" q-pt-none  q-pb-none">
                <q-item-section class="text-accent">
                  {{ name }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/system'  class=" q-pt-none  q-pb-none">
                <q-item-section>
                  <q-item-label>{{$t('settings.title')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/system/editProfile'  class=" q-pt-none  q-pb-none">
                <q-item-section>
                  <q-item-label>{{$t('settings.users.accauntSettings')}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout"  class=" q-pt-none  q-pb-none">
                <q-item-section>
                  <q-item-label>{{$t('settings.users.logout')}}</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
            <template v-slot:label>
              <div class="row items-center bg-accent">
                  <q-icon left name="mdi-account" color="white"/>
              </div>
            </template>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-separator />

    <AdminMenu />
  </q-layout>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ToolbarLanguage from 'components/toolbar/ToolbarLanguage.vue';
import { defineComponent, ref } from 'vue';
import { getFirestore, doc, getDoc} from '@firebase/firestore';
import { Role, User } from 'src/shared/model/Account.model';
import  AdminMenu  from 'src/components/AdminMenu.vue'
import { useMaintainModeStore } from 'src/stores/maintainMode';
import { getMaintainEnabledEvent } from 'src/shared/utils/Admin.utils';
import { Alert } from 'src/shared/utils/Alert.utils';
//import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AdminLayout',

  components: {
    ToolbarLanguage,
    AdminMenu,
  },

  setup() {
    //const { t, te } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const auth = getAuth();
    const router = useRouter();
    const db = getFirestore();
    const email = ref('');
    const name = ref('');


    const store = useMaintainModeStore()
    getMaintainEnabledEvent(db).then(data => {
      if (data) {
        store.setMaintainModeDisabled()
      } else store.setMaintainModeEnabled()
    })

    // if we want to get the user details, this is how its done
    onAuthStateChanged(auth, async (user) => {
      $q.localStorage.set('user', user)
      if (user) {
        const userRef = doc(db, 'users/'+user.uid);
        const data = (await getDoc(userRef)).data() as User | undefined;
        if (data) {
          $q.localStorage.set('userData', data)
          email.value = user.email as string;
          if (data.displayName){
            name.value = data.displayName as string;
          } else {
            name.value = data.name as string;
          }
          // get user role and permissions
          let role = (await getDoc(doc(db, 'roles/'+data.role))).data() as Role | undefined;
          if (role) {
            $q.localStorage.set('role', role)
          }

        }
      }
    });


    const logout = () => {
      getAuth().signOut();
      router
        .push('/auth/login')
        .then(() => {
          
        })
        .catch((error) => console.log('error', error));
    };

    return {
      email,
      name,
      logout,
    };
  },
});
</script>

<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
.q-layout {
  background-color: $main_bg;
}
.admin-layout{
  .dropdown{
    .q-btn{
      padding: unset;
    }
    .q-btn__content .row{
      height: 30px;
      width: 30px;
      border-radius: 4px;
      .on-left{
        margin: auto;
      }
    }
  }
  .header{
    color: $accent;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
  }
  .q-drawer--left.q-drawer--bordered, .q-list--bordered{
    border: unset;
  }
  .menu{
    &_header{
      background-color: $grey-3;
      border-bottom: 2px solid $grey-5;
    }
    &_slidebar{
      color: $accent;
      width: $left-sidebar-open-width;
      height: calc(100vh - #{$top-header-height});
      display: none;
      &.active {
        display: block;
      }
      &_item{
        border-bottom: 2px solid white;
        background-color: $grey-3;
        align-items: center;
        &.menu_slidebar_class{
          background-color: white;
        }
      }
    }
  }
}
</style>
