<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps({
    modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const localHead = ref(props.modelValue);

const updateOfficeHead = (newVal: string | number | null) => {
    emit('update:modelValue', newVal);
};
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>
                {{ t('client.list.officeHead') }}
                <span class="text-red-5">*</span>
            </q-item-label>
            <q-input outlined dense v-model="localHead" :placeholder="t('client.add.clientLabel')" lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']" hide-bottom-space @update:modelValue="updateOfficeHead" />
        </q-item-section>
    </q-item>
</template>