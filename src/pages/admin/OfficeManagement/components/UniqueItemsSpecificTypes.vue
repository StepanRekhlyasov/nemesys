<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watch } from 'vue';
import draggable from 'vuedraggable'

import { Industry, SpecificItem } from 'src/shared/model/Industry.model';
import { QInput } from 'quasar';
const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    activeIndustry: Industry | null
}>()

const emit = defineEmits<{
    (e: 'newSpecificType', data: {title: string, dataType: string}),
    (e: 'deleteSpecificType', id: string),
    (e: 'updateSpecificType'),
    (e: 'sortSpecificType', event: {
        newIndex: number,
        oldIndex: number
    })
}>()

const newSpecificType = ref({
    title: '',
    dataType: 'string'
})
const inputVal = ref<QInput>()

const titleExists = (val: string, exception = '') => {
    if(props.activeIndustry) {
        const titles = [
            ...Object.values(props.activeIndustry.uniqueItems.typeSpecificItems || {}).map(item => item.title),
            ...Object.values(props.activeIndustry.uniqueItems.facilityForms || {}).map(item => item.title)
        ].filter(title => title !== exception)
        return !titles.includes(val)
    }

    return false
}

const newSpecificTypeHandle = () => {
    if(inputVal.value && inputVal.value.validate()) {
        emit('newSpecificType', newSpecificType.value)
        newSpecificType.value.title = ''
        inputVal.value?.resetValidation()
    }
}

const deleteSpecificType = (id: string) => {
    emit('deleteSpecificType', id)
}

const updateSpecificType = (val: string, initVal: string) => {
    if(val !== initVal) {
        emit('updateSpecificType')
    }
}
const updateItemsOrder = (event: {
        newIndex: number,
        oldIndex: number
    }) => {

    const { newIndex, oldIndex } = event;

    emit('sortSpecificType', { newIndex, oldIndex })
}
const sortedList = ref<[string, SpecificItem][]>()
watch(()=>props.activeIndustry, ()=>{
  if(props.activeIndustry){
    sortedList.value = Object.entries(props.activeIndustry.uniqueItems.typeSpecificItems)
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
        <div v-if="Object.keys(activeIndustry.uniqueItems.typeSpecificItems).length">
            <draggable :list="sortedList" :itemKey="({index})=>index" handle=".cursor_grab" @end="updateItemsOrder">
                <template #item="{element, index}">
                    <div class="row items-center q-mt-md" :key="element[1].order">
                        <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md cursor_grab"/>

                        <div class="q-mr-md">{{ t('KPI.item') + ` ${index + 1}` }}</div>

                        <div>
                            <q-input class="q-mr-md" outlined readonly dense v-model="element[1].title"/>

                            <q-popup-edit
                                :validate="(val) => (val !== null && val !== '' && /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(val) && titleExists(val, element[1].title))"
                                v-model="element[1].title"
                                :cover="false"
                                :offset="[0, 10]"
                                v-slot="scope"
                                @save="updateSpecificType"
                                >
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

                        <q-input class="q-mr-md" outlined readonly dense v-model="element[1].dataType"/>

                        <q-btn @click="deleteSpecificType(element[0] as string)" icon="mdi-delete-outline" round flat>
                        </q-btn>
                    </div>
                </template>
            </draggable>
        </div>

        <div class="row items-center q-mt-md">
            <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>
            <div class="q-mr-md">{{ t('KPI.item') + ` ${Object.keys(activeIndustry.uniqueItems.typeSpecificItems).length + 1}` }}</div>
            <q-input
                class="q-mr-md" outlined dense
                v-model="newSpecificType.title"
                ref="inputVal"
                color="accent"
                lazy-rules
                :rules="[
                     (val) => (val && val.length > 0) || '',
                     (val) => (/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(val)) || 'Invalid input. Keys should start with a letter, $ or _, and should not contain spaces or special characters.',
                     (val) => titleExists(val) || 'Title already exists'
                ]" hide-bottom-space/>
            <q-select class="q-mr-md" dense outlined v-model="newSpecificType.dataType" :options="['string', 'number']" color="accent">
            </q-select>
            <div>
                <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm" @click="newSpecificTypeHandle"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cursor_grab {
    cursor: grab;
}
</style>