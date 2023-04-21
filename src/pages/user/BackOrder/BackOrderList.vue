<template>
	<div class="row no-shadow full-height new">
		<q-card class="no-shadow full-width bg-grey-1">
			<q-card-section class="bg-grey-3">
				<div class="text-h6 text-primary">{{ $t('menu.backOrderSearch') }}</div>
			</q-card-section>

			<q-separator color="white" size="2px" />

			<q-card-section class="bg-grey-3">
				<div class="text-subtitle2">検索条件 / エリア：東京都全域,　詳細条件：…</div>
				<div class="row q-mt-xs justify-between" >
					<q-btn :label="$t('backOrder.changeSearchCriteria')" color="primary" />
				</div>
			</q-card-section>
      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
				<q-table
					:columns="columns"
					:rows="state.BOList"
					row-key="id"
					selection="multiple"
					class="no-shadow"
					v-model:selected="selected"
					table-class="text-grey-8"
					table-header-class="text-grey-9"
					v-model:pagination="pagination"
					hide-pagination>

          <template v-slot:header-cell-dealType="props">
            <q-th :props="props" class="q-pa-none" >
              <div> {{ $t('backOrder.dealType') }} </div>
              <div> {{ $t('backOrder.transactionType') }} </div>
            </q-th>
          </template>

					<template v-slot:header-cell-name="props">
						<q-th :props="props" class="q-pa-none" >
							<div> {{ $t('backOrder.officeName') }} </div>
							<div> {{ $t('backOrder.clientName') }} </div>
						</q-th>
					</template>

					<template v-slot:body-cell-dealType="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row.qualifications? t(`applicant.add.${props.row.qualifications}`): '-'}} </div>
							<div> {{ props.row.transactionType? t(`backOrder.${props.row.transactionType}`): '-' }} </div>
						</q-td>
					</template>

					<template v-slot:body-cell-employmentType="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row.status? t(`client.backOrder.${props.row.status}`): '-'}} </div>
						</q-td>
					</template>
				</q-table>
			</q-card-section>
		</q-card>
	</div>
</template>

<script lang="ts" setup>
import { BackOrderModel } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const backOrderStore = useBackOrder();
const state = backOrderStore.state;

const selected = ref<BackOrderModel[]>([])
const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10
	// rowsNumber: xx if getting data from a server
});

const columns = computed(() => {
	return [
		{
			name: 'BOID',
			required: true,
			label: 'BOID',
			align: 'left',
			field: 'BOID',
			sortable: false,
		},
		{
			name: 'personnel',
			required: true,
			label: t('backOrder.personnel') ,
			field: 'personnel',
			align: 'left',
		},
		{
			name: 'registrationDate',
			required: true,
			label: t('backOrder.registrationDate') ,
			field: 'registrationDate',
			align: 'left',
		},
		{
			name: 'dealType',
			required: true,
			field: 'dealType',
			align: 'left',
		},
		{
			name: 'distance',
			required: true,
			label: t('backOrder.distance'),
			field: 'distance',
			align: 'left',
		},
		{
			name: 'name',
			field: 'name',
			align: 'left',
		},
		{
			name: 'employmentType',
			required: true,
			label: t('backOrder.employmentType'),
			field: 'employmentType',
			align: 'left',
		},
		{
			name: 'hourlyRate',
			required: true,
			label: t('backOrder.hourlyRate'),
			field: 'hourlyRate',
			align: 'left',
		},
		{
			name: 'monthlyWage',
			required: true,
			label: t('backOrder.monthlyWage'),
			field: 'monthlyWage',
			align: 'left',
		},
		{
			name: 'state',
			required: true,
			label: t('backOrder.state'),
			field: 'state',
			align: 'left',
		},
	];
});

backOrderStore.loadBackOrder()

</script>

<style>

</style>