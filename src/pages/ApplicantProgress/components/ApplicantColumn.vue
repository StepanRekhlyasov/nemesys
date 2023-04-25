<template>
  <div class='column ' style='width: 170px'>
    <div class='flex q-mx-xs items-center text-bold text-primary'>
      <span class='text-h5'>●</span>{{ t(column.label, 'en') }}
    </div>
    <div class='row column bg-white q-py-md q-px-xs  items-start'>
      <q-card
        v-for='item in column.items'
        :key='item.id'
        bordered
        class='cursor-move q-mb-md text-caption full-width'
        square
        flat
        style='border: 1px solid #333; padding: 8px'
      >
        <div class='row q-gutter-sm items-center'>
          <span class='col-1'>S</span>
          <span class='col'>{{ item.name }}</span>
        </div>

        <div class='row q-gutter-md items-center'>
          <div class='col'>{{ item.occupation }}</div>
          <div class='col' v-if="item.prefecture">{{ t('prefectures.'+item.prefecture) }}</div>
        </div>
        <div class='row q-gutter-sm items-center'>
          <div class='col-1'>応</div>
          <div class='col' v-if="item.applicationDate">{{ applicationDate(item.applicationDate) }}</div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { date } from 'quasar'
import { ApplicantCol } from '../types/applicant.types';

const { t } = useI18n({ useScope: 'global' });

const applicationDate = (myDate : string) => {
  const timeStamp = Date.parse(myDate)
  return date.formatDate(timeStamp, 'YYYY.MM.DD')
}
defineProps<{
  column: ApplicantCol,
}>()


</script>
