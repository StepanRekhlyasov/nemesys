<template>
  <q-card class="no-shadow bg-grey-3">
    <q-form ref="jobForm" @submit="saveJob">
      <q-card-section class="text-white bg-primary rounded-borders">
        <div class="row">
          <div class="col-12 flex flex-inline">
            <q-btn dense flat icon="close" @click="hideDrawer" />
            <div class="q-mr-sm">
              <div>
                {{ transactionText }}
                <span v-if="projectText">/ {{ projectText }}</span>
              </div>
              <div class="text-h6">{{ jobData['name'] }}</div>
            </div>
            <q-btn size="sm" style="background: white; color: #085374; height: 30px"
              :label="jobData['id'] ? $t('job.jobUpdate') : $t('job.jobReg')" type="submit" />
            <q-btn outline size="sm" :label="$t('job.autoJobCreation')" class="q-ml-md" style="height: 30px" />
          </div>
        </div>
      </q-card-section>
      <q-card-section v-if="isDrawer">
        <div class="row text-primary text-body1">
          ■ {{ $t('job.add.basicInfo') }}
        </div>

        <div class="row">
          {{ $t('job.add.jobName') }}
          <span class="text-red-5">*</span>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input outlined dense v-model="jobData['name']" :placeholder="$t('client.add.clientLabel')" lazy-rules
              :rules="[(val) => (val && val.length > 0) || '']" />
          </div>
        </div>


        <div class="row">
          <div class="col-4">
            {{ $t('job.add.transactionType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.projectType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('client.add.facilityType') }}
            <span class="text-red-5">*</span>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="transactionTypeOptions" emit-value map-options
              v-model="jobData['transactionType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['transactionType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="projectTypeOptions" emit-value map-options v-model="jobData['projectType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['projectType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-select outlined dense :options="facilityTypeOption" emit-value map-options option-label="name"
              v-model="jobData['facilityType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['facilityType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.paymentType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.add.salaryType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-4">
            {{ $t('job.add.status') }}
            <span class="text-red-5">*</span>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="paymentTypeOption" emit-value map-options v-model="jobData['paymentType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['paymentType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="jobData['salaryType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['salaryType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-select outlined dense :options="statusOption" emit-value map-options v-model="jobData['status']" lazy-rules
              :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['status']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('client.list.client') }}
          </div>
          <div class="col-4">
            {{ $t('applicant.list.fixEmployment.office') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="clientList" v-model="jobData['client']">
              <template v-if="!jobData['client']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="officeList" v-model="jobData['office']" :disable="officeList.length == 0">
              <template v-if="!jobData['office']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.email') }}
          </div>
          <div class="col-4">
            {{ $t('applicant.add.phone') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-input outlined dense v-model="jobData['email']"
              :placeholder="$t('client.add.emailLabel1') + '@' + $t('client.add.emailLabel2')" hide-bottom-space />
          </div>
          <div class="col-4 q-pr-sm">
            <q-input outlined dense v-model="jobData['phone']" :placeholder="$t('client.add.phoneLabel')"
              hide-bottom-space />
          </div>
        </div>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.jobContent') }}
        </div>
        <div v-for="item in jobItems" :key="item['id']">
          <div class="row q-pt-sm">
            <div class="col-4">
              {{ item['name'] }}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-input outlined v-model="jobData['jobContent'][item['name']]"
                @click="openJobOptionDrawer(jobItemOptions[item['id']], item['name'],item['id'])" dense />
            </div>
          </div>
        </div>
        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.employmentContract') }}
        </div>

        <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('job.add.salaryType') }}
          </div>
          <div class="col-3">
            {{ $t('job.add.salaryCap') }}
          </div>
          <div class="col-3">
            {{ $t('job.add.minSalary') }}
          </div>
          <div class="col-3">
            {{ $t('office.payDay') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['salaryTypeText']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['salaryCap']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['minSalary']" hide-bottom-space />
          </div>
          <div class="col-3">
            <q-input outlined dense v-model="jobData['payday']" hide-bottom-space />
          </div>
        </div>


        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('client.backOrder.employmentStatus') }}
          </div>
          <div class="col-4">
            {{ $t('client.backOrder.bonuses') }}
          </div>
          <div class="col-4">
            {{ $t('client.backOrder.transportationExpenses') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="employmentStatusOption" emit-value map-options
              v-model="jobData['employmentStatus']">
              <template v-if="!jobData['employmentStatus']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="[]" emit-value map-options v-model="jobData['bonuses']">
              <template v-if="!jobData['bonuses']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-input outlined dense v-model="jobData['transportationExpenses']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-pt-sm">
          <div class="col-12">
            {{ $t('job.add.treatmentBenefits') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-select outlined dense :options="[]" emit-value map-options v-model="jobData['benefits']">
              <template v-if="!jobData['benefits']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>

        <!-- Employment Conditions -->
        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.employmentConditions') }}
        </div>

        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.experienceRequired') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input outlined dense v-model="jobData['experienceRequired']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.requiredQualification') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.halfYearExp') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.upperAgeLimit') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="[]" emit-value map-options v-model="jobData['requiredQualification']">
              <template v-if="!jobData['requiredQualification']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="halfYearExpOption" emit-value map-options v-model="jobData['halfYearExp']">
              <template v-if="!jobData['halfYearExp']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4">
            <q-input outlined dense v-model="jobData['upperAgeLimit']" hide-bottom-space />
          </div>
        </div>
        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('job.add.mediaInformation') }}
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.indeedJobCategory') }}
          </div>
          <div class="col-4">
            {{ $t('job.add.presenceAbsenceResume') }}
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="indeedJobCategorOption" emit-value map-options
              v-model="jobData['indeedJobCategory']">
              <template v-if="!jobData['indeedJobCategory']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-4 q-pr-sm">
            <q-select outlined dense :options="resumeRequiredOption" emit-value map-options
              v-model="jobData['presenceAbsenceResume']">
              <template v-if="!jobData['presenceAbsenceResume']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-pt-sm">
          <div class="col-4">
            {{ $t('job.add.indeedTag') }}
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pr-sm">
            <q-select outlined dense v-model="jobData['indeedTag']" emit-value map-options use-chips multiple
              input-debounce="0" :options="indeedTagOptions" options-html use-input>
              <template v-if="!jobData['indeedTag']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeCommonInformation') }}
        </div>

        <div class="row q-pt-sm">
          <div class="col-3">
            {{ $t('client.list.client') }}
          </div>
          <div class="col-3">
            {{ $t('applicant.list.fixEmployment.office') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="clientList" v-model="jobData['client']">
              <template v-if="!jobData['client']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="officeList" v-model="jobData['office']" :disable="officeList.length == 0">
              <template v-if="!jobData['office']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('settings.branch.prefectures') }}
          </div>
          <div class="col-3">
            {{ $t('settings.branch.municipalities') }}
          </div>
          <div class="col-3">
            {{ $t('applicant.add.street') }}
          </div>
          <div class="col-3">
            {{ $t('client.add.buildingName') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="prefectureList"  emit-value map-options
              v-model="jobData['prefectures']">
              <template v-if="!jobData['prefectures']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['municipalities']">
              <template v-if="!jobData['municipalities']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['street']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['buidingName']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-6">
            {{ $t('job.facilityForm') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.numberEmployees') }}
          </div>
        </div>
        <div class="row">
          <div class="col-6 q-pr-md">
            <q-select outlined dense :options="facilityTypeOption" emit-value map-options option-label="name"
              v-model="jobData['facilityType']" lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['facilityType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['numberEmployees']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('job.add.salaryType') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.salary') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.bonuses') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.payday') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="jobData['salaryType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['salaryType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['salary']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['bonuses']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['payday']" hide-bottom-space />
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.overtime') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.retirementAge') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.welfare') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.leaveChildcare') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['overtime']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['retirementAge']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['welfare']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['leaveChildcare']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursEarly') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursDay') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursLate') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursNight') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursEarly']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursDay']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursLate']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursNight']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.businessContent') }}
          </div>
          <div class="col-3">
            {{ $t('client.add.smokingPermitted') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.holidayAnnual') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.holidaysWeekly') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['businessContent']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options v-model="jobData['smokingPermitted']"
             >
              <template v-if="!jobData['smokingPermitted']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['holidayAnnual']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['holidaysWeekly']" hide-bottom-space />
          </div>
        </div>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeSpecificInformation') }}
        </div>
        <div class="row q-mt-sm">
          <div class="col-3">
            {{ $t('office.availabilityParkingLot') }}
          </div>
          <div class="col-3">
            {{ $t('client.add.parkingLotNotes') }}
          </div>
          <div class="col-3">
            {{ $t('office.headquarterSettlement') }}
          </div>
          <div class="col-3">
            {{ $t('office.presenceAbsenceApproval') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select
        outlined
        dense
        v-model="jobData['availabilityParkingLot']"
        :options="industriesDataOptions"
        option-value="id"
        option-label="title"
        hide-bottom-space
      />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['parkingLotNotes']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options v-model="jobData['headquarterSettlement']"
              >
              <template v-if="!jobData['headquarterSettlement']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['presenceAbsenceApproval']">
              <template v-if="!jobData['presenceAbsenceApproval']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-3">
            {{ $t('office.hiringDate') }}
          </div>
          <div class="col-3">
            {{ $t('office.averageLevelCare') }}
          </div>
          <div class="col-3">
            {{ $t('office.vaccination') }}
          </div>
          <div class="col-3">
            {{ $t('office.numberUsers') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['hiringDate']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['averageLevelCare']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['vaccination']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['numberUsers']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col-3">
            {{ $t('clientFactory.drawer.details.healthCheck') }}
          </div>
          <div class="col-3">
            {{ $t('office.withWithoutLunch') }}
          </div>
          <div class="col-3">
            {{ $t('office.onCallCorrespondence') }}
          </div>
          <div class="col-3">
            {{ $t('office.presenceAbsenceUniform') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['healthCheck']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['withWithoutLunch']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['onCallCorrespondence']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
          <q-select outlined dense  emit-value map-options v-model="jobData['presenceAbsenceUniform']"
              >
              <template v-if="!jobData['presenceAbsenceUniform']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boCommonInformation') }}
        </div>
        <div class="row q-mt-sm">
          <div class="col-3">
            {{ $t('job.projectType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-3">
            {{ $t('job.add.salaryType') }}
            <span class="text-red-5">*</span>
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.businessContent') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.employmentStatus') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="projectTypeOptions" emit-value map-options v-model="jobData['boProjectType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['boProjectType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="salaryTypeOption" emit-value map-options v-model="jobData['boSalaryType']"
              lazy-rules :rules="[(val) => (val && val.length > 0) || '']">
              <template v-if="!jobData['boSalaryType']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['businessContent']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense :options="employmentStatusOption" emit-value map-options
              v-model="jobData['boEmploymentStatus']">
              <template v-if="!jobData['boEmploymentStatus']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row ">
          <div class="col-3">
            {{ $t('backOrder.create.paycheck') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.payday') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.benefit') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.bonus') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['payCheck']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['boPayDay']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['boBenefit']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['bonus']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursEarly') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursDay') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursLate') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.workingHoursNight') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursEarly']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursDay']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursLate']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingHoursNight']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.shiftRemarks') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.numberWorkingDays') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.workingDays') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.holidayAnnual') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['shiftRemarks']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['numberWorkingDays']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['workingDays']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['holidayAnnual']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('office.referralFee') }}
          </div>
          <div class="col-3">
            {{ $t('office.referralFeeAmount') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.ageLimit') }}
          </div>
          <div class="col-3">
            {{ $t('office.retirementAge') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['referralFee']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['referralFeeAmount']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['ageLimit']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['retirementAge']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('client.backOrder.transportationExpenses') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.overtimeWork') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.overtimeRemarks') }}
          </div>
          <div class="col-3">
            {{ $t('client.list.memo') }}
          </div>
        </div>
        <div class="row">
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['botransportationExpenses']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['overtimeWork']">
              <template v-if="!jobData['overtimeWork']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['overtimeRemarks']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['memo']" hide-bottom-space />
          </div>
        </div>

        <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('backOrder.boSpecificInformation') }}
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.requiredQualifications') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.qualificationRemarks') }}
          </div>
          <div class="col-3">
            {{ $t('client.backOrder.experienceReq') }}
          </div>
          <div class="col-3">
            {{ $t('backOrder.create.experienceRemarks') }}
          </div>
        </div>
        <div class="row">
           <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['boRequiredQualification']">
              <template v-if="!jobData['boRequiredQualification']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['qualificationRemarks']" hide-bottom-space />
          </div>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['experienceReq']">
              <template v-if="!jobData['experienceReq']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['experienceRemarks']" hide-bottom-space />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-3">
            {{ $t('backOrder.create.pickDrop') }}
          </div>
          <div class="col-3 q-ml-sm">
            {{ $t('backOrder.availabilityOnCallSupport') }}
          </div>
          <div class="col-3">
            {{ $t('office.onCallCorrespondence') }}
          </div>
        </div>
          <div class="row">
           <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['pickDrop']">
              <template v-if="!jobData['pickDrop']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>>
          <div class="col-3 q-pr-sm">
            <q-select outlined dense  emit-value map-options
              v-model="jobData['availabilityOnCallSupport']">
              <template v-if="!jobData['availabilityOnCallSupport']" v-slot:selected>
                <div class="text-grey-6">{{ $t('common.pleaseSelect') }}</div>
              </template>
            </q-select>
          </div>
          <div class="col-3 q-pr-sm">
            <q-input outlined dense v-model="jobData['onCallCorrespondence']" hide-bottom-space />
          </div>
        </div>
        <!-- <div class="row text-primary text-body1 q-pt-sm">
          ■ {{ $t('client.add.officeSpecificInformation') }}
        </div>
        <div class="row" v-for="items in industriesData" :key="items['id']">
  <div class="col-6" v-for="underItem in items['uniqueItems']['typeSpecificItems']" :key="underItem['id']">
    <div class="q-pr-sm">
      {{ underItem['title'] }}
    </div>
    <div class="q-pr-sm">
      <q-input outlined dense v-model="jobData['onCallCorrespondence']" hide-bottom-space />
    </div>
  </div>
</div> -->
      </q-card-section>
    </q-form>
    <q-dialog v-model="dialogVisible" persistent transition-show="scale" transition-hide="scale" class="my-dialog">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <q-list dense bordered padding class="rounded-borders">
            <q-item clickable v-ripple v-for="(options, index) in itemOptions" :key="options['id']"
              >
              <q-btn icon="edit" size="md" color="primary" flat  @click="startEditing(index)"/>
              <div class="text-h6 q-ml-md"  v-if="!isEditing(index)" @click="selectJobOption(options,jobItemId)">
                 {{ options['name'] }}
              </div>
              <q-input v-model="options['name']" dense v-if="isEditing(index)"  @blur="stopEditing()" @keyup.enter="stopEditing()" />
            </q-item>
            <div class="row">
                <q-btn icon="mdi-plus-thick" size="md" color="primary"  :label="$t('common.addNew')" flat class="q-ml-md q-mt-sm text-bold" @click="addNewField"/>
              </div>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ref,Ref, watch, defineProps, onMounted, onBeforeUnmount ,computed} from 'vue';
import { applicantClassification, occupationList } from 'src/shared/constants/Applicant.const';
import { facilityList } from 'src/shared/constants/Organization.const';
import { paymentTypeList, salaryTypeList, statusList, employmentStatusList, reqList, indeedJobCategoryList, indeedTagList, indeedTagJobType, indeedTagCoronaType, resumeRequiredList } from 'src/shared/constants/JobAd.const';
import { DocumentData } from 'firebase/firestore';
import { useJobSearch } from 'src/stores/jobSearch'
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import {Client,ClientOffice} from 'src/shared/model/Client.model'
const jobSearchStore = useJobSearch()
const props = defineProps({
  selectedJob: {
    type: Object,
    required: true
  },
  isDrawer: {
    type: Boolean,
    required: true
  }
}
)
const emit = defineEmits<{
  (e: 'hideDrawer')
}>()
const hideDrawer = () => {
  jobData.value = { ...jobDataObject }
  emit('hideDrawer')
}
const { t } = useI18n({
  useScope: 'global',
});
const $q = useQuasar();
const jobDataObject = {
  id: props?.selectedJob['id'] || null,
  name: props?.selectedJob['name'] || '',
  client: '',
  indeedTag: props?.selectedJob['indeedTag'] || [],
  transactionType: '',
  projectType: '',
  boProjectType: '',
  facilityType: props?.selectedJob['facilityType'] || '',
  paymentType: props?.selectedJob['paymentType'] || '',
  salaryType: props?.selectedJob['salaryType'] || '',
  boSalaryType: props?.selectedJob['boSalaryType'] || '',
  status: props?.selectedJob['status'] || '',
  office: props?.selectedJob['office'] || '',
  email: props?.selectedJob['email'] || '',
  phone: props?.selectedJob['phone'] || '',
  jobContent: props?.selectedJob['jobContent'] || {},
  salaryTypeText: props?.selectedJob['salaryTypeText'] || '',
  salaryCap: props?.selectedJob['salaryCap'] || '',
  minSalary: props?.selectedJob['minSalary'] || '',
  payday: props?.selectedJob['payday'] || '',
  employmentStatus: props?.selectedJob['employmentStatus'] || '',
  boEmploymentStatus: props?.selectedJob['boEmploymentStatus'] || '',
  bonuses: props?.selectedJob['bonuses'] || '',
  transportationExpenses: props?.selectedJob['transportationExpenses'] || '',
  businessContent: props?.selectedJob['businessContent'] || '',
  payCheck: props?.selectedJob['payCheck'] || '',
  boPayDay: props?.selectedJob['boPayDay'] || '',
  benefits: props?.selectedJob['benefits'] || '',
  boBenefit: props?.selectedJob['boBenefit'] || '',
  shiftRemarks: props?.selectedJob['shiftRemarks'] || '',
  numberWorkingDays: props?.selectedJob['numberWorkingDays'] || '',
  workingDays: props?.selectedJob['workingDays'] || '',
  bonus: props?.selectedJob['bonus'] || '',
  holidayAnnual: props?.selectedJob['holidayAnnual'] || '',
  workingHoursEarly: props?.selectedJob['workingHoursEarly'] || '',
  workingHoursDay: props?.selectedJob['workingHoursDay'] || '',
  workingHoursLate: props?.selectedJob['workingHoursLate'] || '',
  workingHoursNight: props?.selectedJob['workingHoursNight'] || '',
  referralFee: props?.selectedJob['referralFee'] || '',
  referralFeeAmount: props?.selectedJob['referralFeeAmount'] || '',
  ageLimit: props?.selectedJob['ageLimit'] || '',
  retirementAge: props?.selectedJob['retirementAge'] || '',
  botransportationExpenses: props?.selectedJob['transportationExpenses'] || '',
  overtimeWork: props?.selectedJob['overtimeWork'] || '',
  overtimeRemarks: props?.selectedJob['overtimeRemarks'] || '',
  memo: props?.selectedJob['memo'] || '',
  experienceRequired: props?.selectedJob['experienceRequired'] || '',
  requiredQualification: props?.selectedJob['requiredQualification'] || '',
  boRequiredQualification: props?.selectedJob['boRequiredQualification'] || '',
  qualificationRemarks: props?.selectedJob['qualificationRemarks'] || '',
  experienceReq: props?.selectedJob['experienceReq'] || '',
  experienceRemarks: props?.selectedJob['experienceRemarks'] || '',
  numberEmployees: props?.selectedJob['numberEmployees'] || '',
  pickDrop: props?.selectedJob['pickDrop'] || '',
  availabilityOnCallSupport: props?.selectedJob['availabilityOnCallSupport'] || '',
  onCallCorrespondence: props?.selectedJob['onCallCorrespondence'] || '',
  prefectures: props?.selectedJob['prefectures'] || '',
  municipalities: props?.selectedJob['municipalities'] || '',
  street: props?.selectedJob['street'] || '',
  buildingName: props?.selectedJob['buildingName'] || '',
  upperAgeLimit: props?.selectedJob['upperAgeLimit'] || '',
  indeedJobCategory: props?.selectedJob['indeedJobCategory'] || '',
  presenceAbsenceResume: props?.selectedJob['presenceAbsenceResume'] || '',
  halfYearExp: props?.selectedJob['halfYearExp'] || '',

}
const jobData = ref({ ...jobDataObject })
const transactionTypeOptions = ref(applicantClassification);
const projectTypeOptions = ref(occupationList);
const facilityTypeOption = ref(facilityList);
const paymentTypeOption = ref(paymentTypeList);
const salaryTypeOption = ref(salaryTypeList);
const statusOption = ref(statusList);
const indeedTagOptions = ref(indeedTagList);
const employmentStatusOption = ref(employmentStatusList);
const resumeRequiredOption = ref(resumeRequiredList);
const halfYearExpOption = ref(reqList);
const indeedJobCategorOption = ref(indeedJobCategoryList);
const dialogVisible = ref(false)
const unsubscribe = ref();
const unsubscribeOffice = ref();
const clientList:Ref<Client[]> = ref([]);
const officeList:Ref<ClientOffice[]> = ref([]);
const transactionText = ref('')
const projectText = ref('')
const selectedIndustry = ref(null);
const jobForm = ref();
const jobItems = ref({});
const jobItemOptions = ref({});
const itemOptions:DocumentData = ref({})
const currentJobContent = ref('')
const editingIndex = ref(-1);
const jobItemId = ref({})
const optionId = ref('')
const industriesData:DocumentData = ref({})
const startEditing = (index) => {
  editingIndex.value = index;
};
const isEditing = (index) => {
  return editingIndex.value === index;
};
const stopEditing = () => {
  editingIndex.value = -1;
};

onMounted(async () => {
  clientList.value = await jobSearchStore.loadClientsData()
  jobData.value.transactionType = props?.selectedJob['transactionType'] || '';
  jobData.value.projectType = props?.selectedJob['projectType'] || '';
  jobData.value.client = props?.selectedJob['client'] || '';
  await jobSearchStore.loadJobItemSettingData(jobItemOptions, jobItems)
  await jobSearchStore.loadJobItemData(jobItems)
 industriesData.value = await jobSearchStore.getIndustries()
})

const industriesDataOptions = computed(() => {
  const options: object[] = [];
  if (Array.isArray(industriesData.value)) {
    for (const data of industriesData.value) {
      if (
        data &&
        data.uniqueItems &&
        Array.isArray(data.uniqueItems.typeSpecificItems)
      ) {
        for (const innerData of data.uniqueItems.typeSpecificItems) {
          options.push({ id: innerData.id, title: innerData.title });
        }
      }
    }
  }
  return options;
});

const saveJob = async () => {
  try {
    if (jobData.value.id) {
      await jobSearchStore.updateFormData(jobData.value)
      hideDrawer()

    } else {
      await jobSearchStore.addFormData(jobData.value)
      hideDrawer()
    }

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: t('success'),
    });
    jobData.value = { ...jobDataObject }
    jobForm.value.resetValidation();
  } catch (error) {
    console.log(error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: t('failed'),
    });
  }

}
const openJobOptionDrawer = (options, jobContent,itemId) => {
  itemOptions.value = options;
  currentJobContent.value = jobContent;
  jobItemId.value = itemId
  dialogVisible.value = true
}

