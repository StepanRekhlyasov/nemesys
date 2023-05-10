<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: Record<string, any>
}>();

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
                {{ t('office.clientInformation') }}
            </q-item-label>

            <div class="row">
                <div class="col-6 q-pr-sm">
                      <q-item-label class="q-pb-xs">
                        {{ t('office.representativeName') }}
                        <span class="text-red-5">*</span>
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['representativeName']"
                        :placeholder="t('client.add.managerLabel')" lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                    </div>
                    <div class="col-6 q-pl-sm">
                      <q-item-label class="q-pb-xs">
                        {{ t('office.established') }}
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['established']" placeholder="2000-07" />
                    </div>
                </div>

                <div class="row q-pt-sm">
                    <div class="col-6 q-pr-sm">
                      <q-item-label class="q-pb-xs">
                        {{ t('office.capital') }}
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['capital']" placeholder="1,000,000"/>
                    </div>
                    <div class="col-6 q-pl-sm">
                      <q-item-label class="q-pb-xs">
                        {{ t('office.earnings') }}
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['earnings']" placeholder="1,000,000" />
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 q-pt-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('office.companyProfile') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientData['companyProfile']" />
                </div>
            </div>

        </q-item-section>
    </q-item>
</template>