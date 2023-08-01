<script lang="ts" setup>
import { getAuth } from 'firebase/auth';
import { storeToRefs } from 'pinia'
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineEmits, defineProps, watch, ref, watchEffect } from 'vue';
import CFDrawerTitle from './components/CFDrawerTitle.vue';
import CFDrawerBody from './components/CFDrawerBody.vue';
import CFDrawerTabs from './components/CFDrawerTabs.vue';
import ModifiedCFsDrawer from './ModifiedCFsDrawer.vue';
import UpdatedCFDrawer from './UpdatedCFDrawer.vue';
import { useClientFactory } from 'src/stores/clientFactory';
import { useOrganization } from 'src/stores/organization';
import { useUserStore } from 'src/stores/user';
import { finishEditing, mergeWithDraft } from 'src/components/client-factory/handlers';
import { deepCopy, recursivelyRemoveField } from 'src/shared/utils';
import { ModifiedCF } from 'src/shared/model/ModifiedCF';
import { ReflectLog } from 'src/shared/model/ReflectLog';
import { ChangedData } from 'src/components/client-factory/types';
import { ImportLog } from 'src/shared/model/ImportLog';

const props = defineProps<{
    isDrawer: boolean,
    selectedItem: ClientFactory
}>()

const { updateClientFactory, addReflectLog, addImportLog } = useClientFactory()
const organizationStore = useOrganization()
const { currentOrganizationId } = storeToRefs(organizationStore)
const { getUserById } = useUserStore();
const auth = getAuth();
const user = auth.currentUser;

const isLoading = ref({
    isGeneral: false,
    isReflecting: false,
    isImporting: false
})

const localData = ref<ClientFactory>(deepCopy(props.selectedItem))
const localDraft = ref<Partial<ClientFactory>>(deepCopy(props.selectedItem.draft))
const selectedModifiedCF = ref<ModifiedCF>()
const dropDownIndustryValue = ref([] as Array<{ value: string, isSelected: boolean }>)
const selectedIndustry = ref<{ value: string, isSelected: boolean }>({} as { value: string, isSelected: boolean })

const initializeIndustry = () => {
    dropDownIndustryValue.value = props.selectedItem.industry?.reduce((acc, industry, index) => {
        if (industry) {
            acc.push({
                value: industry,
                isSelected: index === 0,
            })
        }

        return acc
    }, [] as Array<{ value: string, isSelected: boolean }>)

    selectedIndustry.value = dropDownIndustryValue.value[0] ?? {}
}

const industryHandler = (value: { value: string, isSelected: boolean }) => {
    selectedIndustry.value = value
}

const newReflectLog = ref<ReflectLog>()
const newImportLog = ref<ImportLog>()

const modifiedCFsDrawer = ref(false)
const updatedCFDrawer = ref(false)

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

const hideModifiedCFsDrawer = () => {
    modifiedCFsDrawer.value = false
}

const openModifiedCFsDrawer = () => {
    modifiedCFsDrawer.value = true
}

const openUpdatedCFDrawer = (modifiedCF: ModifiedCF) => {
    selectedModifiedCF.value = modifiedCF
    updatedCFDrawer.value = true
}

const closeUpdatedCFDrawer = () => {
    updatedCFDrawer.value = false
}

const editDraftHandler = async (changedData: ChangedData) => {
    isLoading.value.isGeneral = true

    localDraft.value = finishEditing(changedData, localDraft.value, localData.value)
    await updateClientFactory({ ...localData.value, draft: localDraft.value })

    isLoading.value.isGeneral = false
}

