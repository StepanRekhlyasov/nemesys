<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps, withDefaults, ref } from 'vue';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { getMunicipalities } from 'src/shared/constants/Municipalities.const';

const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
  modelValue: Record<string, string | number>
  theme?: string
}>(), {
  theme: 'primary'
})

const emit = defineEmits(['update:modelValue']);

const clientData = reactive({ ...props.modelValue });

const prefecture = () => clientData['prefecture']
const fetchMunicipalities = ref(false)
const municipalities = ref<string[]>([])

watch(clientData, () => {
  emit('update:modelValue', clientData);
}, { deep: true });

watch(prefecture, async () => {
  fetchMunicipalities.value = false

  municipalities.value = await getMunicipalities(clientData['prefecture'] as string)

  fetchMunicipalities.value = true
}, {immediate: true})

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

              <q-select
                :rules="[val => !!val || '']"
                outlined dense
                lazy-rules
                :options="prefectureList"
                v-model="clientData['prefecture']"
                bg-color="white" :label="t('common.pleaseSelect')" emit-value map-options :color="theme"/>
            </div>
            <div class="col-6 q-pl-sm">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.municipalities') }}
                <span class="text-red-5">*</span>
              </q-item-label>

              <q-select
                outlined dense
                :disable="!fetchMunicipalities"
                emit-value
                :rules="[val => !!val || '']"
                bg-color="white"
                :color="theme"
                :options="municipalities"
                v-model="clientData['municipality']"
                :placeholder="t('client.add.municipalitieLabel')"/>

            </div>
          </div>
          <div class="row q-pt-sm">
            <div class="col-6 q-pr-sm">
              <q-item-label class="q-pb-xs">
                {{ t('applicant.add.street') }}
                <span class="text-red-5">*</span>
              </q-item-label>

              <q-input
                :color="theme"
                outlined dense
                v-model="clientData['street']"
                lazy-rules
                :rules="[val => !!val || '', val => (val && val.trim().length > 0) || '']"
                hide-bottom-space />
            </div>

            <div class="col-6 q-pl-sm">
              <q-item-label class="q-pb-xs">
                {{ t('client.add.addressBuildingName') }}
              </q-item-label>

              <q-input
                :color="theme"
                outlined dense
                v-model="clientData['building']"
                :rules="[val => (val === '' || (val && val.trim().length > 0)) || '']"/>
            </div>
          </div>
        </q-item-section>
      </q-item>
</template>
