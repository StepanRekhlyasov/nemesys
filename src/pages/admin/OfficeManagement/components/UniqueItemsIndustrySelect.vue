<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { QInput } from 'quasar';
import { defineEmits, defineProps, ref} from 'vue';
import { useQuasar } from 'quasar';
import { Industry } from 'src/shared/model/Industry.model';

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    industries: Industry[]
    activeIndustry: Industry | null
    isNewIndustryPopup: boolean
}>()
const $q = useQuasar();
const emit = defineEmits<{
    (event: 'update:activeIndustry', value: Industry): void,
    (e: 'update:isNewIndustryPopup', payload: boolean): void,
    (e: 'newIndustry', industryName: string),
    (e: 'deleteIndustry', id: string | undefined)
}>()
const newIndustry = ref('')
const inputVal = ref<QInput>()
const titleExists = (value: string) => {
    if(props.industries.find((el) => el.industryName === value)) {
        return false
    }

    return true
}

const selectIndustry = (industry) => {
    emit('update:activeIndustry', industry);
};
const deleteIndustry = async (industryId) => {
  $q.dialog({
    title: t('common.delete'),
    message: t('common.deleteInfo'),
    persistent: true,
    cancel: t('common.cancel'),
    color:'accent'
  }).onOk(async () => {
    emit('deleteIndustry', industryId);
  })
}
const saveNewIndustry = async () => {
    if (inputVal.value && inputVal.value.validate()) {
        emit('newIndustry', newIndustry.value)
        newIndustry.value = ''
        emit('update:isNewIndustryPopup', false)
    }
}
</script>

<template>
    <div class="row items-center">
        <h4 class="title q-mr-lg">
            {{ t('industry.uniqueItemSetting') }}
        </h4>
        <q-select
            :disable="!industries.length"
            class="select q-mr-lg"
            :model-value="activeIndustry"
            emit-value
            map-options
            dense
            color="accent"
            @update:modelValue="val => emit('update:activeIndustry', val)"
            :options="industries"
            option-label="industryName"
            option-value="."
        >
            <template v-slot:option="{ opt }">

                <div class="q-item q-item-type row no-wrap items-center justify-between" v-close-popup>
                    <q-btn class="q-item-label cursor-pointer text-weight-medium " flat @click="selectIndustry(opt)">{{ opt.industryName }}</q-btn>
                    <q-btn
                        icon="mdi-delete"
                        dense
                        flat
                        class="cursor-pointer q-ml-xs"
                        @click="deleteIndustry(opt.id)"
                    />
                </div>
            </template>
        </q-select>
       <div>
            <q-btn color="accent" size="sm" @click="() => emit('update:isNewIndustryPopup', true)">
                {{ t('common.addNew') }}
            </q-btn>
       </div>
    </div>

    <q-dialog :model-value="isNewIndustryPopup" @hide="() => emit('update:isNewIndustryPopup', false)">
        <q-card class="content-popup q-pa-md">
            <q-card-section class="text-bold text-h6 text-accent">
                {{ t('industry.newIndustry') }}
            </q-card-section>

            <q-card-section class="row items-center">
              <q-input
               ref="inputVal"
               v-model="newIndustry"
               class="q-mr-md"
               outlined
               dense
               color="accent"
               hide-bottom-space
               :rules="[
                   (val) => (val && val.length > 0) || '',
                   (val) => (/^[a-zA-Z_$ぁ-んァ-ン一-龯ー]*$/.test(val)) || 'Invalid input. Text should not contain spaces or special characters.',
                   (val) => titleExists(val) || 'Title already exists'
               ]"
                />

                <div>
                    <q-btn color="accent" icon="mdi-plus" :label="t('common.save')" size="sm" @click="saveNewIndustry"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}

.content-popup {
    width: 500px;
    max-width: 50vw;
}

.select {
    width: 200px;
}
</style>
