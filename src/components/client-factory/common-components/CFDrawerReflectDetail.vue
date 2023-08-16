<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, onMounted, ref, watch } from 'vue';
import { useReflectLogLabels } from '../handlers';
import { ReflectLog } from 'src/shared/model/ReflectLog'
import { useClientFactory } from 'src/stores/clientFactory';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientId: string
    clientFactoryId: string
}>()
const adminClientFactory = useClientFactory()

const reflectLogs = ref<ReflectLog[]>([])
const isLoading = ref(false)
const labels = useReflectLogLabels.value

const fetchReflectLogs = async () => {
    isLoading.value = true
    const reflectLogsData = await adminClientFactory.getAllReflectLogs(props.clientId, props.clientFactoryId)
    reflectLogs.value = reflectLogsData

    isLoading.value = false
};

onMounted(fetchReflectLogs)

watch(props, fetchReflectLogs, { deep: true })

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

    <div v-for="log in reflectLogs" :key="log.id">
        <div class="q-pa-md bg-grey-2 row justify-between">
            <div class="label-data">{{ log.userName }}</div>
            <div class="label-data">{{ log.executionDate }}</div>
            <div class="label-data">{{ log.isUpdated ? t('clientFactory.drawer.details.update') : t('clientFactory.drawer.details.create') }}</div>
            <div class="label-data">
                {{ log.itemType.isBasicInfoChanged ? t('clientFactory.drawer.details.basicInfoChanged') : '' }}
                {{ log.itemType.isDetailInfoChanged ? t('clientFactory.drawer.details.officeInfoChanged') : '' }}
            </div>
        </div>
        <q-separator color="white" size="3px"/>
    </div>
</template>

<style lang="scss" scoped>
    .header {

        &__label {
            flex: 1 1 25%;
        }
    }

    .label-data {
        flex: 1 1 25%;
    }
</style>