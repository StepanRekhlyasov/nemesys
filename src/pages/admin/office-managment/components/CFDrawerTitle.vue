<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps(['selectedItem']);

const dropDownValue = ref([
    t('client.add.nurse'),
    t('client.add.nursing')
])
const selectedDropDown = ref(dropDownValue.value[0])

const dropDownHandler = (item: string) => {
    selectedDropDown.value = item
}
</script>

<template>
    <div class="wrapper row items-end justify-around">
        <div class="">
            <div>
                {{  props.selectedItem.office.kind }}
                <q-btn-dropdown
                rounded
                unelevated
                dense
                no-caps
                push
                auto-close
                :label="selectedDropDown"
                color="white"
                text-color="accent">
                    <q-list>
                        <q-item
                        class="row justify-center items-center"
                        clickable
                        dense
                        v-close-popup
                        :key="item"
                        @click="dropDownHandler(item)"
                        v-for="item in dropDownValue.filter(el => el !== selectedDropDown)">
                            <q-item-label>
                                {{ item }}
                            </q-item-label>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </div>
            <div class="text-h5 text-weight-bolder">
                {{ props.selectedItem.office.name }}
            </div>
        </div>
        <div>
            <div>
                {{ t('client.list.phone') }}
                <span> {{ props.selectedItem.telephone }}</span>
            </div>
            <div>
                {{ t('client.list.fax') }}
                <span>{{ props.selectedItem.fax }}</span>
            </div>
        </div>
        <div>
            <div class="text-bold">
                {{ props.selectedItem.location.area }}
            </div>
            <div class="text-bold">
                {{ props.selectedItem.location.address.slice(0, 12) + '...' }}
            </div>
            <div>
                {{ props.selectedItem.basicInfo }}
                <span>
                    {{ props.selectedItem.distance }}
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    flex: 1 1 90%;
}
</style>