// This is just an example,
// so you can safely delete all default props below

export default {
  systemName: 'Recruitment System',
  login: {
    title: 'Sign In',
    subTitle:
      'Login is required to use this system. Please enter your credentials to log in.',
    email: 'Email',
    password: 'Password',
    button: 'Sign In',
  },
  form: {
    required: 'Field is required'
  },
  common: {
    add: 'Add',
    cancel: 'Cancel',
    description: 'Description',
    delete: 'Delete',
    deleteInfo: 'Are you sure you want to delete this item?',
    create: 'Create',
    title: 'Title',
    save: 'Save',
    edit: 'Edit',
    export: 'Export',
    disable: 'Disable',
    enable: 'Enable',
    close: 'Close',
    reset: 'Reset',
    faq: 'FAQ',
    contact: 'Contact Us',
    tos: 'Terms of Service',
    policy: 'Privacy Policy',
    update: 'Successfully updated!',
    clear: 'Clear',
    submit: 'Submit',
    remove: 'Remove',
    ok: 'OK',
    preview: 'Preview',
    yes: 'Yes',
    no: 'No',
    possible: 'Possible',
    impossible: 'Impossible',
    yesShort: 'Yes',
    above: 'Above',
    moreThan: 'or More',
    pleaseSelect: 'Please Select',
    addNew: 'Add New',
    search: 'Search',
    keyboard: 'Keyboard',
    closeArea: 'Close Display Area',
    openArea: 'Open Display Area',
    yen: 'yen',
    year: 'year',
  },
  smoking: {
    no: 'No',
    yes: 'Yes',
    paper: 'Paper cigarettes',
    electronic: 'Electronic cigarettes',
    noWhileWworking: 'No smoking while working',
    acceptable: 'Acceptable',
    notPossible: 'Not possible'
  },
  marriedStatus: {
    married: 'Married',
    unmarried: 'Unmarried'
  },
  tattoos: {
    nil: 'Nil',
    yes: 'Yes'
  },
  weekDay: {
    sunday: 'Suny',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thurs',
    friday: 'Fri',
    saturday: 'Sat',
    holiday: 'Holiday',
  },
  menu: {
    clientManagement: 'Office Management',
    clientList: 'Client List/Search',
    clientReg: 'Client Registration',
    dashboard: 'Dashboard',
    system: 'System Settings',
    item: 'Item Master Management',
    branches: 'Branch Master Management',
    users: 'Responsible Master Management',
    organization: 'Organization Master Management',
    template: 'Template Management',
    applicant: 'Applicant Management',
    officeSearch: 'Office Search',
    savedSearchList: 'Saved Search Item List',
    mapSearch: 'Map Search',
    newApplicant: 'New Applicant Registration',
    applicantSearch : 'Applicant Search',
    areaSearch: 'Area Search',
    advancedSearch: 'Advanced search',
    addOffice: 'Add New Office',
    addOfficeHint: 'Click here to add a new office',
    addClient: 'Add new Client',
    addClientHint: 'Click here if you want to add a new office or client',
    admin: {
      officeManagement: 'Office management',
      enterpriseManagement: 'Enterprise management',
      aggregationData: 'Companywide total',
      licenseManagement: 'License management',
      billingInformation: 'Billing Information Management',
      systemsOperationManagement: 'Systems Operation Management',
      releaseNotesInquiry: 'Release Notes and Inquiries',
      releaseNotes: 'Release Notes',
      inquiry: 'Inquiry',
      userList: 'User list',
      userSearch: 'User search',
    }
  },
  settings: {
    branch: {
      addBranch: 'Add Branch',
      id: 'Branch ID',
      name: 'Branch Name',
      flag: 'Enable Flag',
      prefectures: 'Prefectures',
      phone: 'Phone Number',
      hidden: 'Hidden',
      hiddenFlag: 'Hidden Flag',
      create_at: 'Create At',
      last_update: 'Last Update',
      create_branch: 'Basic Company Information Edit',
      office: 'Main Office',
      municipalities: 'Municipalities',
      addres: 'Address/building name',
      fax: 'FAX number',
      email: 'e-mail',
      car_commuting: 'Car Commuting',
      eat_cigarettes: 'Can I eat cigarettes?',
      garage: 'Garage availability',
      hide: 'Hide',
      deletedInfo: 'All data related to this branch will be deleted.',
      flags: {
        all: 'All',
        valid: 'Valid'
      }
    },
    template: {
      addNew: 'New mail template added',
      name: 'Template Name',
      type: 'Type',
      subject: 'Subject',
      contents: 'Contents',
      mail: 'Mail',
      sms: 'SMS',
      deletedInfo: 'All data related to this template will be deleted.',
      edit: 'Mail template edit',

      create_at: 'Create At',
      last_update: 'Last Update',
    },
    item: {
      addItem: 'Add new item',
      id: 'Classification Id',
      name: 'Classification Name',
      itemName: 'Item Name',
      displayOrder: 'Display Order',
      flag: 'Enable Flag',
      hide: 'Hide',
      edit: 'Item Edit',
      classification: {
        oualifications: 'Qualifications',
        job: 'Job Title',
        media: 'Application Media'
      }
    },
    users: {
      addUser: 'Add new contact person',
      fio: 'FIO',
      email: 'Email',
      password: 'Password',
      person_name: "Contact Person's Name",
      branch_name: 'Branch Name',
      company_name: 'User Company Name',
      passworld: 'passworld',
      role: 'Role',
      infoEditUser: 'Email addresses and user companies cannot be permanently changed',
      infoContact: 'If you wish to change your roll or login password, please contact your team administrator.',
      contact: 'Contact',
      deleteAccaunt: 'Delete Accaunt',
      manager: 'Manager',
      hidden: 'Hidden',
      create_at: 'Create At',
      last_update: 'Last Update',
      editProfile: 'Edit Profile',
      accauntSettings: 'Accaunt Settings',
      deletedInfo: 'All data related to this template will be deleted.',
      logout: 'Logout',
      adminPage: 'Open system administration page',
    },
    title: 'Settings'
  },
  client: {
    list: {
      clients: 'Clients',
      jobs: 'Jobs',
      destination: 'Destination',
      memo: 'Memo',
      address: 'address',
      distance: 'distance',
      score: 'Score',
      phone: 'phone',
      fax: 'Fax',
      officeLocation: 'Office Location',
      distanceStartingPoint: 'Distance from starting point',
      faxResponseRate: 'Fax Response Rate',
      boStatus: 'BO Status',
      achievement: 'Achievement',
      achievementPast: 'Achievement Past',
      headOffice: 'Head Office',
      masterDataAvailable: 'Master Data Available',
      clientDetail: 'Client Detail',
      client: 'Client',
      corporation: 'Corporation',
      contractStatus: 'Contract Status',
      contractInfo: 'Contract Info',
      personIncharge: 'Person Incharge',
      contactPerson: 'Contact Person',
      basicInfoUpdated: 'Basic Information Last Updated',
      infoUpdated: 'Info Last Update',
      performedBy: 'Performed By',
      editor: 'Editor',
      displayMasterInfo: 'Display Master Information',
      basicInfoMasterData: 'Basic information master data',
      note: 'Note',
      basicInfoNote: 'Since the basic information has been changed, it will not be updated automatically even if the information is updated.',
      overwriteBasicInfo: 'Overwrite Basic Information',
      search: 'Search',
      conditionSearch: 'Condition Search',
      searchResults: 'Search Results',
      searchButton: 'Search',
      keywordSearch: 'Search keyword',
      saveKeywords: 'Save Keywords',
      advancedSearch: 'Advanced Search',
      searchFromMap: 'Search from map',
      searchFromPref: 'Search from prefectures',
      faxNotAvailable: 'Fax not Available',
      detailedConditionSearch: 'Detailed condition search',
      keyboard: 'Keyboard',
      presenceContract: 'Presence of basic contract',
      availJobPostings: 'Availability of job postings',
      jobPostings: 'Job Postings',
      teleAppointmentInfo: 'Last Tele-Appointment Info',
      contactPeroneName: 'Contract Persone',
      postingStartDate: 'Posting period start date',
      postingEndDate: 'Posting period end date',
      evaluationRank: 'Evaluation Rank',
      dispatchIndex: 'Dispatch index',
      referralMetrics: 'Referral Metrics',
      status: 'Status',
      point: 'Point',
      periodStartDate: 'Period start date',
      numBOsAcquired: 'Number of BOs acquired',
      numBOs: 'Number of BOs',
      listBO: 'BO List',
      officeDetail: 'Office Detail',
      officeHead: 'Office Head',
      variousAchievements: 'Various Achievements',
      numFixResults: 'Number of FIX results',
      jobSearchResults: 'Job search results',
      numJobOffers: 'Number of job offers',
      hiringRecord: 'Hiring record',

      dispatchRecord: 'Dispatch record',
      referralResults: 'Referral results',
      dispatchedOtherCompanies: 'Dispatched to other companies (consulting only)',
      otherCompanyReferralResults: 'Other company referral results (consulting only)',

      pastEmploymentRecord: 'Past employment record',
      numFullTimeEmployees: 'Number of full-time employees employed',
      numPartTimeEmployees: 'Number of part-time employees',
      numTempEmployees: 'Number of general temporary workers',

      historySearch: 'Index/action history search',
      appointLastMonths: 'Tele appointment companies within the last two months',
      allTeleAppointedCompanies: 'All tele-appointed companies',
      connectedCompanies: 'Connected companies only',
      companiesOutService: 'Only companies that are all out of service',
      saveSearchConditions: 'Save Search Conditions',
      areaSearch: 'Area Search',
      listPrefectures: 'List of prefectures',
      mapSearch: 'Map Search',
      regionalSearch: 'Regional Search',
      originationStaff: 'Candidate Origination Staff',
      distanceFromOrigin: 'Distance from origin (km)',
      corporateSearch: 'Corporate search',
      addNewClient: 'Add new client',
      basicContractConclusion: 'Conclusion of basic contract',
      contactMorning: 'Contact Morning',
      contactAfternoon: 'Contact Afternoon',
      contactEvening: 'Contact Evening',
      numDispatchedBOs: 'Number of dispatched BOs',
      numInhouseDispatchedFIX: 'Number of in-house dispatched FIX',
      numInhouseDispatchedJobs: 'Number of in-house dispatched jobs',
      businessLocation: 'Business Location',
      callingTendency: 'Calling tendency of the current time zone',
      businessAddress: 'Business Address',
      tradingPerformance: 'Trading Performance',
      officesConcludedBasicContract: 'Within the same corporation other offices that have concluded a basic contract',
      contactTendency: 'Contact Tendency',
      position: 'Position',
      conditionalSearch: 'Conditional Search',
      searchByCondition: 'Search by set condition',
      addressHint: 'Please enter a place name. Example: Shinjuku Ward Kanagawa Prefecture',
      settingFromMap: 'Setting From Map',
      settingFromArea: 'Setting From Area',
      savedSearchList: 'savedSearchList',

    },
    add: {
      newReg: 'Client new registration',
      clientBasicInfo: 'Client basic information',
      clientName: 'Client Name',
      clientLabel: 'Ex) ◯◯◯ Co., Ltd.',
      updatingFax: 'Updating Fax List',
      faxReceptionNGTemp: 'Fax Reception NG (60 days)',
      cancelDate: 'Cancel Date',
      faxReceptionNG: 'Fax Reception NG',
      pharmacistClient: 'Pharmacist Client',
      clientType: 'Client Type',
      jobType: 'Job Categories',
      nurse: 'Nurse',
      nursing: 'Nurse Care',
      clientRepresentative: 'Client Representative',
      clientRepLabel: 'Ex) General Affairs Department: Taro Suzuki',
      address: 'Address',
      addressLabel: 'Ex) ◯◯◯, Shinjuku Ward, Tokyo',
      latitude: 'Latitude',
      longitude: 'Longitude',
      latitudeLabel: 'Ex) 35.658581',
      memo: 'Note',
      memoLabel: 'Ex) Please fill in any necessary items here.',
      workplaceInformation: 'Office',
      contractor: 'Contractor',
      contractorLabel: "This client's contract: Corporate lump sum (will be the contract for all offices)",
      prSheetDestination: 'PR Sheet Destination',
      priorityFlag: 'Priority',
      priorityFlagLabel:
        'Give priority to client information when displaying sub-offices',
      phoneNumber: 'Phone Number',
      phoneLabel: 'Ex）080-1234-5678',
      faxNumber: 'FAX Number',
      email: 'Email',
      emailLabel1: 'Ex）example',
      emailLabel2: 'example.co.jp',
      manager: 'Manager',
      managerLabel: 'Ex) Taro Suzuki',

      //
      integrationSource: 'Integration Source',
      copInfo: 'Coperation Info',
      options: {
        transactionHistory: 'Transaction History',
        noFaxSending: 'No Fax Sending',
        faxSending: 'Fax Sending',
        fixNumberLimit: 'Fix Number Limit',
      },
      facilityType: 'Facility Type',
      facilityOp: {
        medicalClinic: 'Medical Clinic ',
        homeVisitCare: 'Home Visit Care',
        dayCare: 'Day Care',
        homeVisitRehabilitation: 'Home-visit rehabilitation',
        longMedicalFacility: 'Long-term care medical facility',
        homeNursing: 'Home-visit nursing care',
        shortStay: 'Short stay',
        dayService: 'Day service',
        nursingCareElderly: 'Health care facility for the elderly',
        specialElderlyNursingHome: 'Special nursing home for the elderly',
        paidNursingHome: 'Pay nursing home',
        groupHome: 'Group home',
        smallMultifunFacility: 'Small-scale multi-functional facility',
        homeCareNursing: 'Home-visit care nursing',
        elderlyHousingServices: 'Residence for the elderly with services',
        clinic: 'Clinic',
        hospital: 'Hospital',
        careHouse: 'Care House',
        nursingCareClinic: 'Nursing and medical care home',
        dementiaLivingCare: 'Dementia-compatible communal living car',
        longCareWelfareFacilityElderly:
          'Long-term care welfare facility for the elderly',
        communityNursingElderly:
          'Community-based long-term care facility for the elderly',
        communitySpecificFacility: 'Community-based specified facility',
        dayCareFacility: 'Day-care facility',
        homeCare: 'In-home care',
        specifiedWelfareSales: 'Specified welfare equipment sales',
        shortResidentialCare: 'Short-term residential care',
        lendingWelfareEquipment: 'Lending of welfare equipment',
        homeBathingCare: 'Home bathing care',
        livelihoodResidentFacility:
          'Livelihood care for residents of specified facility',
        outpatientRehabilitation: 'Outpatient rehabilitation',
        dentalClinic: 'Dental Clinic',
        pharmacy: 'Pharmacy',
      },
      busInfoReg: 'Business Information Registration',
      mainOffice: 'Main Office',
      officeName: 'Office Name',
      officeInfo: 'Office Information',
      location: 'Location',
      prefectures: 'Prefectures',
      municipalities: 'Municipalities',
      addressBuildingName: 'Address Building Name',
      prefectureLabel: 'Ex) Tokyo-ku',
      municipalitieLabel: 'Ex) Shinjuku',
      addressBuildingLabel: 'Ex)◯◯◯',
      sameOfficeInfo: 'Same as office information',
      officeEnvironment: 'Office Environment',
      smokingPermitted: 'Smoking Permitted',
      separateSmokingArea: 'Separate Smoking Area',
      noSmoking: 'No Smoking',
      smokingAllowed: 'Smoking Allowed',
      commutingCar: 'Commuting Car',
      carCommutingPossible: 'Car Commuting Possible',
      parkingAvailable: 'Parking Available',
      parkingLotRemarks: 'Parking Lot Remarks',
      officeMemo: 'Office Memo',
      longLatInfo: 'Longitude/latitude Information',
      calOfficeInfo: 'Calculated from office information',
      numTeleAppoint: 'Number of Tele Appointments',
      lastTeleAppointDate: 'Last Tele Appointment Date',
      numBOs: 'Number of BOs',
      lastBODate: 'Last BO Date',
      basicContract: 'Basic Contract',
      basicContractSigned: 'Basic Contract Signed',
      basicContractNG: 'Basic Contract NG',
      parentClientName: 'Parent Client Name',
      companyAddress: 'Company Address',
      reprPhoneNumber: 'Representative phone number',
      contractUnit: 'Contract Unit',
      corporateBatch: 'Corporate batch',
      businessOffice: 'By business office',
      addClientButton: 'Add new client',
      homePage: 'Home Page',
      conclusionDispatchContract:'Conclusion of dispatch contract',
      conclusionReferralContract: 'Conclusion of referral contract',
      contactInfo: 'Contact Information',
      officeReg: 'Office Registration',
    },
    tele: {
        teleAppointHistory: 'Tele Appointment History',
        openTeleAppointForm: 'Open the add Tele Appointment form',
        displayAll: 'Display All',
        noAppointHistory: 'No Tele Appoint History',
        addTeleAppoint: 'Add Tele Appointment',
        teleAppointmentReg: 'Tele Appointment Registration',
        teleAppointmentClientName: 'Tele appointment Client Name',
        teleAppointDateTime: 'Tele appointment date and time',
        teleAppointIncharge: 'Tele Appointment Incharge',
        teleAppointResult: 'Tele Appointment Result',
        notConnected: 'Not Connected',
        connected: 'Connected',
        teleAppointContactPerson: 'Tele Appointment Contact Person',
        jobInterviewResults: 'Job Interview Results',
        noJobOffer: 'No Job Offer',
        needForRecruiting: 'Need For Recruiting',
        reasonNoJobOffer: 'Reason for no job offer',
        reasonNoJobOfferOption: {
          supplierNG: 'Supplier NG',
          companyJobsOnly: 'Company Jobs Only',
          noTrader: 'Designated trader',
          noDecisionMakingAuthority: 'No decision-making authority',
          halloweenOnly: 'Halloween only',
          otherDetails: 'Other details',
          others: 'Others'
        },
      noNeedContact: 'No need to contact',
      reqRecruitmentServices: 'Required Recruitment Services',
        reqRecruitmentServicesOption: {
          referral: 'Referral (direct hire only)',
          introduction: 'Introduction (NTTP)',
          referralNTTP: 'Referral (usually NTTP)',
          dispatch: 'Dispatch',
        },
        remark: 'Remark',
        list: {
          id: 'ID',
          appointmentDay: 'Tele Appointment Day',
          contactPerson: 'Contact Person',
          teleAppointmentResult: 'Tele Appointment Result',
        }
      },
      backOrder: {
        title: 'Backorder',
        noOrders: 'No past backorders',
        add: 'Add Backorder',
        reg: 'BO Registration',
        clientName: 'BO Client Name / Business Name',
        acquisitionDate: 'Date and time of BO acquisition',
        personIncharge: 'BO person in charge',
        route: 'BO Route',
        teleAppointment: 'via tele appointment',
        viaFax: 'via fax',
        others: 'others',
        endDateTime: 'BO end date and time',
        nurse: 'Nurse',
        nursingCare: 'Nursing Care',
        clientPersonIncharge: 'Client side person in charge',
        caseType: 'Case Type',
        publicRelationsConsultant: 'Public Relations Consultant',
        careManager: 'Care Manager',
        transactionType: 'Transaction Type',
        introduction: 'Introduction',
        dispatch: 'Dispatch',
        reqQualification: 'Required qualification',
        regularReview: 'Regular review',
        assistant: 'Assistant',
        careWorker: 'Care Worker',
        practitioners: 'Practitioners',
        newcomer: 'Newcomer',
        experienceReq: 'Experience Required',
        moreHalfYearExp: 'More than half a year experience',
        unnecessary: 'Unnecessary',
        necessary: 'Necessary',
        upperAgeLimit: 'Upper Age Limit',
        talent: 'Talent',
        employmentStatus: 'Employment Status',
        fullTime: 'Full Time',
        dispatchEm: 'Dispatch',
        partTime: 'Part Time',
        baito: 'Baito',
        retirementAge: 'Retirement Age',
        hourlywage: 'Hourly Wage',
        dispatchPrice: 'Dispatch Price',
        monthlySalary: 'Monthly Salary',
        bonuses: 'Bonuses, salary increases, incentives',
        payday: 'Pay Day',
        transportationExpenses: 'Transportation Expenses',
        workingDays: 'Working Days',
        workingDaysWeek: 'Working Days Week',
        workingHoursEarly: 'Working hours (Early Shift)',
        workingHoursDay: 'Working hours (Day Shift)',
        workingHoursLate: 'Working hours (Late Shift)',
        workingHoursNight: 'Working hours (Night Shift)',
        dateOfRegistration: 'Date Of Registration',
        customerReprisentative: 'Customer Reprisentative',
        businessContent: 'Business content',
        onCallPickUP: 'On-call/pick-up',
        overtimeHours: 'Overtime Hours',
        holidaysWeekly: 'Holidays (weekly)',
        holidayAnnual: 'Holiday (annual)',
        welfare: 'Welfare',
        leaveChildcare: 'Leave for childcare, nursing care, etc.',
        otherNotes: 'Other notes',
        regBOButton: 'BO Registration',
        list: {
          id: 'BOID',
          dateBO: 'Date of BO',
        }
      },
      pastRecord: {
        title: 'Past Record',
        job: 'Job',
        offer: 'Offer',
        hired: 'Hired'
      },
       workExperience: {
        title: 'Work Experience',
      },
      variousAchievement: {
        displayPeriod: 'Display Period',
        inHouseBO: 'In-house BO',
        inHouseFIX: 'In-house FIX',
        companyJob: 'Company job',
        inHouseOffer: 'In-house offer',
        inHouseEmployment: 'In-house employment',
        otherCompanyBO: 'Other company BO',
        competitorFIX: 'Competitor FIX',
        otherCompanyJob: 'Other company job',
        otherCompany: 'Other company',
        joiningAnotherCompany: 'Joining another company',
        referralResults: 'Referral Results',
        partTimeJob: 'Part Time Job',
      }
  },
  detal: {
    teleAppoint: {
      registredUser: 'Registred User',
      date: 'Date',
      teleAppointmentResult: 'Tele Appointment Result',
      jobResult: 'Job Result',
      requiredService: 'Required Service',
      remark: 'Remark',
    },
    memo: {
      registredUser: 'Registred User',
      contents: 'Contents',
      creationDay: 'Creation Day',
      updateDate: 'Update Date',
      addNew: 'Add New',
      addNewMemo: 'Add New Memo'
    },
    boList: {
      clientCorporationName: 'Client Corporation Name'
    }
  },
  applicant: {
    add: {
      name: 'Name',
      kanaName: 'Kana Name',
      postCode: 'Post Code',
      prefecture: 'Prefecture',
      municipalities: 'Municipalities',
      street: 'Street Name',
      apartment: 'Apartment',
      phone: 'Phone Number',
      email: 'Email',
      status: 'Status',
      wanted: 'Wanted',
      branchIncharge: 'Branch in Charge',
      boGenerationPath: 'BO Generation Path',
      coldCall: 'Cold Call',
      fax: 'FAX',
      caseType: 'Case Type',
      hourlyMonthly: 'Hourly/monthly wage',
      monthlySalary: 'Monthly Salary',
      hourlyWage: 'Hourly Wage',
      hr: 'HR Hacker',
      web: 'WEB application ',
      tel: 'TEL application ',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      dob: 'Date of Birth',
      occupation: 'Occupation',
      nurse: 'Nurse',
      nursingCare: 'Nursing Care',
      lifeCounselor: 'Life Counselor',
      careManager: 'Care Manager',
      others: 'Others',
      qualification: 'Qualification',
      applicationDate: 'Application Date',
      registeredNurse: 'Registered Nurse',
      assistantNurse: 'Assistant Nurse',
      newcomer: 'Newcomer',
      careWorker: 'Care Worker',
      applicationMedia: 'Application Media',
      applicationMetod: 'Application Metod',
      image: 'Applicant Image',
    },
    list: {
      name: 'Staff Name ',
      category: 'Category',
      address: 'Staff Address',
      rank: 'Staff Rank',
      status: 'Application Status',
      qualification: 'Qualification',
      experience: 'Experience',
      availableDays: 'Available Days',
      candidate: 'Candidate BO',
      locator: 'Business Locator',
      memo: 'Staff Memo',
      contactInfo: 'Contact Info',
      applicationInfo: 'Application Info',
      attendanceInfo: 'Attendance Info',
      fixEmployInfo: 'FIX Employment Info',
      operationInfo: 'Operation Info',
      contacts: {
        openContactForm: 'Open contact add form',
        closeContactForm: 'Close contact add form',
        dateTime: 'Date Time',
        contactMethod: 'Contact Method',
        userInharge: 'User in Charge',
        content: 'Content',
        note: 'Note',
        phone: 'Phone',
      },
      fixEmployment: {
        fixDestinationOffice: 'FIX先事業所',
        fixedDestination: 'FIX先',
        fixDate: 'FIX日',
        workDay: '職見日',
        informalOfferDate: '内定日',
        hiringDate: '入職日',
        memo: 'メモ',
      },
      info: {
        date: 'Application Date',
        media: 'Application Media',
        apply: 'How to apply',
        tel: 'Telephone number',
        email: 'Email',
        postCode: 'Post Code',
        addres: 'Address',
        name: 'Full Name',
        kana: 'Kana',
        gender: 'Gender',
        birth: 'Date of birth',
        lon: 'Longitude',
        lat: 'Latitude',

        attractionsStatus: 'Attractions Status',
        employmentStatus: 'Employment Status',
        classiffication: 'Classiffication',
        qualifications: 'Qualifications',
        memo: 'Attraction Memo',
        seductionDay: 'Seduction Day',
        seduser: 'Seduser',
        position: 'Position',
        period: 'Employment Period',

        application: '■Application Information',
        attraction: '■Information on Attraction',
        working: 'Working',
        notWorking: 'Not Working'
      }
    },
    statusOption: {
      notCompatible: 'Not Compatible',
      excludedApplicant: 'Excluded Applicant',
      waitingContact: 'Applied/Waiting for Contact',
      contactNG: 'Contact NG',
      contactedWI: 'Contacted/Waiting for invitation',
      invitationNG: 'Invitation NG',
      invitedWaiting: 'Invited/Waiting for attend',
      invitedNoContact: 'Invited/No Contact',
      attendedNG: 'Attend NG',
      attendedWaitingFix: 'Attended/Waiting for FIX',
      fixNG: 'FIX NG',
      fixedWaiting: 'Fixed/Waiting for visiting',
      visitingNG: 'Visiting NG',
      visitedWaitingOffer: 'Visited/Waiting for offer',
      offerNG: 'Offer NG',
      OfferedWaitingEntry: 'Offered/Waiting for entry',
      entryNG: 'Entry NG',
      entered: 'Entered (Waiting for Expiry)',
      expiryNG: 'Expiry NG',
      end: 'End',
      update: 'Update',
      futureTalent: 'Future Talent',
      ok: 'OK',
      ng: 'NG'
    },
    attendant: {
      attendantStatus: 'Attendant Status',
      day: 'Attending Day',
      attendee: 'Attendee',
      memo: 'Attendance Memo',
      desiredConditions: 'Desired Conditions',
      timeToWork: 'Possible Employment Period',
      daysToWork: 'Possible days per week',
      daysPerWeek: 'Available days of the week',
      specialDay: 'Working on a special day',
      shiftRemarks: 'Available Shift Remarks',
      days: 'Days',
      meansCommuting: 'Means of commuting',
      nearestStation: 'Nearest Station',
      commutingTime: 'Commuting Time',
      route: 'Route',
      commutingTimeRemarks: 'Commuting Time Remarks',
      facilityDesired: 'Type of facility desired',
      ngFacilityType: 'NG facility type',
      hourlyRate: 'Hourly Rate',
      transportationServices: 'Transportation services',
      jobSearchPriorities: 'Job Search Priorities',
      possible: 'Possible',
      no: 'Not',
      workExperience: 'Work Experience',
      personal: 'Personal Status',
      assignedEvaluation: 'Assigned Evaluation',

      specialDays: {
        gw: 'GW',
        festival: 'Festival',
        christmas: "New Year's"
      },

      // Assigned Evaluation Component
      language: 'Language',
      comprehension: 'Comprehension',
      staffRank: 'Staff rank (uneditable)',
      attendeeEvaluation: 'Attendee Evaluation',
      otherRemarks : 'Other Remarks',
      remarks: 'Remarks',
      performance: 'Performance',
      excellent: 'Excellent',
      good: 'Good',

      // Personal Status Component
      smoking: 'Smoking',
      tattoos: 'Tattoos',
      marriedStatus: 'Married/Unmarried',
      liveTogether: 'Living Together',
      cohabitation: 'Cohabitation',
      children: 'Children',
      medicalHistory: 'Medical History',
      vaccinationStatus: 'Vaccination Status',
      startCaring: 'How did you start caring?',
      interviewsWaitingList: 'Number of Interviews Waiting List',
      temporaryCompaniesRegistered: 'Number of temporary staffing companies registered',
      startedInCaregiving: 'How did you get started in caregiving?',
      items: 'items',
      daysVisitAtWork: 'Days when you can visit us at work',
      experienceDetails: 'Experience Details',

      // Work Experience Component
      experience: 'Experience',
      facilityType: 'Facility type',
      startMonth: 'Employment Start Month',
      endMonth: 'End of Employment Month',
      years: 'Years',
      nameEstablishment: 'Name of Experienced Establishment',
      employmentType: 'Employment Type',
      reasonResignation: 'Reason for Resignation',
      pastInterviews: 'Past Interviews',
      deletedInfo: 'All data related to this experience will be deleted.',
      totalYearsExperience: 'Total years of experience',

      // Operation Info Component
      placeOperation: 'Place of operation',
      startDate: 'Start Date',
      endDate: 'End Date',
      companyInCharge: 'Company in Charge',
      operationMemo: 'Memo',
      operatingSites: '■Operating Sites',

      // Memo Tab
      content: 'Content'
    }
  },
  prefectures: {
    hokkaido: 'Hokkaido',
    aomori: 'Aomori',
    iwate: 'Iwate',
    miyagi: 'Miyagi',
    akita: 'Akita',
    yamagata: 'Yamagata',
    fukushima: 'Fukushima',
    ibaraki: 'Ibaraki',
    tochigi: 'Tochigi',
    gunma: 'Gunma',
    saitama: 'Saitama',
    chiba: 'Chiba',
    tokyo: 'Tokyo',
    kanagawa: 'Kanagawa',
    nigata: 'Nigata',
    toyama: 'Toyama',
    ishikawa: 'Ishikawa',
    fukui: 'Fukui',
    yamanashi: 'Yamanashi',
    nagano: 'Nagano',
    gifu: 'Gifu',
    shizuoka: 'Shizuoka',
    aichi: 'Aichi',
    mie: 'Mie',
    shiga: 'Shiga',
    kyoto: 'Kyoto',
    osaka: 'Osaka',
    hyogo: 'Hyogo',
    nara: 'Nara',
    wakayama: 'Wakayama',
    tottori: 'Tottori',
    shimane: 'Shimane',
    okayama: 'Okayama',
    hiroshima: 'Hiroshima',
    yamaguchi: 'Yamaguchi',
    tokushima: 'Tokushima',
    kagawa: 'Kagawa',
    ehime: 'Ehime',
    kochi: 'Kochi',
    fukuoka: 'Fukuoka',
    saga: 'Saga',
    nagasaki: 'Nagasaki',
    kumamoto: 'Kumamoto',
    oita: 'Oita',
    miyazaki: 'Miyazaki',
    kagoshima: 'Kagoshima',
    okinawa: 'Okinawa',

  },
  office: {
    commonItems: 'Common Items',
    referralFee: 'Referral Fee %',
    referralFeeAmount: 'Referral Fee Amount',
    hourlyWage: 'Hourly Wage',
    monthlySalary: 'Monthly Salary',
    loansRaises: 'Loans, raises, incentives',
    payDay: 'Payday',
    transportationExpenses: 'Transportation Expenses',
    retirementAge: 'Retirement Age',
    overtimeHours: 'Overtime Hours',
    annualholiday: 'Holiday (Annual)',
    welfare: 'Welfare',
    childcareLeave: 'Childcare Leave',
    businessContent: 'Business content',
    weeklyHolidays: 'Holidays (weekly)',
    smokingPermitted: 'Smoking Permitted',
    commutingByCar: 'Commuting by Car',
    workingHours: 'Working Hours',
    earlyShift: 'Early Shift',
    dayShift: 'Day Shift',
    lateShift: 'Late Shift',
    nightShift: 'Night Shift',
    nursingCareItem: 'Nursing care original item',
    availabilityParkingLot: 'Availability of Parking Lot',
    parkingLotRemarks: 'Parking Lot Remarks',
    headquarterSettlement: 'Presence or absence of headquarters settlement',
    presenceAbsenceApproval: 'Presence or absence of approval',
    hiringDate: 'Hiring Date',
    averageLevelCare: 'Average level of care',
    vaccination: 'Vaccination',
    numberUsers: 'Number of users',
    medicalCheckup: 'Medical checkup',
    withWithoutLunch: 'With or without lunch',
    onCallCorrespondence: 'On-call correspondence',
    presenceAbsenceUniform: 'Presence or absence of uniform',
    numberEmployees: 'Number of employees',
    numberOfUsers: 'Number of users',
    headOfficeInformation: 'Head office information',
    officeTel: 'Office Tel',
    personInChargeTel: 'Person in charge Tel',
    contactAddress: 'Contact Address',
    clientInformation: 'Client Information',
    representativeName: 'Representative Name',
    established: 'Established',
    capital: 'Capital',
    earnings: 'Earnings',
    numOffices: 'Number of offices',
    companyProfile: 'Company Profile',
    latestHistory: 'Latest history',
    relatedOffice: 'Related office',
    office: 'Office',
    backOrder: 'Back Order',
    employmentRecord: 'Employment Record',
    fullTimeEmployment: 'Full Time employment',
    nonRegularEmployment: 'Non-regular employment',
    temporaryEmployee: 'Temporary Employee',
    originalOperation: 'Original Operation',
    contractInfo: 'Contract information',
  },
  failed: 'Action failed',
  success: 'Action was successful',
  authErrorCode: {
    'auth/invalid-email':
      'The provided value for the email user property is invalid. It must be a string email address',
    'auth/user-not-found':
      'There is no existing user record corresponding to the provided email',
    'auth/invalid-password':
      'The provided value for the password user property is invalid',
    'auth/wrong-password': 'Invalid username or password',
    'auth/email-already-in-use': 'Email adrress already in use',
  },
};
