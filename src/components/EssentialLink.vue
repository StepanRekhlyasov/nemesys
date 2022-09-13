<template>
<q-item
    clickable
    :to="link"
    exact
    v-ripple
    active-class="menu-active-class"
  >
    <q-item-section
      v-if="icon"
      avatar
      :class="main ? '' : 'q-pl-md'"
    >
      <q-icon :name="icon" :size="main ? 'md' : 'xs'" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium" :class="main ? '' : 'text-caption'">{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    main: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style lang="sass">
.menu-active-class
  color: white
  background: #374A5E
</style>
