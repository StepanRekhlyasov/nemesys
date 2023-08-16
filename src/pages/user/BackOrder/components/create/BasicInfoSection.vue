<template>
  <q-card-section>

    <div class="row text-primary text-h6" >
      {{'■ '+ $t('backOrder.basicInfo') }}
    </div>
    <div class="row ">
      <labelField :label="$t('client.list.client')" :edit="false"
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="col-4 q-pl-md " :value="backOrder['client_id'] && client ? client['name']  : ''">
      </labelField>
      <labelField :label="$t('backOrder.officeName')" :edit="false" :value="offices.find(office => office.id == backOrder['office_id'])?.name"
        labelClass="q-pl-md col-2 text-right self-center"  valueClass="col-4 q-pl-md self-center" >
      </labelField>
      <template v-for="item in ui" :key="item.title">
        <labelField
          :label="item.title"
          :edit="false"
          labelClass="q-pl-md col-2 text-right self-center"
          valueClass="col-4 q-pl-md self-center"
          :value="item.value"
        />
      </template>
    </div>

  </q-card-section>
</template>

<script lang="ts" setup>
import labelField from 'src/components/form/LabelField.vue';
import { BackOrderModel, Client } from 'src/shared/model';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { safeGet } from 'src/shared/utils';
import { ref, watch } from 'vue'

const props = defineProps<{
  backOrder: Partial<BackOrderModel>,
  loading: boolean,
  client?: Client,
  officeID?: string,
  offices: ClientFactory[]
}>()

const cF = ref<ClientFactory>()
const ui = ref()

watch(()=>[props.backOrder.industry, props.officeID, props.offices], ()=>{
  if(props.backOrder.industry){
    cF.value = props.offices.find(office => office.id == props.backOrder['office_id'])
    if(cF.value?.officeDetails?.[props.backOrder.industry]?.uniqueItems){
      ui.value = (Object.entries(cF.value.officeDetails[props.backOrder.industry]?.uniqueItems) as [string, Record<string, string | number | boolean>][]).map((row)=>{
        const key = row[0]
        const item = row[1]
        return {
          title: item.title,
          value: safeGet(cF.value, `officeDetails.${props.backOrder.industry}.uniqueItems.${key}.value`),
          order: item.order
        }
      })
      ui.value.sort((a, b)=>{
        return a['order'] - b['order']
      })
    }
  }
}, {immediate: true})

</script>
