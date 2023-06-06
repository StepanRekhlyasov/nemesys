<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, watchEffect, watch } from 'vue';
import EditableColumnsCF, { Data } from 'src/components/client-factory/EditableColumnsCF.vue';
import HighlightTwoColumn from 'src/components/client-factory/HighlightTwoColumn.vue';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderMainInfo } from '../types';
import { useHighlightMainInfo, finishEditing } from '../handlers';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    clientFactory: ClientFactory
}>();

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
const isEditForm = ref({
    officeInfo: false,
    contactInfo: false
})

const draft = ref({} as ClientFactory)
const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {

    dataForUpdating.value[key] = data
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory, draft.value)
});

watch(props, (newProps, oldProps) => {
    if (oldProps) {
        draft.value = {} as ClientFactory;
    }
});
</script>

<template>
    <div class="wrapper">

        <div v-if="Object.keys(draft).length">
            <div class="row">
                <q-btn size="sm" color="primary" class="no-shadow q-mr-md">
                    保存
                </q-btn>
                <q-btn size="sm" outline>
                    キャンセル
                </q-btn>
            </div>

            <q-separator color="bg-grey-3 q-mt-md"></q-separator>
        </div>

        <HighlightTwoColumn 
            :data="mainInfo.officeInfo"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            theme="primary"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"
            @on-save="isEditForm.officeInfo = false; finishEditing(dataForUpdating.officeInfo, draft)"/>

        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="primary"/>

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :label="t('client.add.contactInfo')"
            theme="primary"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"
            @on-save="isEditForm.contactInfo = false; finishEditing(dataForUpdating.contactInfo, draft)"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="primary"/>
    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

    <div class="info-footer column justify-between q-pa-lg">

    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.wrapper {
    padding: 1% 5%;
}

.info-footer {
    padding: 1% 5%;

    &__label {
        color: $main-purple;
        font-size: 1rem;
    }
}

.circle {
    height: 10px;
    width: 10px;
    border-radius:50%;
    border: 1px solid $main-purple;
}

.square {
    height: 12px;
    width: 12px;
    background-color: $main-purple;
}
.subtitle {
    color: $main-purple;
    font-size: 1rem;
    font-weight: bold;
}
</style>