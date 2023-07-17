<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
import { facilityList } from 'src/shared/constants/Organization.const';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: Array<string>
    theme?: string
}>(), {
    theme: 'primary'
})

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
        <div class="q-gutter-sm">
            <q-item-label class="q-pb-xs">
                {{t('client.add.facilityType')}}
            </q-item-label>

            <q-checkbox
                size="xs"
                :model-value="localType.includes(option.value)"
                :val="option.value"
                :label="option.name"
                :color="`${theme}`"
                v-for="option in facilityList"
                :key="option.value"
                @update:modelValue="(isChecked) => updateType(option.value, isChecked)"/>
        </div>
    </q-item>
</template>

<style lang="scss" scoped>

</style>