<template>
  <DropDownEditGroup
		:isEdit="edit.includes('jobSearchInfo')"
		:label="$t('applicant.list.fixEmployment.jobSearchInfo')"
		@openEdit="emit('openEdit');resetData();"
		@closeEdit="emit('closeEdit');resetData();"
		@onSave="emit('save', 'jobSearchInfo', data)"
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
		
		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.userInChargeVisit')" 
				:value="usersListOption
					.filter(user => user.value === fixData['visit'])
					.map(user => user.label).join('')">
					<q-select
						v-model="data['visit']"
						:disable="loading || disableLevel < 1"
						emit-value map-options dense outlined
						:options="usersListOption" :label="$t('common.pleaseSelect')" />
			</labelField>
		</div>
		
		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.visitRecotd')" 
					:value="visitRecotd" valueClass="text-uppercase col-9 q-pl-md">
					<div class="row">
						<div class="col-4">
							<span class="text-blue text-weight-regular">{{ $t('applicant.list.fixEmployment.personalStatus') }}</span>
							<q-checkbox v-model="data['personalStatus']" label="OK" checked-icon="mdi-checkbox-intermediate" 
								unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
							<q-checkbox v-model="data['personalStatus']" label="NG" class="q-ml-sm" unchecked-icon="mdi-checkbox-intermediate" 
								checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
						</div>
						<div class="col-4">
							<span class="text-blue text-weight-regular">{{ $t('applicant.list.fixEmployment.corporationStatus') }}</span>
							<q-checkbox v-model="data['corporationStatus']" label="OK" checked-icon="mdi-checkbox-intermediate" 
								unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
							<q-checkbox v-model="data['corporationStatus']" label="NG" class="q-ml-sm" unchecked-icon="mdi-checkbox-intermediate" 
								checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
						</div>
						<div class="col-4">
							<span class="text-blue text-weight-regular">{{ $t('applicant.list.fixEmployment.businessStatus') }}</span>
							<q-checkbox v-model="data['businessStatus']" label="OK" checked-icon="mdi-checkbox-intermediate" 
								unchecked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
							<q-checkbox v-model="data['businessStatus']" label="NG" class="q-ml-sm" unchecked-icon="mdi-checkbox-intermediate" 
								checked-icon="mdi-checkbox-blank-outline" color="primary" :disable="disableLevel < 1"/>
						</div>

					</div>
				</labelField>
		</div>
		
		<div class="row q-pb-sm" v-if="!data['inspectionStatus']">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.reasonNG')" 
				:value="fixData.reasonNG" valueClass="col-9 q-pl-md">
				<div class="row">
						<div class="col-9 q-pl-md">
							<q-radio v-model="data['reasonNG']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')"/>
							<q-radio v-model="data['reasonNG']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" />
							<q-radio v-model="data['reasonNG']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" />
							<q-radio v-model="data['reasonNG']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm"/>
						</div>
						<div class="col-3">
							<q-select 
								v-if="data['reasonNG']" 
								v-model="data['reasonJobDetal']"
								:options="statusJobOptions"                        
								emit-value map-options dense outlined
								:label="$t('common.pleaseSelect')" 
							/>
						</div>
					</div>
			</labelField>
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
				:value="usersListOption
					.filter(user => user.value === fixData['contact'])
					.map(user => user.label).join('')">
          <q-select
            v-model="data['contact']"
            :disable="loading || disableLevel < 1"
            emit-value map-options dense outlined
            :options="usersListOption" :label="$t('common.pleaseSelect')" />
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
				:value="fixData.notesInspection" valueClass="col-9 q-pl-md">
				<q-input dense outlined bg-color="white"
					v-model="data['notesInspection']" :disable="loading || disableLevel < 1" />
			</labelField>
		</div>
	</DropDownEditGroup>
</template>

<script lang="ts" setup>
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import labelField from 'src/components/form/LabelField.vue';
import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

import { ApplicantFix, selectOptions } from 'src/shared/model';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])

const data = ref({});
const statusJobOptions = ref<selectOptions[]> ();

const visitRecotd = computed(() => {
	const personalStatus = props.fixData['personalStatus']? 'OK' : 'personalStatus' in props.fixData ? 'NG' : '-' 
	const corporationStatus = props.fixData['corporationStatus']? 'OK' : 'corporationStatus' in props.fixData ? 'NG' : '-' 
	const businessStatus = props.fixData['businessStatus']? 'OK' : 'businessStatus' in props.fixData ? 'NG' : '-' 
	return `${t('applicant.list.fixEmployment.personalStatus')} : ${personalStatus}  / 
	 ${t('applicant.list.fixEmployment.corporationStatus')} : ${corporationStatus}  /  
	 ${t('applicant.list.fixEmployment.businessStatus')} : ${businessStatus}`
})

resetData();

function resetData() {
	data.value = {
		inspectionStatus: props.editData['inspectionStatus'] || false,
		inspectionDate: props.editData['inspectionDate'] || '',
		visit: props.editData['visit'] || '',
		personalStatus: props.editData['personalStatus'] || false,
		corporationStatus: props.editData['corporationStatus'] || false,
		businessStatus: props.editData['businessStatus'] || false,
		reasonNG: props.editData['reasonNG'] || '',
		reasonJobDetal: props.editData['reasonJobDetal'] || '',
		chargeOfFacility: props.editData['chargeOfFacility'] || '',
		contact: props.editData['contact'] || '',
		jobTitle: props.editData['jobTitle'] || '',
		comments: props.editData['comments'] || '',
		notesInspection: props.editData['notesInspection'] || '',
	}
}

watch(() => [data.value['reasonNG']], () => {
  if ('inspectionStatus' in data.value && data.value['inspectionStatus'] == false) {
		switch(data.value['reasonNG']){
			case('notApplicable'):
				statusJobOptions.value = notApplicableFixList;
			break;
			case('decided'):
				statusJobOptions.value = decidedFixList;
			break;
			case('notCovered'):
				statusJobOptions.value = [];
			break;
			case('registrationDeclined'):
				statusJobOptions.value = registrationDeclinedFixList;
			break;
		}
		data.value['reasonJobDetal'] = '';
  }
}, {deep: true, immediate: true})

watch(
  () => [props.editData, props.fixData],
  () =>{
    resetData();
  }, {deep: true, immediate: true}
) 
</script>

<style>

</style>