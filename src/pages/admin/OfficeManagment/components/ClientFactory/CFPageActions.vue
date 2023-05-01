<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineEmits } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const emit = defineEmits<{
    (e: 'openDrawer')
}>()

const openNewClientDrawer = () => {
    emit('openDrawer', )
}

</script>

<template>
    <q-card-section class="bg-white">
        <div class="row items-center justify-between">
            <div class="text-subtitle1">
                {{ t('common.searchCondition') }} / 
                {{ t('common.area') }} : 
                {{ t('common.aroundTokio') }}, 
                {{ t('common.detailedConditions') }}
            </div>
            <div>
                <a class="action_link" @click="openNewClientDrawer">
                    {{ t('actions.clickToAddNewClient') }}
                </a>
            </div>
        </div>
        
        <div class="row items-center justify-between q-mt-sm">
            <q-btn class="action_btn">
                {{ t('actions.searchConditionChange') }}
            </q-btn>
            <q-btn icon="add" class="action_btn">
                {{ t('menu.addOffice') }}
            </q-btn>
        </div>
    </q-card-section>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.action_btn {
    background-color: $main_purple;
    color: white;
    font-weight: bold;
}
.action_link {
    text-decoration: underline;
    line-height: 14px;
    color: $main_purple;
    cursor: pointer;
}
</style>