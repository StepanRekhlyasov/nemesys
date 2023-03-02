<template>
  <div class="row justify-between">
    <div class="flex self-center">
      <span class="text-primary text-h6">{{ label }}</span>
      <div v-if="showButton">
        <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
          class="text-grey-9" @click="show = false" v-if="show" />
        <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
          class="text-grey-9" @click="show = true" v-else />
      </div>
    </div>
    <div class="col-3 text-right" v-if="show || !showButton">
      <q-btn v-if="!edit" 
        :label="$t('common.edit')" color="primary" 
        outline  icon="edit" @click="$emit('openEdit')" 
        class="no-shadow q-ml-lg" size="sm" :disable="disableButton" />
      <q-btn v-if="edit" 
        :label="$t('common.save')" color="primary" 
        @click="$emit('onSave')" size="sm" 
        :disable="disableButton" />
      <q-btn v-if="edit" 
        :label="$t('common.cancel')" class="q-ml-md" 
        outline color="primary" @click="$emit('closeEdit')"
        size="sm" />
    </div>
  </div>
  <template v-if="show">
    <slot></slot>
  </template>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  name: 'EditViewComponent',
  props: {
    edit: {
      type: Boolean,
      required: true
    },
    label: {
      type: String
    },
    showButton: {
      type: Boolean,
      default: true
    },
    disableButton: {
      type: Boolean
    }
  },
  emits:{
    openEdit: null,
    closeEdit: null,
    onSave: null
  },
  setup() {
    const show = ref(false)
    return {
      show
    }
  },
}
</script>

<style>

</style>
