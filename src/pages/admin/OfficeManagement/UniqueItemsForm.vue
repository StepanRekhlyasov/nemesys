<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { uid, is } from 'quasar';
import { storeToRefs } from 'pinia';
import { watch, ref, nextTick  } from 'vue';
import UniqueItemsIndustrySelect from './components/UniqueItemsIndustrySelect.vue';
import UniqueItemsSpecificTypes from './components/UniqueItemsSpecificTypes.vue';
import UniqueItemsFacilityForms from './components/UniqueItemsFacilityForms.vue';
import UniqueCertificateForms from './components/UniqueCertificateForms.vue';
import UniqueOccupationForm from './components/UniqueOccupationForm.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { useIndsutry } from 'src/stores/industry';
import { FacilityForm, Industry, SpecificItem, OccupationForm,CertificateForm } from 'src/shared/model/Industry.model';
import { deepCopy } from 'src/shared/utils';
const { t } = useI18n({ useScope: 'global' });

const industryStore = useIndsutry()
const {industries, isFirstLoading } = storeToRefs(industryStore)
const { updateIndustry, addIndustry ,deleteIndustry ,addId} = industryStore
const activeIndustry = ref<Industry | null>(null)
const industryToUpdate = ref<Industry | null>(null)
const currentId = ref<string>('');
const handleActiveIndustry = (selectedIndustry: Industry) => {
    if(selectedIndustry.id !== activeIndustry.value?.id) {
        activeIndustry.value = selectedIndustry
        industryToUpdate.value = deepCopy(selectedIndustry)
        resetSaveButtons()
    }
}

const isCanBeSaved = ref({
    typeSpecificItems: false,
    facilityForms: false,
    occupationForms: false,
    certificateForms: false
})
const isLoading = ref(isFirstLoading)
const isNewIndustryPopup = ref(false)

const resetSaveButtons = () => {
    Object.keys(isCanBeSaved.value).forEach((key) => {
        isCanBeSaved.value[key] = false
    })
}

const updateIndustryHandler = async (key: keyof Industry['uniqueItems']) => {
    isLoading.value = true
    isCanBeSaved.value[key] = false
    if(activeIndustry.value && industryToUpdate.value) {

        await nextTick()

        const updatedIndustry = {
            ...activeIndustry.value,
            uniqueItems: {
                ...activeIndustry.value.uniqueItems,
                [key]: industryToUpdate.value.uniqueItems[key]
            }
        };

        await updateIndustry(activeIndustry.value.id, updatedIndustry)

    }

    isLoading.value = false
}

const onNewIndustry = async (industryName: string) => {
    isLoading.value = true

    const newId = await addIndustry({
        industryName: industryName,
        uniqueItems: {
            typeSpecificItems: {},
            facilityForms: {},
            occupationForms: {},
            certificateForms: {},
        }
    })
    if (newId) {
        currentId.value = newId;
    }
    const updatedIndustry = {
        id:currentId.value,
        deleted:false,
        industryName: industryName,
        uniqueItems: {
            typeSpecificItems: {},
            facilityForms: {},
            occupationForms: {},
            certificateForms: {}
        }
      };
      await addId(currentId.value, updatedIndustry)

    isLoading.value = false
}
const onDeleteIndustry = async (id: string | undefined) => {
    isLoading.value = true
    await deleteIndustry(id)
    activeIndustry.value = null
    isLoading.value = false
}

const newSpecificTypeHandle = (data: { title: string, dataType: string }) => {
    const id = uid();
    if(industryToUpdate.value) {
        industryToUpdate.value.uniqueItems.typeSpecificItems[id] = { ...data, order: Object.keys(industryToUpdate.value.uniqueItems.typeSpecificItems).length + 1 };

        if (!is.deepEqual(industryToUpdate.value?.uniqueItems.typeSpecificItems as Record<string, SpecificItem>, activeIndustry.value?.uniqueItems.typeSpecificItems as Record<string, SpecificItem>)) {
            isCanBeSaved.value.typeSpecificItems = true;
        }
    }
}

