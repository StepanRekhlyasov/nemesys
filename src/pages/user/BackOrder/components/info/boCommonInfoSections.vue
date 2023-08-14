<template>
  <div class="row q-pb-md">
    <div class="col-9"></div>
    <div class="col-3 text-right">
      <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm"/>
      <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm"/>
      <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm" />
    </div>
  </div>

  <div class="row">
    <LabelField :label="$t('backOrder.registeredDate')" :edit="edit"
      :value="!edit? (bo['dateOfRegistration']):''" labelClass="q-pl-md col-2 text-right self-center" valueClass="col-4 q-pl-md self-center" >
      <q-input v-if="edit" dense outlined bg-color="white" v-model="formattedDate">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dateOfRegistration']" default-view="Years" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
      </q-input>
    </LabelField>
    <LabelField :label="$t('backOrder.create.registrant')" :edit="false" :value="getRegistrant(data['registrant'])" 
          labelClass="q-pl-md col-2 text-right self-center" 
          valueClass="col-4 q-pl-md self-center" />
    <template v-for="item in ui" :key="item.title"> 
      <LabelField 
        :label="item.title" 
        :edit="false"
        labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="col-4 q-pl-md self-center" 
        :value="item.value"
      />
    </template>
    <q-linear-progress query v-if="loading" color="primary"/>
  </div>

</template>

<script lang="ts" setup>
import { BackOrderModel, ClientFactory } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { ref, computed, watch } from 'vue';
import LabelField from 'src/components/form/LabelField.vue';
import { useUserStore } from 'src/stores/user'
import { myDateFormat } from 'src/shared/utils/utils';
import { useClientFactory } from 'src/stores/clientFactory';
import { safeGet } from 'src/shared/utils';

const userStore = useUserStore();

const props = defineProps<{
  bo: BackOrderModel
}>();

const backOrderStore = useBackOrder();
const edit = ref(false);
const loading = ref(false);
const data = computed(() => props.bo as BackOrderModel)

async function save() {
  loading.value = true;
  try {
    if(data.value.dateOfRegistration){
      data.value.dateOfRegistration = myDateFormat(data.value.dateOfRegistration)
    }
    await backOrderStore.updateBackOrder({id: props.bo.id, ...data.value} as BackOrderModel);
    edit.value = false;
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}

const formattedDate = computed(()=> {
      return myDateFormat(data.value['dateOfRegistration'])
})

const userNames = ref<{ [id: string]: string }>({});
const getRegistrant = (registrant: string | undefined) => {
  const userDisplayName = ref('');

  if (registrant && !userNames.value[registrant]) {
    userStore
      .getUserById(registrant)
      .then((user) => {
        if(user?.branchName){
          userNames.value[registrant] = user?.displayName + ' / ' + user.branchName || '';
        }
        else{
          userNames.value[registrant] = user?.displayName || '';
        }
        userDisplayName.value = userNames.value[registrant];
      })
      .catch(() => {
        userDisplayName.value = '';
      });
  } else {
    userDisplayName.value = userNames.value[registrant];
  }

  return userDisplayName.value;
};

const cF = ref<ClientFactory>()
const ui = ref()
const clientFactoryStore = useClientFactory()

watch(()=>props.bo.id, async ()=>{
  ui.value = []
  loading.value = true
  cF.value = await clientFactoryStore.getClientFactory(props.bo.client_id, props.bo.office_id)
  if(props.bo.industry){
    if(cF.value?.officeDetails?.[props.bo.industry]?.uniqueItems){
      ui.value = (Object.entries(cF.value.officeDetails[props.bo.industry]?.uniqueItems) as [string, Record<string, string | number | boolean>][]).map((row)=>{
        const key = row[0]
        const item = row[1]
        return {
          title: item.title, 
          value: safeGet(cF.value, `officeDetails.${props.bo.industry}.uniqueItems.${key}.value`),
          order: item.order
        }
      })
      ui.value.sort((a, b)=>{
        return a['order'] - b['order']
      })
    }
  }
  loading.value = false
}, {immediate: true})
</script>