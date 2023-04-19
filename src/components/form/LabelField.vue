<template>  
  <div :class="['text-blue text-weight-regular self-center', labelClass]">
    {{ label }}
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
    valueClass: {
      type: String,
      default: 'col-3 q-pl-md '
    },
    labelClass: {
      type: String,
      default: 'col-3 q-pl-md text-right'
    }
})
</script>