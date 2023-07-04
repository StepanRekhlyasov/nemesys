<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
defineProps<{
    clientFactory: ClientFactory,
    industryValue: Array<{ value: string, isSelected: boolean, ts: string }>,
    selectedIndustry: { value: string, isSelected: boolean, ts: string } | undefined
}>();

const emit = defineEmits<{
    (e: 'importHandle'),
    (e: 'editIndustry', value: { value: string, isSelected: boolean, ts: string })
}>()

const importHandle = () => {
    emit('importHandle')
}

const dropDownHandler = (item: { value: string, isSelected: boolean, ts: string }) => {
    emit('editIndustry', item)
}

</script>

<template>
    <div class="wrapper q-ml-md row justify-between items-center">
        <div>
            {{ clientFactory.client?.representativeName }}
            <q-btn-dropdown
                v-if="clientFactory.isHead && clientFactory.industry?.length && selectedIndustry"
                rounded
                unelevated
                dense
                no-caps
                push
                auto-close
                :label="selectedIndustry.ts ?? ''"
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
                                {{ item.ts }}
                            </q-item-label>
                    </q-item>
                </q-list>
            </q-btn-dropdown>

            <div class="text-bold text-h5">
                {{ clientFactory.name }}
            </div>
        </div>

        <div class="text-bold text-h5 text-right">
            {{ clientFactory.client?.companyProfile }}

            <div>
                <q-btn
                    class="bg-white"
                    text-color="accent"
                    dense padding="xs md" size="sm"
                    @click="importHandle">
                    <q-icon name="mdi-tray-arrow-down" color="accent" size="xs" left/>
                    {{ t('common.capture') }}
                </q-btn>
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