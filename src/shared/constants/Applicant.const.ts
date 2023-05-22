import { computed } from 'vue';
import { i18n } from 'boot/i18n'
import { ApplicantStatus } from '../model';

const { t } = i18n.global

export const statusList = computed(() => {
  return [
    {
        label: t('applicant.statusOption.unsupported'),
        value: ApplicantStatus.UNSUPPORTED,
    },
    {
        label: t('applicant.statusOption.waitingContact'),
        value: ApplicantStatus.WAIT_CONTACT,
    },
    {
        label: t('applicant.statusOption.excluded'),
        value: ApplicantStatus.EXCLUDED,
    },
    {
        label: t('applicant.statusOption.anotherCompany'),
        value: ApplicantStatus.ANOTHER_COMPANY,
    },
    {
        label: t('applicant.statusOption.breakContact'),
        value: ApplicantStatus.BREAK_CONTACT,
    },
    {
        label: t('applicant.statusOption.decline'),
        value: ApplicantStatus.DECLINE,
    },
    {
        label: t('applicant.statusOption.wait_attend'),
        value: ApplicantStatus.WAIT_ATTEND,
    },
    {
        label: t('applicant.statusOption.wait_FIX'),
        value: ApplicantStatus.WAIT_FIX,
    },
    {
        label:t( 'applicant.statusOption.wait_visit'),
        value :ApplicantStatus.WAIT_VISIT
     },
     {
         label:t( 'applicant.statusOption.wait_entry'),
         value :ApplicantStatus.WAIT_ENTRY
     },
     {
         label:t( 'applicant.statusOption.working'),
         value :ApplicantStatus.WORKING
     },
     {
         label:t( 'applicant.statusOption.wait_termination'),
         value :ApplicantStatus.WAIT_TERMINATION
     },
     {
         label:t( 'applicant.statusOption.wait_retire'),
         value :ApplicantStatus.WAIT_RETIRE
     },
     {
         label:t( 'applicant.statusOption.retired'),
         value :ApplicantStatus.RETIRED
     }
  ];
});

export const applicationMethod = computed(() => {
  return [{
    label: t('applicant.add.web'),
    value: 'web'
  },{
    label: t('applicant.add.tel'),
    value: 'tel'
  },]
})

export const employmentStatus = computed(() => {
  return [{
    label: t('applicant.list.info.working'),
    value: 'working'
  },{
    label: t('applicant.list.info.notWorking'),
    value: 'notWorking'
  },]
})

export const attendantStatus = computed(() =>{
  return [{
    label: 'OK',
    value: 'ok'
  }, {
    label: 'NG',
    value: 'ng'
  }]
})

export const notApplicableFixList = [{
  label: t('applicant.list.fixEmployment.age'),
  value: 'age'
}, {
  label: t('applicant.list.fixEmployment.antiSocial'),
  value: 'antiSocial'
}, {
  label: t('applicant.list.fixEmployment.age'),
  value: 'introductionsNotAllowed'
}, {
  label: t('applicant.list.fixEmployment.employmentUnacceptable'),
  value: 'employmentUnacceptable'
}]

export const decidedFixList = [{
  label: t('applicant.list.fixEmployment.dispatch'),
  value: 'dispatch'
}, {
  label: t('applicant.list.fixEmployment.directHire'),
  value: 'directHire'
}]

export const registrationDeclinedFixList = [{
  label: t('applicant.list.fixEmployment.noDesiredProjects'),
  value: 'noDesiredProjects'
}, {
  label: t('applicant.list.fixEmployment.noDesireWork'),
  value: 'noDesireWork'
}]

export const daysList = computed(() => [{
  label: t('weekDay.sunday'),
  value: 'sunday'
},{
  label: t('weekDay.monday'),
  value: 'monday'
},{
  label: t('weekDay.tuesday'),
  value: 'tuesday'
},{
  label: t('weekDay.wednesday'),
  value: 'wednesday'
},{
  label: t('weekDay.friday'),
  value: 'friday'
},{
  label: t('weekDay.saturday'),
  value: 'saturday'
},{
  label: t('weekDay.holiday'),
  value: 'holiday'
}])

export const specialDaysList = computed(() => [{
  label: t('applicant.attendant.specialDays.gw'),
  value: 'gw'
},{
  label: t('applicant.attendant.specialDays.festival'),
  value: 'festival'
},{
  label: t('applicant.attendant.specialDays.christmas'),
  value: 'christmas'
}])

