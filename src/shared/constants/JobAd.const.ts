
import { computed } from 'vue';
import { i18n } from 'boot/i18n'
import { QTableProps } from 'quasar';

const { t } = i18n.global

export const paymentTypeList = computed(() => {
  return [
    {
      label: t('job.add.paymentTypeList.daily'),
      value: 'daily',
    },
    {
      label: t('job.add.paymentTypeList.monthly'),
      value: 'monthly',
    }
  ]
});

export const salaryTypeList = computed(() => {
  return [
    {
      label: t('applicant.add.hourlyWage'),
      value: 'hourly',
    },
    {
      label: t('applicant.add.monthlySalary'),
      value: 'monthly',
    }
  ]
});

export const statusList = computed(() => {
  return [
    {
      label: t('job.add.statusList.notRecruited'),
      value: 'notRecruited',
    },
    {
      label: t('job.add.statusList.recruiting'),
      value: 'recruiting',
    },
    {
      label: t('job.add.statusList.finished'),
      value: 'finished',
    },
  ]
});

export const employmentStatusList = computed(() => {
  return [
    {
      label: t('job.add.employmentStatusList.fullTime'),
      value: 'fullTime',
    },
    {
      label: t('job.add.employmentStatusList.partTime'),
      value: 'partTime',
    },
    {
      label: t('job.add.employmentStatusList.dispatched'),
      value: 'dispatched',
    },
    {
      label: t('job.add.employmentStatusList.contract'),
      value: 'contract',
    },
    {
      label: t('job.add.employmentStatusList.intern'),
      value: 'intern',
    },
    {
      label: t('job.add.employmentStatusList.subcontracting'),
      value: 'subcontracting',
    },
    {
      label: t('job.add.employmentStatusList.volunteer'),
      value: 'volunteer',
    },
    {
      label: t('job.add.employmentStatusList.newGraduate'),
      value: 'newGraduate',
    },
    {
      label: t('job.add.employmentStatusList.contractor'),
      value: 'contractor',
    },
    {
      label: t('job.add.employmentStatusList.rehired'),
      value: 'rehired',
    },

  ]
});

export const reqList = computed(() => {
  return [
    {
      label: t('client.backOrder.necessary'),
      value: 'necessary',
    },
    {
      label: t('client.backOrder.unnecessary'),
      value: 'unnecessary',
    },
  ]
});

export const indeedJobCategoryList = computed(() => {
  return [
    {
      label: t('job.add.indeedJobCategoryList.eatingDrinkingFood'),
      value: 'eatingDrinkingFood',
    },
    {
      label: t('job.add.indeedJobCategoryList.salesCustomerService'),
      value: 'salesCustomerService',
    },
    {
      label: t('job.add.indeedJobCategoryList.leisureEventEntertainment'),
      value: 'leisureEventEntertainment',
    },
    {
      label: t('job.add.indeedJobCategoryList.sales'),
      value: 'sales',
    },
    {
      label: t('job.add.indeedJobCategoryList.clericalWorkOfficeWork'),
      value: 'clericalWorkOfficeWork',
    },
    {
      label: t('job.add.indeedJobCategoryList.education'),
      value: 'education',
    },
    {
      label: t('job.add.indeedJobCategoryList.deliveryMovingDriver'),
      value: 'deliveryMovingDriver',
    },
    {
      label: t('job.add.indeedJobCategoryList.easyWork'),
      value: 'easyWork',
    },
    {
      label: t('job.add.indeedJobCategoryList.architectureCivilEngineering'),
      value: 'architectureCivilEngineering',
    },
    {
      label: t('job.add.indeedJobCategoryList.factoryManufacturing'),
      value: 'factoryManufacturing',
    },
    {
      label: t('job.add.indeedJobCategoryList.itCreative'),
      value: 'itCreative',
    },
    {
      label: t('job.add.indeedJobCategoryList.beautyBarberSalon'),
      value: 'beautyBarberSalon',
    },
    {
      label: t('job.add.indeedJobCategoryList.medicalNursingChildcare'),
      value: 'medicalNursingChildcare',
    },
    {
      label: t('job.add.indeedJobCategoryList.securityCleaningBuilding'),
      value: 'securityCleaningBuilding',
    },


  ]
});

