<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, watch } from 'vue';
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

watch([props.clientFactory, draft], () => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory, draft.value)
}, {deep: true, immediate: true});

watch(props, (newProps, oldProps) => {
    if (oldProps) {
        draft.value = {} as ClientFactory;
    }
}, {immediate: true});
</script>

<template>
    <div class="wrapper">

        <div v-if="Object.keys(draft).length && !isEditForm.contactInfo && !isEditForm.officeInfo" class="q-mb-md">
            <div class="row">
                <q-btn size="sm" color="primary" class="no-shadow q-mr-md">
                    {{ t('common.save') }}
                </q-btn>
                <q-btn size="sm" outline>
                    {{ t('common.cancel') }}
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
            @on-save="isEditForm.officeInfo = false; finishEditing(dataForUpdating.officeInfo, draft, props.clientFactory)"/>

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
            @on-save="isEditForm.contactInfo = false; finishEditing(dataForUpdating.contactInfo, draft, props.clientFactory)"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="primary"/>
    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

    <div class="info-footer row justify-between q-pa-lg">
        <div class="info-footer__column row items-center text-bold">
            <q-icon name="mdi-information-outline" size="1.5rem" color="primary" class="q-mr-sm"/>
            <div>
                <p class="q-ma-none">{{ t('clientFactory.drawer.withMasterData') }}</p>
                <p class="q-ma-none">{{ t('clientFactory.drawer.noAutoRenewal') }}</p>
            </div>
        </div>

        <div class="info-footer__column">
            <p class="row q-ma-none q-pt-sm">
                <span class="info-footer__label q-mr-sm">
                    {{ t('clientFactory.drawer.situation') }}
                </span>

                <span class="info-footer__value">
                    TEST
                </span>
            </p>
            <p class="row q-ma-none q-pt-sm">
                <span class="info-footer__label q-mr-sm">
                    {{ t('clientFactory.drawer.contactTendency') }}
                </span>

                <span class="info-footer__value">
                    <span class="q-mr-sm">{{ t('clientFactory.drawer.morning') }} :</span>
                    <span class="q-mr-sm">test</span>
                    <span class="q-mr-sm">{{ t('clientFactory.drawer.afternoon') }} :</span>
                    <span class="q-mr-sm">test</span>
                    <span class="q-mr-sm">{{ t('clientFactory.drawer.evening') }} :</span>
                    <span>test</span>
                </span>
            </p>
        </div>

        <div class="info-footer__column">
            <p class="row q-ma-none q-pt-sm">
                <span class="info-footer__label q-mr-sm">
                    {{ t('clientFactory.drawer.dispatchIndex') }}
                </span>

                <span class="info-footer__value">
                    TEST
                </span>
            </p>

            <p class="row q-ma-none q-pt-sm">
                <span class="info-footer__label q-mr-sm">
                    {{ t('clientFactory.drawer.referralMetrics') }}
                </span>

                <span class="info-footer__value">
                    TEST
                </span>
            </p>
        </div>

        <div class="info-footer__column text-right">
            <div class="full-width">
                <q-btn size="sm" outline color="primary" style="width: 5rem;">
                    BO登録
                </q-btn>
            </div>
            <div class="full-width">
                <q-btn size="sm" outline color="primary" class="q-mt-sm" style="width: 5rem;">
                    FAX送信
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.wrapper {
    padding: 1% 5%;
}

.info-footer {
    padding: 1% 5%;
    color: $main-primary;

    &__column:nth-child(1) {
        flex: 1 1 20%;
    }

    &__column:nth-child(2) {
        flex: 1 1 50%;
    }

    &__column:nth-child(3) {
        flex: 1 1 15%;
    }

    &__column:nth-child(4) {
        flex: 1 1 15%;
    }

    &__label {
        font-size: 1rem;
    }

    &__value {
        color: $main-black;
        word-wrap: break-word;
    }
}

.subtitle {
    color: $main-purple;
    font-size: 1rem;
    font-weight: bold;
}
</style>