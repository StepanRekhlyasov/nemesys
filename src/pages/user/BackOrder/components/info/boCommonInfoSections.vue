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
      :value="bo['registeredDate'] ">
    </LabelField>
    <labelField :label="$t('backOrder.create.registrant')" :edit="edit" :value="data['registrant']">
      <q-input v-model="data['registrant']" outlined dense :disable="loading"/>
    </labelField>
  </div>

<div class="row">
    <LabelField :label="$t('backOrder.create.approvalOrNot')" :edit="edit" 
      :value="bo['approvalOrNot'] ">
    </LabelField>
  <labelField :label="$t('backOrder.create.uniformAvailability')" :edit="edit" 
      :value="data['uniformAvailability']" >
    <q-input v-model="data['registrant']" outlined dense :disable="loading"/>
  </labelField>
</div>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { ref } from 'vue';
import LabelField from 'src/components/form/LabelField.vue';

const props = defineProps<{
  bo: BackOrderModel
}>();

const backOrderStore = useBackOrder();
const edit = ref(false);
const loading = ref(false);
const data = ref(props.bo)

async function save() {
  loading.value = true;
  try {
    await backOrderStore.updateBackOrder({id: props.bo.id, ...data.value} as BackOrderModel);
    edit.value = false;

  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>

<style>

</style>