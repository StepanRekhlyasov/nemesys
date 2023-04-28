<template>
  <div class='column ' style='width: 170px'>
    <div class='flex q-mx-xs items-center text-bold text-primary q-mx-auto'>
      <span class='text-h5'>●</span>{{ $t(column.label, 'en') }}
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
          <div class='col' v-if="item.prefecture">{{ $t('prefectures.'+item.prefecture) }}</div>
        </div>
        <div class='row q-gutter-sm items-center'>
          <div class='col-1'>応</div>
          <div class='col' v-if="item.applicationDate">{{ applicationDateFormat(item.applicationDate) }}</div>
        </div>
      </q-card>
      <q-spinner
        color="primary"
        size="1em"
        class="full-width"
        v-if="loading"
      />
      <q-btn class="full-width" @click="emit('showMore', column.status)" v-else-if="continueFromDoc">
        More
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { date } from 'quasar'
import { ApplicantCol } from '../types/applicant.types';
import { useApplicant } from 'src/stores/user/applicant';
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'showMore', status: string)
}>()

const applicationDateFormat = (myDate : string) => {
  const timeStamp = Date.parse(myDate)
  return date.formatDate(timeStamp, 'YYYY.MM.DD')
}
const props = defineProps<{
  column: ApplicantCol,
  loading: boolean,
}>()

const applicantStore = useApplicant()
const continueFromDoc = computed(() => applicantStore.state.continueFromDoc[props.column.status]);

</script>
