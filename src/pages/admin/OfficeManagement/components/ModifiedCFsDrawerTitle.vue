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
    <div class="wrapper q-ml-md">
        <div>
            {{ clientFactory.address }} / {{ clientFactory.name }}
        </div>
        <div class="text-bold text-h5">
            {{ t('clientFactory.drawer.importCandidates') }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    flex: 1 1 90%;
    height: 4rem;
}
</style>