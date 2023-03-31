<template>  
  <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
    {{ label }}
  </div>
  <div :class="['q-pl-md blue', valueClass]">
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
    valueClass: {
      type: String,
      default: 'col-3'
    }
})
</script>