const selectJobOption = async(data,id) => {
  if (jobData.value['jobContent'][currentJobContent.value] !== data['name']) {
    jobData.value['jobContent'][currentJobContent.value] = data['name']
  }
  try {
    if (data['id'] && jobData.value['jobContent'][currentJobContent.value] === data['name']) {
      jobData.value['jobContent'][currentJobContent.value] = data['name']
      await jobSearchStore.updateOption(id,data)

      } else {
        jobData.value['jobContent'][currentJobContent.value] = data['name']
         optionId.value = await jobSearchStore.addNewOption(id,data)
         await jobSearchStore.addId(id,data,optionId.value)
      }
      dialogVisible.value = false
      $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
      });

  } catch (error) {
      console.log(error);
      $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: t('failed'),
      });
  }

}
const addNewField = () => {
  itemOptions.value.unshift({ 'name': '' })
};
onBeforeUnmount(() => {
  if (unsubscribe.value) {
    unsubscribe.value();
  }
  if (unsubscribeOffice.value) {
    unsubscribeOffice.value();
  }

})

watch(
  () => (jobData.value.transactionType),
  (newVal,) => {
    transactionText.value = '';
    let obj = transactionTypeOptions.value.find(o => o.value === newVal);
    if (obj) {
      transactionText.value = obj.label;
    }
  }
)

