<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { computed, defineProps, defineEmits, ref, watch, withDefaults } from 'vue';
import { useClient } from 'src/stores/client';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: string | number
    isLabel?: boolean
    theme?: string
}>(), {
    isLabel: true,
    theme: 'primary'
})

const emit = defineEmits(['update:modelValue'])

const clientStore = useClient()
const { clients } = storeToRefs(clientStore)
const clientList = computed(() => clients.value.map(client => ({ label: client.name, value: client.id })))

const selectedClient = ref(props.modelValue)

const filterFn = (val: string, update: (cb: () => {label: string, value: string | undefined}[]) => void) => {
    update(() => {
        const needle = val.toLowerCase();
        return clientList.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

watch(selectedClient, (newVal) => {
    emit('update:modelValue', newVal);
});

</script>

<template>         
    <q-item>
        <q-item-section>
            <q-item-label v-if="isLabel" class="q-pb-xs">
                {{ t('client.add.parentClientName') }}
            <span class="text-red-5">*</span>
            </q-item-label>
            <q-select outlined v-model="selectedClient" :options="clientList" dense emit-value
                map-options lazy-rules :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space
                style="max-width:400px" use-input @filter="filterFn" clearable :color="theme"/>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>

</style>