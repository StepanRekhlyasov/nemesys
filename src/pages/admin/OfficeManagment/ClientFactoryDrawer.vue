<script lang="ts" setup>
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineEmits, defineProps } from 'vue';
import CFDrawerTitle from './components/ClientFactory/CFDrawerTitle.vue';
import CFDrawerBody from './components/ClientFactory/CFDrawerBody.vue';
import CFDrawerTabs from './components/ClientFactory/CFDrawerTabs.vue';

const props = defineProps<{
    isDrawer: boolean,
    selectedItem: ClientFactory
}>()

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

</script>

<template>
    <q-drawer
    :model-value="props.isDrawer"
    overlay
    elevated
    bordered
    side="right"
    :breakpoint="400"
    :width="1000"
    >
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-2">
                <q-card-section class="text-white bg-accent row items-end" >
                    <q-btn dense flat icon="close" @click="hideDrawer" />
                    <CFDrawerTitle v-if="selectedItem" :selectedItem="selectedItem"/>
                </q-card-section>
                <q-card-section class="bg-grey-2 q-pa-none">
                    <CFDrawerBody v-if="selectedItem" :selectedItem="selectedItem"/>
                </q-card-section>
                <q-card-section class="bg-grey-3">
                    <CFDrawerTabs :clientFactory="selectedItem as ClientFactory" />
                </q-card-section>
            </q-card>
        </q-scroll-area>

    </q-drawer>
</template>

<style lang="scss" scoped>


</style>