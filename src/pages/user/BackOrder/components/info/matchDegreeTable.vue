<template>
  <table class="popup-table">
    <thead>
      <tr>
        <th class="header bg-grey">items</th>
        <th class="header bg-blue text-white">BO</th>
        <th class="header bg-red text-white">desired</th>
        <th class="header bg-yellow text-white">accuracy</th>
      </tr>
    </thead>
    <tbody>

      <tr>
        <td class="item-cell bg-grey">Possible days week</td>
        <td>{{ props.bo.daysPerWeekList?props.bo.daysPerWeekList:'-' }}</td>
        <td>{{ props.staff.daysToWork?props.staff.daysToWork:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].daysToWork.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">Available Days</td>
        <td>
          <table class="sub-table">
            <tr>
              <td>Monday</td>
              <td>{{ props.bo.working_days_week.includes('monday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>{{ props.bo.working_days_week.includes('tuesday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>{{ props.bo.working_days_week.includes('wednesday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>{{ props.bo.working_days_week.includes('thursday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>{{ props.bo.working_days_week.includes('friday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>{{ props.bo.working_days_week.includes('saturday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>{{ props.bo.working_days_week.includes('sunday')?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sub-table">
            <tr>
              <td>Monday</td>
              <td>{{ props.staff.daysPerWeek.includes('monday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>{{ props.staff.daysPerWeek.includes('tuesday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>{{ props.staff.daysPerWeek.includes('wednesday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>{{ props.staff.daysPerWeek.includes('thursday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>{{ props.staff.daysPerWeek.includes('friday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>{{ props.staff.daysPerWeek.includes('saturday')?'△':'×' }}</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>{{ props.staff.daysPerWeek.includes('sunday')?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>{{ props.matchedData[props.staff.id].daysPerWeek.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">Shift</td>
        <td>
          <table class="sub-table">
            <tr>
              <th>Day</th>
              <td>{{ props.bo.workingHoursDay_min?'△':props.bo.workingHoursDay_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Early</th>
              <td>{{ props.bo.workingHoursEarly_min?'△':props.bo.workingHoursEarly_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Late</th>
              <td>{{ props.bo.workingHoursLate_min?'△':props.bo.workingHoursLate_max?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Night</th>
              <td>{{ props.bo.workingHoursNight_min?'△':props.bo.workingHoursNight_max?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>
          <table class="sub-table">
            <tr>
              <th>Day</th>
              <td>{{ props.staff.workingHoursDay===true || props.staff.workingHoursDay==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Early</th>
              <td>{{ props.staff.workingHoursEarly===true || props.staff.workingHoursEarly==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Late</th>
              <td>{{ props.staff.workingHoursLate===true || props.staff.workingHoursLate==='△'?'△':'×' }}</td>
            </tr>
            <tr>
              <th>Night</th>
              <td>{{ props.staff.workingHoursNight===true || props.staff.workingHoursNight==='△'?'△':'×' }}</td>
            </tr>
          </table>
        </td>
        <td>{{ props.matchedData[props.staff.id].workingHours.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">commute distance</td>
        <td>{{ props.staff.distanceBusiness }}Km</td>
        <td>-</td>
        <td>{{ props.matchedData[props.staff.id].commuteDistance.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">Experience required</td>
        <td>{{ props.bo.experience_req?props.bo.experience_req + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.staff.totalYear?props.staff.totalYear + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].expReq.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">Age</td>
        <td>{{ props.bo.upperAgeLimit?props.bo.upperAgeLimit + ` ${$t('common.year')}`:'-' }}</td>
        <td>{{ props.matchedData[props.staff.id].agePercent.label + ` ${$t('common.year')}` }}</td>
        <td>{{ props.matchedData[props.staff.id].agePercent.value }}%</td>
      </tr>

      <tr>
        <td class="item-cell bg-grey">Qualification</td>
        <td>{{ props.bo.qualifications }}</td>
        <td v-if="props.matchedData[staff.id].qualification==100">{{ props.bo.qualifications }}</td>
        <td v-else>{{ props.staff.qualification[0]}}</td>
        <td>{{ props.matchedData[props.staff.id].qualification.value }}%</td>
      </tr>

    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { DocumentData } from 'firebase/firestore';
import { BackOrderModel } from 'src/shared/model';

const props = defineProps<{
  bo: DocumentData,
  staff,
  matchedData,
}>()


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
