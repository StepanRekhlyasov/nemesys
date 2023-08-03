<script lang="ts" setup>
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import MapDrawer from './MapDrawer.vue';
import AreaSearchDrawer from './AreaSearchDrawer.vue';
import AdvancedSearch from 'src/components/client-factory/AdvancedSearch.vue';
const props = withDefaults(defineProps<{
    isDrawer: boolean,
    from: string,
    width: number,
    rowId: string,
}>(), {
    from: '',
    width: 1100,
    rowId: '',
})

const emit = defineEmits<{
    (e: 'openCFDrawer', ClientFactoryData: ClientFactory),
    (e: 'hideCSDrawer'),
}>()

const { t } = useI18n({ useScope: 'global' });

const mapDrawer = ref(false)
const areaDrawer = ref(false)
const openMapDrawer = () => {
    mapDrawer.value = true;
}
const hideMapDrawer = () => {
    mapDrawer.value = false;
}
const openAreaDrawer = () => {
    areaDrawer.value = true;
}
const hideAreaDrawer = () => {
    areaDrawer.value = false;
}
const hideDrawer = () => {
    emit('hideCSDrawer')
}
const openCFDrawer = (office: ClientFactory) => {
    emit('openCFDrawer', office)
}
</script>

<template>
    <q-drawer :model-value="props.isDrawer" :width="props.width" :breakpoint="500" overlay elevated bordered side="right"
        show>
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
                <q-card-section class="text-white bg-accent">
                    <div class="text-h6">
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        {{ t('menu.advancedSearch') }}
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="bg-grey-1 q-pa-none">
                    <AdvancedSearch page="admin" :from="props.from" :rowId="props.rowId" theme="accent" @hide-c-s-drawer="hideDrawer"
                        @open-c-f-drawer="openCFDrawer" @open-map-drawer="openMapDrawer" @open-area-drawer="openAreaDrawer"/>
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>
    <MapDrawer :isDrawer="mapDrawer" from="advance" :width=900 @hide-drawer="hideMapDrawer" @open-c-f-drawer="openCFDrawer"
        v-if="props.from == ''" />
    <AreaSearchDrawer :isDrawer="areaDrawer" from="advance" :width=900 @hide-drawer="hideAreaDrawer"
        v-if="props.from == ''" />
</template>

<style lang="scss" scoped></style>