const onImport = async (data: ChangedData) => {
    isLoading.value.isImporting = true

    if(!user) {
      return
    }
    const uid = user.uid;
    const currentUser = await getUserById(uid)

    if(!currentUser){
      return
    }

    const organizations = await organizationStore.getDataById([currentOrganizationId.value], 'Organization')

    localDraft.value = finishEditing(data, localDraft.value, localData.value)

    const copyBeforeRemoveDraft = deepCopy(localData.value)
    recursivelyRemoveField(copyBeforeRemoveDraft, 'draft')

    const clientFactoryToUpdate = mergeWithDraft(copyBeforeRemoveDraft, localDraft.value)
    const isOfficeDetailsChanged = localDraft.value.officeDetails && Object.keys(localDraft.value.officeDetails).length ? true : false
    localData.value = copyBeforeRemoveDraft
    localDraft.value = {}

    await updateClientFactory({ ...clientFactoryToUpdate, draft: localDraft.value }, )

    const importLog = await addImportLog(currentUser, localData.value, organizations[0], isOfficeDetailsChanged)
    newImportLog.value = importLog as ImportLog

    isLoading.value.isImporting = false
    closeUpdatedCFDrawer()
    hideModifiedCFsDrawer()
}

const onReflect = async () => {
    isLoading.value.isReflecting = true

    if (!user) {
      return
    }

    const uid = user.uid;
    const currentUser = await getUserById(uid)

    if(!currentUser){
      return
    }

    const copyBeforeRemoreDraft = deepCopy(localData.value)
    recursivelyRemoveField(copyBeforeRemoreDraft, 'draft')

    const clientFactoryToUpdate = mergeWithDraft(copyBeforeRemoreDraft, localDraft.value)
    const isOfficeDetailsChanged = localDraft.value.officeDetails && Object.keys(localDraft.value.officeDetails).length ? true : false
    localData.value = copyBeforeRemoreDraft
    localDraft.value = {}

    await updateClientFactory({...clientFactoryToUpdate, draft: localDraft.value}, )

    const reflectLog = await addReflectLog(currentUser, localData.value, isOfficeDetailsChanged)
    newReflectLog.value = reflectLog as ReflectLog


    isLoading.value.isReflecting = false
}

watchEffect(() => {
    initializeIndustry()
})

watch([() => props.selectedItem], (newProps, oldProps) => {
    if (oldProps) {
        modifiedCFsDrawer.value = false
        localData.value = deepCopy(props.selectedItem)
        localData.value.draft = props.selectedItem.draft ?? {}
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
                <q-card-section class="text-white bg-accent row items-end" >
                    <q-btn dense flat icon="close" @click="hideDrawer" />
                    <CFDrawerTitle
                        v-if="localData"
                        :selectedItem="localData"
                        :industry-value="dropDownIndustryValue"
                        :selected-industry="selectedIndustry"
                        @edit-industry="industryHandler"/>
                </q-card-section>
                <q-card-section class="bg-grey-2 q-pa-none">
                    <CFDrawerBody
                        @edit-draft="editDraftHandler"
                        :clientFactory="localData"
                        :draft="localDraft"
                        :new-import-log="newImportLog"
                        :new-reflect-log="newReflectLog"
                        :is-loading="isLoading.isGeneral"
                        :is-reflecting="isLoading.isReflecting"
                        :is-importing="isLoading.isImporting"
                        @handle-import="openModifiedCFsDrawer"
                        @handle-reflect="onReflect"/>
                </q-card-section>
                <q-card-section class="bg-grey-3">
                    <CFDrawerTabs
                        :clientFactory="localData"
                        :draft="localDraft"
                        :is-loading="isLoading.isGeneral"
                        :industryType="localData.isHead ? selectedIndustry.value ?? '' : localData.industry[0]"
                        @edit-draft="editDraftHandler" />
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>

    <ModifiedCFsDrawer
        @open-updated-info="openUpdatedCFDrawer"
        @hide-drawer="hideModifiedCFsDrawer"
        :is-drawer="modifiedCFsDrawer"
        :client-factory="localData"/>

    <UpdatedCFDrawer
        v-if="selectedModifiedCF"
        :modifiedCF="selectedModifiedCF"
        @apply-import="onImport"
        @hide-drawer="closeUpdatedCFDrawer"
        :is-drawer="updatedCFDrawer"
        :client-factory="localData"
        :is-loading="isLoading.isImporting"/>
</template>

<style lang="scss" scoped>
</style>
