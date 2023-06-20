<script lang="ts" setup>
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
defineProps<{
    clientFactory: ClientFactory
}>();
</script>

<template>
    <div class="wrapper q-ml-md row justify-between items-center">
        <div>
            {{ clientFactory.client?.representativeName }}

            <div class="text-bold text-h5">
                {{ clientFactory.name }}
            </div>
        </div>

        <div class="text-bold text-h5 text-right">
            {{ clientFactory.client?.companyProfile }}

            <div>
                {{ t('clientFactory.drawer.updateData') }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    flex: 1 1 90%;
    height: 4rem;
}
</style>