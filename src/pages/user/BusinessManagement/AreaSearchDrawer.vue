<script lang="ts" setup>
import { ref, defineEmits, defineProps, withDefaults } from 'vue';
import { useI18n } from 'vue-i18n';
import AdvanceSearchDrawer from './AdvanceSearchDrawer.vue';
import AreaSearch from 'src/components/client-factory/AreaSearch.vue';

const props = withDefaults(defineProps<{
    isDrawer: boolean,
    from: string,
    width: number
}>(),{
    from:'',
    width: 1100
})
const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const { t } = useI18n({ useScope: 'global' });

const drrawer = ref(false)
const advanceSearchKey = ref<number>(0)
const resetKey = () =>{
    advanceSearchKey.value = advanceSearchKey.value === 0 ? 1 : 0;
}
const hideCSDrawer = () =>{
  drrawer.value = false
}
const openCSDrawer = () =>{
  drrawer.value = true
}

const hideDrawer = () => {
    emit('hideDrawer')
}
</script>

<template>
    <q-drawer :model-value="props.isDrawer" :width="props.width" :breakpoint="500" overlay elevated bordered side="right" show>
        <q-scroll-area class="fit text-left">
            <q-card class="no-shadow bg-grey-3">
                <q-card-section class="text-white bg-primary">
                    <div class="text-h6">
                        <q-btn dense flat icon="close" @click="hideDrawer" />
                        {{ t('menu.areaSearch') }}
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="bg-grey-1 q-pa-none">
                    <AreaSearch page="user" theme="primary" @hide-drawer="hideDrawer" :from="props.from" @open-c-s-drawer="openCSDrawer" @reset-key="resetKey"/>
                </q-card-section>
            </q-card>
        </q-scroll-area>
    </q-drawer>
    <AdvanceSearchDrawer from="area" :isDrawer="drrawer" :width="900" @hide-c-s-drawer="hideCSDrawer" :key="advanceSearchKey"/>
</template>

<style lang="scss" scoped></style>