<template>
<q-card-section>
  <div class="row bg-white" style="height:100%;width:100%">
    <p class="text-h7 text-primary">■{{ t('backOrder.sms.SendContent') }}</p>
  </div>
  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm">
    <p>{{t('backOrder.sms.form')}}</p>
  </div>

  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm">
    <div class="col-2 q-pl-xl">
      <p>{{t('backOrder.sms.template')}}</p>
    </div>
      <div class="col-3 q-pl-sm">
        <q-select class="bg-white" outlined v-model="template"
            :options="options"
             dense />
    </div>
  </div>

  <div class="row q-ml-sm text-h7 bg-grey-3 q-pl-xl q-pt-sm q-pb-sm" style="width:100%">
    <div class="col-2 q-pl-xl">
      <p>{{t('backOrder.sms.Content')}}</p>
    </div>
      <div class="col-3" style="width:80%">
        <textarea v-model="msg" class="bg-white" outlined dense style="border-radius: 5px; height: 150px; width: 90%; padding: 5px;resize:none"></textarea>
        <div>
          <p>46 {{t('backOrder.sms.characters')}}</p>
        </div>
        <div class="row">
          <q-btn @click="SendMsg" :label="t('backOrder.sms.send')" class="bg-primary text-white"></q-btn>
          <q-btn @click="msg=''" :label="t('common.cancel')" class="text-primary q-ml-md"></q-btn>
        </div>
    </div>
  </div>
  <div class="destination">
    <div class="row bg-white">
      <p class="text-h7 text-primary">■{{ t('backOrder.sms.SendContent') }}</p>
    </div>
    <div class="row text-grey">
      <div class="col-4">
      </div>
      <div class="col-4 q-pl-sm">
        status
      </div>
      <div class="col-4 q-pl-sm">
        Applicantion day
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <q-input class="bg-white" dense label="Keyword"/>
      </div>
      <div class="col-4 q-pl-sm">
        <q-select class="bg-white" outlined v-model="template" :options="options" dense />
      </div>
      <div class="col-4 q-pl-sm">
        <q-input v-model="date" outlined type="date" class="bg-white"/>
      </div>
    </div>
    <q-table
					:columns="destinationApplicant"
					row-key="id"
					selection="multiple"
					class="no-shadow"
					v-model:selected="selected"
					table-class="text-grey-8"
					table-header-class="text-grey-9">
				</q-table>
  </div>
</q-card-section>

</template>

<script lang="ts" setup>
import { ref,computed } from 'vue';
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { destinationApplicant } from 'src/pages/user/BackOrder/consts/BackOrder.const';

const msg = ref('')
const options = computed(() => {
  return [
    {
      label: t('common.pleaseSelect'),
      value: 'Select',
    },
  ];
});


const template = ref(null)

const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });


const SendMsg = ()=>{
  console.log(msg.value)
}



</script>

<style scoped>

</style>


