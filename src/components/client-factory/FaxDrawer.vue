<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { withDefaults, defineEmits, defineProps } from 'vue';

const { t } = useI18n({ useScope: 'global' });

withDefaults(
    defineProps<{
        isDrawer: boolean
        theme?: string
    }>(), {
      theme: 'primary'
    }
)



const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}
</script>

<template>
        <q-drawer
            :model-value="isDrawer"
            :width="900"
            :breakpoint="500"
            overlay
            elevated
            bordered
            side="right"
            show>
                <q-scroll-area class="fit text-left">
                    <q-card class="no-shadow bg-grey-3">
                        <q-card-section class="text-white bg-primary">
                            <div class="text-h6">
                                <q-btn dense flat icon="close"  @click="hideDrawer" />
                                <span class="q-pl-sm text-bold">FAX送信</span>
                                <q-btn label="送信内容確認" color="white" text-color="primary" class="text-bold q-ml-lg q-px-md q-py-none" dense/>
                            </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="bg-grey-1 q-pa-none">
                          <div class="row">
                           <q-icon name="square" color="primary" class="q-mt-lg q-ml-xl"/>
                           <span class="text-primary text-bold q-mt-md q-pt-xs">応募者紐付け</span>
                           <span class="text-primary text-bold q-mt-lg q-pt-lg q-ml-xl">応募者</span>
                          </div>
                        </q-card-section>
                    </q-card>
                </q-scroll-area>
        </q-drawer>
</template>

<style lang="scss" scoped>

</style>
