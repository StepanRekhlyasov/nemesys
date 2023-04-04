<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, withDefaults } from 'vue'
const show = ref(false)

const { t } = useI18n({ useScope: 'global' });

withDefaults(defineProps<{
    isEdit: boolean
    isButton?: boolean
    label?: string
    isDisabledButton?: boolean
    theme?: string
}>(), {
  isButton: true,
  theme: 'primary'
})

const emit = defineEmits<{
  (e: 'openDropDown'),
  (e: 'closeDropDown'),
  (e: 'onSave')
}>()

</script>

<template>
    <div class="row justify-between">
        <div class="flex self-center">
          <span :class="`text-${theme} text-h6`">{{ label }}</span>
          <div v-if="isButton">
            <q-btn :label="t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
              class="text-grey-9" @click="show = false" v-if="show" />
            <q-btn :label="t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
              class="text-grey-9" @click="show = true" v-else />
          </div>
        </div>
        <div class="col-3 text-right" v-if="show || !isButton">
          <q-btn v-if="!isEdit" 
            :label="t('common.edit')" :color="theme" 
            outline  icon="edit" @click="emit('openDropDown')" 
            class="no-shadow q-ml-lg" size="sm" :disable="isDisabledButton" />
          <q-btn v-if="isEdit" 
            :label="t('common.save')" :color="theme" 
            @click="emit('onSave')" size="sm" 
            :disable="isDisabledButton" />
          <q-btn v-if="isEdit" 
            :label="t('common.cancel')" class="q-ml-md" 
            outline :color="theme" @click="emit('closeDropDown')"
            size="sm" />
        </div>
    </div>
    <template v-if="show">
        <slot></slot>
    </template>
</template>

<style lang="scss" scoped>

</style>