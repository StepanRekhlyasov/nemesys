<template>
  <div class="text-subtitle1">
    {{ t('common.searchKeyword') }} / {{ t('common.searchCondition') }}
  </div>
  <q-card class="row q-pt-sm items-center justify-between">
    <q-card-section class="row q-px-none items-center">
      <q-input v-model:model-value="value" v-bind="$attrs" borderless input-style="height: 28px;" class="input"
        :placeholder="t('form.searchPlaceholder')" />
      <DefaultButton label-key="common.search" @click="onClickSearch" :color="searchButtonColor" />
      <DefaultButton label-key="common.clear" @click="onClickClear" clear :text-color="clearButtonTextColor" />
    </q-card-section>
    <q-card-section>
      <slot name="rigthButton">

      </slot>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>


<script setup lang="ts">
import { QBtnProps, QInputProps } from 'quasar';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DefaultButton from './buttons/DefaultButton.vue';
const { t } = useI18n({ useScope: 'global' });

interface SearchFieldProps extends QInputProps {
  onClickSearch: QBtnProps['onClick']
  onClickClear: QBtnProps['onClick']
  color?: string
  searchButtonColor?: string
  clearButtonTextColor?: string
}

const props = withDefaults(defineProps<SearchFieldProps>(), {
  searchButtonColor: 'accent'
})

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null | undefined): void }>();

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

</script>

<style lang="scss" scoped>
@import "src/css/imports/colors";

button {
  margin-left: 10px;
  width: 62px;
  height: 28px;
  border-radius: 4px;
}

.clear {
  border: 1px solid $clear-button-border;
  background-color: $grey-11;
  color: $accent;
}

.input {
  border: 1px solid $input-border;
  border-radius: 3px;
  max-height: 28px;
  width: 350px;
  height: 28px;
  padding-left: 10px;
}
</style>
