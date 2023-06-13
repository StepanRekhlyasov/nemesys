<script lang="ts" setup>
// import { useI18n } from 'vue-i18n';
import { defineProps, defineEmits } from 'vue';
import UpdatedCFDrawerTitle from './components/UpdatedCFDrawerTitle.vue'

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

// const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    isDrawer: boolean,
    clientFactory: ClientFactory
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
        side="right"
        :breakpoint="400"
        :width="800">
            <q-scroll-area class="fit text-left">
                <q-card class="no-shadow bg-grey-2">
                    <q-card-section class="text-white bg-accent row items-end" >
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        <UpdatedCFDrawerTitle
                            v-if="clientFactory"
                            :clientFactory="clientFactory"/>
                    </q-card-section>
                </q-card>
            </q-scroll-area>

    </q-drawer>
</template>

<style lang="scss" scoped>

</style>