export const indeedTagList = computed(() => {
  return [
    {
      label: `<span class="text-body1 text-primary text-weight-bold"> ${t('job.add.indeedTagList.jobTag')}</span>`,
      value: '',
      disable: true,
    },
    {
      label: t('job.add.indeedTagList.employeePromotions'),
      value: 'employeePromotions',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.payRaiseAvailable'),
      value: 'payRaiseAvailable',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.noOvertime'),
      value: 'noOvertime',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.ok1dayWeek'),
      value: 'ok1dayWeek',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.ok23DayWeek'),
      value: 'ok23DayWeek',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.freeShift'),
      value: 'freeShift',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.paidTransportationExpenses'),
      value: 'paidTransportationExpenses',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.sameDayWorkOK'),
      value: 'sameDayWorkOK',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.urgentNeeded'),
      value: 'urgentNeeded',
      type: 'job',
    },
    {
      label: t('job.add.indeedTagList.within5minutesStation'),
      value: 'within5minutesStation',
      type: 'job',
    },
    {
      label: `<span class="text-body1 text-primary text-weight-bold"> ${t('job.add.indeedTagList.newCoronavirusRelatedTags')}</span>`,
      value: '',
      disable: true,
    },
    {
      label: t('job.add.indeedTagList.completelyHome'),
      value: 'completelyHome',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.okStayHome'),
      value: 'okStayHome',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.flextimeSystem'),
      value: 'flextimeSystem',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.workingHours'),
      value: 'workingHours',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.staggeredWorkingHours'),
      value: 'staggeredWorkingHours',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.workStartTimeAdjustment'),
      value: 'workStartTimeAdjustment',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.remoteInterviewOK'),
      value: 'remoteInterviewOK',
      type: 'corona',
    },
    {
      label: t('job.add.indeedTagList.wearMaskWhenInterviewing'),
      value: 'wearMaskWhenInterviewing',
      type: 'corona',
    },
  ]
});


export const resumeRequiredList = computed(() => {
  return [
    {
      label: t('job.add.resumeRequiredList.required'),
      value: 'required',
    },
    {
      label: t('job.add.resumeRequiredList.notRequired'),
      value: 'notRequired',
    },
  ]
});

export const indeedTagJobType = ['employeePromotions', 'payRaiseAvailable', 'noOvertime', 'ok1dayWeek', 'ok23DayWeek', 'freeShift', 'paidTransportationExpenses', 'sameDayWorkOK', 'urgentNeeded', 'within5minutesStation'];
export const indeedTagCoronaType = ['completelyHome', 'okStayHome', 'flextimeSystem', 'workingHours', 'staggeredWorkingHours', 'workStartTimeAdjustment', 'remoteInterviewOK', 'wearMaskWhenInterviewing'];


export const jobSearchColumns = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'boid',
      required: true,
      label: t('job.createdByBOID'),
      field: 'boid',
      align: 'left',
    },
    {
      name: 'office',
      required: true,
      label: '',
      align: 'left',
      field: 'office',
      sortable: false,
    },
    {
      name: 'projectType',
      required: true,
      label: t('job.projectType'),
      field: 'projectType',
      align: 'left',
    },
    {
      name: 'facilityType',
      required: true,
      label: t('job.facilityForm'),
      field: 'facilityType',
      align: 'left',
    },
    {
      name: 'transactionType',
      required: true,
      label: t('job.transactionType'),
      field: 'transactionType',
      align: 'left',
    },
    {
      name: 'author',
      required: true,
      label: '',
      field: 'author',
      align: 'left',
    },
    {
      name: 'numberOfIssues',
      required: true,
      label: t('job.numberOfIssues'),
      field: 'numberOfIssues',
      align: 'left',
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },

  ];
});

export const mediaList = computed(() => {
  return [
    {
      label: 'Indeed',
      value: 'indeed',
    },
  ]
});

export const jobAdColumns = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'jobName',
      required: true,
      label: '',
      align: 'left',
      field: 'jobName',
      sortable: false,
    },
    {
      name: 'projectType',
      required: true,
      label: '',
      align: 'left',
      field: 'projectType',
      sortable: false,
    },
    {
      name: 'issuingFormat',
      required: true,
      label: '',
      align: 'left',
      field: 'issuingFormat',
      sortable: false,
    },
    {
      name: 'area',
      required: true,
      label: '',
      align: 'left',
      field: 'area',
      sortable: false,
    },
    {
      name: 'media',
      required: true,
      label: t('jobAd.add.media'),
      align: 'left',
      field: 'media',
      sortable: false,
    },
    {
      name: 'numApplications',
      required: true,
      label: t('jobAd.list.numApplications'),
      align: 'left',
      field: 'numApplications',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
    {
      name: 'author',
      required: true,
      label: '',
      align: 'left',
      field: 'author',
      sortable: false,
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },

  ]
});

