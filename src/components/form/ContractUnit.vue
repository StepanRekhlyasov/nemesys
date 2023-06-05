<script lang="ts" setup>
import { ref, defineEmits, defineProps, withDefaults, watch } from 'vue';
import { contractUnits } from 'src/shared/constants/ContractUnits.const';

const props = withDefaults(defineProps<{
    modelValue: string | number
    theme?: string
}>(), {
    theme: 'primary'
})

const emit = defineEmits(['update:modelValue'])

const localType = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
    localType.value = newVal
});

const updateType = (value: string) => {
    emit('update:modelValue', value);
};
</script>

<template>
    <q-item>
        <div class="q-gutter-sm">
            <q-radio size="xs" v-model="localType" :val="option.value" :label="option.label" :color="`${theme}`"
                v-for="option in contractUnits" :key="option.value" @change="updateType" />
        </div>
    </q-item>
</template>

<style lang="scss" scoped></style>
