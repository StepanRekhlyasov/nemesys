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
                  {{$t('settings.users.organizationName')}}
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
              <div class="row" v-if="allowDelete">
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
import { Alert } from 'src/shared/utils/Alert.utils';
import { useRole } from 'src/stores/role';
import { useOrganization } from 'src/stores/organization';
import { adminRolesIds } from 'src/components/handlers/consts';

export default {
  name: 'EditProfile',
  setup(){
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();
    const roleStore = useRole()
    const showDeleteDialog = ref(false);
    const urlImage = ref('');
    const user = ref(auth.currentUser);
    const profileData = ref({})
    const organizations = ref([]);
    const organizationStore = useOrganization()
    const allowDelete = ref(false)

    loadUserData()
    async function loadUserData() {
      allowDelete.value = false
      const currentUser = (await getDoc(doc(db, 'users/',auth.currentUser.uid))).data()
      const role = await roleStore.getRole(currentUser.role)
      if(adminRolesIds.includes(role.id)){
        allowDelete.value = true
      }

      user.value = {
        ...user.value,
        ...currentUser,
        roleName: role.displayName
      }
      resetData();
      const userOrganizations = await organizationStore.getDataById(currentUser.organization_ids, 'Organization')
      organizations.value = userOrganizations.map((org)=> org.name)
      if (user.value.photoURL){
        const storageRef = refStorage(storage, 'users/' + user.value.uid + '/profile/' + user.value.photoURL);
        urlImage.value = await getDownloadURL(storageRef)
        return;
      }

      try {
        const storageRef = refStorage(storage, 'users/default.png');
        urlImage.value = await getDownloadURL(storageRef)
      } catch (error) {
        Alert.warning(error)
      }
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
        Alert.success()
      } catch(e) {
        Alert.warning(e)
      }
    }

    return {
      user,
      urlImage,
      profileData,
      showDeleteDialog,
      organizations,
      allowDelete,
      updateUser,
      resetData
    }
  }
}
</script>

<style>

</style>
