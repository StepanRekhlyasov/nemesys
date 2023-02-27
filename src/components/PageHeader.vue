<template>
  <q-card-section class="container q-px-none">
    <div class="text-h6  text q-px-lg">
      <slot>
      </slot>
    </div>
  </q-card-section>
  <q-separator color="grey-5" size="1.5px" />
</template>

<script setup>

</script>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.container {
  height: 46.5px;
  display: flex;
  align-items: center;
}

.text {
  color: $main-black;
}
</style>