watch(
  () => (jobData.value.projectType),
  (newVal,) => {
    projectText.value = '';
    let obj = projectTypeOptions.value.find(o => o.value === newVal);
    if (obj) {
      projectText.value = obj.label;
    }
  }
)

watch(
  () => (jobData.value.indeedTag),
  (newVal,) => {
    let jobType = 0;
    let coronaType = 0;
    for (var i = 0; i < newVal.length; i++) {
      if (indeedTagJobType.includes(newVal[i])) {
        jobType += 1;
      }
      else if (indeedTagCoronaType.includes(newVal[i])) {
        coronaType += 1;
      }
    }
    for (var i = 0; i < indeedTagOptions.value.length; i++) {
      indeedTagOptions.value[i]['disable'] = false;
      if (indeedTagOptions.value[i]['type'] == 'job') {
        if (jobType > 4 && !newVal.includes(indeedTagOptions.value[i]['value'])) {
          indeedTagOptions.value[i]['disable'] = true;
        }

      }
      if (indeedTagOptions.value[i]['type'] == 'corona') {
        if (coronaType > 2 && !newVal.includes(indeedTagOptions.value[i]['value'])) {
          indeedTagOptions.value[i]['disable'] = true;
        }
      }
    }
  }
)

watch(
  () => (jobData.value.client),
  async (newVal,) => {
    officeList.value = [];
    if (unsubscribeOffice.value) {
      unsubscribeOffice.value();
    }
    if (newVal) {
      officeList.value = await jobSearchStore.loadOfficeData(newVal['id'])
    }
  }
)

watch(
  () => selectedIndustry.value,
  (newValue) => {
    for (const data of industriesData.value) {
      for (const innerData of data.uniqueItems.typeSpecificItems) {
        if (innerData.id === newValue) {
          innerData.title = selectedIndustry.value;
          return;
        }
      }
    }
  }
);

</script>
<style >
.my-dialog .q-dialog__backdrop {
  background-color: transparent;
}
</style>
