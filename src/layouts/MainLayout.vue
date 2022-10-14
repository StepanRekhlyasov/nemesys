<template>
  <!-- view="lHh Lpr lFf"  hHh lpR fFf -->
  <q-layout view="lHh Lpr lFf">
    <q-header >
      <q-toolbar class="bg-white text-black">
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

        <div class="flex">
          <q-btn-dropdown
            v-if="organization && (activeOrganization || activeOrganization === 0)"
            :label="organization[activeOrganization]['staff_name']"
            unelevated flat color="black">
            <q-list>
              <q-item clickable v-close-popup v-for="item in organization" :key="item.code">
                <q-item-section>
                  <q-item-label>{{item.staff_name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn-dropdown unelevated flat color="black" :label="name">
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
    <q-separator />

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
        <EssentialLink
          v-for="item in singleList"
          v-bind="item"
          :key="'es' + $t(item.title)"
          :main="true"
        />
        <template
          v-for="parent in menuParent"
          :key="$t(parent.title)">
          <q-expansion-item
            expand-separator
            :icon="parent.icon"
            :label="$t(parent.title)"
            default-closed
          >
            <template
              v-for="link in linksList"
              :key="$t(link.title)">
              <EssentialLink
                v-if="parent.type === link.menuParent && (link.permissions ? permissionMenuItem(link.permissions) : true )"
                v-bind="link"
              />
            </template>
          </q-expansion-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-1">
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
import { defineComponent, Ref, ref } from 'vue';
import { getFirestore, doc, getDoc} from '@firebase/firestore';
import { Role, User, UserPermissionNames } from 'src/shared/model/Accaunt.model';
import { Organization } from 'src/shared/model/Organization.model';
import { MenuItem } from 'src/shared/model/Menu.molel'
import { RouterToMenu, menuParent, RouterToSingleMenuItem,} from 'src/shared/constants/Menu.const';
import { isPermission } from 'src/shared/utils/User.utils'
import routes from 'src/router/routes';
//import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    ToolbarLanguage,
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
    const activeOrganization:Ref<number> = ref(0)


    const leftDrawerOpen = ref(false);
    const permissions = ref([] as UserPermissionNames[])
    const linksList: MenuItem[] =  RouterToMenu(routes);
    const singleList: MenuItem[] = RouterToSingleMenuItem(routes);

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
            }, [] as Promise<any>[])
            Promise.all(ss).then(result => {
              let organizations: Organization[]  = result.map(organization => organization.data());
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
      menuParent,
      organization,
      activeOrganization,
      singleList,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
      permissionMenuItem
    };
  },
});
</script>

<style lang="scss">
.q-layout {
  background-color: $grey-1;
}
</style>
