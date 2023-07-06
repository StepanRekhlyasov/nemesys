<template>  
  <q-card-section class="bg-white ">
    <div class="row q-pb-md">
      <div class="col-9"></div>
      <div class="col-3 text-right">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" @click="save()" size="sm"/>
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" size="sm" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.status')" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :value="selectedBo['employmentType']?$t(`backOrder.${selectedBo['employmentType']}`) : ''">
        <q-radio
          v-for="key in BackOrderStatus"
          v-model="data['employmentType']"
          :label="$t('backOrder.'+key)"
          checked-icon="mdi-checkbox-intermediate" unchecked-icon="mdi-checkbox-blank-outline"
          :val="key"
          :key="key"
          :disable="loading"
          class="q-pr-md"/>
      </LabelField>
      <LabelField :label="$t('backOrder.create.hourlyMonthly')" v-if="selectedBo['type'] == 'referral'"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :edit="edit" :value="`${$t('backOrder.create.'+selectedBo['wage'])}  ${selectedBo['salary']} ${selectedBo['wage'] == 'monthlySalary' ? $t('backOrder.create.yenMonth')  : $t('backOrder.create.yenHour')}`">
        <q-field v-model="data['wage']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.create.monthlySalary')" 
          val="monthlySalary" v-model="data['wage']" />
          <q-radio :disable="loading" :label="$t('backOrder.create.hourlyWage')" 
          val="hourlyWage" v-model="data['wage']" />
        </q-field>
      </LabelField>      
      <labelField :label="$t('client.backOrder.customerReprisentative')" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :value="`${selectedBo['customerReprisentative'] || ''}`" v-if="selectedBo['type'] == 'dispatch'">
        <q-input v-model="data['customerReprisentative']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit" v-if="selectedBo['type'] == 'dispatch'" valueClass="self-center q-pl-md col-4" 
        :value="`${selectedBo['requiredQualifications']? $t('common.yes') : $t('common.no')}`" labelClass="q-pl-md col-2 text-right self-center" >
        <q-field v-model="data['requiredQualifications']" borderless hide-bottom-space :rules="[() => 'requiredQualifications' in data || '']" flat >
          <q-toggle v-model="data['requiredQualifications']" 
            :label="$t('backOrder.create.existence')" :disable="loading" />
        </q-field>
      </labelField>
      <LabelField :label="$t('backOrder.create.BOGenerationRoute')" :edit="edit" valueClass="self-center q-pl-md col-4" 
        :value="selectedBo['BOGenerationRoute']?$t(`backOrder.create.${selectedBo['BOGenerationRoute']}`) : ''" labelClass="q-pl-md col-2 text-right self-center" >
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.coldCall')" val="coldCall" :disable="loading"/>
        <q-radio v-model="data['BOGenerationRoute']" :label="$t('backOrder.create.fax')" val="fax" :disable="loading"/>
      </LabelField>      
      <labelField :label="$t('backOrder.create.benefit')" :edit="edit" :value="`${data['benefit'] || ''}`"
        v-if="selectedBo['type'] == 'referral'" labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" >
        <q-input v-model="data['benefit']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <LabelField :label="$t('client.backOrder.caseType')" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :value="selectedBo['typeCase']?$t(`applicant.add.${selectedBo['typeCase']}`) : ''">
          <q-radio
            v-for="key in TypeOfCase"
            v-model="data['typeCase']"
            :label="$t('applicant.add.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
      </LabelField>
      <labelField :label="$t('backOrder.create.bonus')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="self-center q-pl-md col-4"  :value="`${data['bonus'] || ''}`">
        <q-input v-model="data['bonus']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <labelField :label="$t('backOrder.create.requiredQualifications')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="self-center q-pl-md col-4" :value="`${selectedBo['requiredQualifications']? $t('common.yes') : $t('common.no')}`">
        <q-field v-model="data['requiredQualifications']" borderless hide-bottom-space :rules="[() => 'requiredQualifications' in data || '']" flat >
          <q-toggle v-model="data['requiredQualifications']" 
            :label="$t('backOrder.create.existence')" :disable="loading" />
        </q-field>
      </labelField>
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :value="`${selectedBo['travelingExpenses'] ? $t('backOrder.travelingExpenses.'+selectedBo['travelingExpenses']) : ''}`">
        <q-field v-model="data['travelingExpenses']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesRegular')" 
          val="yesRegular" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesDaily')" 
          val="yesDaily" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.none')" 
          val="none" v-model="data['travelingExpenses']" />
        </q-field>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'"  >
      <labelField :label="$t('backOrder.create.nameQualification')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4" 
        :value="selectedBo['qualifications']? $t('backOrder.qualification.'+data['qualifications']) : ''">
        <q-field v-model="data['qualifications']" borderless hide-bottom-space :rules="[(val) => data['requiredQualifications'] ? creationRule(val) : true]">
          <q-radio
            v-for="key in TypeQualifications"
            v-model="data['qualifications']"
            :label="$t('backOrder.qualification.'+key)"
            :val="key"
            :key="key"
            :disable="loading || !data['requiredQualifications']"
            class="q-pr-md"/>
        </q-field>
      </labelField>
      <labelField :label="$t('backOrder.create.payday')" :edit="edit" valueClass="col-4 q-pl-md flex self-center"
        :value="selectedBo['payday']? `${selectedBo['payday']} ${$t('backOrder.create.day')}` : ''" labelClass="q-pl-md col-2 text-right self-center" >
        <q-input v-model="data['payday']" outlined dense type="number" :disable="loading"/>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.create.day') }}</span>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      
      <labelField :label="$t('client.backOrder.experienceReq')" :edit="edit" 
        :value="data['experienceReq']?$t('backOrder.create.somethingNotQuestioned'):$t('backOrder.create.required')"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-field v-model="data['experienceReq']" borderless hide-bottom-space :rules="[() => 'experienceReq' in data || '']" flat >
          <q-toggle v-model="data['experienceReq']"  :disable="loading" 
            :label="data['experienceReq']?$t('backOrder.create.somethingNotQuestioned'):$t('backOrder.create.required')"/>
        </q-field>
      </labelField>
      <LabelField :label="$t('client.backOrder.caseType')" :edit="edit"  v-if="selectedBo['type'] == 'dispatch'"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="selectedBo['typeCase']?$t(`applicant.add.${selectedBo['typeCase']}`) : ''">
          <q-radio
            v-for="key in TypeOfCase"
            v-model="data['typeCase']"
            :label="$t('applicant.add.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
      </LabelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.experienceRemarks')" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :edit="edit" :value="selectedBo['experienceRemarks']">
          <q-input v-model="data['experienceRemarks']"  outlined dense :disable="loading" />
      </LabelField>
      <labelField :label="$t('backOrder.create.tasks')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="q-pl-md col-4" :value="selectedBo['work_content']" v-if="selectedBo['type'] == 'referral'">
        <q-input v-model="data['work_content']" outlined dense :disable="loading"/>
      </labelField>
    </div> 

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'dispatch'">
      <labelField :label="$t('backOrder.request')" :edit="edit" labelClass="q-pl-md col-2 self-center text-right"
        valueClass="col-4 q-pl-md flex" :value="selectedBo['invoice']">
        <q-input v-model="data['invoice']"  outlined dense :disable="loading" hide-bottom-space  />
      </labelField>
      <labelField :label="$t('client.backOrder.upperAgeLimit')" :edit="edit" labelClass="q-pl-md col-2 self-center text-right"
        valueClass="col-4 q-pl-md flex" :value="selectedBo['upperAgeLimit'] + $t('common.ageShort')">
        <q-input v-model="data['upperAgeLimit']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" />
        <span class="self-center q-pl-md">{{ $t('common.ageShort') }}</span>
      </labelField>
    </div>
    
    <div class="row q-pb-sm"  v-if="selectedBo['type'] == 'dispatch'">
      <labelField :label="$t('backOrder.payment')" :edit="edit" labelClass="q-pl-md col-2 self-center text-right" 
        valueClass="col-4 q-pl-md flex " :value="`${data['payment']}  ${$t('common.yen')}`">
        <q-input v-model="data['payment']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]"/>
        <span class="self-center q-pl-md">{{ $t('common.yen') }}</span>
      </labelField>
      <labelField :label="$t('backOrder.create.travelingExpenses')" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :value="`${selectedBo['travelingExpenses'] ? $t('backOrder.travelingExpenses.'+selectedBo['travelingExpenses']) : ''}`">
        <q-field v-model="data['travelingExpenses']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesRegular')" 
          val="yesRegular" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.yesDaily')" 
          val="yesDaily" v-model="data['travelingExpenses']" />
          <q-radio :disable="loading" :label="$t('backOrder.travelingExpenses.none')" 
          val="none" v-model="data['travelingExpenses']" />
        </q-field>
      </labelField>
    </div>   

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <labelField :label="$t('backOrder.employmentType')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="self-center q-pl-md col-4" :value="selectedBo['employmentType']? $t('backOrder.'+selectedBo['employmentType']) : ''">
        <q-field v-model="data['employmentType']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio
            v-for="key in BackOrderStatus"
            v-model="data['employmentType']"
            :label="$t('backOrder.'+key)"
            :val="key"
            :key="key"
            :disable="loading"
            class="q-pr-md"/>
        </q-field>
      </labelField>      
      <labelField :label="$t('backOrder.create.pickDrop')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="q-pl-md col-4 flex" :value="selectedBo['pickDrop']?$t('common.yesShort') : $t('common.noShort')">
        <q-field
          borderless dense
          v-model="data['pickDrop']"
          :rules="[() => 'pickDrop' in data || '' ]" hide-bottom-space> 
          <template v-slot:control> 
            <q-toggle v-model="data['pickDrop']" :disable="loading"/>
            <span class="q-ma-sm flex-center">{{ data['pickDrop']?$t('common.yesShort'):$t('common.noShort') }}</span>
          </template>
        </q-field>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <labelField :label="$t('backOrder.create.workingDays')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4" 
        :value="`${selectedBo['workingDays']? $t('backOrder.workingDays.'+data['workingDays']) :''} / ${selectedBo['workingDays'] == 'fixed'?data['working_days_week'].map(day => $t('weekDay.'+day)).join(', ') : ''}`">
        <q-field v-model="data['workingDays']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.shiftSystem')" 
          val="shiftSystem" v-model="data['workingDays']" />
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.fixed')" 
          val="fixed" v-model="data['workingDays']" />
        </q-field>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField :label="$t('backOrder.create.numberWorkingDays')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 flex self-center" :value="selectedBo['daysPerWeekList']? $t('backOrder.daysPerWeek.' + data['daysPerWeekList']) : ''" v-if="selectedBo['type'] == 'dispatch'">
        <q-field v-model="data['daysPerWeekList']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio v-for="day in DaysPerWeekList" :key="day.value" :disable="loading"
            :label="day.label" :val="day.value" v-model="data['daysPerWeekList']" />
        </q-field>
      </labelField>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.earlyShift')}`" :edit="edit" valueClass="q-pl-md col-4 flex self-center"
        labelClass="q-pl-md col-2 text-right self-center" 
        :value="`${selectedBo['workingHoursEarly_min'] || ''} ~ ${selectedBo['workingHoursEarly_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursEarly_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursEarly_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursEarly_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </LabelField>
      <labelField :label="$t('backOrder.create.onCallRemarks')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="q-pl-md col-4 row self-center" :value="selectedBo['onCallRemarks']" v-if="selectedBo['type'] == 'referral'">
        <q-input v-model="data['onCallRemarks']" outlined dense  :disable="loading"/>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <labelField :label="$t('backOrder.create.workingDays')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" v-if="selectedBo['type'] == 'dispatch'"
        valueClass="q-pl-md col-4 flex self-center" :value="selectedBo['workingDays']? $t('backOrder.workingDays.'+data['workingDays']) : ''">
        <q-field v-model="data['workingDays']" borderless hide-bottom-space :rules="[creationRule]">
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.shiftSystem')" 
          val="shiftSystem" v-model="data['workingDays']" />
          <q-radio :disable="loading" :label="$t('backOrder.workingDays.fixed')" 
          val="fixed" v-model="data['workingDays']" />
        </q-field>
      </labelField>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.dayShift')}`" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex self-center"
        :value="`${selectedBo['workingHoursDay_min'] || ''} ~ ${selectedBo['workingHoursDay_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursDay_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursDay_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursDay_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </LabelField>
      <labelField :label="$t('backOrder.create.welfare')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="q-pl-md col-4 self-center" :value="selectedBo['welfare']"  v-if="selectedBo['type'] == 'referral'">
        <q-input v-model="data['welfare']" outlined dense  :disable="loading" :rules="[creationRule]" hide-bottom-space/>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <LabelField :label="$t('backOrder.create.shiftRemarks')" :edit="edit" :value="selectedBo['shiftRemarks']"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4 self-center"  v-if="selectedBo['type'] == 'dispatch'">
        <q-input dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading"/>
      </LabelField>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.lateShift')}`" :edit="edit" valueClass="q-pl-md col-4 flex self-center"
        labelClass="q-pl-md col-2 text-right self-center"
        :value="`${selectedBo['workingHoursLate_min'] || ''} ~ ${selectedBo['workingHoursLate_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursLate_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursLate_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </LabelField>
      <labelField :label="$t('backOrder.create.childcare')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"
        valueClass="q-pl-md col-4 self-center" :value="selectedBo['tasks_childcare']" v-if="selectedBo['type'] == 'referral'">
        <q-input v-model="data['tasks_childcare']" outlined dense  :disable="loading" :rules="[creationRule]" hide-bottom-space/>
      </labelField>
    </div>

    <div class="row q-pb-sm">
      <div class="col-6"  v-if="selectedBo['type'] == 'dispatch'">

      </div>
      <LabelField :label="`${$t('office.workingHours')}  ${$t('office.nightShift')}`" :edit="edit" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex self-center"
        :value="`${selectedBo['workingHoursNight_min'] || ''} ~ ${selectedBo['workingHoursNight_max'] || ''}`">
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_min']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_min']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') + '  ~' }}</span>
        <q-input dense outlined bg-color="white" v-model="data['workingHoursNight_max']"
          :rules="[(val) => val ? validateTime(val) : true, creationRule]" hide-bottom-space >
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['workingHoursNight_max']" mask="HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <span class="q-ma-sm flex-center">{{ $t('backOrder.time') }}</span>
      </LabelField>
      <labelField :label="$t('backOrder.create.retirementAge')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" v-if="selectedBo['type'] == 'referral'" 
        valueClass="q-pl-md col-4 flex" :value="selectedBo['retirementAge_tasks']? `${selectedBo['retirementAge_tasks']} ${$t('common.age')}` :''">
        <q-input v-model="data['retirementAge_tasks']" outlined dense type="number" :disable="loading"/>
        <span class="col-2 q-ma-sm flex-center">{{ $t('common.age') }}</span>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'dispatch'">
      <LabelField :label="$t('client.backOrder.businessContent')" :edit="edit" :value="selectedBo['work_content']"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-input dense outlined bg-color="white" v-model="data['work_content']" :disable="loading" />
      </LabelField>
      <LabelField :label="$t('backOrder.availabilityOnCallSupport')" :edit="edit" :value="data['onCallSupport']?$t('common.yesShort') : $t('common.noShort')"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-field
          borderless dense
          v-model="data['onCallSupport']"
          :rules="[() => 'onCallSupport' in data || '' ]" hide-bottom-space>
          <template v-slot:control>
            <q-toggle v-model="data['onCallSupport']"  :disable="loading" />
            <span class="flex-center q-pr-md ">{{ data['onCallSupport']?$t('common.yesShort'):$t('common.noShort') }}</span>
          </template>
        </q-field>
      </LabelField>
    </div>
    
    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'dispatch'">
      <labelField :label="$t('backOrder.create.pickDrop')" :edit="edit" :value="selectedBo['pickDrop']?$t('common.yesShort') : $t('common.noShort')"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="q-pl-md col-4 flex">
        <q-field
          borderless dense
          v-model="data['pickDrop']"
          :rules="[() => 'pickDrop' in data || '' ]" hide-bottom-space> 
          <template v-slot:control> 
            <q-toggle v-model="data['pickDrop']" :disable="loading"/>
            <span class="q-ma-sm flex-center">{{ data['pickDrop']?$t('common.yesShort'):$t('common.noShort') }}</span>
          </template>
        </q-field>
      </labelField>
      <labelField :label="$t('backOrder.create.onCallRemarks')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center" 
        valueClass="q-pl-md col-4 row" :value="selectedBo['onCallRemarks']" >
        <q-input v-model="data['onCallRemarks']" outlined dense  :disable="loading"/>
      </labelField>
    </div>
    
    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <LabelField :label="$t('backOrder.create.shiftRemarks')" :edit="edit" :value="selectedBo['shiftRemarks']"
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4">
        <q-input dense outlined bg-color="white" v-model="data['shiftRemarks']" :disable="loading" />
      </LabelField>
      <div class="col-6">
        <div class="row">
          <labelField :label="$t('backOrder.create.referralFee')" :edit="edit" labelClass="q-pl-md col-4 text-right self-center self-center" 
            valueClass="q-pl-md col-8 flex" :value="`${selectedBo['retirementAge']} %`">
            <q-input v-model="data['retirementAge']" outlined dense type="number" 
              :disable="loading" :rules="[creationRule]" hide-bottom-space/>
            <span class="col-2 q-ma-sm flex-center">%</span>
          </labelField>
        </div>
        <div class="row">
          <labelField :label="$t('backOrder.create.referralFeeAmount')" :edit="edit" labelClass="q-pl-md col-4 text-right self-center" 
            valueClass="q-pl-md col-8 q-pt-sm flex" :value="selectedBo['stipulatedAmount'] ? `${selectedBo['stipulatedAmount']} ${$t('common.yen')}` : ''">
            <q-input v-model="data['stipulatedAmount']" outlined dense type="number" :disable="loading"/>
            <span class="col-2 q-ma-sm flex-center">{{ $t('common.yen') }}</span>
          </labelField>
        </div>
      </div>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <labelField :label="$t('client.backOrder.upperAgeLimit')" :edit="edit" labelClass="q-pl-md col-2 self-center text-right"
        valueClass="col-4 q-pl-md flex" :value="selectedBo['upperAgeLimit'] + $t('common.ageShort')">
        <q-input v-model="data['upperAgeLimit']"  outlined dense :disable="loading" hide-bottom-space :rules="[creationRule]" />
        <span class="self-center q-pl-md">{{ $t('common.ageShort') }}</span>
      </labelField>
    </div>

    <div class="row q-pb-sm" v-if="selectedBo['type'] == 'referral'">
      <LabelField :label="$t('backOrder.create.overtimeRemarks')" 
        labelClass="q-pl-md col-2 text-right self-center" valueClass="self-center q-pl-md col-4"
        :edit="edit" :value="selectedBo['overtimeRemarks']" >
        <q-input  dense outlined bg-color="white" v-model="data['overtimeRemarks']" :disable="loading || data['overtimeWork'] !== 'yes'" />
      </LabelField>
      
      <labelField :label="$t('client.list.memo')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"  
        valueClass="q-pl-md col-4" :value="selectedBo['memo_house']">
        <q-input v-model="data['memo_house']" outlined dense :disable="loading"/>
      </labelField>
    </div>

    

    <div class="row " v-if="selectedBo['type']=='referral'">
      <labelField :label="$t('backOrder.create.annualHolidays')" :edit="edit" labelClass="q-pl-md col-2 text-right self-center"  
        valueClass="q-pl-md col-4 flex" :value="selectedBo['annualHolidays'] ? `${data['annualHolidays']} ${$t('weekDay.sunday')}` : ''">
        <q-input v-model="data['annualHolidays']" outlined dense type="number" :disable="loading" min="0" max="365"/>
        <span class="q-ma-sm flex-center">{{ $t('weekDay.sunday') }}</span>
      </labelField>
    </div>
  </q-card-section>  
  <q-card-section>
    <detalInfoTab :bo="selectedBo" @openSearchByMap="emit('openSearchByMap')" />
  </q-card-section>
</template>
<script lang="ts" setup>
import { BackOrderModel, BackOrderStatus, Client, TypeOfCase, TypeQualifications } from 'src/shared/model';
import { ref } from 'vue';
import { DaysPerWeekList } from 'src/shared/constants/BackOrder.const';
import { useBackOrder } from 'src/stores/backOrder';
import LabelField from 'src/components/form/LabelField.vue';
import detalInfoTab from './detalInfoTab.vue';
import { creationRule } from 'src/components/handlers/rules';
import { validateTime } from 'src/shared/constants/Form.const';

const props = defineProps<{
  selectedBo: BackOrderModel,
  client?: Client
}>()
const emit = defineEmits(['openSearchByMap']);

const edit = ref(false);
const backOrderStore = useBackOrder();
const loading = ref(false)
const data = ref(props.selectedBo)

async function save() {
  loading.value = true;
  try {
    await backOrderStore.updateBackOrder({id: props.selectedBo.id, ...data.value} as BackOrderModel);
    edit.value = false;

  } catch (e) {
    console.log(e);
  }
  loading.value = false;
}
</script>

<style>

</style>