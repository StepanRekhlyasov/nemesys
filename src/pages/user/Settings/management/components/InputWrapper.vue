<template>
  <div class="container q-pt-md">
    <div class="text q-pr-md">
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
  textPaddingBottom?: string
}


defineProps<InputWarapperProps>()
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
}

.text {
  min-width: 120px;
  text-align: right;
  padding-bottom: v-bind(textPaddingBottom);
}
</style>

