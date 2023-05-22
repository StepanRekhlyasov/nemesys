<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults, computed } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: string | number
    theme?: string
}>(), {
    theme: 'primary'
})

const emit = defineEmits(['update:modelValue'])

const localType = ref(props.modelValue)
const unitList = computed(() => [
    {
        name: t('contractUnit.corporateBulk'),
        value: '法人一括'
    },
    {
        name: t('contractUnit.businessUnit'),
        value: '事業所単位'
    }
])

const updateType = (value: string) => {
    localType.value = value;
    emit('update:modelValue', localType.value);
};
</script>

<template>
    <q-item>
        <div class="q-gutter-sm">
            <q-radio size="xs" v-model="localType" :val="option.value" :label="option.name" :color="`${theme}`"
                v-for="option in unitList" :key="option.value" @update:modelValue="updateType" />
        </div>
    </q-item>
</template>

<style lang="scss" scoped>

</style>