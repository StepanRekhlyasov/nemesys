<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineProps, defineEmits, withDefaults } from 'vue'
const show = ref(false)

const { t } = useI18n({ useScope: 'global' });

withDefaults(defineProps<{
    isEdit: boolean
    isLabelSquare: boolean
    isButton?: boolean
    label?: string
    isDisabledButton?: boolean
    theme?: string
}>(), {
  isButton: true,
  isDisabledButton: false,
  isLabelSquare: false,
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
        <div class="row items-center">
          <div class="row items-center">
            <div v-if="isLabelSquare" :class="`bg-${theme} square`"></div>
            <span :class="`text-${theme} subtitle`">{{ label }}</span>
          </div>
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
.subtitle {
  font-size: 1rem;
  font-weight: bold;
}

.square {
  height: 12px;
  width: 12px;
}
</style>