<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults, watch } from 'vue';
import { useIndsutry } from 'src/stores/industry';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: Array<string>
    industries: string[]
    theme?: string
}>(), {
    theme: 'primary'
})

const emit = defineEmits(['update:modelValue'])

const localType = ref(props.modelValue ?? [])
const industryStore = useIndsutry()
const facilityList = ref<{[key: string]: string[]}>({})
const isLoading = ref(false)

const updateType = (value: string, isChecked: boolean) => {
    if (isChecked) {
        localType.value.push(value);
    } else {
        localType.value = localType.value.filter(item => item !== value);
    }
    emit('update:modelValue', localType.value);
};

watch(() => [props.industries], async ([newIndustries, oldIndustries]) => {
    isLoading.value = true

    const newIndustriesSet = new Set(newIndustries)
    const oldIndustriesSet = new Set(oldIndustries)

    const industriesToFetch = [...newIndustriesSet].filter(industry => !oldIndustriesSet.has(industry))

    for (const industry of industriesToFetch) {
        const industryDoc = await industryStore.getIndustryByName(industry)
        if(industryDoc) {
            facilityList.value[industry] = Object.entries(industryDoc.uniqueItems.facilityForms)
                .sort((val1, val2) => val1[1].order - val2[1].order)
                .map(([, value]) => value.title)
        }
    }

    isLoading.value = false
}, {deep: true})
</script>

<template>
    <q-item>
        <div class="q-gutter-sm">
            <q-item-label v-if="!industries.length" class="q-pb-xs">
                {{t('client.add.facilityType')}}
            </q-item-label>

            <div v-if="(!isLoading && industries.length)">

                <div v-for="industry in industries" :key="industry" class="q-pb-xs">
                    <q-item-label>
                        {{ t('client.add.facilityType') + ` (${industry})`}}
                    </q-item-label>

                    <q-checkbox
                        size="xs"
                        :model-value="localType.includes(option)"
                        :val="option"
                        :label="option"
                        :color="`${theme}`"
                        v-for="option in facilityList[industry]"
                        :key="option"
                        @update:modelValue="(isChecked) => updateType(option, isChecked)"/>
                </div>
            </div>

            <div v-else>
                <q-spinner-gears v-if="isLoading" size="1.5rem" :color="theme" class="q-mx-md"/>
            </div>
        </div>
    </q-item>
</template>

<style lang="scss" scoped>

</style>