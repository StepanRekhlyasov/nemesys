<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, watch } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const localName = ref(props.modelValue)

watch(localName, (newVal) => {
    emit('update:modelValue', newVal)
});
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="q-pb-xs">
                {{ t('client.add.clientName') }}
                <span class="text-red-5">*</span>
            </q-item-label>
            <q-input
                outlined
                dense
                v-model="localName"
                :placeholder="t('client.add.clientLabel')"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']"
                hide-bottom-space />
        </q-item-section>
    </q-item>
</template>