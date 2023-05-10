<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
import { industries } from 'src/shared/constants/Industry.const';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(
    defineProps<{
        modelValue: Array<string>
        theme?: string
    }>(), {
    theme: 'primary'
}
)

const emit = defineEmits(['update:modelValue'])

const localType = ref(props.modelValue ?? [])

const updateType = (value: string, isChecked: boolean) => {
    if (isChecked) {
        localType.value.push(value);
    } else {
        localType.value = localType.value.filter(item => item !== value);
    }
    emit('update:modelValue', localType.value);
};

</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="q-pb-xs">
                {{ t('client.add.clientType') }}
            </q-item-label>
            <div class="row q-pt-sm">
            <q-checkbox size="xs" :model-value="localType.includes(option.value)" :val="option.value" :label="option.label" :color="`${theme}`"
                    v-for="option in industries" :key="option.value" @update:modelValue="(isChecked) => updateType(option.value, isChecked)"/>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>