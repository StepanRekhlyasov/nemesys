<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, defineProps, withDefaults, watch } from 'vue';
import { useIndsutry } from 'src/stores/industry';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    modelValue: Array<string>
    industryName?: string 
    theme?: string
    isLabel?: boolean
}>(), {
    theme: 'primary',
    isLabel: true
})

const emit = defineEmits(['update:modelValue'])

const industryStore = useIndsutry()
const localType = ref(props.modelValue ?? [])
const facilityList = ref<string[]>([])
const isLoading = ref(false)

const updateType = (value: string, isChecked: boolean) => {
    if (isChecked) {
        localType.value.push(value);
    } else {
        localType.value = localType.value.filter(item => item !== value);
    }
    localType.value = localType.value.filter((item)=> facilityList.value.includes(item))
    emit('update:modelValue', localType.value);
};

watch(() => [props.industryName], async () => {
  if(props.industryName){
    facilityList.value = []
    emit('update:modelValue', localType.value)
    isLoading.value = true
    const industry = await industryStore.getIndustryByName(props.industryName)
      if(industry) {
        facilityList.value = Object.entries(industry.uniqueItems.facilityForms)
          .sort((val1, val2) => val1[1].order - val2[1].order)
          .map(([ , value]) => value.title)
      }
    isLoading.value = false
  }
}, {immediate: true})
</script>

<template>
    <q-item>
        <div class="q-gutter-sm">
            <q-item-label v-if="isLabel" class="q-pb-xs">
                    {{t('client.add.facilityType')}}
            </q-item-label>

            <div v-if="!isLoading">
                <q-checkbox
                    size="xs"
                    :model-value="localType.includes(option)"
                    :val="option" :label="option"
                    :color="`${theme}`"
                    v-for="option in facilityList"
                    :key="option"
                    @update:modelValue="(isChecked) => updateType(option, isChecked)"
                />
            </div>

            <div v-else>
                <q-spinner-gears v-if="isLoading" size="1.5rem" :color="theme" class="q-mx-md"/>
            </div>
        </div>
    </q-item>
</template>

<style lang="scss" scoped>

</style>