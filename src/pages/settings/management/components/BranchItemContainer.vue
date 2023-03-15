<template>
  <div class="row q-pb-sm">
    <div class="col-3 text-right q-pr-sm  q-pt-sm">
      {{ $t(nameKey) }}
    </div>
    <div class="col-9 q-pl-sm ">
      <slot>

      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalizationKeys } from 'src/shared/types/LocalizationKeys';

interface BranchItemContainerProps {
  nameKey: LocalizationKeys
}

defineProps<BranchItemContainerProps>()

</script>
