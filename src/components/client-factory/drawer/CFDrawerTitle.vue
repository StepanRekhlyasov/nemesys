<script lang="ts" setup>
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    selectedItem: ClientFactory,
    industryValue: Array<{ value: string, isSelected: boolean }>,
    selectedIndustry: { value: string, isSelected: boolean } | undefined
}>();
const emit = defineEmits<{
    (e: 'editIndustry', value: { value: string, isSelected: boolean })
}>()
const dropDownHandler = (item: { value: string, isSelected: boolean }) => {
    emit('editIndustry', item)
}
const route = useRoute()
const theme = route.meta.isAdmin ? 'accent' : 'primary'
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
                        :text-color="theme">

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
                    <span v-else-if="selectedIndustry"> / {{ selectedIndustry.value }}</span>
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
            <div>
                {{ props.selectedItem.prefecture+' '+props.selectedItem.municipality }}
            </div>
            <div>
                {{ props.selectedItem.street+' '+props.selectedItem.building }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    flex: 1 1 90%;
}
</style>
