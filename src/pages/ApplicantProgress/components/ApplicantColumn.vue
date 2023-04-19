<template>
  <div class='column' style='width: 170px'>
    <div class='flex q-mx-xs items-center text-bold text-primary'>
      <span class='text-h5'>●</span>{{ column.label }}
    </div>

    <div class='row column bg-white q-py-md q-px-xs'>
      <q-card
        v-for='item in column.items'
        :key='item.id'
        bordered
        class='cursor-move q-mb-md text-caption'
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
          <div class='col'>{{ item.prefecture }}</div>
        </div>
        <div class='row q-gutter-sm items-center'>
          <div class='col-1'>応</div>
          <div class='col'>{{ item.applicationDate }}</div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
//import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
import { ApplicantCol } from '../types/applicant.types';

const props = defineProps<{
  column: ApplicantCol,
  columns: Array,

}>()


watch(() => props.column, (column)=>{
    console.log(column)
  })


</script>
