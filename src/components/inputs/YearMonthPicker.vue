<template>
  <q-input
    readonly
    class="input--monthYearOnly"
    input-class="cursor-pointer"
    v-model="selectedMonth"
    @click="monthPicker?.show()"
    fill-mask=""
    filled 
    dense
  >
  <template v-slot:append>
    <q-icon v-if="selectedMonth" name="cancel" @click="()=>{
      selectedMonth = '';
      monthPicker?.hide()
    }" class="cursor-pointer" />
  </template>
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy 
          ref="monthPicker" 
          transition-show="scale" 
          transition-hide="scale"
        >
          <q-date
            minimal
            emit-immediately
            default-view="Years"
            mask="YYYY-MM"
            v-model="selectedMonth"
            @update:model-value="(_, reason)=>checkValue(reason)"
            :color="isAdmin?'accent':'primary'"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { QDateProps, QPopupProxy } from 'quasar';
import { ref } from 'vue';

const monthPicker = ref<InstanceType<typeof QPopupProxy> | null>(null)
const selectedMonth = ref('')
const checkValue = (reason : Parameters<NonNullable<QDateProps['onUpdate:modelValue']>>[1]) => {
  if (reason === 'month') {
    monthPicker.value?.hide()
  }
}
const emit = defineEmits(['update:modelValue'])
withDefaults(defineProps<{
  width?: string,
  height?: string,
  fontSize?: string,
  isAdmin?: boolean,
  modelValue: string,
}>(), {
  width: '175px',
  height: '30px',
  fontSize: '12px',
  isAdmin: false
})
watch(selectedMonth, (newVal)=>{
  emit('update:modelValue', newVal);
})
</script>
<style lang="scss">
@import "src/css/imports/colors";

.input--monthYearOnly{
  background: #FFFFFF;
  box-sizing: border-box;
  
  border-radius: 3px;
  width: v-bind(width);
  height: v-bind(height);
  font-size: v-bind("fontSize");
  input {
    height: v-bind(height);
  }
  .q-field__marginal{
    height: v-bind(height);
  }
  .q-field__control{
    background: transparent;
    height: v-bind(height);
    &:before{
      border: 1px solid rgba(0, 0, 0, 0.24);
      border-radius: 4px;
      border-bottom-style: solid!important;
    }
    &:hover:before{
      border: 1px solid $input-border;
    }
  }
  
}
</style>