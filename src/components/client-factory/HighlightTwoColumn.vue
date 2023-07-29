<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, withDefaults, computed, ref } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    data: { label: string; value: string | number | string[] | boolean, isHighlight?: boolean, key?: string }[]
    isEdit: boolean
    label: string
    isDropDown?: boolean
    isDisableEdit?: boolean
    showActions?: boolean
    theme?: string
}>(), {
    isDropDown: false,
    isDisableEdit: false,
    showActions: true,
    theme: 'primary'
})

const isHidden = ref(false)

const emit = defineEmits<{
    (e: 'closeEdit'),
    (e: 'openEdit'),
    (e: 'onSave')
}>()

const leftColumn = computed(() => props.data.filter((_, index) => index % 2 === 0))
const rightColumn = computed(() => props.data.filter((_, index) => index % 2 !== 0))
</script>

<template>
    <div class="row justify-between">
        <div class="row items-center">
            <div class="row items-center">
                <div :class="`bg-${theme} square`"></div>
                <span :class="`text-${theme} subtitle`">{{ label }}</span>
            </div>

            <div v-if="isDropDown">
                <q-btn :label="t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
                  class="text-grey-9" @click="isHidden = false" v-if="isHidden" />
                <q-btn :label="t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
                  class="text-grey-9" @click="isHidden = true" v-else />
            </div>

            <slot name="tag" v-if="$slots.tag">
                
            </slot>
        </div>
        <div class="col-3 text-right" v-if="showActions">
            <q-btn v-if="!isEdit" 
                :disable="isDisableEdit"
                :label="t('common.edit')" :color="theme" 
                outline  icon="edit" @click="emit('openEdit')" 
                class="no-shadow q-ml-lg" size="sm" />
            <q-btn v-if="isEdit" 
                :label="t('common.save')" :color="theme" 
                @click="emit('onSave')" size="sm" />
            <q-btn v-if="isEdit" 
                :label="t('common.cancel')" class="q-ml-md" 
                outline :color="theme" @click="emit('closeEdit')"
                size="sm" />
        </div>
    </div>

    <div v-if="(!isHidden && !isEdit)" class="row justify-between">
        <div class="column">
            <div v-for="row in leftColumn" :key="row.label" class="line">
                <span :class="`text-${theme} line__label`">
                    {{ row.label }}
                </span>

                <a v-if="row.key === 'homepageUrl' && typeof row.value === 'string'" :href="row.value" target="_blank" :class="`link q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value }}
                </a>

                <span v-else-if="Array.isArray(row.value)" :class="`q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value.join(', ') }}
                </span>

                <q-icon v-else-if="(typeof row.value === 'boolean')" color="black" :name="row.value ? 'circle' : 'mdi-close'" :class="`q-pl-sm ${row.isHighlight && 'line__highlight'}`"/>

                <span v-else :class="`line__value q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value }}
                </span>
            </div>
        </div>
        
        <div class="column">
            <div v-for="row in rightColumn" :key="row.label" class="line">
                <span :class="`text-${theme} line__label`">
                    {{ row.label }}
                </span>

                <a v-if="row.key === 'homepageUrl' && typeof row.value === 'string'" :href="row.value" target="_blank" :class="`link q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value }}
                </a>

                <span v-else-if="Array.isArray(row.value)" :class="`q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value.join(', ') }}
                </span>

                <q-icon v-else-if="(typeof row.value === 'boolean')" color="black" :name="row.value ? 'circle' : 'mdi-close'" :class="`q-pl-sm ${row.isHighlight && 'line__highlight'}`"/>

                <span v-else :class="`line__value q-pl-sm ${row.isHighlight && 'line__highlight'}`">
                    {{ row.value }}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'src/css/imports/colors';

.column {
    width: 50%;
}
.line {
    display: flex;
    align-items: center;
    width: 100%;

    &__label {
        display: inline-flex;
        width: 50%;
        font-size: 1rem;
        text-align: right;
        justify-content: flex-end;
    }

    &__value {
        word-wrap: break-word;
        width: 50%;
    }

    &__highlight {
        background-color: $edit-highlight;
    }
}

.subtitle {
  font-size: 1rem;
  font-weight: bold;
}

.square {
  height: 12px;
  width: 12px;
}

.link {
    color: #2196F3;
    text-decoration-line: underline;
    cursor: pointer;
}
</style>