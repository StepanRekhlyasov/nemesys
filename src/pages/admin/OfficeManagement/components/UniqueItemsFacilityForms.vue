<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watch } from 'vue';
import draggable from 'vuedraggable'

import { FacilityForm, Industry } from 'src/shared/model/Industry.model';
import { QInput } from 'quasar';
import { uniqueItemsMask } from '../consts/uniqueItems';
const { t } = useI18n({ useScope: 'global' });

const props =  defineProps<{
    activeIndustry: Industry | null
}>()

const emit = defineEmits<{
    (e: 'newFacilityForm', data: string),
    (e: 'deleteFacilityForm', id: string),
    (e: 'updateFacilityForm'),
    (e: 'sortFacilityForm', event: {
        newIndex: number,
        oldIndex: number
    })
}>()

const newFacilityForm = ref('')
const inputVal = ref<QInput>()

const titleExists = (val: string, exception = '') => {
    if (props.activeIndustry) {
        const titles = [
            ...Object.values(props.activeIndustry.uniqueItems.typeSpecificItems || {}).map(item => item.title),
            ...Object.values(props.activeIndustry.uniqueItems.facilityForms || {}).map(item => item.title),
            ...Object.values(props.activeIndustry.uniqueItems.occupationForms || {}).map(item => item.title),
            ...Object.values(props.activeIndustry.uniqueItems.certificateForms || {}).map(item => item.title)
        ].filter(title => title !== exception)
        return !titles.includes(val)
    }

    return false
}

const newFacilityFormHandle = () => {
    if(inputVal.value && inputVal.value.validate()) {
        emit('newFacilityForm', newFacilityForm.value)
        newFacilityForm.value = ''
        setTimeout(()=>{
          inputVal.value?.resetValidation()
        }, 1)
    }
}

const deleteFacilityForm = (id: string) => {
    emit('deleteFacilityForm', id)
}

const updateFacilityForm = (val: string, initVal: string) => {
    if(val !== initVal) {
        emit('updateFacilityForm')
    }
}

const updateItemsOrder = (event: {
    newIndex: number,
    oldIndex: number
}) => {

    const { newIndex, oldIndex } = event;

    emit('sortFacilityForm', { newIndex, oldIndex })
}
const sortedList = ref<[string, FacilityForm][]>()
watch(()=>props.activeIndustry, ()=>{
  if(props.activeIndustry){
    sortedList.value = Object.entries(props.activeIndustry.uniqueItems.facilityForms)
    sortedList.value.sort((a, b)=>{
      if(b?.[1].order && a?.[1].order){
        return a?.[1].order - b?.[1].order
      }
      return 0
    })
  }
}, {deep: true, immediate: true})
</script>

<template>
    <div v-if="activeIndustry">
        <div v-if="Object.keys(activeIndustry.uniqueItems.facilityForms).length">

            <draggable :list="sortedList" :itemKey="({index})=>index" handle=".cursor_grab" @end="updateItemsOrder">
                <template #item="{ element, index }">
                    <div class="row items-center q-mt-md" :key="element[1].order">
                        <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md cursor_grab"/>

                        <div class="q-mr-md">{{ t('clientFactory.facilityType') + ` ${index + 1}` }}</div>

                        <div>
                            <q-input style="width:300px" class="q-mr-md" outlined readonly dense v-model="element[1].title"/>

                            <q-popup-edit
                                :validate="(val) => (val !== null && val !== '' && uniqueItemsMask(val) && titleExists(val, element[1].title))"
                                v-model="element[1].title"
                                :cover="false"
                                :offset="[0, 10]"
                                v-slot="scope"
                                @save="updateFacilityForm">

                                <q-input
                                    color="accent"
                                    v-model="scope.value"
                                    dense autofocus
                                    @keyup.enter="scope.set"
                                    :rules="[
                                        val => scope.validate(val) || 'Validation error'
                                    ]">
                                    <template v-slot:append>
                                        <q-icon name="edit" size="sm" color="accent" class="cursor-pointer" @click.stop.prevent="scope.set"/>
                                    </template>
                                </q-input>
                            </q-popup-edit>
                        </div>

                        <q-btn @click="deleteFacilityForm(element[0] as string)" icon="mdi-delete-outline" round flat>
                        </q-btn>
                    </div>
                </template>
            </draggable>
        </div>

        <div class="row items-center q-mt-md">
            <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

            <div class="q-mr-md">{{ t('clientFactory.facilityType') + ` ${Object.keys(activeIndustry.uniqueItems.facilityForms).length + 1}` }}</div>

            <q-input
                style="width:300px"
                class="q-mr-md" outlined dense
                v-model="newFacilityForm"
                ref="inputVal"
                :rules="[
                     (val) => (val && val.length > 0) || '',
                     (val) => (uniqueItemsMask(val)) || $t('errors.industryRules'),
                     (val) => titleExists(val) || $t('errors.titleExist')
                ]"
                color="accent" hide-bottom-space/>

            <div class="q-mr-md">
                <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm" @click="newFacilityFormHandle"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cursor_grab {
    cursor: grab;
}
</style>
