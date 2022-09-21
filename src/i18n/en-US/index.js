// This is just an example,
// so you can safely delete all default props below

export default {
  systemName: 'Recruitment System',
  login: {
    title: 'Sign In',
    subTitle: 'Login is required to use this system. Please enter your credentials to log in.',
    email: 'Email',
    password: 'Password',
    button: 'Sign In'
  },
  common: {
    add: 'Add',
    cancel: 'Cancel',
    description: 'Description',
    delete: 'Delete',
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
    preview: 'Preview'
  },
  menu: {
    clientManagement: 'Client Management',
    clientList: 'Client List/Search',
    clientReg: 'Client Registration',
    dashboard: 'Dashboard',
    system: 'System Settings',
    branches: 'Branch Master Management',
    users: 'Responsible Master Management'
  },
  settings: {
    branch: {
      addBranch: 'Add Branch'
    }
  },
  client: {
    list: {
      destination: 'Destination',
      address: 'address',
      distance: 'distance',
      score: 'Score',
      phone: 'phone',
      fax: 'Fax',
      faxResponseRate: 'Fax Response Rate',
      boStatus: 'BO Status',
      achievement	: 'Achievement',
      achievementPast	: 'Achievement Past'
    },
    add: {
      clientName: 'Client Name',
      clientLabel: 'Ex) ◯◯◯ Co., Ltd.',
      updatingFax: 'Updating Fax List',
      faxReceptionNGTemp: 'Fax Reception NG (60 days)',
      cancelDate: 'Cancel Date',
      faxReceptionNG: 'Fax Reception NG (Permanent)',
      pharmacistClient: 'Pharmacist Client',
      clientType: 'Client Type',
      nurse: 'Nurse',
      nursing: 'Nursing',
      clientRepresentative: 'Client Representative',
      clientRepLabel: 'Ex) General Affairs Department: Taro Suzuki',
      address: 'Address',
      addressLabel: 'Ex) ◯◯◯, Shinjuku Ward, Tokyo',
      latitude: 'Latitude',
      longitude: 'Longitude',
      latitudeLabel: 'Ex) 35.658581',
      memo: 'Note',
      memoLabel: 'Ex) Please fill in any necessary items here.',
      workplaceInformation: "Office",
      contractor: 'Contractor',
      prSheetDestination: 'PR Sheet Destination',
      priorityFlag: 'Priority',
      priorityFlagLabel: 'Give priority to client information when displaying sub-offices',
      phoneNumber: 'Phone Number',
      phoneLabel: 'Ex）080-1234-5678',
      faxNumber: 'FAX Number',
      email: 'Email',
      emailLabel1: 'Ex）example',
      emailLabel2: 'example.co.jp',
      manager: 'Manager',
      managerLabel: 'Ex) Taro Suzuki',
    }
  },
  failed: 'Action failed',
  success: 'Action was successful',
  authErrorCode: {
    "auth/invalid-email": "The provided value for the email user property is invalid. It must be a string email address",
    "auth/user-not-found": "There is no existing user record corresponding to the provided email",
    "auth/invalid-password": "The provided value for the password user property is invalid",
    "auth/wrong-password": "Invalid username or password",
    "auth/email-already-in-use": "Email adrress already in use"
  }
}
