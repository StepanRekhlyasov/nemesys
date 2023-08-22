<template>
    <div class="container">
        <div class="left-container q-px-md">
            {{ text }}
        </div>
        <slot>

        </slot>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    text: string
}>()

</script>

<style scoped lang="scss">
.left-container {
    background: $accent;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: white;
    min-width: 150px;
}

.container {
    display: flex;
    flex-direction: row;
    border-top: 1px solid $grey-5;
    border-left: 1px solid $grey-5;
    border-right: 1px solid $grey-5;
}
</style>