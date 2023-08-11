<template>
  <q-dialog :model-value="openDialog">
    <DialogWrapper>
      <q-card-section class="row items-center">
        <div class="text-h6">{{ $t('client.list.address') }}</div>
        <q-space />
        <q-btn icon="close" @click="emit('keepDetails', false)" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-list>
          <q-item tag="label" v-ripple v-for="(address, index) in addressList" :key="address.prefecture" dense>
            <q-item-section avatar>
              <q-radio v-model="selectedAddress" :val="index" color="primary" dense />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ address.prefecture }}{{ address.municipality }}{{ address.street }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn flat :label="$t('common.close')" color="red" v-close-popup />
        <q-btn flat :label="$t('common.submit')" color="primary" @click="emit('getAddress', selectedAddress)"
          v-close-popup :disable="selectedAddress < 0" />
      </q-card-actions>
    </DialogWrapper>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QDialogProps } from 'quasar';
import DialogWrapper from 'src/components/dialog/DialogWrapper.vue';

const emit = defineEmits<{ (e: 'getAddress', index: number), (e: 'keepDetails', flag: boolean) }>()
interface AddressDialogProps extends QDialogProps {
  openDialog: boolean,
  addressList: { prefecture: string, municipality: string, street: string }[]
}
const selectedAddress = ref(<number>-1)

defineProps<AddressDialogProps>()
</script>
