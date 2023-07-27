<script lang="ts" setup>
import { defineEmits, defineProps, withDefaults } from 'vue';
import { useI18n } from 'vue-i18n';
import AdvancedSearch from './AdvancedSearch.vue';
const props = withDefaults(defineProps<{
    isDrawer: boolean,
    from: string,
    width: number
}>(),{
    from:'',
    width:1100
})
const emit = defineEmits<{
    (e: 'hideCSDrawer'),
}>()

const { t } = useI18n({ useScope: 'global' });

const hideDrawer = () => {
    emit('hideCSDrawer')
}

</script>

<template>
    <q-drawer :model-value="props.isDrawer" :width="props.width" :breakpoint="500" overlay elevated bordered side="right" show>
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
                <q-card-section class="text-white bg-primary">
                    <div class="text-h6">
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        {{ t('menu.advancedSearch') }}
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="bg-grey-1 q-pa-none">
                    <AdvancedSearch :from="props.from" @hide-c-s-drawer="hideDrawer"/>
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped></style>