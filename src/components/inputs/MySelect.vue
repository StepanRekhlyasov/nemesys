<template>
  <q-select
    class="mySelect"
    outlined
    dense
    :options="options"
    v-model="inputVal"
    bg-color="white"
    :label="$t('common.pleaseSelect')"
    emit-value
    map-options
    clearable
    @update:model-value="(newVal)=>{
      emit('update:modelValue', newVal);
      emit('update');
    }"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update', 'update:modelValue'])
const props = defineProps(['modelValue', 'options'])
const inputVal = ref(props.modelValue)
</script>
<style lang="scss" scoped>
.mySelect{
  white-space: nowrap;
}
</style>