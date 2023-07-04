<template>
  <div class='column ' style='width: 170px'>
    <div class='flex q-mx-xs items-center text-bold text-primary q-mx-auto'>
      <span class='text-h5'>●</span><router-link :to="'/applicant-progress/'+link" :class="{'disable-link':loading}" class="applicant-link">{{ $t(label) }} </router-link>
    </div>
    <div class='row column bg-white q-py-md q-px-xs  items-start'>
      <ApplicantFixesCard v-for='fix in sortedFixes' :key='fix.id' :fix="fix" @select-applicant="(applicant)=>{emit('selectApplicant', applicant)}" :status="status"/>
      <q-spinner
        color="primary"
        size="1em"
        class="full-width"
        v-if="loading"
      />
      <q-btn class="full-width" @click="emit('showMore', status)" v-else-if="continueFromDoc">
        {{ $t('common.more') }}
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useApplicant } from 'src/stores/applicant';
import { computed } from 'vue';
import { Applicant, ApplicantFix, ApplicantStatus } from 'src/shared/model';
import ApplicantFixesCard from './ApplicantFixesCard.vue';
import { applicantStatusDates } from 'src/shared/constants/Applicant.const';

const emit = defineEmits<{
  (e: 'showMore', status: string),
  (e: 'selectApplicant', applicant : Applicant)
}>()

const applicantStore = useApplicant()
const props = defineProps<{
  status: ApplicantStatus,
  label: string,
  loading: boolean,
  fixes: ApplicantFix[]
}>()
const sortedFixes = computed(()=>{
  const field = applicantStatusDates[props.status]
  const result = props.fixes
  result.sort((a, b)=>{
    return a[field] > b[field] ? 1 : -1
  })
  return result
})

const link = props.status.replace(/_/g,'-').toLowerCase()
const continueFromDoc = computed(() => applicantStore.state.continueFromDoc[props.status]);

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
