<template>
  <q-card-section class="bg-white ">
    <div class="row q-pb-md">
      <div class="col-9">
        <q-btn @click="assignToBo" v-if="props.isHiddenDetails" class="bg-primary text-white" :label="$t('client.backOrder.assignToBo')"/>
      </div>
      <div class="col-3 text-right">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline icon="edit" @click="edit = true"
          class="no-shadow q-ml-lg" size="sm" />
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm" />
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="resetData()"
          size="sm" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.status')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4" :value="selectedBo['status'] ? $t(`backOrder.${selectedBo['status']}`) : ''">
        <q-radio v-for="key in BackOrderStatus" v-model="data['status']" :label="$t('backOrder.' + key)"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :val="key" :key="key"
          :disable="loading" class="q-pr-md" />
      </LabelField>
      <LabelField :label="$t('backOrder.create.customerRepresentative')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="`${selectedBo['customerRepresentative'] || ''}`">
        <q-input v-model="data['customerRepresentative']" outlined dense :disable="loading" type="text" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit"
        labelClass="q-pl-md col-2 self-center text-right" :valueClass="edit?'col-10 q-pl-md self-center':'col-4 q-pl-md self-center'" :value="Array.isArray(data['qualifications']) && !edit ? data['qualifications'].map((row) => $t('applicant.qualification.' + row)):''">
        <q-field v-model="data['qualifications']" borderless hide-bottom-space>
          <q-checkbox
            v-for="key in TypeQualifications"
            v-model="data['qualifications']"
            :label="$t('applicant.qualification.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"
          />
        </q-field>
      </LabelField>
      <LabelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="edit" :valueClass="edit?'col-10 q-pl-md self-center':'col-4 q-pl-md self-center'"
        :value="selectedBo['BOGenerationRoute'] ? $t(`backOrder.create.${selectedBo['BOGenerationRoute']}`) : ''"
        labelClass="q-pl-md col-2 self-center text-right">
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall"
          :disable="loading" />
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <!-- $t('backOrder.create.somethingNotQuestioned') -->
      <LabelField :label="$t('client.backOrder.experienceReq')" :edit="edit"
        :value="data['experienceReq'] ? data['experienceReq'] : ''"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-input v-model="data['experienceReq']" outlined dense :disable="loading" type="text"/>
      </LabelField>
      <LabelField :label="$t('client.backOrder.caseType')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['typeCase'] ? $t(`applicant.add.${selectedBo['typeCase']}`) : ''">
        <q-radio v-for="key in TypeOfCase" v-model="data['typeCase']" :label="$t('applicant.add.' + key)" :val="key"
          :key="key" :disable="loading" class="q-pr-md" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">

      <LabelField :label="$t('backOrder.create.experienceRemarks')" labelClass="q-pl-md col-2 text-right q-mt-sm"
        valueClass="q-pl-md col-4" :edit="edit" :value="selectedBo['experienceRemarks'] || ''" :autogrow="true">
        <q-input v-model="data['experienceRemarks']" outlined dense :disable="loading" type="textarea" autogrow />
      </LabelField>
      <LabelField :label="$t('client.backOrder.transactionType')" :edit="edit" labelClass="q-pl-md col-2 text-right q-mt-sm" :value="data.transactionType? $t(`client.backOrder.${data.transactionType}`):''"
        valueClass="q-pl-md col-4">
        <q-radio v-for="item in transactionTypeOptions" v-model="data.transactionType" :label="item.label"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :val="item.value" :key="item.value"
          :disable="loading" class="q-pr-md" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.request')" :edit="edit" labelClass="q-pl-md col-2 self-center text-right"
        valueClass="col-4 q-pl-md flex" :value="selectedBo['invoice'] ? selectedBo['invoice'] + ' ' + $t('common.yen') : ''">
        <q-input v-model="data['invoice']" outlined dense :disable="loading" hide-bottom-space @update:model-value="(value)=>{
          data['invoice'] = commaSeparatedNumber(value)
        }"/>
        <span class="self-center q-pl-md">{{ $t('common.yen') }}</span>
      </LabelField>

      <LabelField :label="$t('client.backOrder.upperAgeLimit')" :edit="edit"
        labelClass="q-pl-md col-2 self-center text-right" valueClass="col-4 q-pl-md flex"
        :value="selectedBo['upperAgeLimit'] ? selectedBo['upperAgeLimit'] + $t('common.ageShort') : ''">
        <q-input v-model="data['upperAgeLimit']" outlined dense :disable="loading" hide-bottom-space
          :rules="[creationRule]" />
        <span class="self-center q-pl-md">{{ $t('common.ageShort') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.payment')" :edit="edit" labelClass="q-pl-md col-2 q-pt-sm text-right"
        valueClass="col-4 q-pl-md flex" :value="data['payment'] ? `${data['payment']}  ${$t('common.yen')}` : ''">
        <q-input v-model="data['payment']" outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" @update:model-value="(value)=>{
          data['payment'] = commaSeparatedNumber(value)
        }"/>
        <span class="q-pl-md q-pt-sm">{{ $t('common.yen') }}</span>
      </LabelField>
      <LabelField :label="$t('backOrder.create.travelingExpenses')" :edit="edit"
        labelClass="q-pl-md col-2 text-right q-pt-sm" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['travelingExpenses'] || ''" :autogrow="true">
        <q-input v-model="data['travelingExpenses']" type="textarea" outlined dense :disable="loading" autogrow/>
      </LabelField>
    </div>

    <template v-if="!edit">
      <div class="row q-pb-sm">
        <LabelField :label="$t('backOrder.create.numberWorkingDays')" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" :valueClass="'col-4 q-pl-md self-center valueClass_flexyBoxy'"
          :value="selectedBo['daysPerWeekList'] ? $t('backOrder.daysPerWeek.' + data['daysPerWeekList']) : ''">
          <q-field v-model="data['daysPerWeekList']" borderless hide-bottom-space :rules="[creationRule]">
            <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading" :label="day.label" :val="day.value"
              v-model="data['daysPerWeekList']" />
          </q-field>
        </LabelField>
        <LabelField :label="`${$t('office.workingHours')}  ${$t('office.earlyShift')}`" :edit="edit"
        :valueClass="'col-4 q-pl-md self-center flex no-wrap'" labelClass="q-pl-md col-2 text-right self-center"
          :value="`${selectedBo['workingHoursEarly_min'] || ''} ~ ${selectedBo['workingHoursEarly_max'] || ''}`">
        </LabelField>
      </div>
      <div class="row q-pb-sm">
        <LabelField :label="$t('backOrder.create.workingDays')" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 self-center"
          :value="!edit && Array.isArray(selectedBo['workingDays']) ? selectedBo['workingDays'].map(day => $t('weekDay.' + day)).join(', ') : ''">
          <q-field v-model="data['workingDays']" borderless hide-bottom-space :rules="[creationArrayRule]">
            <q-checkbox
              v-model="data['workingDays']"
              v-for="day in daysList"
              :val="day.value"
              :disable="loading"
              :label="day.label"
              :key="day.value"
              @update:model-value="(val : string[])=>{
                if(val.length === 8){
                  everythingTrgger = true
                } else {
                  everythingTrgger = false
                }
              }"
            />
            <q-checkbox
              :disable="loading"
              v-model="everythingTrgger"
              :label="$t('common.everything')"
              @update:model-value="(val : boolean)=>{
                if(val){
                  data['workingDays'] = [ WorkingDaysWeek.Monday, WorkingDaysWeek.Tuesday, WorkingDaysWeek.Wednesday, WorkingDaysWeek.Thursday, WorkingDaysWeek.Friday, WorkingDaysWeek.Saturday, WorkingDaysWeek.Sunday, WorkingDaysWeek.Holiday ]
                } else {
                  data['workingDays'] = []
                }
              }"
            />
          </q-field>
        </LabelField>
        <LabelField :label="`${$t('office.workingHours')}  ${$t('office.dayShift')}`" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex self-center flex no-wrap items-center"
          :value="`${selectedBo['workingHoursDay_min'] || ''} ~ ${selectedBo['workingHoursDay_max'] || ''}`">
        </LabelField>
      </div>
    </template>
    <template v-else>
      <div class="row q-pb-sm">
        <LabelField :label="$t('backOrder.create.numberWorkingDays')" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" :valueClass="'col-10 q-pl-md self-center'"
          :value="selectedBo['daysPerWeekList'] ? $t('backOrder.daysPerWeek.' + data['daysPerWeekList']) : ''">
          <q-field v-model="data['daysPerWeekList']" borderless hide-bottom-space :rules="[creationRule]">
            <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading" :label="day.label" :val="day.value"
              v-model="data['daysPerWeekList']" />
          </q-field>
        </LabelField>
        <LabelField :label="$t('backOrder.create.workingDays')" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-10"
          :value="!edit && Array.isArray(selectedBo['workingDays']) ? selectedBo['workingDays'].map(day => $t('weekDay.' + day)).join(', ') : ''">
          <q-field v-model="data['workingDays']" borderless hide-bottom-space :rules="[creationArrayRule]">
            <q-checkbox
              v-model="data['workingDays']"
              v-for="day in daysList"
              :val="day.value"
              :disable="loading"
              :label="day.label"
              :key="day.value"
              @update:model-value="(val : string[])=>{
                if(val.length >= 7){
                  everythingTrgger = true
                } else {
                  everythingTrgger = false
                }
              }"
            />
            <q-checkbox
              :disable="loading"
              v-model="everythingTrgger"
              :label="$t('common.everything')"
              @update:model-value="(val : boolean)=>{
                if(val){
                  data['workingDays'] = [ WorkingDaysWeek.Monday, WorkingDaysWeek.Tuesday, WorkingDaysWeek.Wednesday, WorkingDaysWeek.Thursday, WorkingDaysWeek.Friday, WorkingDaysWeek.Saturday, WorkingDaysWeek.Sunday, WorkingDaysWeek.Holiday ]
                } else {
                  data['workingDays'] = []
                }
              }"
            />
          </q-field>
        </LabelField>
      </div>
      <div class="row q-pb-sm justify-end">
        <LabelField :label="`${$t('office.workingHours')}  ${$t('office.earlyShift')}`" :edit="edit"
        :valueClass="'col-4 q-pl-md self-center flex no-wrap'" labelClass="q-pl-md col-2 text-right self-center"
          :value="`${selectedBo['workingHoursEarly_min'] || ''} ~ ${selectedBo['workingHoursEarly_max'] || ''}`">
          <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_min']"
            :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data['workingHoursEarly_min']" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <span class="q-ma-sm flex-center text-no-wrap">{{ '~' }}</span>
          <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_max']"
            :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data['workingHoursEarly_max']" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </LabelField>
      </div>
      <div class="row q-pb-sm justify-end">
        <LabelField :label="`${$t('office.workingHours')}  ${$t('office.dayShift')}`" :edit="edit"
          labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex self-center flex no-wrap items-center"
          :value="`${selectedBo['workingHoursDay_min'] || ''} ~ ${selectedBo['workingHoursDay_max'] || ''}`">
          <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_min']"
            :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data['workingHoursDay_min']" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <span class="q-ma-sm flex-center text-no-wrap">{{ '~' }}</span>
          <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_max']"
            :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="data['workingHoursDay_max']" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </LabelField>
      </div>
    </template>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.shiftRemarks')" :edit="edit" :value="selectedBo['shiftRemarks'] || ''"
        labelClass="q-pl-md col-2 text-right q-pt-sm" valueClass="self-center q-pl-md col-4" :autogrow="true">
        <q-input dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.lateShift')}`" :edit="edit"
        valueClass="q-pl-md col-4 flex no-wrap q-pt-sm" labelClass="q-pl-md col-2 text-right q-pt-sm"
        :value="`${selectedBo['workingHoursLate_min'] || ''} ~ ${selectedBo['workingHoursLate_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_min']"
          :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center text-no-wrap">{{'~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_max']"
          :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('client.backOrder.businessContent')" :edit="edit" :value="selectedBo['work_content'] || ''"
        labelClass="q-pl-md col-2 text-right q-pt-sm" valueClass="q-pl-md col-4" :autogrow="true">
        <q-input dense outlined bg-color="white" v-model="data['work_content']" :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.nightShift')}`" :edit="edit"
        labelClass="q-pl-md col-2 text-right q-pt-sm" valueClass="q-pl-md col-4 flex no-wrap q-pt-sm"
        :value="`${selectedBo['workingHoursNight_min'] || ''} ~ ${selectedBo['workingHoursNight_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_min']"
          :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center text-no-wrap">{{'~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_max']"
          :rules="[(val) => val ? validateTime(val) : true]" hide-bottom-space>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </LabelField>
    </div>


    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.pickDrop')" :edit="edit"
        :value="selectedBo['pickDrop'] ? $t('common.yesShort') : $t('common.noShort')"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex items-center">
        <q-field borderless dense v-model="data['pickDrop']" :rules="[() => 'pickDrop' in data || '']" hide-bottom-space>
          <template v-slot:control>
            <q-toggle v-model="data['pickDrop']" :disable="loading" />
            <span class="q-ma-sm flex-center">{{ data['pickDrop'] ? $t('common.yesShort') : $t('common.noShort') }}</span>
          </template>
        </q-field>
      </LabelField>
      <LabelField :label="$t('backOrder.availabilityOnCallSupport')" :edit="edit"
        :value="data['onCallSupport'] ? $t('common.yesShort') : $t('common.noShort')"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-field borderless dense v-model="data['onCallSupport']" :rules="[() => 'onCallSupport' in data || '']"
          hide-bottom-space>
          <template v-slot:control>
            <q-toggle v-model="data['onCallSupport']" :disable="loading" />
            <span class="flex-center q-pr-md ">{{ data['onCallSupport'] ? $t('common.yesShort') : $t('common.noShort')
            }}</span>
          </template>
        </q-field>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.onCallRemarks')" :edit="edit"
        labelClass="q-pl-md col-2 text-right q-pt-sm" valueClass="q-pl-md col-4 row self-center"
        :value="selectedBo['onCallRemarks'] || ''" :autogrow="true">
        <q-input v-model="data['onCallRemarks']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

  </q-card-section>
  <q-card-section>
    <detalInfoTab :bo="selectedBo" @openSearchByMap="emit('openSearchByMap')" />
  </q-card-section>
