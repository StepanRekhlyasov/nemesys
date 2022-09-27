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
    @update:model-value="setLang"
  >
  </q-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LanguageSwitcher',
  setup() {
    const q = useQuasar();
    const { locale } = useI18n({ useScope: 'global' });

    const setLang = () => {
      q.localStorage.set('lang', locale.value)
    };

    return {
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'ja-JP', label: '日本語' },
      ],

      setLang,
    };
  },
});
</script>
