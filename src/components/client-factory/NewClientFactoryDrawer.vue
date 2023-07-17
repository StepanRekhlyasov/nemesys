<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { withDefaults, defineEmits, defineProps, ref } from 'vue';
import { useClientFactory } from 'src/stores/clientFactory'
import NewClientFactoryFormGroup from 'src/components/form/NewClientFactoryFormGroup.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
const { t } = useI18n({ useScope: 'global' });

withDefaults(
    defineProps<{
        isDrawer: boolean
        theme?: string
    }>(), {
        theme: 'primary'
    }
)

const { addClientFactory } = useClientFactory()

const childFormRef = ref<{
    validateAndSubmit: () => void
} | null>(null);

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

const submitForm = () => {
    if (childFormRef.value) {
        childFormRef.value.validateAndSubmit();
    }

}

const onSubmit = async (newClientFactoryData: Omit<ClientFactory, 'id'> | null) => {
    if(newClientFactoryData) {
        emit('hideDrawer')
        await addClientFactory(newClientFactoryData as ClientFactory)
    }
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
                        <q-card-section :class="`text-white bg-${theme}`">
                            <div class="text-h6">
                                <q-btn dense flat icon="close" @click="hideDrawer" />
                                <q-btn
                                    :label="t('client.add.officeReg')" :text-color="`${theme}`" color="white"
                                    class="q-ml-lg text-weight-bold" @click="submitForm" />
                            </div>
                        </q-card-section>
                        <q-separator />
                        <q-card-section class="bg-grey-1 q-pa-none">
                            <NewClientFactoryFormGroup :theme="theme" ref="childFormRef" @submit="onSubmit"/>
                        </q-card-section>
                    </q-card>
                </q-scroll-area>
        </q-drawer>
</template>

<style lang="scss" scoped>

</style>