</template>
<script lang="ts" setup>
import { BackOrderModel, BackOrderStatus, TypeOfCase, TypeQualifications, WorkingDaysWeek } from 'src/shared/model';
import { ComputedRef, computed, ref, watch } from 'vue';
import { DaysPerWeekList } from 'src/shared/constants/BackOrder.const';
import { useBackOrder } from 'src/stores/backOrder';
import LabelField from 'src/components/form/LabelField.vue';
import detalInfoTab from './detalInfoTab.vue';
import { creationRule, creationArrayRule } from 'src/components/handlers/rules';
import { validateTime } from 'src/shared/constants/Form.const';
import { daysList } from 'src/shared/constants/Applicant.const';
import { useApplicant } from 'src/stores/applicant';
import { serverTimestamp, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import { commaSeparatedNumber } from 'src/shared/utils/utils';

const { t } = useI18n({ useScope: 'global' });
const applicantStore = useApplicant()
const props = defineProps<{
  isHiddenDetails?: boolean,
}>()

const emit = defineEmits(['openSearchByMap']);
const everythingTrgger = ref(false)

const transactionTypeOptions = computed(()=>{
  if(selectedBo.value.type === 'dispatch') {
    return [
      {label: 'TTP', value: 'TTP'},
      {label: t('client.backOrder.dispatchEm'), value: 'dispatch'},
    ]
  }
  return [
    {label: 'TTP', value: 'TTP'},
    {label: t('client.backOrder.introduction'), value: 'introduction'},
  ]
})

const edit = ref(false);
const backOrderStore = useBackOrder();
const loading = ref(false)
const data = ref<BackOrderModel | ComputedRef>(computed(() => backOrderStore.state.selectedBo))
resetData()

function resetData() {
  data.value = JSON.parse(JSON.stringify({ ...backOrderStore.state?.selectedBo } as BackOrderModel))
  edit.value = false
}

if(!Array.isArray(data.value.workingDays)){
  data.value.workingDays = []
}

const selectedBo = computed(() => backOrderStore.state?.selectedBo as BackOrderModel)

async function save() {
  loading.value = true;
  try {
    await backOrderStore.updateBackOrder({ ...data.value, id: backOrderStore.state?.selectedBo?.id } as BackOrderModel);
    edit.value = false;

  } catch (e) {
    console.log(e);
  }
  resetData()
  loading.value = false;
}

const assignToBo = async () => {
  const data = ref<DocumentData>({
    applicant_id: applicantStore.state.selectedApplicant?.id,
    backOrder: backOrderStore.state.selectedBo?.id,
    client: backOrderStore.state.selectedBo?.client_id,
    office: backOrderStore.state.selectedBo?.office_id,
    deleted: false,
    created_by: getAuth().currentUser?.uid,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  try {
    backOrderStore.addToFix(data)
  } catch (error) {
    Alert.warning(error);
  }
}

watch(()=> selectedBo.value, () => {
  data.value = backOrderStore.state?.selectedBo as BackOrderModel
}, { deep: true })

</script>

<style lang="scss">
.valueClass_flexyBoxy{
  .q-field__control-container{
    display: flex;
    flex-direction: column;
  }
}
</style>
