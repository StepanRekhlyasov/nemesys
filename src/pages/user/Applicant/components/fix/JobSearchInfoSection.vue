<template>
  <edit-view-component
		:edit="edit.includes('jobSearchInfo')"
		:label="$t('applicant.list.fixEmployment.jobSearchInfo')"
		@openEdit="emit('openEdit')"
		@closeEdit="emit('closeEdit')"
		@onSave="emit('save')"
		:disableButton="disableLevel < 1">

		<div class="row q-pb-sm">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.status')" :value="fixData.inspectionStatus">
				<q-radio v-model="data['inspectionStatus']" val="ok" label="OK" @click="data['inspectionDate'] = '';emit('disableChange')" :disable="disableLevel < 1"/>
				<q-radio v-model="data['inspectionStatus']" val="ng" label="NG" class="q-ml-sm" @click="emit('disableChange')" :disable="disableLevel < 1"/>
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
		
		<div class="row q-pb-sm" v-if="data['inspectionStatus'] == 'ng'">
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.reasonNG')" :value="fixData.reasonNG" valueClass="col-9">
				<div class="row">
						<div class="col-9">
							<q-radio v-model="data['reasonNG']" val="notApplicable" :label="$t('applicant.list.fixEmployment.notApplicable')" @click="changeJobStatus" />
							<q-radio v-model="data['reasonNG']" val="decided" :label="$t('applicant.list.fixEmployment.decided')" class="q-ml-sm" @click="changeJobStatus" />
							<q-radio v-model="data['reasonNG']" val="notCovered" :label="$t('applicant.list.fixEmployment.notCovered')" class="q-ml-sm" @click="changeJobStatus" />
							<q-radio v-model="data['reasonNG']" val="registrationDeclined" :label="$t('applicant.list.fixEmployment.registrationDeclined')" class="q-ml-sm" @click="changeJobStatus" />
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
					.filter(user => user.value === data['contact'])
					.map(user => user.label).join('')">
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
			<labelField :edit="edit.includes('jobSearchInfo')" :label="$t('applicant.list.fixEmployment.inspection.notes')" :value="fixData.notesInspection" valueClass="col-9">
				<q-input dense outlined bg-color="white"
					v-model="data['notesInspection']" :disable="loading || disableLevel < 1" />
			</labelField>
		</div>
	</edit-view-component>
</template>

<script lang="ts" setup>
import editViewComponent from 'src/components/editView.component.vue';
import labelField from 'src/components/form/LabelField.vue';
import { decidedFixList, notApplicableFixList, registrationDeclinedFixList } from 'src/shared/constants/Applicant.const';

import { ApplicantFix, selectOptions } from 'src/shared/model';
import { ref } from 'vue';



const props = defineProps<{
  loading: boolean,
  fixData: ApplicantFix,
  editData: object,
  usersListOption: selectOptions[],
  edit: string[],
	disableLevel: number
}>()
const emit = defineEmits(['save', 'disableChange', 'openEdit', 'closeEdit'])

const data = ref(props.editData)
const statusJobOptions = ref<selectOptions[]> ()


function changeJobStatus() {
	if (data.value['inspectionStatus'] && data.value['inspectionStatus'] == 'ng') {
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
}

</script>

<style>

</style>