<template>
  <q-card-section class="bg-white ">
    <div class="row q-pb-md">
      <div class="col-9">
        <q-btn @click="assignToBo" v-if="props.isHiddenDetails" class="bg-primary text-white" :label="$t('client.backOrder.assignToBo')"/>
      </div>
      <div class="col-3 text-right">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline icon="edit" @click="edit = true"
          class="no-shadow q-pl-lg" size="sm" />
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm" />
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-pl-md" outline color="primary" @click="resetData()"
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
      <LabelField :label="$t('backOrder.create.annualHolidays')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex"
        :value="selectedBo['annualHolidays'] ? `${data['annualHolidays']} ${$t('weekDay.sunday')}` : ''">
        <q-input v-model="data['annualHolidays']" outlined dense type="number" :disable="loading" min="0" max="365" />
        <span class="q-ma-sm flex-center">{{ $t('weekDay.sunday') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.customerRepresentative')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="`${selectedBo['customerRepresentative'] || ''}`" :autogrow="true">
        <q-input v-model="data['customerRepresentative']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.hourlyMonthly')" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4 flex" :edit="edit"
        :value="`${selectedBo['salary']} ${selectedBo['wage'] == 'monthlySalary' ? $t('backOrder.create.yenMonth') : $t('backOrder.create.yenHour')}`">
        <q-field v-model="data['wage']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.create.monthlySalary')" val="monthlySalary"
            v-model="data['wage']" />
          <q-radio :disable="loading" :label="$t('backOrder.create.hourlyWage')" val="hourlyWage"
            v-model="data['wage']" />
        </q-field>
        <q-input v-model="data['salary']" outlined dense type="text" :disable="loading" :rules="[creationRule]"
          hide-bottom-space @update:model-value="(value)=>{
            data['salary'] = commaSeparatedNumber(value)
          }" />
        <span v-if="data['wage'] == 'monthlySalary'" class="q-ma-sm flex-center">{{ $t('backOrder.create.yenMonth')
        }}</span>
        <span v-if="data['wage'] == 'hourlyWage'" class="q-ma-sm flex-center">{{ $t('backOrder.create.yenHour') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="edit" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['BOGenerationRoute'] ? $t(`backOrder.create.${selectedBo['BOGenerationRoute']}`) : ''"
        labelClass="q-pl-md col-2 text-right self-center">
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall"
          :disable="loading" />
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading" />
      </LabelField>
      <LabelField :label="$t('backOrder.create.benefit')" :edit="edit" :value="`${data['benefit'] || ''}`" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4">
        <q-input v-model="data['benefit']" outlined dense :disable="loading" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('client.backOrder.caseType')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4"
        :value="selectedBo['typeCase'] ? $t(`applicant.add.${selectedBo['typeCase']}`) : ''">
        <q-radio v-for="key in TypeOfCase" v-model="data['typeCase']" :label="$t('applicant.add.' + key)" :val="key"
          :key="key" :disable="loading" class="q-pr-md" />
      </LabelField>
      <LabelField :label="$t('backOrder.create.bonus')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4" :value="`${data['bonus'] || ''}`">
        <q-input v-model="data['bonus']" outlined dense :disable="loading" />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('client.backOrder.transactionType')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" :value="data.transactionType"
        valueClass="self-center q-pl-md col-4">
        <q-radio v-for="item in transactionTypeOptions" v-model="data.transactionType" :label="item.label"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline" :val="item.value" :key="item.value"
          :disable="loading" class="q-pr-md" />
      </LabelField>
      <LabelField :label="$t('backOrder.create.travelingExpenses')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['travelingExpenses']" :autogrow="true">
        <q-input v-model="data['travelingExpenses']" type="textarea" autogrow outlined dense :disable="loading"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit" 
        labelClass="q-pl-md col-2 self-center text-right"  :valueClass="edit?'col-10 q-pl-md':'col-4 q-pl-md'" :value="Array.isArray(data['qualifications']) && !edit ? data['qualifications'].map((row) => $t('applicant.qualification.' + row)):''">
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
      <LabelField :label="$t('backOrder.create.payday')" :edit="edit" valueClass="col-4 q-pl-md flex self-center" 
        :value="selectedBo['payday']"
        labelClass="q-pl-md col-2 text-right self-center" :autogrow="true">
        <q-input v-model="data['payday']" outlined dense type="textarea" :disable="loading" autogrow />
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('client.backOrder.experienceReq')" :edit="edit"
        :value="data['experienceReq']"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" :autogrow="true">
        <q-input v-model="data['experienceReq']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="$t('client.backOrder.remarks')" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4" :edit="edit" :value="selectedBo.remarks" :autogrow="true">
        <q-input v-model="data.remarks" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.experienceRemarks')" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4" :edit="edit" :value="selectedBo['experienceRemarks']" :autogrow="true">
        <q-input v-model="data['experienceRemarks']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.tasks')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4" :value="selectedBo['work_content']" :autogrow="true">
        <q-input v-model="data['work_content']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.employmentType')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4"
        :value="Array.isArray(selectedBo['employmentType']) ? selectedBo['employmentType'].map((row) => $t('client.backOrder.' + row)):''">
        <q-field v-model="data['employmentType']" borderless hide-bottom-space>
          <q-checkbox v-for="key in EmploymentBOStatus" v-model="data['employmentType']" :label="$t('client.backOrder.' + key)"
            :val="key" :key="key" :disable="loading" class="q-pr-md" />
        </q-field>
      </LabelField>
      <LabelField :label="$t('backOrder.create.pickDrop')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 flex" :value="selectedBo['pickDrop'] ? $t('common.yesShort') : $t('common.noShort')">
        <q-field borderless dense v-model="data['pickDrop']" :rules="[() => 'pickDrop' in data || '']" hide-bottom-space>
          <template v-slot:control>
            <q-toggle v-model="data['pickDrop']" :disable="loading" />
            <span class="q-ma-sm flex-center">{{ data['pickDrop'] ? $t('common.yesShort') : $t('common.noShort') }}</span>
          </template>
        </q-field>
      </LabelField>
    </div>


    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.workingDays')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" :valueClass="edit?'q-pl-md col-10 self-center':'q-pl-md col-4 self-center'"
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
      <LabelField :label="$t('backOrder.create.onCallRemarks')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 row self-center"
        :value="selectedBo['onCallRemarks']" :autogrow="true">
        <q-input v-model="data['onCallRemarks']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.earlyShift')}`" :edit="edit"
        valueClass="q-pl-md col-4 self-center flex no-wrap" labelClass="q-pl-md col-2 text-right self-center"
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
        <span class="q-ma-sm flex-center">{{ '~' }}</span>
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
      <LabelField :label="$t('backOrder.create.welfare')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 self-center" :value="selectedBo['welfare']" :autogrow="true">
        <q-input v-model="data['welfare']" outlined dense :disable="loading" :rules="[creationRule]" hide-bottom-space type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.dayShift')}`" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex no-wrap self-center"
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
        <span class="q-ma-sm flex-center">{{ '~' }}</span>
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
      <LabelField :label="$t('backOrder.create.childcare')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 self-center" :value="selectedBo['tasks_childcare']" :autogrow="true">
        <q-input v-model="data['tasks_childcare']" outlined dense :disable="loading" :rules="[creationRule]"
          hide-bottom-space type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.lateShift')}`" :edit="edit"
        valueClass="q-pl-md col-4 flex no-wrap self-center" labelClass="q-pl-md col-2 text-right self-center"
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
        <span class="q-ma-sm flex-center">{{ '~' }}</span>
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
      <LabelField :label="$t('backOrder.create.retirementAge')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 flex"
        :value="selectedBo['retirementAge_tasks'] ? `${selectedBo['retirementAge_tasks']} ${$t('common.age')}` : ''" :autogrow="true">
        <q-input v-model="data['retirementAge_tasks']" outlined dense type="number" :disable="loading" autogrow/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.age') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.nightShift')}`" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex no-wrap self-center"
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
        <span class="q-ma-sm flex-center">{{ '~' }}</span>
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
      <LabelField :label="$t('backOrder.create.referralFee')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center self-center" valueClass="q-pl-md col-4 flex self-center"
        :value="`${selectedBo['referralFee']} %`">
        <q-input v-model="data.referralFee" outlined dense type="text" :disable="loading"
          :rules="[creationRule]" hide-bottom-space />
        <span class="col-2 q-ma-sm flex-center">%</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.shiftRemarks')" :edit="edit" :value="selectedBo['shiftRemarks']"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" :autogrow="true">
        <q-input dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading" type="textarea" autogrow/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.referralFeeAmount')" :edit="edit"
        labelClass="q-pl-md col-2 text-right self-center q-pt-sm" valueClass="q-pl-md col-4 q-pt-sm flex self-center"
        :value="selectedBo['stipulatedAmount'] ? `${selectedBo['stipulatedAmount']} ${$t('common.yen')}` : ''">
        <q-input v-model="data['stipulatedAmount']" outlined dense type="text" :disable="loading" @update:model-value="(value)=>{data['stipulatedAmount'] = commaSeparatedNumber(value)}" />
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.yen') }}</span>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.overtimeWork')" :edit="edit" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['overtimeWork'] === 'yes' ? $t('common.yes') : $t('common.without')"
        labelClass="q-pl-md col-2 text-right self-center">
        <q-radio v-model="data['overtimeWork']" :label="$t('common.yes')" val="yes"
          :disable="loading" />
        <q-radio v-model="data['overtimeWork']" :label="$t('common.without')" val="no" :disable="loading" />
      </LabelField>
      <LabelField :label="$t('client.list.memo')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4" :value="selectedBo['memo_house']" :autogrow="true">
        <q-input v-model="data['memo_house']" outlined dense :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.overtimeRemarks')" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4" :edit="edit" :value="selectedBo['overtimeRemarks']" :autogrow="true">
        <q-input dense outlined bg-color="white" v-model="data['overtimeRemarks']" :disable="loading" type="textarea" autogrow/>
      </LabelField>
    </div>

  </q-card-section>
  <q-card-section>
    <detalInfoTab :bo="selectedBo" @openSearchByMap="emit('openSearchByMap')" />
  </q-card-section>
</template>
<script lang="ts" setup>
import { BackOrderModel, EmploymentBOStatus, BackOrderStatus, TypeOfCase, TypeQualifications, WorkingDaysWeek } from 'src/shared/model';
import { computed, ref, watch } from 'vue';
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
import { commaSeparatedNumber } from 'src/shared/utils/utils';
import { useI18n } from 'vue-i18n';

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
      {label: t('client.backOrder.dispatchEm'), value: 'generalDispatch'},
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
const data = ref()
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

<style></style>
