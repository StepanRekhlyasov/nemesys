<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    selectedItem: ClientFactory,
    industryValue: Array<{ value: string, isSelected: boolean }>,
    selectedIndustry: { value: string, isSelected: boolean } | undefined
}>();

const emit = defineEmits<{
    (e: 'editIndustry', value: { value: string, isSelected: boolean})
}>()

const dropDownHandler = (item: { value: string, isSelected: boolean }) => {
    emit('editIndustry', item)
}
</script>

<template>
    <div class="wrapper row items-end justify-around">
        <div class="row">
            <div class="q-mr-md column">
                <div>
                    {{ props.selectedItem.client?.name }}
                    <q-btn-dropdown
                        v-if="selectedItem.isHead && selectedItem.industry?.length && selectedIndustry"
                        rounded
                        unelevated
                        dense
                        no-caps
                        push
                        auto-close
                        :label="selectedIndustry.value ?? ''"
                        color="white"
                        text-color="accent">
                        <q-list>
                            <q-item
                                class="row justify-center items-center"
                                clickable
                                dense
                                v-close-popup
                                :key="item.value ?? 1"
                                @click="dropDownHandler(item)"
                                v-for="item in industryValue.filter(el => el.value !== selectedIndustry?.value)">
                                
                                <q-item-label>
                                    {{ item.value }}
                                </q-item-label>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                </div>
                <span class="text-h5 text-weight-bolder">
                    <q-icon v-if="selectedItem.isHead" color="white" name="home"/>
                    {{ props.selectedItem.name }}
                </span>
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
    height: 4rem;
}
</style>