<template>  
  <div :class="['text-blue text-weight-regular', labelClass]">
    {{ label }} <span v-if="required" style="color: red">*</span>
  </div>
  <div :class="[valueClass, 'blue']">
    <hidden-text v-if="!edit" class="text_dots" :value="value" />
    <template v-if="edit">
      <slot>
      </slot>
    </template>
  </div>
</template> 

<script lang="ts" setup>
import hiddenText from 'src/components/hiddingText.component.vue';
defineProps({
  label: {
    type: String,
    required: true
  },
  edit: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  value: {
    type: String
  },
  required: {
    type: Boolean,
    default: false
  },
  valueClass: {
    type: String,
    default: 'col-3 q-pl-md '
  },
  labelClass: {
    type: String,
    default: 'col-3 q-pl-md text-right self-center'
  }
})
</script>