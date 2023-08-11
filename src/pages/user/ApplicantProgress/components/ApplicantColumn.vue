<template>
  <div class='column progressColumn'>
    <div class='flex q-mx-xs items-center text-bold text-primary q-mx-auto'>
      <span class='text-h5 text-bolder'>●</span><router-link :to="'/applicant-progress/'+link" :class="{'disable-link':loading}" class="applicant-link">{{ $t(column.label) }} </router-link>
    </div>
    <div class='row column bg-white q-py-sm items-start progressColumn__whiteBg'>
      <template v-if="ApplicantOrFixColumn[column.status]==='applicants'">
        <ApplicantCard v-for='item in column.items' :key='item.id' :item="(item as Applicant)" @select-applicant="(applicant)=>{emit('selectApplicant', applicant)}"/>
      </template>
      <template v-else>
        <ApplicantFixesCard v-for='item in column.items' :status="(column.status as ApplicantStatus)" :key='item.id' :fix="(item as ApplicantFix)" @select-applicant="(applicant)=>{emit('selectApplicant', applicant)}"/>
      </template>
      <q-spinner
        color="primary"
        size="1em"
        class="full-width"
        v-if="loading"
      />
      <q-btn class="full-width" @click="emit('showMore', column.status)" v-else-if="continueFromDoc">
        {{ $t('common.more') }}
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ApplicantCol } from 'src/pages/user/Applicant/types/applicant.types';
import { useApplicant } from 'src/stores/applicant';
import { computed } from 'vue';
import ApplicantCard from './ApplicantCard.vue'
import { Applicant, ApplicantFix, ApplicantStatus } from 'src/shared/model';
import ApplicantFixesCard from './ApplicantFixesCard.vue';
import { ApplicantOrFixColumn } from 'src/shared/constants/Applicant.const';

const emit = defineEmits<{
  (e: 'showMore', status: string),
  (e: 'selectApplicant', applicant : Applicant)
}>()


const props = defineProps<{
  column: ApplicantCol,
  loading: boolean,
}>()

const link = props.column.status.replaceAll('_','-').toLowerCase()
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
.progressColumn__whiteBg{
  border-radius: 10px;
  padding-left: 3px;
  padding-right: 3px;
}
.disable-link{
  pointer-events: none;
}
.progressColumn{
  min-width: 140px;
  width: 100%;
}
</style>
