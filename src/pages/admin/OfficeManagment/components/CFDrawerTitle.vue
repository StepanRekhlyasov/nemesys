<script lang="ts" setup>
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    selectedItem: ClientFactory
}>();

const dropDownValue = ref([
    t('client.add.nurse'),
    t('client.add.nursing')
])
const selectedDropDown = ref<string>(dropDownValue.value[0])

const dropDownHandler = (item: string) => {
    selectedDropDown.value = item
}
</script>

<template>
    <div class="wrapper row items-end justify-around">
        <div class="row">
            <div class="text-h5 text-weight-bolder q-mr-md">
                {{ props.selectedItem.name }}
            </div>
            <div>
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
        </div>
        <div>
            <div>
                {{ t('client.list.phone') }}
                <span> {{ props.selectedItem.tel }}</span>
            </div>
            <div>
                {{ t('client.list.fax') }}
                <span>{{ props.selectedItem.fax }}</span>
            </div>
        </div>
        <div>
            <div class="text-bold">
                {{ props.selectedItem.address.slice(0, 12) + '...' }}
            </div>
            <div>
                {{ props.selectedItem.basicInfoChangingFlag ? '✓（基本情報変更済）' : 'なし（基本情報変更済）' }}
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