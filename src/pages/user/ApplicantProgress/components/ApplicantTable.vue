<template>
  <q-markup-table :separator="'cell'" flat bordered style="overflow:hidden;" class="applicantTable" :loading="loading">
    <UpdateTableRows 
      v-if="status=='wait_termination'" 
      :applicants="applicants" 
      @openDrawer="(applicant : Applicant)=>{emit('openDrawer', applicant)}"
      @onLoadingStart="()=>emit('onLoadingStart')"
      @onLoadingEnds="()=>emit('onLoadingEnd')"
    ></UpdateTableRows>
    <ProgressTableRows v-else :applicants="applicants" @openDrawer="(applicant : Applicant)=>{emit('openDrawer', applicant)}" @sortQuery="(param : QueryOrderByConstraint[])=>{emit('sortQuery', param)}"></ProgressTableRows>
  </q-markup-table>
  <q-linear-progress query v-if="loading" color="primary"/>
</template>
<script setup lang="ts">
import { Applicant } from 'src/shared/model';
import ProgressTableRows from './ProgressTableRows.vue';
import UpdateTableRows from './UpdateTableRows.vue';
import { QueryOrderByConstraint } from 'firebase/firestore';
import { ref } from 'vue'

defineProps<{
  applicants: Applicant[],
  loading: boolean,
  status: string
}>()
const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant),
  (e: 'sortQuery', param: QueryOrderByConstraint[]),
  (e: 'onLoadingStart'),
  (e: 'onLoadingEnd'),
}>()

</script>
<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
.applicantTable{
  table{
    thead{
      background-color: $main-primary;
    }
    th{
      font-size: 15px;
      background-color: $main-primary;
      color: #fff;
      border-color: #fff;
      padding: 0 3px;
      white-space: break-spaces;
    }
    td{
      text-align: center;
    }
  }
  .applicant-clickable{
    color: $primary;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
}
</style>