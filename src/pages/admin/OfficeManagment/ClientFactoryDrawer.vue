<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue';
import CFDrawerTitle from './components/CFDrawerTitle.vue';

const props = defineProps(['isDrawer', 'selectedItem'])
const emit = defineEmits(['hideDrawer'])

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
            <q-card class="no-shadow bg-grey-3">
                <q-card-section class="text-white bg-accent row items-end" >
                    <q-btn dense flat icon="close" @click="hideDrawer" />
                    <CFDrawerTitle :selectedItem="selectedItem"/>
                </q-card-section>
                <q-card-section>

                </q-card-section>
            </q-card>
        </q-scroll-area>

    </q-drawer>
</template>

<style lang="scss" scoped>


</style>