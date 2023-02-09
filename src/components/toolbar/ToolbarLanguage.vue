<template>
  <div class="flex">
    <q-btn-toggle
      flat
      color="black"
      toggle-color="primary"
      v-model='locale'
      @input="setLang"
      :options="localeOptions"
    />
  </div>
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
      q.lang.set(q.lang)
    };

    return {
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'ja-JP', label: '日本語' },
      ],
      locale,

      setLang,
    };
  },
});
</script>

<style lang="scss">
.toolbarLanguage-item{

}
</style>