export const regionSalaryColumns = computed(() => {
  return [
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'numPrefectures',
      required: true,
      label: t('regionSalary.list.numPrefectures'),
      align: 'left',
      field: 'numPrefectures',
      sortable: false,
    },
    {
      name: 'numMunicipalities',
      required: true,
      label: t('regionSalary.list.numMunicipalities'),
      align: 'left',
      field: 'numMunicipalities',
      sortable: false,
    },
    {
      name: 'monthlySalary',
      required: true,
      label: '',
      align: 'left',
      field: 'monthlySalary',
      sortable: false,
    },
    {
      name: 'hourlySalary',
      required: true,
      label: '',
      align: 'left',
      field: 'hourlySalary',
      sortable: false,
    },
    {
      name: 'jobOpenings',
      required: true,
      label: t('regionSalary.list.jobOpenings'),
      align: 'left',
      field: 'jobOpenings',
      sortable: false,
    },
    {
      name: 'numStaff',
      required: true,
      label: t('regionSalary.list.numStaff'),
      align: 'left',
      field: 'numStaff',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
    {
      name: 'author',
      required: true,
      label: '',
      align: 'left',
      field: 'author',
      sortable: false,
    },
    {
      name: 'updatedBy',
      required: true,
      label: '',
      align: 'left',
      field: 'updatedBy',
      sortable: false,
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },
  ]
});


export const regionSalaryAddColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'prefecture',
      required: true,
      label: t('applicant.add.prefecture'),
      align: 'left',
      field: 'prefecture',
      sortable: false,
    },
    {
      name: 'ward',
      required: true,
      label: t('applicant.add.municipalities'),
      align: 'left',
      field: 'ward',
      sortable: false,
    },
    {
      name: 'monthlySalary',
      required: true,
      label: '',
      align: 'left',
      field: 'monthlySalary',
      sortable: false,
    },
    {
      name: 'hourlySalary',
      required: true,
      label: '',
      align: 'left',
      field: 'hourlySalary',
      sortable: false,
    },
    {
      name: 'jobOpenings',
      required: true,
      label: t('regionSalary.list.jobOpenings'),
      align: 'left',
      field: 'jobOpenings',
      sortable: false,
    },
    {
      name: 'numStaff',
      required: true,
      label: t('regionSalary.list.numStaff'),
      align: 'left',
      field: 'numStaff',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
  ]
});

export const formatColumns = computed(() => {
  return [
    {
      name: 'edit',
      required: true,
      label: '',
      align: 'left',
      field: 'edit',
      sortable: false,
    },
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'media',
      required: true,
      label: t('formatSetting.mediaName'),
      align: 'left',
      field: 'media',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
    {
      name: 'author',
      required: true,
      label: '',
      align: 'left',
      field: 'author',
      sortable: false,
    },
    {
      name: 'updatedBy',
      required: true,
      label: '',
      align: 'left',
      field: 'updatedBy',
      sortable: false,
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },
  ]
})

export const phraseColumns = computed(() => {
  return [
    {
      name: 'edit',
      required: true,
      label: '',
      align: 'left',
      field: 'edit',
      sortable: false,
    },
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'content',
      required: true,
      label: t('settings.template.contents'),
      align: 'left',
      field: 'content',
      sortable: false,
    },
    {
      name: 'category',
      required: true,
      label: t('releaseNotes.form.category'),
      align: 'left',
      field: 'category',
      sortable: false,
    },
    {
      name: 'numUsers',
      required: true,
      label: t('phraseSettings.numUsers'),
      align: 'left',
      field: 'numUsers',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
    {
      name: 'author',
      required: true,
      label: '',
      align: 'left',
      field: 'author',
      sortable: false,
    },
    {
      name: 'updatedBy',
      required: true,
      label: '',
      align: 'left',
      field: 'updatedBy',
      sortable: false,
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },
  ]
})

export const phraseCategoryList = computed(() => {
  return [
    {
      label: t('job.add.employmentContract'),
      value: 'employmentContract',
    },
    {
      label: t('job.add.jobContent'),
      value: 'jobContent',
    },
    {
      label: t('job.add.employmentConditions'),
      value: 'employmentConditions',
    },
    {
      label: t('job.add.mediaInformation'),
      value: 'mediaInformations',
    },
  ]
})

