<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits, watch } from 'vue';
import { useClientFactory } from 'src/stores/clientFactory';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const clientFactoryStore = useClientFactory()
const { modifiedCFs } = storeToRefs(clientFactoryStore)

const props = defineProps<{
    clientFactory: ClientFactory
}>()

const emit = defineEmits<{
    (e: 'handleImport')
}>()

const importHandle = () => {
    emit('handleImport')
}

watch([() => props.clientFactory], async (newProps, oldProps) => {
    if (oldProps) {
        await clientFactoryStore.getModifiedCFs(props.clientFactory.clientID, props.clientFactory.id)
    }
}, { immediate: true });

const { t } = useI18n({ useScope: 'global' });
</script>

<template>
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
                <div :class="`row ${!clientFactory.reflectLog?.executionDate && 'items-center'}`">
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
                <div :class="`row ${!clientFactory.reflectLog?.executionDate && 'items-center'}`">
                    <span class="info-footer__label q-mx-md">{{ t('clientFactory.lastCaptured') }}</span>
                    <span v-if="clientFactory.importLog">{{ clientFactory.importLog?.executionDate }}</span>
                    <q-icon v-else color="black" name="mdi-close"/>

                        <div class="row justify-between items-center no-wrap">
                            <div :class="`${modifiedCFs.length ? 'circle-highlight' : 'circle'} q-mx-md`"></div>
                            <q-btn
                                text-color="accent"
                                outline dense padding="xs md" size="sm"
                                :disable="!modifiedCFs.length"
                                @click="importHandle">
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

.circle-highlight {
    height: 10px;
    width: 10px;
    border-radius:50%;
    border: 1px solid $main-purple;
    background-color: $edit-highlight;
}
</style>