<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits, ref } from 'vue';
import ModifiedCFsDrawerTitle from './components/ModifiedCFsDrawerTitle.vue';
import { useClientFactory } from 'src/stores/clientFactory';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { useImportCandidatesLabels } from './handlers';
import Quasar, { useQuasar } from 'quasar';

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar()

const clientFactoryStore = useClientFactory()
const { modifiedCFs } = storeToRefs(clientFactoryStore)

const props = defineProps<{
    isDrawer: boolean,
    clientFactory: ClientFactory
}>()

const emit = defineEmits<{
    (e: 'hideDrawer'),
    (e: 'openUpdatedInfo')
}>()

const isLoading = ref(false)

const hideDrawer = () => {
    emit('hideDrawer')
}

const updatedInfoHandle = () => {
    emit('openUpdatedInfo')
}

const setIgnoredStatus = async (modifiedCFId: string) => {
    await clientFactoryStore.setIgnoredStatus(props.clientFactory.clientID, props.clientFactory.id, modifiedCFId, $q as unknown as typeof Quasar)
    isLoading.value = false
}

const labels = useImportCandidatesLabels
</script>

<template>
    <q-drawer
        :model-value="props.isDrawer"
        overlay
        elevated
        side="right"
        :breakpoint="400"
        :width="900">
            <q-scroll-area class="fit text-left">
                <q-card class="no-shadow bg-grey-2">
                    <q-card-section class="text-white bg-accent row items-end" >
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        <ModifiedCFsDrawerTitle
                            v-if="clientFactory"
                            :clientFactory="clientFactory"/>
                    </q-card-section>

                    <q-card-section class="bg-white">
                        <div class="header row justify-between q-pa-sm text-center">
                            <div v-for="label in labels" :key="label" class="header__label text-dark">
                                {{ label }}
                            </div>
                        </div>

                        <div v-for="modifiedCF in modifiedCFs" :key="modifiedCF.id">
                            <div class="q-pa-md bg-grey-2 row justify-between items-center text-center">
                                <div class="label-data">
                                    {{ modifiedCF.organizationId }}
                                </div>
                                <div class="label-data">
                                    {{ modifiedCF.updated_at }}
                                </div>
                                <div class="label-data">
                                    {{ modifiedCF.numberUpdates }}
                                </div>
                                <div class="label-data">
                                    {{ modifiedCF.numberImports }}

                                    {{ modifiedCF.isIgnored }}
                                </div>

                                <div class="label-data row items-center">
                                    <div class="q-pr-sm">
                                        <q-btn color="accent" size="sm" outline @click="isLoading = true; setIgnoredStatus(modifiedCF.id)" :disable="isLoading">
                                            {{ t('clientFactory.drawer.ignore') }}
                                        </q-btn>
                                    </div>

                                    <div>
                                        <q-btn flat round size="md" @click="updatedInfoHandle" icon="mdi-information-outline">
                                        </q-btn>
                                    </div>
                                </div>
                                <q-separator color="white" size="3px"/>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped>
    .header {

        &__label {
            flex: 1 1 20%;
        }
    }

    .label-data {
        flex: 1 1 20%;
        word-break: break-all;
    }

    .label-data:nth-child(6) {
        flex: 1 1 20%;
        justify-content: flex-end;
    }
</style>