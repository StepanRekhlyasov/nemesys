<template>
  <q-markup-table :separator="'cell'" flat bordered style="overflow:hidden;">
    <q-inner-loading showing color="primary" v-if="loading"/>
    <UpdateTableRows v-if="status=='wait_termination'" :status="status" :applicants="applicants" @openDrawer="(applicant : Applicant)=>{emit('openDrawer', applicant)}"></UpdateTableRows>
    <ProgressTableRows v-else :status="status" :applicants="applicants" @openDrawer="(applicant : Applicant)=>{emit('openDrawer', applicant)}"></ProgressTableRows>
  </q-markup-table>
</template>
<script setup lang="ts">
import { Applicant } from 'src/shared/model';
import ProgressTableRows from './ProgressTableRows.vue';
import UpdateTableRows from './UpdateTableRows.vue';

defineProps<{
  applicants: Applicant[],
  loading: boolean,
  status: string
}>()
const emit = defineEmits<{
  (e: 'openDrawer', applicant: Applicant)
}>()

</script>
<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/imports/variables";
table{
  thead{
    background-color: $main-primary;
  }
  th{
    font-size: 15px;
    background-color: $main-primary;
    color: #fff;
    border-color: #fff!important;
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
</style>