export const PossibleTransportationServicesList = computed(() => [{
  label: t('applicant.attendant.possible'),
  value: 'possible'
},{
  label: t('applicant.attendant.no'),
  value: 'no'
}])

export const occupationList = computed(() => [{
  label: t('applicant.add.nurse'),
  value: 'nurse'
}, {
  label: t('applicant.add.nursingCare'),
  value: 'nursingCare'
}, {
  label: t('applicant.add.lifeCounselor'),
  value: 'lifeCounselor'
}, {
  label: t('applicant.add.careManager'),
  value: 'careManager'
}, {
  label: t('applicant.add.others'),
  value: 'others'
}])

export const expertiseLevelList = computed(() => [{
  label: t('applicant.attendant.performance'),
  value: 'performance'
},{
  label: t('applicant.attendant.excellent'),
  value: 'excellent'
},{
  label: t('applicant.attendant.good'),
  value: 'good'
},{
  label: t('applicant.attendant.possible'),
  value: 'possible'
},{
  label: t('applicant.attendant.no'),
  value: 'no'
}])


export const smokingStatusList = computed(() => [{
  label: t('smoking.no'),
  value: 'no'
},{
  label: t('smoking.yes'),
  value: 'yes'
},{
  label: t('smoking.paper'),
  value: 'paper'
},{
  label: t('smoking.electronic'),
  value: 'electronic'
},{
  label: t('smoking.noWhileWworking'),
  value: 'noWhileWorking'
},{
  label: t('smoking.acceptable'),
  value: 'acceptable'
},{
  label: t('smoking.notPossible'),
  value: 'notPossible'
}])


export const marriedStatusList = computed(() => [{
  label: t('marriedStatus.married'),
  value: 'married'
},{
  label: t('marriedStatus.unmarried'),
  value: 'unmarried'
},])

export const tattoosStatusList = computed(() => [{
  label: t('tattoos.nil'),
  value: 'nil'
},{
  label: t('tattoos.yes'),
  value: 'yes'
},])

export const applicantClassification = computed(() => {
  return [{
    label: t('applicant.list.info.classification.introduction'),
    value: 'introduction'
  },{
    label: t('applicant.list.info.classification.dispatch'),
    value: 'dispatch'
  },{
    label: t('applicant.list.info.classification.TTP'),
    value: 'TTP'
  }]
})


export const qualificationList = computed(() => {
  return [
    {
      label: t('applicant.add.registeredNurse'),
      value: 'registeredNurse'
    },
    {
      label: t('applicant.add.assistantNurse'),
      value: 'assistantNurse'
    },
    {
      label: t('applicant.add.newcomer'),
      value: 'newcomer'
    },
    {
      label: t('applicant.add.careWorker'),
      value: 'careWorker'
    },
  ]
})
 
export const availableShiftList = computed(() => {
  return [
    {
      label: t('office.earlyShift'),
      value: 'workinghoursearly'
    },
    {
      label: t('office.dayShift'),
      value: 'workinghoursday'
    },
    {
      label: t('office.lateShift'),
      value: 'workinghourslate'
    },
    {
      label: t('office.nightShift'),
      value: 'workinghoursnight'
    },
  ]
})
 
export const sexList = computed(() => {
  return [
    {
      label: t('applicant.add.male'),
      value: 'male'
    },
    {
      label: t('applicant.add.female'),
      value: 'female'
    },
  ]
})
 
export const rankList = computed(() => {
  return [
    {
      label: 'S',
      value: 'S'
    },
    {
      label: 'A',
      value: 'A'
    },
    {
      label: 'B',
      value: 'B'
    },
    {
      label: 'C',
      value: 'C'
    },
    {
      label: 'D',
      value: 'D'
    },
    {
      label: 'E',
      value: 'E'
    },
  ]
})
 
export const applicantListColumn = computed(() => {
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
      name: 'rank',
      required: true,
      label: t('applicant.list.rank'),
      field: 'rank',
      align: 'left',
    },
    {
      name: 'status',
      required: true,
      label: t('applicant.list.status'),
      field: 'status',
      align: 'left',
    },
    {
      name: 'qualification',
      required: true,
      label: t('applicant.list.qualification'),
      field: 'qualification',
      align: 'left',
    },
 
  ];
})

