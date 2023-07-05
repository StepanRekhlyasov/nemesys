<template>
    <PageHader>
        {{ t('menu.admin.aggregateDataDisplay') }}
    </PageHader>
</template>

<script lang="ts" setup>

import { useI18n } from 'vue-i18n';
import PageHader from 'src/components/PageHeader.vue';
const { t } = useI18n({ useScope: 'global' });

</script>
<style lang="scss">
</style>