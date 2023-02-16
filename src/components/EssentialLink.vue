<template>
  <q-item
    clickable
    :to="link ? link : undefined"
    exact
    v-ripple
    :active="active"
    :active-class=" $props.admin ? 'menu-admin-active-class' : 'menu-active-class' "
  >
    <q-item-section
      v-if="icon"
      avatar
      :class="main ? '' : 'q-pl-md'"
    >
      <q-icon :name="icon" :size="main ? 'sm' : 'xs'" />
      <q-tooltip anchor="center right" self="center left" :offset="[20, 20]">
          <strong>{{ $t(title) }}</strong>
        </q-tooltip>
    </q-item-section>

    <!-- <q-item-section>
      <q-item-label class="text-weight-medium" :class="main ? '' : 'text-caption'">{{ $t(title) }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section> -->
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
      type: String ,
      required: false
    },
    icon: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false,
    },
    main: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style lang="scss">
@import "src/css/imports/colors";
.menu-active-class{
  color: $main-primary;
  background: $grey-3;
}

.menu-admin-active-class{
  color: $accent;
  background: $grey-3;
}
</style>
