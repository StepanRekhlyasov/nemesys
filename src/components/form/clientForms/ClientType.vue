<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(
    defineProps<{
        modelValue: string,
        theme?: string
    }>(), {
    theme: 'primary'
}
)

const emit = defineEmits(['update:modelValue'])

const localType = ref(props.modelValue)

const updateType = (value: string) => {
    localType.value = value;
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
                <q-radio size="xs" :model-value="localType" :label="t('client.add.nurse')" val="nurse"
                    :color="`${theme}`" @update:modelValue="() => updateType('nurse')" />
                <q-radio size="xs" :model-value="localType" :label="t('client.add.nursing')"
                    class="q-ml-md" val="nursing" :color="`${theme}`" @update:modelValue="() => updateType('nursing')" />
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>