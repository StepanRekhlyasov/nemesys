<template>
  <q-card-section class=" q-pa-none">
    <q-table
      :columns="BackOrderStaff"
      :rows="StaffList"
      row-key="id"
      class="no-shadow"
      table-class="text-grey-8"
      table-header-class="text-grey-9"
      v-model:pagination="pagination"
      hide-pagination>
    </q-table>
  </q-card-section>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { ref } from 'vue';
import { BackOrderStaff } from '../../consts/BackOrder.const';

const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10
	// rowsNumber: xx if getting data from a server
});
defineProps<{
  bo: BackOrderModel
}>();
const StaffList = ref([]);

</script>

<style>

</style>