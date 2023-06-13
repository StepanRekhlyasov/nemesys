<script lang="ts" setup>
import Quasar, { useQuasar } from 'quasar';
import { defineEmits, defineProps, ref, watch } from 'vue';
import CFDrawerTitle from './components/CFDrawerTitle.vue';
import CFDrawerBody from './components/CFDrawerBody.vue';
import CFDrawerTabs from './components/CFDrawerTabs.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { mergeWithDraft } from 'src/components/client-factory/hadlers';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { useOrganization } from 'src/stores/organization';

const { addModifiedCF, getModifiedCF, updateModifiedCF } = useClientFactory()
const { currentOrganizationId } = useOrganization()

const props = defineProps<{
    isDrawer: boolean,
    selectedItem: ClientFactory
}>()

const $q = useQuasar()
const modifiedCF = ref<ModifiedCF | undefined>()
const draft = ref<Partial<ClientFactory>>({})
const isLoading = ref(false)

const cancelHandler = () => {
    draft.value = {} as ClientFactory;
}

const saveHandler = async () => {
    isLoading.value = true
    if(modifiedCF.value) {

        const mergedData = mergeWithDraft(modifiedCF.value, draft.value)
        
        await updateModifiedCF(props.selectedItem.id, mergedData, $q as unknown as typeof Quasar)
        modifiedCF.value = mergedData
        draft.value = {} as ClientFactory;
    } else {
        const mergedData = mergeWithDraft(props.selectedItem, draft.value)
        const res = await addModifiedCF(currentOrganizationId, mergedData as Omit<ClientFactory, 'importLog' | 'reflectLog'>, $q as unknown as typeof Quasar)

        if(res) {
            modifiedCF.value = mergedData
        }

        draft.value = {} as ClientFactory;
    }
    isLoading.value = false
}

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

watch([() => props.selectedItem], async (newProps, oldProps) => {
    if (oldProps) {
        isLoading.value = true
        draft.value = {} as ClientFactory;
        modifiedCF.value = await getModifiedCF(currentOrganizationId, props.selectedItem, $q as unknown as typeof Quasar)
        isLoading.value = false
    }
}, { immediate: true });

</script>

<template>
    <q-drawer
        :model-value="props.isDrawer"
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
                        <CFDrawerTitle v-if="selectedItem" :selectedItem="selectedItem"/>
                    </q-card-section>
                    <q-card-section class="bg-grey-2 q-pa-none">
                        <CFDrawerBody
                            @cancel-draft="cancelHandler"
                            @save-draft="saveHandler"
                            :clientFactory="modifiedCF ?? selectedItem"
                            :draft="draft"
                            :is-loading="isLoading"/>
                    </q-card-section>
                    <q-card-section class="bg-grey-3">
                        <CFDrawerTabs :clientFactory="modifiedCF ?? selectedItem" />
                    </q-card-section>
                </q-card>
            </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped>

</style>