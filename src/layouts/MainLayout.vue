<template>
  <q-layout view="hHh Lpr lFf" class="main-layout">
    <q-header class="shadow-1">
      <q-toolbar class="bg-white text-black">
        <q-img :src="require('assets/logo_view.png')" style="height: 50px; width: 100px;" />
        <q-toolbar-title class="text-h4 text-weight-bolder header"> nemesys </q-toolbar-title>
        <ToolbarLanguage />

        <div class="flex">
          <OrganizationDropdown />
          <q-btn-dropdown flat color="blue" class="dropdown">
            <q-list>
              <q-item class=" q-pt-none  q-pb-none">
                <q-item-section class="text-primary">
                  {{ name }}
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/system/editProfile' class=" q-pt-none  q-pb-none">
                <q-item-section>
                  <q-item-label>{{ $t('settings.users.accauntSettings') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout" class=" q-pt-none  q-pb-none">
                <q-item-section>
                  <q-item-label>{{ $t('settings.users.logout') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable :to="routeNames.admin" target="_blank" v-close-popup class="q-pt-none q-pb-none"
                v-if="isPermission(permissions, UserPermissionNames.AdminPageAccess)">
                <q-item-section>
                  <q-item-label>
                    {{ $t('settings.users.adminPage') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
            <template v-slot:label>
              <div class="row items-center bg-primary">
                <q-icon left name="mdi-account" color="white" />
              </div>
            </template>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-separator />

    <q-drawer v-if="!isDevMode" v-model="leftDrawerOpen" show-if-above bordered behavior="desktop"
      style="background: linear-gradient(180deg, #085374 0%, #043246 100%);" :width="260" :mini="miniState">
      <q-list bordered padding class="rounded-borders text-white text-subtitle2 q-pa-none">
        <EssentialLink v-for="item in singleList" v-bind="item" :key="'es' + $t(item.title)"
          :active="item.link === active_menu" :main="true" @click="onChangeMenu(item.link)" />
        <EssentialLink v-for="parent in menuParent" :key="$t(parent.title)" :active="parent.type === active_menu"
          v-bind="parent" @click="onChangeMenu(parent.type)" />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-1 flex">
      <div v-if="!isDevMode">
        <template v-for="parent in menuParent" :key="parent.title">
          <q-list class="menu_slidebar q-pa-none" :class="{ 'active': parent.type == active_menu }">
            <q-item class="menu_header text-weight-bold">
              <q-item-section>
                <div class="row">
                  <q-icon :name="parent.icon" class="q-pr-sm text-h5" />
                  <div>
                    {{ $t(parent.title) }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <template v-for="link in linksList" :key="link.link">
              <q-item
                v-if="parent.type === link.menuParent && (link.permissions ? permissionMenuItem(link.permissions) : true)"
                class="menu_slidebar_item q-pl-xl text-justify flex justify-between" :to="link.link"
                :class="{ 'menu_slidebar_item_hide': link.hideInMenu }" exact v-ripple clickable
                active-class="menu_slidebar_class">
                <q-item-section>
                  {{ $t(link.title) }}
                </q-item-section>
                <q-icon name="mdi-chevron-right text-grey-7" size="sm" class="content-end" />
              </q-item>
            </template>
          </q-list>
        </template>
      </div>
      <div class="main_content shadow-5" :class="{ 'open_left_slidebar': openLeftSlidebar }">
        <q-page v-if="isDevMode" class="row flex-center">
          <div class="col-4 ">
            <p class="text-h6 text-weight-bolder text-center">nemesys{{ $t('devMode.title') }} <br />
              {{ $t('devMode.subtitle') }}</p>
            <p class="text-h6 text-weight-bolder header q-mb-none text-center">
              {{ $t('devMode.phone') }}
            </p>
            <p class="text-h6 text-weight-bolder header text-center">
              {{ $t('devMode.email') }}
            </p>
          </div>

        </q-page>
        <router-view v-else />
      </div>

    </q-page-container>


  </q-layout>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EssentialLink from 'components/EssentialLink.vue';
import ToolbarLanguage from 'components/toolbar/ToolbarLanguage.vue';
import { defineComponent, Ref, ref } from 'vue';
import { getFirestore, doc, getDoc, DocumentSnapshot, DocumentData } from '@firebase/firestore';
import { Role, User, UserPermissionNames } from 'src/shared/model/Account.model';
import { Organization } from 'src/shared/model/Organization.model';
import { MenuItem, MenuParent } from 'src/shared/model/Menu.model'
import { RouterToMenu, menuParent, RouterToSingleMenuItem, } from 'src/shared/constants/Menu.const';
import { isPermission } from 'src/shared/utils/User.utils'
import { getMaintainEnabledEvent } from 'src/shared/utils/Admin.utils'
import { useMaintainModeStore } from 'src/stores/maintainMode'
import routes from 'src/router/routes';
import { routeNames } from 'src/router/routeNames'
import { useOrganization } from 'src/stores/organization';
import OrganizationDropdown from 'src/pages/user/components/OrganizationDropdown.vue';


export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    ToolbarLanguage,
    OrganizationDropdown
  },

  setup() {
    //const { t, te } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const auth = getAuth();
    const router = useRouter();
    const db = getFirestore();
    const email = ref('');
    const name = ref('');
    const openLeftSlidebar: Ref<boolean> = ref(false)
    const active_menu: Ref<MenuParent | string | undefined> = ref(undefined);
    const organization = useOrganization()

    const leftDrawerOpen = ref(false);
    const miniState = ref(true);
    const permissions = ref([] as UserPermissionNames[])
    const linksList: MenuItem[] = RouterToMenu(routes);
    const singleList: MenuItem[] = RouterToSingleMenuItem(routes);

    const store = useMaintainModeStore()
    const isDevMode = computed(() => store.maintainMode);
    getMaintainEnabledEvent(db).then(data => {
      if (data) {
        store.setMaintainModeDisabled()
      } else store.setMaintainModeEnabled()
    })

    if (router.currentRoute.value.meta.parent) {
      active_menu.value = router.currentRoute.value.meta.parent as string | undefined;
      openLeftSlidebar.value = true;
    }

    // if we want to get the user details, this is how its done
    onAuthStateChanged(auth, async (user) => {
      $q.localStorage.set('user', user)
      if (user) {
        const userRef = doc(db, 'users/' + user.uid);
        const data = (await getDoc(userRef)).data() as User | undefined;
        if (data) {
          $q.localStorage.set('userData', data)
          email.value = user.email as string;
          if (data.displayName) {
            name.value = data.displayName as string;
          } else {
            name.value = data.name as string;
          }
          // get user role and permissions
          let role = (await getDoc(doc(db, 'roles/' + data.role))).data() as Role | undefined;
          if (role) {
            $q.localStorage.set('role', role)
            permissions.value = role.permission
          }
          // get user organization
          if (permissions.value.includes(UserPermissionNames.AdminPageAccess)) {
            organization.state.organizations = await organization.getAllOrganizations()
          } else if (data.organization_ids?.length) {
            let ss = data.organization_ids.reduce((organization_list, organization_id) => {
              let organizationRef = getDoc(doc(db, 'organization/' + organization_id));
              return [...organization_list, organizationRef]
            }, [] as Promise<DocumentSnapshot<DocumentData>>[])
            Promise.all(ss).then(result => {
              let organizations: Organization[] = result.map(organization => organization.data() as Organization);
              if (organizations.length) {
                organization.state.organizations = organizations;
              }
            })
          }


        }
      }
    });

    const onChangeMenu = (active: MenuParent | string | undefined) => {
      if (active && active_menu.value !== active) {
        openLeftSlidebar.value = false;
        active_menu.value = active;
        if (Object.values(MenuParent).toString().includes(active)) {
          openLeftSlidebar.value = true;
          router.push('/')
        }
      }
    }

    const logout = () => {
      getAuth().signOut();
      router.push('/auth/login').catch((error) => console.log('error', error));
    };

    const permissionMenuItem = (item: UserPermissionNames[]) => {
      return item.length === 0 || item.some(permission => isPermission(permissions.value, permission))
    }
    return {
      linksList,
      email,
      name,
      permissions,
      leftDrawerOpen,
      menuParent,
      organization,
      singleList,
      miniState,
      active_menu,
      openLeftSlidebar,
      routeNames,
      UserPermissionNames,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      onChangeMenu,
      permissionMenuItem,
      isPermission,
      isDevMode
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

.main-layout {
  .dropdown {
    .q-btn {
      padding: unset;
    }

    .q-btn__content .row {
      height: 30px;
      width: 30px;
      border-radius: 4px;

      .on-left {
        margin: auto;
      }
    }
  }

  .header {
    background: -webkit-linear-gradient(#155792 0%, #051E34 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .q-drawer--left.q-drawer--bordered,
  .q-list--bordered {
    border: unset;
  }

  .menu {
    &_header {
      background-color: $grey-3;
      border-bottom: 2px solid $grey-5;
    }

    &_slidebar {
      color: $main-primary;
      width: $left-sidebar-open-width;
      height: calc(100vh - #{$top-header-height});
      display: none;

      &.active {
        display: block;
      }

      &_item {
        border-bottom: 2px solid white;
        background-color: $grey-3;
        align-items: center;

        &.menu_slidebar_class {
          background-color: white;
        }

        &_hide {
          display: none;
        }
      }
    }
  }

  .main_content {
    width: 100%;
    z-index: 50;

    &.open_left_slidebar {
      width: calc(100% - #{$left-sidebar-open-width});
    }
  }
}
</style>
