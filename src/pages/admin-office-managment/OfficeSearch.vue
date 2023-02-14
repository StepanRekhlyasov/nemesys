<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });

const menu = computed(() => {
    return [
        {
            name: t('menu.mapSearch'),
            right: 'assets/admin-office-managment/map-search-image.png'
        },
        {
            name: t('menu.areaSearch'),
            right: 'assets/admin-office-managment/area-search-image.png'
        },
        {
            name: t('menu.advancedSearch'),
            right: 'assets/admin-office-managment/advanced-search-image.png'
        },
        {
            name: t('menu.addOffice'),
            center: t('menu.addOfficeHint')
        },
        {
            name: t('menu.addClient'),
            center: t('menu.addNewClient'),
            right: ''
        },
    ]
})
</script>

<template>
    <div class="row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-3">
            <q-card-section class="bg-grey-3">
                <div class="title">{{ $t('menu.officeSearch') }}</div>
            </q-card-section>
            <q-card-section class="no-padding">
                <q-list bordered separator padding class="rounded-borders bg-grey-3">
                    <q-separator color="white" size="2px" />
                    <q-item
                    clickable
                    :key="item.name"
                    v-for="item in menu">
                        <q-item-section>
                            <div class="menu-item">
                                <div class="menu-item__name">
                                    {{ item.name }}
                                </div>
                                <div class="menu-item__center">
                                    {{ item.center }}
                                </div>
                                <div class="menu-item__right">
                                    <q-img v-if="item.right" :src="item.right" :alt="item.name" />
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}
.q-list {
    color: $main-purple;
}
.menu-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-height: 80px;

    &__name {
        font-weight: bold;
        font-size: 1rem;
        flex: 0 0 33%;
    }
    &__center {
        flex: 0 0 27%;
    }
    &__right {
        flex: 0 0 40%;

        .q-img {
            max-height: 80px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>