<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { uid } from 'quasar';
import { storeToRefs } from 'pinia';
import { watch, ref } from 'vue';
import UniqueItemsIndustrySelect from './components/UniqueItemsIndustrySelect.vue';
import UniqueItemsSpecificTypes from './components/UniqueItemsSpecificTypes.vue';
import UniqueItemsFacilityForms from './components/UniqueItemsFacilityForms.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { useIndsutry } from 'src/stores/industry';
import { FacilityForm, Industry, SpecificItem } from 'src/shared/model/Industry.model';
import { arraysAreEqual, deepCopy } from 'src/shared/utils';
const { t } = useI18n({ useScope: 'global' });

const industryStore = useIndsutry()
const {industries, isFirstLoading } = storeToRefs(industryStore)
const { updateIndustry } = industryStore

const activeIndustry = ref<Industry | null>(null)
const industryToUpdate = ref<Industry | null>(null)

const handleActiveIndustry = (selectedIndustry: Industry) => {
    if(selectedIndustry.id !== activeIndustry.value?.id) {
        activeIndustry.value = selectedIndustry
        industryToUpdate.value = deepCopy(selectedIndustry)
        resetSaveButtons()
    } 
}

const isCanBeSaved = ref({
    specificTypes: false,
    facilityForms: false
})
const isLoading = ref(isFirstLoading)

const resetSaveButtons = () => {
    Object.keys(isCanBeSaved.value).forEach((key) => {
        isCanBeSaved.value[key] = false
    })
}

const updateIndustryHandler = async (key: keyof Industry['uniqueItems']) => {
    if(activeIndustry.value && industryToUpdate.value) {
        isLoading.value = true

        const updatedIndustry = {
            ...activeIndustry.value,
            uniqueItems: {
                ...activeIndustry.value.uniqueItems,
                [key]: industryToUpdate.value.uniqueItems[key]
            }
        };
        await updateIndustry(activeIndustry.value.id, updatedIndustry)

        isLoading.value = false
    }
}

const newSpecificTypeHandle = (data: {title: string, dataType: string}) => {
    industryToUpdate.value?.uniqueItems.typeSpecificItems.push({...data, id: uid()})

    if(!arraysAreEqual(industryToUpdate.value?.uniqueItems.typeSpecificItems as Array<SpecificItem>, activeIndustry.value?.uniqueItems.typeSpecificItems as Array<SpecificItem>)) {
        isCanBeSaved.value.specificTypes = true
    }
}

const newFacilityForm = (data: string) => {
    industryToUpdate.value?.uniqueItems.facilityForms.push({id: uid(), title: data})

    if(!arraysAreEqual(industryToUpdate.value?.uniqueItems.facilityForms as Array<FacilityForm>, activeIndustry.value?.uniqueItems.facilityForms as Array<FacilityForm>)) {
        isCanBeSaved.value.facilityForms = true
    }
}

watch(() => industries.value, () => {
    if(!activeIndustry.value && industries.value.length) {
        activeIndustry.value = industries.value[0]
        industryToUpdate.value = deepCopy(industries.value[0])
        resetSaveButtons()
    }
}, {immediate: true, deep: true})
</script>

<template>
    <div class="wrapper row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-2 q-pa-md relative-position">

            <div v-if="isLoading" class="loading-overlay">
                <q-spinner-gears v-if="isLoading" size="3rem" color="accent" class="q-mx-md"/>
            </div>

            <UniqueItemsIndustrySelect 
                :industries="industries"
                :active-industry="activeIndustry"
                @update:active-industry="handleActiveIndustry"/>

            <DropDownEditGroup
                :label="t('industry.specificTypeItems') + ' (' + t('client.add.officeInfo') + ')'"
                :is-edit="true"
                :isLabelSquare="true"
                :is-disabled-button="!isCanBeSaved.specificTypes"
                :is-without-cancel="true"
                @on-save="updateIndustryHandler('typeSpecificItems')"
                theme="accent">
                <UniqueItemsSpecificTypes 
                    :active-industry="industryToUpdate"
                    @new-specific-type="newSpecificTypeHandle"/>
            </DropDownEditGroup>

            <DropDownEditGroup
                :label="t('clientFactory.facilityType') + ' (' + t('client.add.officeInfo') + ')'"
                :is-edit="true"
                :isLabelSquare="true"
                :is-disabled-button="!isCanBeSaved.facilityForms"
                :is-without-cancel="true"
                @on-save="updateIndustryHandler('facilityForms')"
                theme="accent">
                <UniqueItemsFacilityForms 
                    :active-industry="industryToUpdate"
                    @new-facility-form="newFacilityForm"/>
            </DropDownEditGroup>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
}
</style>