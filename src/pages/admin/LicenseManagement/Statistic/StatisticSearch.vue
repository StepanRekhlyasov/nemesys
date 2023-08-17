<template>
        <div class="item-container">
                <SearchItem type="input" :text="t('menu.admin.organizationsTable.organizationCode')">
                        <q-input class="right-container" v-model="search.code" dense borderless square :debounce="200" />
                </SearchItem>
                <SearchItem type="input" :text="t('menu.admin.organizationsTable.organizationName')">
                        <q-input class="right-container" v-model="search.orgaName" dense borderless square :debounce="200" />
                </SearchItem>
                <SearchItem type="input" :text="t('menu.admin.organizationsTable.businessName')">
                        <q-input class="right-container" v-model="search.businessName" dense borderless square
                                :debounce="200" />
                </SearchItem>
                <SearchItem type="input" :text="t('menu.admin.organizationsTable.branchName')">
                        <q-input class="right-container" v-model="search.branchName" dense borderless square :debounce="200" />
                </SearchItem>
                <SearchItem type="checkbox" :text="t('menu.admin.licenseManagement.systemInUse')">
                        <div class="checkbox">
                                <q-checkbox label="arroba" v-model="search.arroba" dense color="accent"
                                        style="margin-right: 10px;" />
                                <q-checkbox label="nemesys" v-model="search.nemesys" dense color="accent" />
                        </div>
                </SearchItem>
        </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SearchItem from './SearchItem.vue';
import { ref, watch } from 'vue';
import { Search } from '../types/LicenseStatistic';

const { t } = useI18n({ useScope: 'global' });

const search = ref<Search>({
        code: '',
        orgaName: '',
        businessName: '',
        branchName: '',
        arroba: false,
        nemesys: true,
})

const emit = defineEmits<{
        (e: 'updateSearch', v: Search)
}>()


watch(search, () => {
        emit('updateSearch', search.value)
}, { deep: true })

</script>

<style scoped lang="scss">
.item-container {
        padding-top: 10px;
        width: 315px;
}

.right-container {
        border: 1px solid $grey-5;
        margin: 2px;
}

.checkbox {
        height: 45px;
        display: flex;
        flex-direction: row;
}

div .item-container:last-child {
        border-bottom: 1px solid $grey-5;
}
</style>
