<template>
  <table class="popup-table">
    <thead>
      <tr>
        <th class="header bg-grey">{{$t('applicant.attendant.items')}}</th>
        <th class="header bg-blue text-white">{{$t('common.desiredBo')}}</th>
        <th class="header bg-red text-white">{{$t('common.desiredCondition')}}</th>
        <th class="header bg-yellow text-white">{{$t('applicant.list.accuracy')}}</th>
      </tr>
    </thead>
    <tbody>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.attendant.daysToWork')}}</td>
        <td>{{ props.bo.daysPerWeekList?getNumberFromString(props.bo.daysPerWeekList):'-' }}</td>
        <td>{{ props.staff.daysToWork?props.staff.daysToWork:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].daysToWork.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.attendant.daysPerWeek')}}</td>
        <td>
          <table class="sub-table">
            <tr>
              <th>{{$t('weekDay.monday')}}</th>
              <td>{{props.bo.working_days_week?props.bo.working_days_week.includes('monday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.tuesday')}}</th>
              <td>{{props.bo.working_days_week? props.bo.working_days_week.includes('tuesday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.wednesday')}}</th>
              <td>{{props.bo.working_days_week?  props.bo.working_days_week.includes('wednesday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.thursday')}}</th>
              <td>{{ props.bo.working_days_week? props.bo.working_days_week.includes('thursday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.friday')}}</th>
              <td>{{ props.bo.working_days_week? props.bo.working_days_week.includes('friday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.saturday')}}</th>
              <td>{{ props.bo.working_days_week? props.bo.working_days_week.includes('saturday')?'△':'×':'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.sunday')}}</th>
              <td>{{ props.bo.working_days_week? props.bo.working_days_week.includes('sunday')?'△':'×':'-' }}</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sub-table">
            <tr>
              <th>{{$t('weekDay.monday')}}</th>
              <td>{{props.staff.daysPerWeek? props.staff.daysPerWeek.includes('monday')?'△':'×':'-'  }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.tuesday')}}</th>
              <td>{{props.staff.daysPerWeek? props.staff.daysPerWeek.includes('tuesday')?'△':'×':'-'  }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.wednesday')}}</th>
              <td>{{props.staff.daysPerWeek? props.staff.daysPerWeek.includes('wednesday')?'△':'×':'-'  }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.thursday')}}</th>
              <td>{{ props.staff.daysPerWeek?props.staff.daysPerWeek.includes('thursday')?'△':'×' :'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.friday')}}</th>
              <td>{{props.staff.daysPerWeek? props.staff.daysPerWeek.includes('friday')?'△':'×' :'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.saturday')}}</th>
              <td>{{ props.staff.daysPerWeek?props.staff.daysPerWeek.includes('saturday')?'△':'×' :'-' }}</td>
            </tr>
            <tr>
              <th>{{$t('weekDay.sunday')}}</th>
              <td>{{props.staff.daysPerWeek? props.staff.daysPerWeek.includes('sunday')?'△':'×':'-'  }}</td>
            </tr>
          </table>
        </td>
        <td>{{ props.matchedData[props.staff.id].daysPerWeek.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.list.shift')}}</td>
        <td>
          <table class="sub-table">
            <tr>
              <th>{{$t('applicant.shift.workinghoursearly')}}</th>
              <td>{{ props.bo.workingHoursEarly_min?'△':props.bo.workingHoursEarly_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghoursday')}}</th>
              <td>{{ props.bo.workingHoursDay_min?'△':props.bo.workingHoursDay_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghourslate')}}</th>
              <td>{{ props.bo.workingHoursLate_min?'△':props.bo.workingHoursLate_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghoursnight')}}</th>
              <td>{{ props.bo.workingHoursNight_min?'△':props.bo.workingHoursNight_max?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sub-table">
            <tr>
              <th>{{$t('applicant.shift.workinghoursearly')}}</th>
              <td>{{ props.staff.workingHoursEarly===true || props.staff.workingHoursEarly==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghoursday')}}</th>
              <td>{{ props.staff.workingHoursDay===true || props.staff.workingHoursDay==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghourslate')}}</th>
              <td>{{ props.staff.workingHoursLate===true || props.staff.workingHoursLate==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>{{$t('applicant.shift.workinghoursnight')}}</th>
              <td>{{ props.staff.workingHoursNight===true || props.staff.workingHoursNight==='△'?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>{{ props.matchedData[props.staff.id].workingHours.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.list.commutesDisatnce')}}</td>
        <td>{{ props.staff.distanceBusiness }}Km</td>
        <td>{{ props.staff.commutingTime?props.matchedData[props.staff.id].commuteDistance.label+'Km':'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].commuteDistance.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.list.yearsExperience')}}</td>
        <td>{{ props.bo.experience_req?props.bo.experience_req + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.staff.totalYear?props.staff.totalYear + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].expReq.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('common.age')}}</td>
        <td>{{ props.bo.upperAgeLimit?props.bo.upperAgeLimit + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.staff.dob?props.matchedData[props.staff.id].agePercent.label + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].agePercent.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">{{$t('applicant.list.qualification')}}</td>
        <td>{{props.bo.qualifications && props.bo.qualifications.length? props.bo.qualifications.map(q => $t('applicant.qualification.' + q)).join(', '):'-' }}</td>
        <td>{{props.staff.qualification && props.staff.qualification.length? props.staff.qualification.map(q => $t('applicant.qualification.' + q)).join(', '):'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].qualification.value }}%</td>
      </tr>

    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { DocumentData } from 'firebase/firestore';
import { useBackOrder } from 'src/stores/backOrder';

const props = defineProps<{
  bo: DocumentData,
  staff,
  matchedData,
}>()

const backOrderStore = useBackOrder();

const getNumberFromString = (number) => {
  return backOrderStore.stringToNumber(number);
}

</script>


<style scoped>
.popup-table {
  border-collapse: collapse;
  width: 100%;
}

.popup-table th,
.popup-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

.popup-table th {
  font-weight: bold;
  white-space: nowrap;
}

.popup-table .header {
  background-color: #ccc;
}

.popup-table .bg-grey {
  background-color: #ccc;
}

.popup-table .bg-blue {
  background-color: blue;
}

.popup-table .bg-red {
  background-color: red;
}

.popup-table .bg-yellow {
  background-color: yellow;
}

.popup-table .text-white {
  color: white;
}
.sub-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}
.popup-table-container {
  margin: 0;
  padding: 0;
}

.popup-table {
  width: 100%;
  border-collapse: collapse;
}

.popup-table th,
.popup-table td {
  border: 1px solid #ccc;
}

.popup-table .sub-table {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: 100%;
}

.popup-table .sub-table th,
.popup-table .sub-table td {
  padding: 0.25rem;
  width: 100%;
  height: 100%;
}

.popup-table .sub-table td:first-child {
  padding-right: 1rem;
  width: 100%;
  height: 100%;
}
</style>
