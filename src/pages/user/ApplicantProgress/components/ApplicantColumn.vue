<template>
  <div class='column ' style='width: 170px'>
    <div class='flex q-mx-xs items-center text-bold text-primary q-mx-auto'>
      <span class='text-h5'>●</span><router-link :to="'/applicant-progress/'+link" :class="{'disable-link':loading}" class="applicant-link">{{ $t(column.label, 'en') }} </router-link>
    </div>
    <div class='row column bg-white q-py-md q-px-xs  items-start'>
      <ApplicantCard v-for='item in column.items' :key='item.id' :item="item" @select-applicant="(applicant)=>{emit('selectApplicant', applicant)}"/>
      <q-spinner
        color="primary"
        size="1em"
        class="full-width"
        v-if="loading"
      />
      <q-btn class="full-width" @click="emit('showMore', column.status)" v-else-if="continueFromDoc">
        {{ $t('common.more', 'en') }}
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ApplicantCol } from '../types/applicant.types';
import { useApplicant } from 'src/stores/applicant';
import { computed } from 'vue';
import ApplicantCard from './ApplicantCard.vue'
import { Applicant } from 'src/shared/model';

const emit = defineEmits<{
  (e: 'showMore', status: string),
  (e: 'selectApplicant', applicant : Applicant)
}>()


const props = defineProps<{
  column: ApplicantCol,
  loading: boolean,
}>()

const link = props.column.status.replace(/_/g,'-').toLowerCase()
const applicantStore = useApplicant()
const continueFromDoc = computed(() => applicantStore.state.continueFromDoc[props.column.status]);
</script>
<style lang="scss">
.applicant-link{
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
.disable-link{
  pointer-events: none;
}
</style>
