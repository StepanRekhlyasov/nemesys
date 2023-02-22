<script lang="ts" setup>
import { ref } from 'vue';

// const props = defineProps(['isDrawer'])
const isDrawer = ref(true)

</script>

<template>
    <q-drawer
    v-model="isDrawer"
    overlay
    elevated
    bordered
    side="right"
    :breakpoint="400"
    :width="1000"
    >

    </q-drawer>
</template>

<style lang="scss" scoped>

</style>