const deleteSpecificTypeHandle = (id: string) => {
   if(industryToUpdate.value) {
        delete industryToUpdate.value.uniqueItems.typeSpecificItems[id]
        Object.values(industryToUpdate.value.uniqueItems.typeSpecificItems).forEach((item, index) => {
            item.order = index + 1;
        });
        isCanBeSaved.value.typeSpecificItems = true;
   }
}

const updateSpecificTypeHandle = () => {
    isCanBeSaved.value.typeSpecificItems = true
    updateIndustryHandler('typeSpecificItems')
}

const sortHandler = (
    event: {
        newIndex: number,
        oldIndex: number
    },
    path: string
) => {

    if(industryToUpdate.value && activeIndustry.value) {
        const items: { [key: string]: SpecificItem  | FacilityForm | OccupationForm | CertificateForm} = industryToUpdate.value.uniqueItems[path];

        const keys = Object.keys(items);
        const movedKey = keys[event.oldIndex];
        const targetKey = keys[event.newIndex];

        [items[movedKey].order, items[targetKey].order] = [items[targetKey].order, items[movedKey].order];

        if(!is.deepEqual(industryToUpdate.value.uniqueItems[path], activeIndustry.value.uniqueItems[path])) {
            isCanBeSaved.value[path] = true;
        }
    }
}

const newFacilityForm = (data: string) => {
    const id = uid();
    if(industryToUpdate.value) {
        industryToUpdate.value.uniqueItems.facilityForms[id] = { title: data, order: Object.keys(industryToUpdate.value.uniqueItems.facilityForms).length + 1 };

        if (!is.deepEqual(industryToUpdate.value?.uniqueItems.facilityForms as Record<string, FacilityForm>, activeIndustry.value?.uniqueItems.facilityForms as Record<string, FacilityForm>)) {
            isCanBeSaved.value.facilityForms = true;
        }
    }
}

const deleteFacilityForm = (id: string) => {
    if (industryToUpdate.value) {
        delete industryToUpdate.value.uniqueItems.facilityForms[id]
        Object.values(industryToUpdate.value.uniqueItems.facilityForms).forEach((item, index) => {
            item.order = index + 1;
        });
        isCanBeSaved.value.facilityForms = true;
    }
}

const updateFacilityForm = () => {
    isCanBeSaved.value.facilityForms = true
    updateIndustryHandler('facilityForms')
}

const newOccupationForm = (data: string) => {
    const id = uid();
    if(industryToUpdate.value) {
        industryToUpdate.value.uniqueItems.occupationForms[id] = { title: data, order: Object.keys(industryToUpdate.value.uniqueItems.occupationForms).length + 1 };

        if (!is.deepEqual(industryToUpdate.value?.uniqueItems.occupationForms as Record<string, OccupationForm>, activeIndustry.value?.uniqueItems.occupationForms as Record<string, OccupationForm>)) {
            isCanBeSaved.value.occupationForms = true;
        }
    }
}
const deleteOccupationForm = (id: string) => {
    if (industryToUpdate.value) {
        delete industryToUpdate.value.uniqueItems.occupationForms[id]
        Object.values(industryToUpdate.value.uniqueItems.occupationForms).forEach((item, index) => {
            item.order = index + 1;
        });
        isCanBeSaved.value.occupationForms = true;
    }
}

const updateOccupationForm = () => {
    isCanBeSaved.value.occupationForms = true
    updateIndustryHandler('occupationForms')
}

