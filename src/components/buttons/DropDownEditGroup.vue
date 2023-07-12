<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref, defineEmits, withDefaults } from 'vue'
import { BackOrderModel } from 'src/shared/model';

const show = ref(false)

const { t } = useI18n({ useScope: 'global' });

withDefaults(defineProps<{
    isEdit: boolean
    isLabelSquare?: boolean
    isButton?: boolean
    label?: string
    isDisabledButton?: boolean
    isWithoutCancel?: boolean
    theme?: string
    bo:BackOrderModel | null
}>(), {
  isButton: true,
  isDisabledButton: false,
  isLabelSquare: false,
  isWithoutCancel: false,
  theme: 'primary',
  bo:null
})

const emit = defineEmits<{
  (e: 'closeEdit'),
  (e: 'openEdit'),
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
        <div class="col-3 text-right" v-if="!bo && (show || !isButton)">
          <q-btn v-if="!isEdit"
            :label="t('common.edit')" :color="theme"
            outline  icon="edit" @click="emit('openEdit')"
            class="no-shadow q-ml-lg" size="sm" :disable="isDisabledButton" />
          <q-btn v-if="isEdit"
            :label="t('common.save')" :color="theme"
            @click="emit('onSave')" size="sm"
            :disable="isDisabledButton" />
          <q-btn v-if="(isEdit && !isWithoutCancel)"
            :label="t('common.cancel')" class="q-ml-md"
            outline :color="theme" @click="emit('closeEdit')"
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
