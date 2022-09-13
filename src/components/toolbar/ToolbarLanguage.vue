<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    dense
    borderless
    emit-value
    map-options
    options-dense


    popup-content-class="text-grey-8"
  >
  </q-select>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Language Switcher',
  setup () {
    const { locale } = useI18n({ useScope: 'global' })

    return {
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'ja-JP', label: '日本語' }
      ]
    }
  }
});
</script>
