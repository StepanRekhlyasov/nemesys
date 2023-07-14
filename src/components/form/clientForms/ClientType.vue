<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
import { useIndsutry } from 'src/stores/industry';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(
    defineProps<{
        modelValue: Array<string>
        theme?: string
        isLabel?: boolean
    }>(), {
        theme: 'primary',
        isLabel: true
    }
)

const emit = defineEmits(['update:modelValue'])

const industryStore = useIndsutry()
const { industries, isFirstLoading } = storeToRefs(industryStore)

const localType = ref(props.modelValue ?? [])
const isLoading = ref(isFirstLoading)

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
            <q-item-label v-if="isLabel" class="q-pb-xs">
                {{ t('client.add.clientType') }}
            </q-item-label>
            <div v-if="!isLoading">
                <q-checkbox size="xs" :model-value="localType.includes(option.industryName)" :val="option.industryName" :label="option.industryName" :color="`${theme}`"
                    v-for="option in industries" :key="option.id" @update:modelValue="(isChecked) => updateType(option.industryName, isChecked)"/>
            </div>

            <div v-else>
                <q-spinner-gears v-if="isLoading" size="1.5rem" :color="theme" class="q-mx-md"/>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>