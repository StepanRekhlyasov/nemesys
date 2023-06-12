<script lang="ts" setup>
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineEmits, defineProps, watch, ref } from 'vue';
import CFDrawerTitle from './components/CFDrawerTitle.vue';
import CFDrawerBody from './components/CFDrawerBody.vue';
import CFDrawerTabs from './components/CFDrawerTabs.vue';
import { deepCopy } from 'src/shared/utils';

const props = defineProps<{
    isDrawer: boolean,
    selectedItem: ClientFactory
}>()

const localData = ref<ClientFactory>(deepCopy(props.selectedItem))

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

watch([() => props.selectedItem], (newProps, oldProps) => {
    if (oldProps) {
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
    :width="1000"
    >
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-2">
                <q-card-section class="text-white bg-accent row items-end" >
                    <q-btn dense flat icon="close" @click="hideDrawer" />
                    <CFDrawerTitle v-if="localData" :selectedItem="localData"/>
                </q-card-section>
                <q-card-section class="bg-grey-2 q-pa-none">
                    <CFDrawerBody :clientFactory="localData"/>
                </q-card-section>
                <q-card-section class="bg-grey-3">
                    <CFDrawerTabs :clientFactory="localData" />
                </q-card-section>
            </q-card>
        </q-scroll-area>

    </q-drawer>
</template>

<style lang="scss" scoped>


</style>