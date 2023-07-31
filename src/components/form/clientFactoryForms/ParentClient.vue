<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { computed, defineProps, defineEmits, ref, watchEffect, withDefaults, watch } from 'vue';
import { useClient } from 'src/stores/client';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: {parentClient: string, selectedIndustry: string}
    isLabel?: boolean
    theme?: string
    isParentIndustry?: boolean
}>(), {
    isLabel: true,
    theme: 'primary',
    isParentIndustry: false
})

const emit = defineEmits(['update:modelValue'])

const clientStore = useClient()
const { clients } = storeToRefs(clientStore)
const clientList = computed(() => clients.value.map(client => ({ label: client.name, value: client.id })))
const industryOptions = computed(() => {
    const client = clients.value.find((client) => client.id === selectedClient.value);
    return client ? client.industry : [];
})
const selectedClient = ref(props.modelValue.parentClient)
const selectedIndustry = ref(props.modelValue.selectedIndustry)

watchEffect(() => {
    selectedClient.value = props.modelValue.parentClient
    selectedIndustry.value = props.modelValue.selectedIndustry
})

const filterFn = (val: string, update: (cb: () => {label: string, value: string | undefined}[]) => void) => {
    update(() => {
        const needle = val.toLowerCase();
        return clientList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

watch(() => [selectedClient.value], () => {
    console.log('lox')
    selectedIndustry.value = ''
})
</script>

<template>         
    <q-item class="row items-center justify-between">
        <q-item-section>
            <q-item-label v-if="isLabel" class="q-pb-xs">
                {{ t('client.add.parentClientName') }}
                <span class="text-red-5">*</span>
            </q-item-label>
            <q-select
                outlined
                v-model="selectedClient"
                @update:modelValue="val => { selectedClient = val; emit('update:modelValue', { ...props.modelValue, parentClient: val }) }"
                :options="clientList"
                dense emit-value
                map-options lazy-rules
                :rules="[val => !!val || '']"
                hide-bottom-space
                style="max-width:400px"
                use-input
                @filter="filterFn"
                clearable :color="theme"/>
        </q-item-section>

        <q-item-section v-if="props.modelValue.parentClient && isParentIndustry">
            <q-item-label class="q-pb-xs">
                {{ t('industry.parentIndustry') }}
                <span class="text-red-5">*</span>
            </q-item-label>
            <q-select
                outlined
                @update:modelValue="val => { selectedIndustry = val; emit('update:modelValue', { ...props.modelValue, selectedIndustry: val }) }"
                v-model="selectedIndustry"
                :options="industryOptions"
                :rules="[val => !!val || '']"
                dense emit-value
                map-options lazy-rules
                hide-bottom-space
                style="max-width:400px"
                use-input
                clearable :color="theme"/>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>

</style>