export const jobItemColumns = computed(() => {
  return [
    {
      name: 'edit',
      required: true,
      label: '',
      align: 'left',
      field: 'edit',
      sortable: false,
    },
    {
      name: 'name',
      required: true,
      label: '',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'category',
      required: true,
      label: t('jobItem.category'),
      align: 'left',
      field: 'category',
      sortable: false,
    },
    {
      name: 'dataType',
      required: true,
      label: t('phraseSettings.add.dataType'),
      align: 'left',
      field: 'dataType',
      sortable: false,
    },
    {
      name: 'numUsers',
      required: true,
      label: t('phraseSettings.numUsers'),
      align: 'left',
      field: 'numUsers',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
    {
      name: 'author',
      required: true,
      label: '',
      align: 'left',
      field: 'author',
      sortable: false,
    },
    {
      name: 'updatedBy',
      required: true,
      label: '',
      align: 'left',
      field: 'updatedBy',
      sortable: false,
    },
    {
      name: 'action',
      required: true,
      label: '',
      field: 'action',
      align: 'left',
    },
  ]
})

export const jobItemOptionColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      name: 'edit',
      required: true,
      label: '',
      align: 'left',
      field: 'edit',
      sortable: false,
    },
    {
      name: 'name',
      required: true,
      label: t('jobItem.add.optionContent'),
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'numUsers',
      required: true,
      label: t('phraseSettings.numUsers'),
      align: 'left',
      field: 'numUsers',
      sortable: false,
    },
    {
      name: 'reactionScore',
      required: true,
      label: t('regionSalary.list.reactionScore'),
      align: 'left',
      field: 'reactionScore',
      sortable: false,
    },
  ]
})

export const dataTypeList = computed(() => {
  return [
    {
      label: t('jobItem.dataTypeList.option'),
      value: 'option',
    },
    {
      label: t('jobItem.dataTypeList.number'),
      value: 'number',
    },
    {
      label: t('jobItem.dataTypeList.freeText'),
      value: 'freeText',
    },

  ]
})

export const formatSettingItemList = computed(() => {
  return [
    {
      name: t('job.add.status'),
      value: 'status',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.companyName'),
      value: 'companyName',
      type: 'text',
      option: '',
    },
    {
      name: t('applicant.add.occupation'),
      value: 'occupation',
      type: 'select',
      option: 'occupation'
    },
    {
      name: t('formatSetting.add.jobcatchCopy'),
      value: 'jobTag',
      type: 'select',
      option: 'jobTag'
    },
    {
      name: t('formatSetting.add.jobCategory'),
      value: 'jobCategory',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.workLocation'),
      value: 'workLocation',
      type: 'text',
      option: '',
    },
    {
      name: t('client.backOrder.employmentStatus'),
      value: 'employmentStatus',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.minSalary'),
      value: 'minSalary',
      type: 'text',
      option: '',
    },
    {
      name: t('job.add.salaryCap'),
      value: 'salaryCap',
      type: 'text',
      option: '',
    },
    {
      name: t('job.add.salaryType'),
      value: 'salaryType',
      type: 'text',
      option: '',
    },
    {
      name: t('job.add.jobContent') + '(' + t('job.add.jobContent') + ')',
      value: 'jobContent',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('job.add.appealPoint') + ')',
      value: 'appealPoint',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('formatSetting.add.workingHours') + ')',
      value: 'workingHours',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('formatSetting.add.leaveHolidays') + ')',
      value: 'leaveHolidays',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('formatSetting.add.workLocation') + ')',
      value: 'workLocation',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('formatSetting.add.access') + ')',
      value: 'access',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('job.add.treatmentBenefits') + ')',
      value: 'treatmentBenefits',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('job.add.jobContent') + '(' + t('applicant.add.others') + ')',
      value: 'others',
      type: 'select',
      option: 'jobContent'
    },
    {
      name: t('formatSetting.add.postingImage'),
      value: 'postingImage',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.tag'),
      value: 'tag',
      type: 'text',
      option: '',
    },
    {
      name: t('job.add.presenceAbsenceResume'),
      value: 'presenceAbsenceResume',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.infoApplicants'),
      value: 'infoApplicants',
      type: 'text',
      option: '',
    },
    {
      name: t('job.add.email'),
      value: 'email',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.phone'),
      value: 'phone',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.judgingQuestions'),
      value: 'judgingQuestions',
      type: 'text',
      option: '',
    },
    {
      name: t('formatSetting.add.jobId'),
      value: 'jobIdFormat',
      type: 'text',
      option: '',
    },

  ]
})
