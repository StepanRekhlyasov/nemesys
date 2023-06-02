<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect } from 'vue';
import EditableColumnsCF, {Data} from 'src/components/EditableColumnsCF.vue';
import HighlightTwoColumn from './HighlightTwoColumn.vue';
import { useHighlightMainInfo } from '../handlers';
import { RenderMainInfo } from '../types';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    clientFactory: ClientFactory
}>();

const mainInfo = ref<RenderMainInfo>({} as RenderMainInfo)
const isEditForm = ref({
    officeInfo: false,
    contactInfo: false
})

const dataForUpdating = ref<Record<string, Data[]>>({} as Record<string, Data[]>)

const getNewDataToUpdate = (data: Data[], key: string) => {
    dataForUpdating.value[key] = data
}

watchEffect(() => {
    mainInfo.value = useHighlightMainInfo(props.clientFactory)
});

</script>

<template>
    <div class="wrapper">
        <HighlightTwoColumn 
            :data="mainInfo.officeInfo"
            :is-edit="isEditForm.officeInfo"
            :label="t('client.add.officeInfo')"
            theme="accent"
            @open-edit="isEditForm.officeInfo = true"
            @close-edit="isEditForm.officeInfo = false"/>
        
        <EditableColumnsCF v-if="isEditForm.officeInfo"
            :data="mainInfo.officeInfo"
            @data-changed="e => getNewDataToUpdate(e, 'officeInfo')"
            theme="accent"/>

        <HighlightTwoColumn
            :data="mainInfo.contactInfo"
            :is-edit="isEditForm.contactInfo"
            :label="t('client.add.contactInfo')"
            theme="accent"
            @open-edit="isEditForm.contactInfo = true"
            @close-edit="isEditForm.contactInfo = false"/>

        <EditableColumnsCF v-if="isEditForm.contactInfo"
            :data="mainInfo.contactInfo"
            @data-changed="e => getNewDataToUpdate(e, 'contactInfo')"
            theme="accent"/>

    </div>

    <q-separator color="bg-grey-3 q-mt-md"></q-separator>

    <div class="info-footer column justify-between q-pa-lg">
        <div class="info-footer__row row justify-between items-center">
            <div>
                <div class=" row">
                    <span class="info-footer__label q-mx-md">{{ t('clientFactory.masterData') }}</span>
                    <span class="info-footer__label q-mr-xs">{{ t('office.office') }}</span>
                    <span class="text-bold q-mr-md">{{ clientFactory.existingOfficeFlag ? ': ✓' : ': なし' }}</span>
                    <span class="info-footer__label q-mr-xs">{{ t('client.list.client') }}</span>
                    <span class="text-bold">{{ clientFactory.clientFlag ? ': ✓' : ': なし' }}</span>
                </div>
            </div>

            <div>
                <div class="row">
                    <span class="info-footer__label q-mx-md">{{ t('clientFactory.lastReflected') }}</span>
                    <span v-if="clientFactory.reflectLog">{{ clientFactory.reflectLog?.executionDate }}</span>
                    <q-icon v-else color="black" name="mdi-close"/>

                    <div class="row justify-between items-center no-wrap">
                        <div class="circle q-mx-md"></div>
                        <q-btn text-color="accent" outline dense padding="xs md" size="sm">
                            <q-icon name="mdi-tray-arrow-up" color="accent" size="xs" left/>
                                {{ t('common.reflect') }}
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
 
        <div class="info-footer__row row justify-between items-center q-mt-lg">
            <div>
                <div class="row">
                    <span class="info-footer__label q-mx-md">{{ t('clientFactory.changeBasicInformation') }}</span>
                    <span class="text-bold">{{ clientFactory.basicInfoChangingFlag ? '✓' : 'なし' }}</span>
                </div>
            </div>

            <div>
                <div class="row">
                    <span class="info-footer__label q-mx-md">{{ t('clientFactory.lastCaptured') }}</span>
                    <span v-if="clientFactory.importLog">{{ clientFactory.importLog?.executionDate }}</span>
                    <q-icon v-else color="black" name="mdi-close"/>

                        <div class="row justify-between items-center no-wrap">
                            <div class="circle q-mx-md"></div>
                            <q-btn text-color="accent" outline dense padding="xs md" size="sm">
                                <q-icon name="mdi-tray-arrow-down" color="accent" size="xs" left/>
                                    {{ t('common.capture') }}
                                </q-btn>
                        </div>
                </div>
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