<template>
  <div class="flex">
    <q-btn-toggle
      flat
      :color="admin ? 'accent' : 'black'"
      toggle-color="primary"
      v-model='locale'
      :options="localeOptions"
    />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar'
import { watch } from 'vue';

defineProps<{
  admin?: boolean
}>()
const $q = useQuasar();

const { locale } = useI18n({ useScope: 'global' });
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
]

watch(locale, val => {
  const langKey = val === 'ja-JP'?'ja':'en-US'
  import(
    /* webpackInclude: /(ja|en-US)\.js$/ */
    'quasar/lang/' + langKey 
    ).then(lang => {
      $q.lang.set(lang.default)
    })
}, {immediate: true})

</script>
