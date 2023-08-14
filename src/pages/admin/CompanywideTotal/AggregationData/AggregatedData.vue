<script setup lang = "ts">

import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' });


</script>
<template>
    <q-card class="no-shadow full-width bg-grey-3">
        <q-card-section class="bg-grey-3">
            <div class="title">{{ t('menu.admin.aggregateDataDisplay') }}</div>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
</style>




