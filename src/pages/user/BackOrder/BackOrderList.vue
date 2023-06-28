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
					<q-btn :label="$t('backOrder.addBO')" color="primary" icon="mdi-plus" @click="addNewBo"/>
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

          <template v-slot:header-cell-caseType="props">
            <q-th :props="props" class="q-pa-none" >
              <div> {{ $t('backOrder.create.caseType') }} </div>
              <div> {{ $t('backOrder.transactionType') }} </div>
            </q-th>
          </template>

					<template v-slot:header-cell-name="props">
						<q-th :props="props" class="q-pa-none" >
							<div> {{ $t('backOrder.officeName') }} </div>
							<div> {{ $t('backOrder.clientName') }} </div>
						</q-th>
					</template>

					<template v-slot:body-cell-caseType="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row.caseType? $t(`applicant.add.${props.row.caseType}`): '-'}} </div>
							<div> {{ props.row.transactionType? $t(`client.backOrder.${props.row.transactionType}`): '-' }} </div>
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

					<template v-slot:body-cell-wage="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row.wage ? $t(`backOrder.create.${props.row.wage}`) : '-'}} </div>
						</q-td>
					</template>

					<template v-slot:body-cell-name="props">
						<q-td :props="props" class="q-pa-none" >
							<div> {{ props.row['client_id'] ? applicantStore.state.clientList.find(client => client.id === props.row['client_id'])?.name : ''}} </div>
							<div> {{ props.row['client_id'] && props.row['office_id'] ? 
									applicantStore.state.clientList.find(client => client.id === props.row['client_id'])?.office?.find(office => office.id === props.row['office_id'])?.name : 
								'' }} </div>
						</q-td>
					</template>
				</q-table>
			</q-card-section>
		</q-card>
	</div>
	<InfoBO ref="infoDrawer"  @openSearchByMap="showSearchByMap=true" @passClientToMapSearch="(clientValue)=>{
		selectedClient = clientValue
	}"/>
	<q-drawer
		v-model="cteateBoDrawer" :width="1000" :breakpoint="500" side="right" 
		overlay elevated bordered>
		<createBO :type="typeBoCreate" @close-dialog="cteateBoDrawer=false;"/>
	</q-drawer>
  <SearchByMapDrawer v-model="showSearchByMap" :selectedBo="selectedBo" :client="selectedClient" @close="showSearchByMap=false"></SearchByMapDrawer>
</template>

<script lang="ts" setup>
import { BackOrderModel, Client } from 'src/shared/model';
import { useBackOrder } from 'src/stores/backOrder';
import { Ref, ref } from 'vue';
import { BackOrderColumns } from 'src/pages/user/BackOrder/consts/BackOrder.const';
import InfoBO from './components/info/InfoBO.vue';
import SearchByMapDrawer from './components/info/searchByMapDrawer.vue';
import createBO from './components/create/createBO.vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useApplicant } from 'src/stores/applicant';

const backOrderStore = useBackOrder();
const applicantStore = useApplicant();
const $q = useQuasar();
const { t } = useI18n({ useScope: 'global' });
const state = backOrderStore.state;

const showSearchByMap = ref(false)
const selected = ref<BackOrderModel[]>([])
const cteateBoDrawer = ref(false);
const typeBoCreate:Ref<'referral' | 'dispatch'> = ref('referral')
const selectedBo = ref<BackOrderModel | undefined>();
const selectedClient = ref<Client | undefined>(undefined);
const infoDrawer = ref<InstanceType<typeof InfoBO> | null>(null);
const pagination = ref({
	sortBy: 'desc',
	descending: false,
	page: 1,
	rowsPerPage: 10
	// rowsNumber: xx if getting data from a server
});


function addNewBo() {
	$q.dialog({
		title: t('backOrder.selectBOType'),
		cancel: t('backOrder.type.dispatch'),
		ok: t('backOrder.type.referral')
	}).onOk(() => {
		typeBoCreate.value = 'referral';
		cteateBoDrawer.value = true;
	}).onCancel(() => {
		typeBoCreate.value = 'dispatch';
		cteateBoDrawer.value = true;
	})
}

function showDialog(bo: BackOrderModel){
  infoDrawer.value?.openDrawer(bo)
}

backOrderStore.loadBackOrder()

</script>