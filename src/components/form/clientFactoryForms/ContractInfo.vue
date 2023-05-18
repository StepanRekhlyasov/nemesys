<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps, withDefaults } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: Record<string, boolean>
    theme?: string
}>(), {
    theme: 'primary',
})

const emit = defineEmits(['update:modelValue']);

const contractInfo = reactive({ ...props.modelValue });

watch(contractInfo, () => {
    emit('update:modelValue', contractInfo);
}, { deep: true });

</script>

<template>
    <q-item>
        <q-item-section>
            <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                      <q-checkbox size="xs" v-model="contractInfo['isSignedDispatchContract']"
                        :label="t('client.add.conclusionDispatchContract')" :color="theme" />
                </div>
                <div class="col-6 q-pl-sm">
                      <q-checkbox size="xs" v-model="contractInfo['isSignedReferralContract']"
                        :label="t('client.add.conclusionReferralContract')" :color="theme"/>
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>

</style>