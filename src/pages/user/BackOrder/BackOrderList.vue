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
					:columns="BackOrderColumns"
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
							<div> {{ props.row.qualifications? $t(`applicant.add.${props.row.qualifications}`): '-'}} </div>
							<div> {{ props.row.transactionType? $t(`backOrder.${props.row.transactionType}`): '-' }} </div>
						</q-td>
					</template>

					<template v-slot:body-cell-employmentType="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row.status? $t(`client.backOrder.${props.row.status}`): '-'}} </div>
						</q-td>
					</template>

					<template v-slot:body-cell-info="props">
						<q-td :props="props" class="q-pa-none" >
							<q-btn icon="mdi-information-outline" round style="color: #175680" flat
								@click="showDialog(props.row)" />
						</q-td>
					</template>
				</q-table>
			</q-card-section>
		</q-card>
	</div>
  <q-drawer
		v-model="drawerRight" 
		v-if="selectedBo" show class="bg-grey-3" :width="1000" :breakpoint="500" side="right" overlay elevated
    bordered>
		<InfoBO :selectedBo="selectedBo" @closeDialog="drawerRight=false;selectedBo=undefined;showSearchByMap=false" @openSearchByMap="showSearchByMap=true" @passClientToMapSearch="(clientValue)=>{
      selectedClient = clientValue
    }"/>
	</q-drawer>
  <SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="showSearchByMap=false"></SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { BackOrderModel, Client } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { ref } from 'vue';
import { BackOrderColumns } from 'src/pages/user/BackOrder/consts/BackOrder.const';
import InfoBO from './components/info/InfoBO.vue';
import SearchByMapDrawer from './components/info/searchByMapDrawer.vue'

const backOrderStore = useBackOrder();
const state = backOrderStore.state;

const showSearchByMap = ref(false)
const selected = ref<BackOrderModel[]>([])
const drawerRight = ref(false);
const selectedBo = ref<BackOrderModel | undefined>()
const selectedClient = ref<Client | undefined>(undefined);
const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10
	// rowsNumber: xx if getting data from a server
});

function showDialog(bo: BackOrderModel){
	selectedBo.value = bo;
	drawerRight.value = true;
}

backOrderStore.loadBackOrder()

</script>