<template>
  <q-input
    readonly
    class="input--dateRange"
    input-class="cursor-pointer"
    v-model="dateStringValue"
    @click="datePicker?.show()"
    filled
    dense
    :disable="disable"
  >
  <template v-slot:append v-if="clearable">
    <q-icon v-if="dateValue" name="cancel" @click="()=>{
      dateValue = '';
      datePicker?.hide();
      emit('cleared');
    }" class="cursor-pointer" />
  </template>
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="datePicker"
          transition-show="scale"
          transition-hide="scale"
          @before-hide="emit('pickerHide', dateValue)"
        >
          <q-date
            minimal
            :range="range"
            emit-immediately
            v-model="dateValue"
            :color="isAdmin?'accent':'primary'"
            :navigation-max-year-month="maxYearMonth"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { QPopupProxy } from 'quasar';
import { ref } from 'vue';

const datePicker = ref<InstanceType<typeof QPopupProxy> | null>(null)
const emit = defineEmits(['update:modelValue', 'pickerHide', 'cleared'])
withDefaults(defineProps<{
  width?: string,
  height?: string,
  fontSize?: string,
  isAdmin?: boolean,
  modelValue: string | {
    from : string,
    to : string
  },
  clearable?: boolean,
  maxYearMonth?: string,
  disable?:boolean,
  range?: boolean
}>(), {
  width: '175px',
  height: '30px',
  fontSize: '12px',
  isAdmin: false,
  clearable: true,
  disable: false,
  range: true
})
const dateValue = ref()
const dateStringValue = ref()
watch(dateValue, (newVal)=>{
  if(newVal.from && newVal.to){
    dateStringValue.value = newVal.from + ' - ' + newVal.to
  } 
  if(!newVal.from && !newVal.to){
    dateStringValue.value = newVal
  }
  emit('update:modelValue', newVal);
})
</script>
<style lang="scss">
@import "src/css/imports/colors";

.input--dateRange{
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
