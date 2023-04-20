<template>
  <div class="row q-pb-sm">
    <div class="col-3 text-right center q-mr-md" v-bind="$attrs">
      {{ $t(textKey) }}
    </div>
    <slot>

    </slot>
  </div>
</template>


<script setup lang="ts">
import { LocalizationKeys } from 'src/shared/types/LocalizationKeys';

interface InputWarapperProps {
  textKey: LocalizationKeys
}


defineProps<InputWarapperProps>()
</script>

<style lang="scss" scoped>
.center {
  align-self: center;
}
</style>

