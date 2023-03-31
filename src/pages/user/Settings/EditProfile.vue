<template>
  <q-card class="bg-grey-3 full-height">
    <q-card-section>
      {{$t('settings.users.editProfile')}}
    </q-card-section>
    <q-separator color="white"/>
    <q-card-section>
      <q-card class="bg-white q-ma-md no-shadow full-height " style="max-height: 60vh; max-width: 1000px; border-radius: unset;">
        <q-form>
          <q-card-section class="row text-weight-regular text-justify">
            <div class="col-3 text-center">
              <q-img :src="urlImage" spinner-color="primary" style="height: 150px; max-width: 150px" />
            </div>
            <div class="col-9">
              <div class="row note warning text-grey-8 text-weight-regular">
                <q-icon name="mdi-alert"  color="warning" size="xs" class="q-pa-xs"/>
                {{$t('settings.users.infoEditUser')}}<br/>
                {{$t('settings.users.infoContact')}}
              </div>
              <div class="row">
                <div class="col-3 text-right q-pa-sm q-pr-md text-primary">
                  {{$t('settings.users.email')}}
                </div>
                <div class="col-9 q-pt-sm q-pb-sm">
                  {{user.email}}
                </div>
              </div>
              <div class="row">
                <div class="col-3 text-right q-pa-sm q-pr-md text-primary">
                  {{$t('settings.users.person_name')}}
                </div>
                <div class="col-9">
                  <q-input outlined dense v-model="profileData['displayName']" />
                </div>
              </div>
              <div class="row">
                <div class="col-3 text-right q-pa-sm q-pr-md text-primary">
                  {{$t('settings.users.company_name')}}
                </div>
                <div class="col-9  q-pt-sm q-pb-sm">
                  {{organizations.join(', ')}}
                </div>
              </div>
              <div class="row">
                <div class="col-3 text-right q-pa-sm q-pr-md text-primary">
                  {{$t('settings.users.role')}}
                </div>
                <div class="col-9  q-pt-sm q-pb-sm">
                  {{user.roleName}}
                </div>
              </div>
              <div class="row">
                <div class="col-3 text-right q-pa-sm q-pr-md text-primary">
                  {{$t('settings.users.contact')}}
                </div>
                <div class="col-9">
                  <q-input outlined dense v-model="profileData['contact']" />
                </div>
              </div>

              <div class="row">
                <div class="col-3"></div>
                <div class="col-9">
                  <q-card-actions>
                    <q-btn :label="$t('common.save')" unelevated color="primary" class="no-shadow text-weight-bold" @click="updateUser"/>
                    <q-btn :label="$t('common.cancel')" outline  color="primary" class="text-weight-bold" @click="resetData"/>
                  </q-card-actions>
                </div>
              </div>
              <div class="row">
                <div class="col-3"></div>
                <div class="col-9">
                  <q-card-actions>
                    <q-btn
                      :label="$t('settings.users.deleteAccaunt')"
                      unelevated
                      color="negative"
                      class="no-shadow text-weight-bold"
                      @click="showDeleteDialog = true"/>
                  </q-card-actions>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-card-section>
  </q-card>

  <!--Deletion Accaunt Modal  -->
  <q-dialog v-model="showDeleteDialog">
    <q-card>
      <q-card-section>
        {{$t('settings.users.deleteAccaunt')}}
      </q-card-section>
      <q-card-actions>

      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { getAuth } from '@firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from '@firebase/firestore';
import { getDownloadURL, getStorage, ref as refStorage } from '@firebase/storage';
import { ref } from 'vue';
import { getRole, getUserOrganizationList } from 'src/shared/utils/User.utils';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export default {
  name: 'EditProfile',
  setup(){
    const $q = useQuasar();
    const { t } = useI18n({ useScope: 'global' });
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    const showDeleteDialog = ref(false);
    const urlImage = ref('');
    const user = ref(auth.currentUser);
    const profileData = ref({})
    const organizations = ref([]);

    loadUserData()
    async function loadUserData() {
      const currentUser = (await getDoc(doc(db, 'users/',auth.currentUser.uid))).data()
      const role = await getRole(db, currentUser.role)

      user.value = {
        ...user.value,
        ...currentUser,
        roleName: role.data().displayName
      }
      resetData();

      Promise.all(getUserOrganizationList(db, currentUser.organization_ids))
      .then(list => organizations.value = list.map(item => item.data().staff_name))

      if (user.value.photoURL){
        const storageRef = refStorage(storage, 'users/' + user.value.uid + '/profile/' + user.value.photoURL);
        urlImage.value = await getDownloadURL(storageRef)
        return;
      }
      const storageRef = refStorage(storage, 'users/default.png');
      urlImage.value = await getDownloadURL(storageRef)
    }

    async function resetData() {
      profileData.value = {
        displayName: user.value.displayName,
        contact: user.value.contact
      }
    }

    async function updateUser() {
      const userRef = doc(db, 'users/'+user.value.uid);
      try {
        await updateDoc(userRef, profileData.value)
        Alert.success($q, t)
      } catch {
        Alert.warning($q, t)
      }
    }

    return {
      user,
      urlImage,
      profileData,
      showDeleteDialog,
      organizations,

      updateUser,
      resetData
    }
  }
}
</script>

<style>

</style>
