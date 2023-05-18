<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    modelValue: Record<string, string>
}>();

const emit = defineEmits(['update:modelValue']);

const contractInfo = reactive({ ...props.modelValue });

watch(contractInfo, () => {
    emit('update:modelValue', contractInfo);
}, { deep: true });
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="q-pb-xs">
                {{t('client.add.contactInfo')}}
            </q-item-label>

            <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.list.personIncharge') }}
                    </q-item-label>
                    <q-input outlined dense v-model="contractInfo['nameContact']"
                        :placeholder="t('client.add.managerLabel')" />
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('office.personInChargeTel') }}
                    </q-item-label>
                    <q-input outlined dense v-model="contractInfo['positionContact']"
                        :placeholder="t('clientFactory.drawer.details.inChargeTitle')" />
                </div>
            </div>
            <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.list.personIncharge') }} : TEL
                    </q-item-label>
                    <q-input outlined dense v-model="contractInfo['telContact']"
                        :placeholder="t('client.add.emailLabel1') + '@' + t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.list.personIncharge') }} : MAIL
                    </q-item-label>
                    <q-input outlined dense v-model="contractInfo['mailContact']"
                        :placeholder="t('client.add.phoneLabel')" />
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
</style>