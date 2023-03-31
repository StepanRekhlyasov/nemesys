<template>
    <DialogWrapper>
      <q-form  @submit="add">
        <q-card-section v-if="!edit?.id">
          {{$t('settings.item.addItem')}}
        </q-card-section>
        <q-card-section v-if="edit?.id">
          {{$t('settings.item.edit')}}
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">

          <div class="row q-pb-sm">
            <div class="col-3 text-right self-center q-pr-sm">
              {{ $t('settings.item.id') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-select outlined dense :options="segmentOption" v-model="branchData['segment']"
                bg-color="white" :label="$t('common.pleaseSelect')" emit-value map-options />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-3 text-right q-pr-sm  q-pt-sm">
              {{ $t('settings.item.name') }}
            </div>
            <div class="col-9 q-pl-sm ">
              <q-input
                v-model="branchData['name']"
                name="name"
                :disable="loading"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-3 text-right q-pr-sm q-pt-sm">
              {{ $t('settings.item.itemName') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input
                v-model="branchData['itemName']"
                :disable="loading"
                name="itemName"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-3 text-right q-pr-sm q-pt-sm">
              {{ $t('settings.item.displayOrder') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-input
                v-model="branchData['displayOrder']"
                :disable="loading"
                name="displayOrder"
                type="number"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row q-pb-sm">
            <div class="col-3 text-right q-pr-sm q-pt-sm">
              {{ $t('settings.branch.flag') }}
            </div>
            <div class="col-9 q-pl-sm">
              <q-checkbox
                v-model="branchData['flag']"
                :label="$t('settings.item.hide')"
                checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
                class="q-pr-md"/>
            </div>
          </div>

        </q-card-section>
        <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
          <q-btn v-if="!edit?.id" :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
          <q-btn v-if="edit?.id" :label="$t('common.edit')" color="primary" class="no-shadow" :loading="loading" @click="save"/>
        </q-card-actions>
      </q-form>
    </DialogWrapper>
  </template>

  <script lang="ts">
  import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
  import { ref, SetupContext } from 'vue';
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useQuasar } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { getAuth } from '@firebase/auth';
  import { segment } from 'src/shared/constants/Item.const';
  import { useOrganization } from 'src/stores/organization';
  import DialogWrapper from 'src/components/dialog/DialogWrapper.vue'

  export default {
    name: 'ItemCreateForm',
    components:{
      DialogWrapper
    },
    props: {
      edit: {
        type: Object,
        required: false
      }
    },
    setup(props, context: SetupContext) {
      const { t } = useI18n({ useScope: 'global' });
      const db = getFirestore();
      const $q = useQuasar();
      const auth = getAuth();
      const branchData = ref(props.edit || {
        flag: false
      })
      const loading = ref(false)
      const segmentOption = ref(segment);
      const organization  = useOrganization()
      return {
        branchData,
        loading,
        segmentOption,

        async add(){
          loading.value = true;
          let data = JSON.parse(JSON.stringify(branchData.value));
          try {

              data['created_at'] = serverTimestamp();
              data['updated_at'] = serverTimestamp();
              data['created_user'] = auth.currentUser?.uid;
              data['deleted'] = false;

              const clientRef = collection(db, 'organization/'+organization.currentOrganizationId+'/item/');
              await addDoc(clientRef, data);

              context.emit('closeDialog');
              Alert.success($q, t);
              loading.value = false;
          } catch (e) {
            console.log(e)
            Alert.warning($q, t);
            loading.value = false;
          }
        },
        async save() {
          loading.value = true;
          const data = branchData.value
          try {
              const boRef = doc(db, 'organization/'+organization.currentOrganizationId+'/item/'+props.edit?.id);
              await updateDoc(boRef, {
                updated_at: serverTimestamp(),
                displayOrder: data.displayOrder,
                itemName: data.itemName,
                segment: data.segment,
                name: data.name,
                flag: data.flag? 'valid': ''
              })

              context.emit('closeDialog');
              Alert.success($q, t);
              loading.value = false;
          } catch (e) {
            console.log(e)
            Alert.warning($q, t);
            loading.value = false;
          }
        }
      }
    }
  }
  </script>

  <style>

  </style>
