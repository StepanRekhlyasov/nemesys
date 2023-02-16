<template>
   <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      behavior="desktop"
      style="background: linear-gradient(180deg, #4D0E4D 0%, #03101A 99.99%, #0C5180 100%);"
      :width="260"
      :mini="miniState"
    >
      <q-list
        bordered
        padding
        class="rounded-borders text-white text-subtitle2 q-pa-none"
      >
        <!-- <EssentialLink
          v-for="item in singleList"
          v-bind="item"
          :key="'es' + $t(item.title)"
          :active="item.link === active_menu"
          :main="true"
          @click="onChangeMenu(item.link)"
        /> -->
        <EssentialLink
          v-for="parent in adminMenuParent"
          :key="$t(parent.title)"
          :active="parent.type === active_menu"
          v-bind="parent"
          @click="onChangeMenu(parent.type)"
          :admin="true"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-1 flex">
      <template v-for="parent in adminMenuParent" :key="parent.title">
        <q-list
          class="admin-menu_slidebar q-pa-none"
          :class="{'active': parent.type == active_menu}">
          <q-item class="admin-menu_header text-weight-bold">
            <q-item-section>
              <div class="row">
                <q-icon :name="parent.icon" class="q-pr-sm text-h5"/>
                <div>
                  {{$t(parent.title)}}
                </div>
              </div>
            </q-item-section>
          </q-item>
          <template v-for="link in linksList" :key="link.link">
            <q-item
              v-if="parent.type === link.menuParent && (link.permissions ? permissionMenuItem(link.permissions) : true)"
              class="admin-menu_slidebar_item q-pl-xl text-justify flex justify-between"
              :to="'/admin' + link.link"
              exact
              v-ripple
              clickable
              active-class="admin-menu_slidebar_class"
              >
              <q-item-section>
                {{$t(link.title)}}
              </q-item-section>
              <q-icon name="mdi-chevron-right text-grey-7" size="sm" class="content-end"/>
            </q-item>
          </template>
        </q-list>
      </template>
      <div class="main_content shadow-5" :class="{'open_left_slidebar': openLeftSlidebar}">
        <router-view />
      </div>
    </q-page-container>
</template>


<script lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import EssentialLink from 'components/EssentialLink.vue';
import { defineComponent, Ref, ref } from 'vue';
import { getFirestore, doc, getDoc, DocumentSnapshot, DocumentData} from '@firebase/firestore';
import { Role, User, UserPermissionNames } from 'src/shared/model/Accaunt.model';
import { Organization } from 'src/shared/model/Organization.model';
import { MenuItem, MenuParent } from 'src/shared/model/Menu.molel'
import { RouterToMenu, adminMenuParent, RouterToSingleMenuItem,} from 'src/shared/constants/Menu.const';
import { isPermission } from 'src/shared/utils/User.utils'
import routes from 'src/router/routes';
import { routeNames } from 'src/router/routeNames'
//import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AdminMenu',

  components: {
    EssentialLink,
  },

  setup() {
    //const { t, te } = useI18n({ useScope: 'global' });
    const $q = useQuasar();
    const auth = getAuth();
    const router = useRouter();
    const db = getFirestore();
    const email = ref('');
    const name = ref('');
    const organization:Ref<Organization[]> = ref([]);
    const openLeftSlidebar: Ref<boolean> = ref(false)
    const active_menu: Ref<MenuParent | string | undefined> = ref(undefined);
    const activeOrganization:Ref<number | undefined> = ref(undefined)


    const leftDrawerOpen = ref(false);
    const miniState = ref(true);
    const permissions = ref([] as UserPermissionNames[])
    const linksList: MenuItem[] =  RouterToMenu(routes);
    const singleList: MenuItem[] = RouterToSingleMenuItem(routes);

    if (router.currentRoute.value.meta.parent) {
      active_menu.value = router.currentRoute.value.meta.parent as string | undefined;
      openLeftSlidebar.value = true;
    }

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
            permissions.value = role.permission
          }
          // get user organization
          if (data.organization_ids?.length) {
            let ss = data.organization_ids.reduce((organization_list, organization_id) => {
              let organizationRef = getDoc(doc(db, 'organization/'+organization_id));
              return [...organization_list, organizationRef]
            }, [] as Promise<DocumentSnapshot<DocumentData>>[])
            Promise.all(ss).then(result => {
              let organizations: Organization[]  = result.map(organization => organization.data() as Organization);
              if (organizations.length) {
                $q.localStorage.set('organizations', organizations);
                $q.localStorage.set('active_organizations', 0)
                organization.value = organizations;
                activeOrganization.value = 0;
              }
            })
          }
        }
      }
    });

    const onChangeMenu = (active: MenuParent | string | undefined) => {
      if (active && active_menu.value !== active){
        openLeftSlidebar.value = false;
        active_menu.value = active;
        if (Object.values(MenuParent).toString().includes(active)) {
          openLeftSlidebar.value = true;
          // router.push('/')
        }
      }
    }

    const logout = () => {
      getAuth().signOut();
      router
        .push('/auth/login')
        .then(() => {
          $q.notify({ message: 'Sign Out Success.' });
        })
        .catch((error) => console.log('error', error));
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
      adminMenuParent,
      organization,
      activeOrganization,
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
      isPermission
    };
  },
});
</script>

<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";

  .admin-menu{
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
        &.admin-menu_slidebar_class{
          background-color: white;
        }
      }
    }
  }
  .main_content{
    width: 100%;
    z-index: 50;
    &.open_left_slidebar{
      width: calc(100% - #{$left-sidebar-open-width});
    }
  }

</style>
