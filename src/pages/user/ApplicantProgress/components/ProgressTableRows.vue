<template>
  <thead>
      <tr>
        <th @click="orderByFetch('staffRank')" class="clickable"><span :class="{asc: queryDirections.staffRank=='asc', desc: queryDirections.staffRank=='desc'}">▼</span></th>
        <th @click="orderByFetch('occupation')" class="clickable"><span :class="{asc: queryDirections.occupation=='asc', desc: queryDirections.occupation=='desc'}">▼</span></th>
        <th @click="orderByFetch('classification')" class="clickable"><span :class="{asc: queryDirections.classification=='asc', desc: queryDirections.classification=='desc'}">▼</span></th>
        <th>{{ $t('applicant.progress.table.fullName') }}</th>
        <th>{{ $t('applicant.progress.table.applicationDate') }}</th>
        <th>{{ $t('applicant.progress.table.nearestStation') }}</th>
        <th>{{ $t('applicant.progress.table.qualificationsExperience') }}</th>
        <th>{{ $t('applicant.progress.table.availableStartDate') }}</th>
        <th>{{ $t('applicant.progress.table.numberOfDays') }}</th>
        <th>{{ $t('applicant.progress.table.earlyShift') }}</th>
        <th>{{ $t('applicant.progress.table.dayShift') }}</th>
        <th>{{ $t('applicant.progress.table.lateShift') }}</th>
        <th>{{ $t('applicant.progress.table.nightShift') }}</th>
        <th>{{ $t('applicant.progress.table.remarks') }}</th>
        <th>{{ $t('applicant.progress.table.mon') }}</th>
        <th>{{ $t('applicant.progress.table.tue') }}</th>
        <th>{{ $t('applicant.progress.table.wed') }}</th>
        <th>{{ $t('applicant.progress.table.thu') }}</th>
        <th>{{ $t('applicant.progress.table.fri') }}</th>
        <th>{{ $t('applicant.progress.table.sat') }}</th>
        <th>{{ $t('applicant.progress.table.sun') }}</th>
        <th>{{ $t('applicant.progress.table.holiday') }}</th>
        <th>{{ $t('applicant.progress.table.memo') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="applicant in applicants" :key="applicant.id">
        <td>{{ RankCount.getRank(applicant.staffRank) }}</td>
        <td>{{ applicant.occupation && $t('applicant.add.' + applicant.occupation) }}</td>
        <td>{{ applicant.classification && $t('applicant.list.info.classification.' + applicant.classification) }}</td>
        <td 
          @click="()=>{
            emit('openDrawer', applicant)
          }" 
          class="applicant-clickable"
        >{{ applicant.name }}</td>
        <td>{{dayMonthFromDate(applicant.applicationDate)}}</td>
        <td>{{ applicant.nearestStation }}</td>
        <td><p v-for="q, index in applicant.qualification" :key="index" style="margin:0;">{{ q }}</p></td>
        <td>{{ timestampToDateFormat(applicant.timeToWork) }}</td>
        <td>{{ applicant.daysToWork }}</td>
        <td>{{ applicant.workingHoursEarly?'●':'-' }}</td>
        <td>{{ applicant.workingHoursDay?'●':'-' }}</td>
        <td>{{ applicant.workingHoursLate?'●':'-' }}</td>
        <td>{{ applicant.workingHoursNight?'●':'-' }}</td>
        <td>{{ applicant.shiftRemarks }}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='monday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='tuesday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='wednesday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='thursday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='friday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='saturday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='sunday')?'●':'-'}}</td>
        <td>{{ applicant.daysPerWeek?.find?.((row)=>row==='holiday')?'●':'-'}}</td>
        <td>{{ applicant.memo }}</td>
      </tr>
    </tbody>
</template>
<script setup lang="ts">
import { Applicant } from 'src/shared/model';
import { dayMonthFromDate, timestampToDateFormat } from 'src/shared/utils/utils';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { QueryOrderByConstraint, orderBy } from 'firebase/firestore';
import { ref } from 'vue';

const queryDirections = ref({
  staffRank: null,
  occupation: null,
  classification: null
})
const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant)
  (e: 'sortQuery', orderBy: QueryOrderByConstraint[])
}>()
defineProps<{
  applicants: Applicant[]
}>()
const orderByFetch = (param : string) => {
  if(!queryDirections.value[param]){
    queryDirections.value[param] = 'desc'
  }else if(queryDirections.value[param] == 'desc'){
    queryDirections.value[param] = 'asc'
  } else if (queryDirections.value[param] == 'asc') {
    queryDirections.value[param] = null
  }

  const orderBys :QueryOrderByConstraint[] = []
  if(queryDirections.value.staffRank) {
    orderBys.push(orderBy('staffRank', queryDirections.value.staffRank))
  }
  if(queryDirections.value.occupation) {
    orderBys.push(orderBy('occupation', queryDirections.value.occupation))
  }
  if(queryDirections.value.classification) {
    orderBys.push(orderBy('classification', queryDirections.value.classification))
  }
  emit('sortQuery', orderBys)
}
</script>
<style scoped lang="scss">
.clickable {
  cursor: pointer;
  span {
    transform: rotate(-90deg);
    display: block;
    &.asc {
      transform: rotate(-180deg);
    }
    &.desc {
      transform: rotate(0);
    }
  }
}
</style>