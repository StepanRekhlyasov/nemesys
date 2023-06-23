<template>
  <DropDownEditGroup
		:isEdit="edit.includes('jobSearchInfo')"
		:label="$t('applicant.list.fixEmployment.jobSearchInfo')"
		@openEdit="emit('openEdit');resetData();"
		@closeEdit="emit('closeEdit');resetData();"
		@onSave="saveHandler()"
		:isDisabledButton="disableLevel < 1">

		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.status')" 
				:value="fixData.inspectionStatus? 'OK' : 'NG' " valueClass="text-uppercase col-3 q-pl-md">
				<q-checkbox v-model="data['inspectionStatus']" label="OK" @click="data['inspectionDate'] = '';emit('disableChange')" 
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
				<q-checkbox v-model="data['inspectionStatus']" label="NG" class="q-ml-sm" @click="emit('disableChange')" 
          unchecked-icon="mdi-checkbox-intermediate" checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
			</labelField>
			
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.date')" :value="fixData.inspectionDate">                
				<q-input dense outlined bg-color="white" v-model="data['inspectionDate']"  :disable="loading || disableLevel < 1">
					<template v-slot:prepend>
						<q-icon name="event" class="cursor-pointer">
							<q-popup-proxy cover transition-show="scale" transition-hide="scale">
								<q-date v-model="data['inspectionDate']" mask="YYYY/MM/DD">
									<div class="row items-center justify-end">
										<q-btn v-close-popup label="Close" color="primary" flat />
									</div>
								</q-date>
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>
			</labelField>
		</div>
		<div class="row q-pb-sm" v-if="!data['inspectionStatus']">
			<NGReasonSelect
        :value="data[reasonKey]?$t('applicant.list.fixEmployment.' + data[reasonKey]) + (data[detailKey]?' (' + $t('applicant.list.fixEmployment.' + data[detailKey])+ ')':''):''"
        :edit="edit.includes(tabKey)" 
        :label="$t('applicant.list.fixEmployment.'+reasonKey)"
        :reasonValue="data[reasonKey]"
        @update:reasonValue="(newValue : string) => data[reasonKey] = newValue"
        :detailedValue="data[detailKey]"
        @update:detailedValue="(newValue : string) => data[detailKey] = newValue"
        :disable="loading"
        :hightlightError="hightlightError"
      />
		</div>

		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" 
				:label="$t('applicant.list.fixEmployment.inspection.chargeOfFacility')" 
				:value="fixData.chargeOfFacility">
				<q-input v-if="edit" dense outlined bg-color="white"
					v-model="data['chargeOfFacility']" :disable="loading || disableLevel < 1" />
			</labelField>              
			
			<labelField :edit="edit.includes('jobSearchInfo')" 
				:label="$t('applicant.list.fixEmployment.inspection.jobTitle')" 
				:value="fixData.jobTitle">
				<q-input dense outlined bg-color="white"
					v-model="data['jobTitle']" :disable="loading || disableLevel < 1" />
			</labelField>
		</div>

		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.contact')" 
				:value="fixData['contact']">
          	<q-input dense outlined bg-color="white"
					v-model="data['contact']" :disable="loading || disableLevel < 1" />
			</labelField>
			<labelField
				:edit="edit.includes('jobSearchInfo')"
				:label="$t('applicant.list.fixEmployment.inspection.comments')"
				:value="fixData.comments">
				<q-input dense outlined bg-color="white"
					v-model="data['comments']" :disable="loading || disableLevel < 1" />
			</labelField>
		</div>

		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.notes')" 
				:value="fixData.inspectionMemo" valueClass="col-9 q-pl-md">
				<q-input dense outlined bg-color="white"
					v-model="data['inspectionMemo']" :disable="loading || disableLevel < 1" />
			</labelField>
		</div>
	</DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import NGReasonSelect from 'src/components/inputs/NGReasonSelect.vue';

import { ApplicantFix, FixJobSearchInfo, selectOptions } from 'src/shared/model';
import { ref, watch } from 'vue';
import { useNGWatchers, useSaveHandler } from '../../const/fixMethods';



const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])

const data = ref<Partial<FixJobSearchInfo>>({});

/** NGReasonSelect handlers */
const reasonKey = 'inspectionReasonNG' /** change reason key */
const detailKey = 'inspectionReasonNGDetail' /** change reason detail key */
const tabKey = 'jobSearchInfo' /** change tab key */
const statusKey = 'inspectionStatus' /** change status key */
const hightlightError = ref<string[]>([])
const saveHandler = () => {
  if(useSaveHandler(data, hightlightError, reasonKey, detailKey, statusKey)){
    emit('save', tabKey, data.value);
    resetData();
  }
}
useNGWatchers(data, hightlightError, reasonKey, detailKey, statusKey)

resetData();
function resetData() {
	data.value = {
		inspectionStatus: props.editData['inspectionStatus'] || false,
		inspectionDate: props.editData['inspectionDate'] || '',
		inspectionReasonNG: props.editData['inspectionReasonNG'] || '',
		inspectionReasonNGDetail: props.editData['inspectionReasonNGDetail'] || '',
		chargeOfFacility: props.editData['chargeOfFacility'] || '',
		jobTitle: props.editData['jobTitle'] || '',
		contact: props.editData['contact'] || '',
		comments: props.editData['comments'] || '',
		inspectionMemo: props.editData['inspectionMemo'] || '',
	}
}

watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 
</script>

<style>

</style>