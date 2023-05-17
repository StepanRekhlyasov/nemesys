<template>
  <q-input
    readonly
    class="input--monthYearOnly"
    input-class="cursor-pointer"
    v-model="selectedMonth"
    @click="monthPicker?.show()"
    mask="####-##"
    fill-mask=""
    filled 
    dense
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy 
          ref="monthPicker" 
          transition-show="scale" 
          transition-hide="scale"
          @before-hide="()=>emit('input', selectedMonth)"
        >
          <q-date
            minimal
            emit-immediately
            default-view="Years"
            mask="YYYY-MM"
            v-model="selectedMonth"
            @update:model-value="(_, reason)=>checkValue(reason)"
            :color="isAdmin()?'accent':'primary'"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { ref } from 'vue';
import { isAdmin } from 'src/shared/utils/Admin.utils'

const monthPicker = ref<InstanceType<typeof QPopupProxy> | null>(null)
const selectedMonth = ref('')
const checkValue = (reason : 'mask' | 'add-day' | 'remove-day' | 'add-range' | 'remove-range' | 'locale' | 'year' | 'month') => {
  if (reason === 'month') {
    monthPicker.value?.hide()
  }
}
const emit = defineEmits<{
  (e: 'input', selectedMonth: string)
}>()
withDefaults(defineProps<{
  width?: string,
  height?: string,
  fontSize?: string,
}>(), {
  width: '175px',
  height: '30px',
  fontSize: '12px'
})
</script>
<style lang="scss">
@import "src/css/imports/colors";

.input--monthYearOnly{
  background: #FFFFFF;
  border: 1px solid $input-border;
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
      border-bottom: 0;
      opacity: 0;
    }
  }
}
</style>