<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps, withDefaults } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: Record<string, any>
    theme: string
}>(), {
    theme: 'primary'
});

const emit = defineEmits(['update:modelValue']);

const clientFactoryInfo = reactive({ ...props.modelValue });

watch(clientFactoryInfo, () => {
    emit('update:modelValue', clientFactoryInfo);
}, { deep: true });

</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="q-pb-xs">
                {{ t('client.add.officeInfo') }}
            </q-item-label>

            <div class="row">
                <div class="col-6 q-pr-sm">
                    <q-item-label class="q-pb-xs">
                        TEL
                        <span class="text-red-5">*</span>
                    </q-item-label>
                    <q-input outlined dense v-model="clientFactoryInfo['tel']" :placeholder="t('client.add.phoneLabel')"
                        lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        FAX
                        <span class="text-red-5">*</span>
                    </q-item-label>
                    <q-input outlined dense v-model="clientFactoryInfo['fax']" :placeholder="t('client.add.phoneLabel')"
                        lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space />
                </div>
            </div>

            <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.email') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientFactoryInfo['mail']"
                        :placeholder="t('client.add.emailLabel1') + '@' + t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm q-pt-lg">
                    <q-checkbox size="xs" v-model="clientFactoryInfo['isFaxNG']" :label="t('client.add.faxReceptionNG')" :color="theme"/>
                </div>
            </div>

            <div class="row">
                <div class="col-6 q-pr-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.homePage') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientFactoryInfo['homepageUrl']" />
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('office.numberEmployees') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientFactoryInfo['numberEmployees']" />
                </div>
            </div>

        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>

</style>