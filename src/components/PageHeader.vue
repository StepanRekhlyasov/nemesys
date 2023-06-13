<template>
  <q-card-section class="container q-px-none" v-bind="$attrs">
    <div class="text-h6 q-px-lg"
      :class="{ accent: color === 'accent', mainBlack: color === 'mainBlack', primary: color === 'primary' }">
      <slot>
      </slot>
    </div>
  </q-card-section>
  <q-separator v-if="separator" size="1.5px" />
</template>

<script setup lang="ts">
type Color = 'accent' | 'mainBlack' | 'primary'
interface PageHeaderProps {
  separator?: boolean
  color?: Color
}

withDefaults(defineProps<PageHeaderProps>(), {
  separator: true,
  color: 'mainBlack'
})



</script>

<style lang="scss" scoped>

@import "src/css/imports/colors";

.accent {
  color: $accent
}

.mainBlack {
  color: $main-black;
}

.primary {
  color: $primary;
}

.container {
  height: 46.5px;
  display: flex;
  align-items: center;
}
</style>
