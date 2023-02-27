<template>
  <q-btn v-if="props.clear" size="sm" class="button clear text-weight-bold" :label="t(labelKey)" :no-wrap="true"
    unelevated v-bind="$attrs" />
  <q-btn v-else size="sm" class="button text-weight-bold" :label="t(labelKey)" :no-wrap="true" unelevated v-bind="$attrs"
    :color="defaultColor" />
</template>

<script setup lang="ts">
import { QBtnProps } from 'quasar';
import { LocalizationKeys } from 'src/shared/types/LocalizationKeys';
import { useI18n } from 'vue-i18n';

interface DefaultButtonProps extends QBtnProps {
  labelKey: LocalizationKeys;
  clear?: boolean;
}

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<DefaultButtonProps>()

const defaultColor = props.color ?? 'accent'

</script>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.button {
  margin-left: 10px;
  height: 28px;
  border-radius: 4px;
}

.clear {
  border: 1px solid $clear-button-border;
  background-color: $grey-11;
  color: $accent;
}
</style>
