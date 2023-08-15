<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MapDrawer from './MapDrawer.vue';
import AreaSearchDrawer from './AreaSearchDrawer.vue';
import AdvanceSearchDrawer from './AdvanceSearchDrawer.vue';
import FaxDrawer from 'src/components/client-factory/FaxDrawer.vue';
import { OfficeMenuItem } from './types'
import ClientFactoryDrawer from 'src/pages/user/BusinessManagement/ClientFactoryDrawer.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import NewClientDrawer from 'src/components/client-factory/NewClientDrawer.vue';
import NewClientFactoryDrawer from 'src/components/client-factory/NewClientFactoryDrawer.vue';
const { t } = useI18n({ useScope: 'global' });

const isDrawer = ref({
    mapSearchDrawer: false,
    areaSearchDrawer: false,
    advanceSearchDrawer: false,
    isNewClientDrawer: false,
    isNewClientFactoryDrawer:false
})
const activeItem = ref<null | OfficeMenuItem>(null)

const activeClientFactoryItem = ref<ClientFactory | null>(null)
// drawers
const isClientFactoryDrawer = ref(false)
const mapSearchKey = ref<number>(0);
const areaSearchKey = ref<number>(0);
const advanceSearchKey = ref<number>(0);
const menu = computed(() => {
    return [
        {
            name: t('menu.mapSearch'),
            right: require('assets/admin-office-managment/map-search-image.png'),
            click() {
                isDrawer.value.mapSearchDrawer = true,
                mapSearchKey.value = mapSearchKey.value === 0 ? 1 : 0
            },
        },
        {
            name: t('menu.areaSearch'),
            right: require('assets/admin-office-managment/area-search-image.png'),
            click() {
                isDrawer.value.areaSearchDrawer = true
                areaSearchKey.value = areaSearchKey.value === 0 ? 1 : 0
            },
        },
        {
            name: t('menu.advancedSearch'),
            right: require('assets/admin-office-managment/advanced-search-image.png'),
            click() {
                isDrawer.value.advanceSearchDrawer = true
                advanceSearchKey.value = advanceSearchKey.value === 0 ? 1 : 0
            },
        },
        {
            name: t('menu.addOffice'),
            center: t('menu.addOfficeHint'),
            click() {
                isDrawer.value.isNewClientFactoryDrawer = true
            },
        },
        {
            name: t('menu.addClient'),
            center: t('menu.addNewClient'),
            click() {
                isDrawer.value.isNewClientDrawer = true
            },
        },
    ]
})

const hideAdvanceDrawer = () =>{
    isDrawer.value.advanceSearchDrawer = false;
}

const hideMapDrawer = () => {
    isDrawer.value.mapSearchDrawer = false
}

const hideAreaDrawer = () => {
    isDrawer.value.areaSearchDrawer = false
}
const hideNewClientFactoryDrawer = () => {
    isDrawer.value.isNewClientFactoryDrawer = false
}
const hideNewClientDrawer = () => {
    isDrawer.value.isNewClientDrawer = false
}
const onMenuItem = (item: OfficeMenuItem) => {
    isDrawer.value = {
        mapSearchDrawer: false,
        areaSearchDrawer: false,
        advanceSearchDrawer: false,
        isNewClientDrawer: false,
        isNewClientFactoryDrawer:false
    }

    activeItem.value = item
    item.click()
}
const openCFDrawer = (clientFactoryData: ClientFactory) => {
    isClientFactoryDrawer.value = false

    setTimeout(() => {
        activeClientFactoryItem.value = clientFactoryData

        if (activeClientFactoryItem.value) {
            isClientFactoryDrawer.value = true
        }
    }, 200);
}
const isFaxDrawer = ref(false);
const selectedCF = ref<string[]>([])
const openFaxDrawer = (id:string) =>{
    selectedCF.value = []
    selectedCF.value.push(id)
    isFaxDrawer.value = true
}
const hideFaxDrawer = () => {
    isFaxDrawer.value = false
}
const hideClientFactoryDrawer = () => {
  isClientFactoryDrawer.value = false
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
            :isDrawer="isDrawer.mapSearchDrawer" 
            :width="1100" 
            @open-c-f-drawer="openCFDrawer" 
            :key="mapSearchKey"/>
        <AreaSearchDrawer @hide-drawer="hideAreaDrawer" 
            :isDrawer="isDrawer.areaSearchDrawer" 
            :width="1100" 
            :key="areaSearchKey"/>
        <AdvanceSearchDrawer 
            @hide-c-s-drawer="hideAdvanceDrawer" 
            :isDrawer="isDrawer.advanceSearchDrawer" 
            @open-c-f-drawer="openCFDrawer" 
            :width="1100" 
            :key="advanceSearchKey"/>
        <ClientFactoryDrawer 
            v-if="activeClientFactoryItem" 
            v-model:selectedItem="activeClientFactoryItem"
            :originalOfficeId="activeClientFactoryItem.id"
            :isDrawer="isClientFactoryDrawer" 
            @open-fax-drawer="openFaxDrawer" 
            @hide-drawer="hideClientFactoryDrawer" />
        <FaxDrawer 
            @hide-drawer="hideFaxDrawer" 
            theme="accent" 
            :selectedCF="selectedCF" 
            :is-drawer="isFaxDrawer" />
        <NewClientDrawer
            @hide-drawer="hideNewClientDrawer"
            theme="accent"
            :is-drawer="isDrawer.isNewClientDrawer" />
        <NewClientFactoryDrawer
            @hide-drawer="hideNewClientFactoryDrawer"
            theme="accent"
            :is-drawer="isDrawer.isNewClientFactoryDrawer"/>
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