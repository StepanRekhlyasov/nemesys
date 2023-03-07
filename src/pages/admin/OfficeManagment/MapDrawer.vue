<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import MapSearchVue from 'src/components/MapSearch.vue';

const props = defineProps<{
    isDrawer: boolean
}>()
const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const { t } = useI18n({ useScope: 'global' });

const hideDrawer = () => {
    emit('hideDrawer')
}

const getClients = (clients) => {
    console.log(clients)
}

</script>

<template>
    <q-drawer
    :model-value="props.isDrawer"
    :width="900"
    :breakpoint="500"
    overlay
    elevated
    bordered
    side="right"
    show>
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
                <q-card-section class="text-white bg-accent">
                    <div class="text-h6">
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        {{ t('menu.mapSearch') }}
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="bg-grey-1 q-pa-none">
                    <MapSearchVue theme="accent" @get-clients="getClients"/>
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped>

</style>