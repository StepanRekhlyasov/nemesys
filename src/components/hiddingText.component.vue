<template>
  <div class="flex" :class="{'show':show, 'hidding-text': hidden}" v-if="value">
    <span ref='width'>{{ value }}</span>
    <div v-if="!show && hidden"  @click="show=true" class="cursor-pointer">...</div>
  </div>
</template>

<script >
import { onMounted, ref } from 'vue';

export default {
  name: 'HiddingTextComponent',
  props: {
    value: {
      type: [String, Number]
    }
  },
  setup () {
    const show = ref(false);
    const width = ref(null)
    const hidden = ref(false)
    onMounted(() => {
        if (width.value && width.value.clientHeight > 21) {
          hidden.value = true
        }
      })
    return {
      show,
      width,
      hidden
    }
  },
}
</script>

<style lang="scss">
.hidding-text{
  overflow: hidden;
  height: 19px;
  padding-right: 10px;
  word-wrap: break-word;
  word-break: break-all;
  &.show{
    overflow: auto;
    height: auto;
  }
  div{
    position: absolute;
    right: 0;
  }
}
</style>
