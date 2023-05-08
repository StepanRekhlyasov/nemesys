<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps({
    modelValue: Object
});

const emit = defineEmits(['update:modelValue']);

const clientData = reactive({ ...props.modelValue });

watch(clientData, () => {
    emit('update:modelValue', clientData);
}, { deep: true });


</script>

<template>
     <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">
            {{ t('client.add.address') }}
          </q-item-label>

          <div class="row">
            <div class="col-6 q-pr-sm">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.prefectures') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="clientData['prefecture']"
                :placeholder="t('client.add.prefectureLabel')" lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
            </div>
            <div class="col-6 q-pl-sm">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.municipalities') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="clientData['municipality']"
                :placeholder="t('client.add.municipalitieLabel')" lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
            </div>
          </div>
          <div class="row q-pt-sm">
            <div class="col-6 q-pr-sm">
              <q-item-label class="q-pb-xs">
                {{ t('applicant.add.street') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="clientData['street']" lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
            </div>
            <div class="col-6 q-pl-sm">
              <q-item-label class="q-pb-xs">{{ t('client.add.addressBuildingName') }}</q-item-label>
              <q-input outlined dense v-model="clientData['building']" />
            </div>
          </div>

          <div class="row q-mt-sm">
            <div class="col-6 q-pr-sm">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.longitude') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense type="number" v-model.number="clientData['lon']"
                :placeholder="t('client.add.latitudeLabel')" step="any" lazy-rules
                :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
            </div>
            <div class="col-6 q-pl-sm ">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.latitude') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense type="number" v-model.number="clientData['lat']"
                :placeholder="t('client.add.latitudeLabel')" step="any" lazy-rules
                :rules="[(val) => (val && val > 0) || '']" hide-bottom-space />
            </div>
          </div>
        </q-item-section>
      </q-item>
</template>