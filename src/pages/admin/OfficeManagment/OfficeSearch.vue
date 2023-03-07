<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import MapDrawer from './MapDrawer.vue';
import AreaSearchDrawer from './AreaSearchDrawer.vue';
import {OfficeMenuItem} from './types'

const { t } = useI18n({ useScope: 'global' });

const router = useRouter()
const isDrawer = ref({
    mapSearchDrawer: false,
    areaSearchDrawer: false
})
const activeItem = ref<null | OfficeMenuItem>(null)


const menu = computed(() => {
    return [
        {
            name: t('menu.mapSearch'),
            right: require('assets/admin-office-managment/map-search-image.png'),
            click() {
                isDrawer.value.mapSearchDrawer = true
            },
        },
        {
            name: t('menu.areaSearch'),
            right: require('assets/admin-office-managment/area-search-image.png'),
            click() {
                isDrawer.value.areaSearchDrawer = true
            },
        },
        {
            name: t('menu.advancedSearch'),
            right: require('assets/admin-office-managment/advanced-search-image.png'),
            click() {
                router.push('client-factory')
            },
        },
        {
            name: t('menu.addOffice'),
            center: t('menu.addOfficeHint'),
            click() {
                router.push('client-factory')
            },
        },
        {
            name: t('menu.addClient'),
            center: t('menu.addNewClient'),
            click() {
                router.push('client-factory')
            },
        },
    ]
})

const hideMapDrawer = () => {
    isDrawer.value.mapSearchDrawer = false
}

const hideAreaDrawer = () => {
    isDrawer.value.areaSearchDrawer = false
}

const onMenuItem = (item: OfficeMenuItem) => {
    isDrawer.value = {
        mapSearchDrawer: false,
        areaSearchDrawer: false
    }

    activeItem.value = item
    item.click()
}

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
                    @click="onMenuItem(item)"
                    class="item_wrapper wrapper_animate_left_border"
                    clickable
                    activeClass="active-link"
                    :active="item.name === activeItem?.name"
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
                                    <q-img v-if="item.right" :src="item.right " :alt="item.name" />
                                </div>
                            </div>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <MapDrawer
        @hide-drawer="hideMapDrawer" 
        :isDrawer="isDrawer.mapSearchDrawer"/>
        <AreaSearchDrawer
        @hide-drawer="hideAreaDrawer"
        :isDrawer="isDrawer.areaSearchDrawer"/>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";
.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}
.q-list {
    color: $main-purple;
}
.active-link {
    color: $main-purple;
}
.wrapper_animate_left_border::after, .active-link::after {
    width: 2.5%;
}
.menu-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &__name {
        font-weight: bold;
        font-size: 1rem;
        flex: 0 0 33%;
        padding-left: 5%;
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
.item_wrapper {
    max-height: 80px;
}
</style>