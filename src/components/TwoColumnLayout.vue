<script lang="ts" setup>
import { defineProps, withDefaults, computed } from 'vue';

const props = withDefaults(defineProps<{
    data: { label: string; value: string | number | string[] }[],
    theme?: string
}>(), {
    theme: 'primary'
})

const leftColumn = computed(() => props.data.filter((_, index) => index%2 === 0))
const rightColumn = computed(() => props.data.filter((_, index) => index%2 !== 0))
</script>

<template>
    <div class="row justify-between">
        <div class="column">
            <div v-for="row in leftColumn" :key="row.label" class="line">
                <span :class="`text-${theme} line__label`">
                    {{ row.label }}
                </span>

                <span v-if="Array.isArray(row.value)" class="q-pl-sm">
                    {{ row.value.join(', ') }}
                </span>

                <span v-else class="line__value q-pl-sm">
                    {{ row.value }}
                </span>
            </div>
        </div>
        <div class="column">
            <div v-for="row in rightColumn" :key="row.label" class="line">
                <span :class="`text-${theme} line__label`">
                    {{ row.label }}
                </span>

                <span v-if="Array.isArray(row.value)" class="q-pl-sm">
                    {{ row.value.join(', ') }}
                </span>

                <span v-else class="line__value q-pl-sm">
                    {{ row.value }}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.column {
    width: 50%;
}
.line {
    display: flex;
    align-items: baseline;
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
}
</style>