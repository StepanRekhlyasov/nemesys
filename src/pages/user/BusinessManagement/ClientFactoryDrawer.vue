<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { defineEmits, defineProps, ref, watch, watchEffect } from 'vue';
import CFDrawerTitle from 'src/components/client-factory/drawer/CFDrawerTitle.vue';
import CFDrawerBody from 'src/components/client-factory/drawer/CFDrawerBody.vue';
import CFDrawerTabs from 'src/components/client-factory/drawer/CFDrawerTabs.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { mergeWithDraft } from 'src/components/client-factory/handlers';
import { finishEditing } from 'src/components/client-factory/handlers';
import { deepCopy } from 'src/shared/utils';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { useOrganization } from 'src/stores/organization';

const { addModifiedCF, getModifiedCF, updateModifiedCF , updateClientFactory } = useClientFactory()
const organizationStore = useOrganization()
const { currentOrganizationId } = storeToRefs(organizationStore)

const props = defineProps<{
    isDrawer: boolean,
    selectedItem: ClientFactory
    originalOfficeId: string
}>()
const modifiedCF = ref<ModifiedCF | undefined>()
const draft = ref<Partial<ClientFactory>>(deepCopy(props.selectedItem.draft))
const isLoading = ref(false)
const dropDownIndustryValue = ref([] as Array<{ value: string, isSelected: boolean }>)
const selectedIndustry = ref<{ value: string, isSelected: boolean }>({} as { value: string, isSelected: boolean })

const initializeIndustry = () => {
    dropDownIndustryValue.value = props.selectedItem.industry?.reduce((acc, industry, index) => {
        if (industry) {
            acc.push({
                value: industry,
                isSelected: index === 0
            })
        }

        return acc
    }, [] as Array<{ value: string, isSelected: boolean }>)

    selectedIndustry.value = dropDownIndustryValue.value[0] ?? {}
}

const industryHandler = (value: { value: string, isSelected: boolean }) => {
    selectedIndustry.value = value
}

const cancelHandler = () => {
    draft.value = {} as ClientFactory;
}

const editDraftHandler = async(changedData: Array<{ label: string; value: string | number | boolean | string[]; key: string }>) => {
    draft.value = finishEditing(changedData, draft.value, modifiedCF.value ?? props.selectedItem)
    if(modifiedCF.value) {
      const mergedData = mergeWithDraft(modifiedCF.value, draft.value)
      await updateClientFactory({ ...mergedData })
      modifiedCF.value = mergedData
      // draft.value = {} as ClientFactory;
    } else {
      const mergedDataSelected = mergeWithDraft(props.selectedItem, draft.value)
      await updateClientFactory({ ...mergedDataSelected })
      modifiedCF.value = mergedDataSelected
      // draft.value = {} as ClientFactory;
    }
  }


const saveHandler = async () => {
    isLoading.value = true
    if(modifiedCF.value) {

        const mergedData = mergeWithDraft(modifiedCF.value, draft.value)

        await updateModifiedCF(props.selectedItem.id, mergedData, )
        modifiedCF.value = mergedData
        draft.value = {} as ClientFactory;
    } else {
        const mergedData = mergeWithDraft(props.selectedItem, draft.value)
        const res = await addModifiedCF(currentOrganizationId.value, mergedData as Omit<ClientFactory, 'importLog' | 'reflectLog'>, )

        if(res) {
            modifiedCF.value = mergedData
        }

        draft.value = {} as ClientFactory;
    }
    isLoading.value = false
}

const emit = defineEmits<{
    (e: 'hideDrawer')
    (e: 'openFaxDrawer',id:string)
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}
const openFaxDrawer = () => {
    emit('openFaxDrawer',props.selectedItem.id)
}
watchEffect(() => {
    initializeIndustry()
})

watch([() => props.selectedItem], async (newProps, oldProps) => {
    if (oldProps) {
        isLoading.value = true
        draft.value = {} as ClientFactory;
        modifiedCF.value = await getModifiedCF(currentOrganizationId.value, props.selectedItem, )
        isLoading.value = false
    }
}, { immediate: true });

</script>

<template>
    <q-drawer
        :model-value="props.isDrawer"
        :key="props.selectedItem.id"
        overlay
        elevated
        bordered
        side="right"
        :breakpoint="400"
        :width="1000">
            <q-scroll-area class="fit text-left">
                <q-card class="no-shadow bg-grey-2">
                    <q-card-section class="text-white bg-primary row items-end" >
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        <CFDrawerTitle
                            v-if="selectedItem"
                            :selectedItem="selectedItem"
                            :industry-value="dropDownIndustryValue"
                            :selected-industry="selectedIndustry"
                            @edit-industry="industryHandler"/>
                    </q-card-section>
                    <q-card-section class="bg-grey-2 q-pa-none">
                        <CFDrawerBody
                            @edit-draft="editDraftHandler"
                            @cancel-draft="cancelHandler"
                            @save-draft="saveHandler"
                            @open-fax-drawer="openFaxDrawer"
                            :selectedIndustry="selectedIndustry"
                            :clientFactory="modifiedCF ?? selectedItem"
                            :draft="draft"
                            :is-loading="isLoading"/>
                    </q-card-section>
                    <q-card-section class="bg-grey-3">
                        <CFDrawerTabs
                            @edit-draft="editDraftHandler"
                            :originalOfficeId="originalOfficeId"
                            :clientFactory="modifiedCF ?? selectedItem"
                            :industryType="(modifiedCF ?? selectedItem).isHead ? selectedIndustry.value ?? '' : (modifiedCF ?? selectedItem).industry[0]"
                            :draft="draft"
                            :is-loading="isLoading"/>
                    </q-card-section>
                </q-card>
            </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped>

</style>
