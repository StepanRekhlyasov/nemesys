import { ComputedRef, computed } from 'vue';
import { i18n } from 'boot/i18n'
import { ApplicantStatus } from '../model';
import { QTableProps } from 'quasar';
import { useOrganization } from 'src/stores/organization';
import { mapToSelectOptions } from '../utils/User.utils';

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
        label:t( 'applicant.statusOption.wait_offer'),
        value :ApplicantStatus.WAIT_OFFER
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
    value:  true
  }, {
    label: 'NG',
    value: false
  }]
})

export const notApplicableFixList = computed(()=>[{
  label: t('applicant.list.fixEmployment.age'),
  value: 'age'
}, {
  label: t('applicant.list.fixEmployment.antiSocial'),
  value: 'antiSocial'
}, {
  label: t('applicant.list.fixEmployment.introductionsNotAllowed'),
  value: 'introductionsNotAllowed'
}, {
  label: t('applicant.list.fixEmployment.employmentUnacceptable'),
  value: 'employmentUnacceptable'
}])

export const decidedFixList = computed(()=>[{
  label: t('applicant.list.fixEmployment.dispatch'),
  value: 'dispatch'
}, {
  label: t('applicant.list.fixEmployment.directHire'),
  value: 'directHire'
}])

export const registrationDeclinedFixList = computed(()=>[{
  label: t('applicant.list.fixEmployment.noDesiredProjects'),
  value: 'noDesiredProjects'
}, {
  label: t('applicant.list.fixEmployment.noDesireWork'),
  value: 'noDesireWork'
}])

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
  label: t('weekDay.thursday'),
  value: 'thursday'
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

export const usersInCharge = computed(()=>{
  const organization = useOrganization()
  try{
    return mapToSelectOptions(organization.state.currentOrganizationUsers)
  } catch {
    return []
  }
});

export const contactColumns : ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'edit',
      align: 'left',
      label: '',
      field: '',
      headerStyle: 'width: 24px'
    },
    {
      name: 'created_at',
      required: true,
      label: t('applicant.list.contacts.dateTime'),
      field: 'created_at',
      align: 'left',
    },
    {
      name: 'contactMethod',
      required: true,
      label: t('applicant.list.contacts.contactMethod'),
      field: 'contactMethod',
      align: 'left',
    },
    {
      name: 'created_by',
      label: t('applicant.list.contacts.userInharge'),
      field: 'created_by',
      align: 'left',
    },
    {
      name: 'content',
      label: t('applicant.list.contacts.content'),
      field: 'content',
      align: 'left',
    },
    {
      name: 'note',
      label: t('applicant.list.contacts.note'),
      field: 'note',
      align: 'left',
    },
    {
      name: 'delete',
      align: 'left',
      label: '',
      field: '',
    }
  ];
});

export const workExpColumns : ComputedRef<QTableProps['columns']> = computed(() => {
  return [
    {
      name: 'edit',
      field: '',
      label: '',
      align: 'left',
      headerStyle: 'width: 24px',
    },
    {
      name: 'experience',
      required: true,
      label: '',
      align: 'left',
      field: 'experience',
      sortable: false,
    },{
      name: 'month',
      required: true,
      label: '',
      field: 'month',
      align: 'left',
    },{
      name: 'years',
      required: true,
      label: t('applicant.attendant.years') ,
      field: 'years',
      align: 'left',
    },{
      name: 'establishment',
      field: 'establishment',
      label: '',
      align: 'left',
    },{
      name: 'reasonResignation',
      label: t('applicant.attendant.reasonResignation') ,
      field: 'reasonResignation',
      align: 'left',
    },{
      name: 'pastInterviews',
      label: t('applicant.attendant.pastInterviews') ,
      field: 'pastInterviews',
      align: 'left',
    },
    {
      name: 'delete',
      label: '',
      field: '',
      align: 'left',
    }
  ];
});

const organization = useOrganization()

export const requiredFields = computed(()=>{
  return {
    'staffRank' : 0,
    'occupation' : '',
    'classification' : '',
    'currentStatusTimestamp' : '',
    'organizationId' : organization.currentOrganizationId,
  }
})

export const applicantStatusOkFields = {
  'attractionsStatus' : ApplicantStatus.WAIT_ATTEND,
  'attendingStatus' : ApplicantStatus.WAIT_FIX,
  'fixStatus' : ApplicantStatus.WAIT_VISIT,
  'inspectionStatus' : ApplicantStatus.WAIT_OFFER,
  'offerStatus' : ApplicantStatus.WAIT_ENTRY,
  'admissionStatus' : ApplicantStatus.WORKING,
}

export const applicantStatusDates = {
  [ApplicantStatus.WAIT_CONTACT] : 'applicationDate',
  [ApplicantStatus.WAIT_ATTEND] : 'invitationDate',
  [ApplicantStatus.WAIT_FIX] : 'attendingDate',
  [ApplicantStatus.WAIT_VISIT] : 'fixDate',
  [ApplicantStatus.WAIT_OFFER] : 'inspectionDate',
  [ApplicantStatus.WAIT_ENTRY] : 'offerDate',
  [ApplicantStatus.WAIT_TERMINATION] : 'endDate',
}