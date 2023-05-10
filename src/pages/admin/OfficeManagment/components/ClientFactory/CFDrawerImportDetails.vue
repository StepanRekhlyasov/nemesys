<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, onMounted, ref, watch } from 'vue';
import { useAdminClientFactory } from 'src/stores/clientFactory';
import { ImportLog } from 'src/shared/model/ImportLog';
import {useImportLogLabels} from '../../handlers/ClientFactory'

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientId: string
    clientFactoryId: string
}>()
const adminClientFactory = useAdminClientFactory()

const importLogs = ref<ImportLog[]>([])
const isLoading = ref(false)
const labels = useImportLogLabels.value

const fetchImportLogs = async () => {
    isLoading.value = true
    const importLogsData = await adminClientFactory.getAllImportLogs(props.clientId, props.clientFactoryId);
    importLogs.value = importLogsData;
    isLoading.value = false
};

onMounted(fetchImportLogs)

watch(props, fetchImportLogs, { deep: true });

</script>

<template>
    <div style="height: 5px;" class="q-my-none q-pa-none">
        <q-separator v-if="!isLoading"/>
        <q-linear-progress v-if="isLoading" indeterminate rounded color="accent" />
    </div>

    <div v-if="isLoading" class="text-grey-6">Loading...</div>

    <div v-if="!isLoading" class="header row justify-between q-pa-sm">
        <div v-for="label in labels" :key="label" class="header__label text-dark">
            {{ label }}
        </div>
    </div>

    <div v-for="log in importLogs" :key="log.id">
        <div class="q-pa-md bg-grey-2 row justify-between">
            <div class="label-data">{{ log.userName }}</div>
            <div class="label-data">{{ log.executionDate }}</div>
            <div class="label-data">{{ log.organizationName }}</div>
            <div class="label-data">{{ log.isUpdated ? t('clientFactory.drawer.details.update') : t('clientFactory.drawer.details.create') }}</div>
            <div class="label-data">
                {{ log.itemType.isBasicInfoChanged ? t('clientFactory.drawer.details.basicInfoChanged') : '' }}
                {{ log.itemType.isDetailInfoChanged ?  t('clientFactory.drawer.details.officeInfoChanged') : ''}}
            </div>
        </div>
        <q-separator color="white" size="3px"/>
    </div>

</template>

<style lang="scss" scoped>
    .header {

        &__label {
            flex: 1 1 20%;
        }
    }

    .label-data {
        flex: 1 1 20%;
    }
</style>