const newCertificateForm = (data: string) => {
    const id = uid();
    if(industryToUpdate.value) {
        industryToUpdate.value.uniqueItems.certificateForms[id] = { title: data, order: Object.keys(industryToUpdate.value.uniqueItems.certificateForms).length + 1 };
        if (!is.deepEqual(industryToUpdate.value?.uniqueItems.certificateForms as Record<string, CertificateForm>, activeIndustry.value?.uniqueItems.certificateForms as Record<string, CertificateForm>)) {
            isCanBeSaved.value.certificateForms = true;
        }
    }
}
const deleteCertificateForm = (id: string) => {
    if (industryToUpdate.value) {
        delete industryToUpdate.value.uniqueItems.certificateForms[id]
        Object.values(industryToUpdate.value.uniqueItems.certificateForms).forEach((item, index) => {
            item.order = index + 1;
        });
        isCanBeSaved.value.certificateForms = true;
    }
}
const updateCertificateForm = () => {
    isCanBeSaved.value.certificateForms = true
    updateIndustryHandler('certificateForms')
}

const isNewIndustryPopupHandler = (val: boolean) => {
    isNewIndustryPopup.value = val
}

watch(() => industries.value, () => {
    if(!activeIndustry.value && industries.value.length) {
        activeIndustry.value = industries.value[0]
        industryToUpdate.value = deepCopy(industries.value[0])
        resetSaveButtons()
    }
}, {immediate: true, deep: true})
watch(async() => activeIndustry.value, () => {
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
                :is-new-industry-popup="isNewIndustryPopup"
                @update:active-industry="handleActiveIndustry"
                @update:is-new-industry-popup="isNewIndustryPopupHandler"
                @new-industry="onNewIndustry"
                @delete-industry="onDeleteIndustry"/>

            <DropDownEditGroup
                :label="t('industry.specificTypeItems') + ' (' + t('client.add.officeInfo') + ')'"
                :is-edit="true"
                :isLabelSquare="true"
                :is-disabled-button="!isCanBeSaved.typeSpecificItems"
                :is-without-cancel="true"
                @on-save="updateIndustryHandler('typeSpecificItems')"
                theme="accent">
                <UniqueItemsSpecificTypes
                    :active-industry="industryToUpdate"
                    @new-specific-type="newSpecificTypeHandle"
                    @delete-specific-type="deleteSpecificTypeHandle"
                    @update-specific-type="updateSpecificTypeHandle"
                    @sort-specific-type="(e) => sortHandler(e, 'typeSpecificItems')"/>
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
                    @new-facility-form="newFacilityForm"
                    @delete-facility-form="deleteFacilityForm"
                    @update-facility-form="updateFacilityForm"
                    @sort-facility-form="(e) => sortHandler(e, 'facilityForms')"/>
            </DropDownEditGroup>
            <DropDownEditGroup
                :label="t('client.add.Occupation') + ' (' + t('applicant.add.applicantInfo') + ')'"
                :is-edit="true"
                :isLabelSquare="true"
                :is-disabled-button="!isCanBeSaved.occupationForms"
                :is-without-cancel="true"
                @on-save="updateIndustryHandler('occupationForms')"
                theme="accent">
                <UniqueOccupationForm
                    :active-industry="industryToUpdate"
                    @new-occupation-form="newOccupationForm"
                    @delete-occupation-form="deleteOccupationForm"
                    @update-occupation-form="updateOccupationForm"
                    @sort-occupation-form="(e) => sortHandler(e, 'occupationForms')"
                    />
            </DropDownEditGroup>
            <DropDownEditGroup
                :label="t('client.add.Certification') + ' (' + t('applicant.add.applicantInfo') + ')'"
                :is-edit="true"
                :isLabelSquare="true"
                :is-disabled-button="!isCanBeSaved.certificateForms"
                :is-without-cancel="true"
                @on-save="updateIndustryHandler('certificateForms')"
                theme="accent">
                <UniqueCertificateForms
                    :active-industry="industryToUpdate"
                    @new-certificate-form="newCertificateForm"
                    @delete-certificate-form="deleteCertificateForm"
                    @update-certificate-form="updateCertificateForm"
                    @sort-certificate-form="(e) => sortHandler(e, 'certificateForms')"/>
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
