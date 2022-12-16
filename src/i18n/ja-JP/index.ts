// This is just an example,
// so you can safely delete all default props below

export default {
  systemName: '採用管理システム',
  login: {
    title: 'サインイン',
    subTitle:
      '本システムの利用にはログインが必要です。認証情報ご入力の上、ログインしてください。',
    email: 'メールアドレス',
    password: 'パスワード',
    button: 'サインイン',
  },
  form: {
    required: 'フィールドは必須です'
  },
  common: {
    add: '追加',
    cancel: 'キャンセル',
    description: '説明',
    delete: '削除',
    deleteInfo: 'このアイテムを削除しますか?',
    create: '作成',
    title: '題名',
    save: '保存',
    edit: '編集',
    export: 'エクスポート',
    disable: '無効化',
    enable: '有効化',
    close: '閉じる',
    reset: 'リセット',
    faq: 'よくある質問',
    contact: 'お問い合わせ',
    tos: '利用規約',
    policy: '個人情報保護方針',
    update: '正常に更新されました！',
    clear: 'クリア',
    submit: '送信',
    remove: '除外',
    ok: 'OK',
    preview: '確認',
    yes: '有り',
    no: '否能',
    possible: '可能',
    impossible: '無り',
    yesShort: '有',
    above: '以上',
    moreThan: '件以上',
    pleaseSelect: '選択してください',
    addNew: '新規追加',
    search: '検索',
    keyboard: 'キーワード',
  },
  weekDay: {
    sunday: '日',
    monday: '月',
    tuesday: '火',
    wednesday: '水',
    thursday: '木',
    friday: '金',
    saturday: '土',
    holiday: '祝日',
  },
  menu: {
    clientManagement: 'クライアント管理',
    clientList: 'クライアント一覧・検索',
    clientReg: 'クライアント情報登録',
    dashboard: 'ダッシュボード',
    system: 'システム設定',
    item: '項目マスタ管理',
    branches: '支店マスタ管理',
    users: '担当マスタ管理',
    organization: '組織マスター管理',
    template: 'テンプレート管理',
    applicant: '応募者管理',
    mapSearch: 'マップ検索',
    areaSearch: 'エリア検索',
    newApplicant: '応募者 新規登録',
    applicantSearch: '応募者 検索',
    advancedSearch: '詳細条件検索'
  },
  settings: {
    branch: {
      addBranch: '支店新規追加',
      id: '支店ID',
      name: '支店名',
      prefectures: '都道府県',
      flag: '有効フラグ',
      phone: '電話番号',
      hiddenFlag: '非表示フラグ',
      hidden: '非表示',
      create_at: '作成日',
      last_update: '更新日',
      create_branch: '会社基本情報 編集',
      office: '本社',
      municipalities: '市区町村',
      addres: '番地・建物名',
      fax: 'FAX番号',
      email: 'e-mail',
      car_commuting: '車通勤可否',
      eat_cigarettes: '喫煙可否',
      garage: '駐車場有無',
      hide: '非表示にする',
      deletedInfo: 'この支店に関するデータはすべて消去されます',
      flags: {
        all: 'すべて',
        valid: '有効'
      }
    },
    template: {
      addNew: 'メールテンプレート新規追加',
      name: 'テンプレート名',
      type: '種別',
      subject: '件名',
      contents: '内容',
      mail: 'メール',
      sms: 'SMS',
      deletedInfo: 'このテンプレートに関するデータはすべて削除されます',
      edit: 'メールテンプレート編集',

      create_at: '作成日',
      last_update: '更新日',
    },
    item: {
      addItem: '項目新規追加',
      id: '区分ID',
      name: '区分名',
      itemName: '項目名',
      displayOrder: '表示順',
      flag: '有効フラグ',
      hide: '非表示にする',
      edit: '項目編集',
      classification: {
        oualifications: '資格',
        job: '職種',
        media: '応募媒体'
      }
    },
    users: {
      addUser: '担当者新規追加',
      fio: '氏名',
      email: 'メールアドレス',
      password: 'パスワード',
      person_name: '担当者名',
      branch_name: '所属支店',
      company_name: 'ユーザー企業名',
      deleteAccaunt: 'アカウント削除',
      role: 'ロール',
      infoEditUser: 'メールアドレス・ユーザー企業は永久に変更できません',
      infoContact: 'ロール・ログインパスワードを変更したい場合は、チームの管理者に連絡してください。',
      contact: '連絡先',
      manager: '管理者',
      hidden: '非表示',
      create_at: '作成日',
      last_update: '更新日',
      editProfile: 'プロフィール編集',
      accauntSettings: 'アカウント設定',
      logout: 'ログアウト'
    },
    title: 'システム設定',
  },
  client: {
    list: {
      clients: '企業一覧',
      jobs: '求人一覧',
      destination: '送信先',
      memo: 'メモ',
      address: '住所',
      distance: '距離',
      score: 'スコア',
      phone: '電話番号',
      fax: 'FAX番号	',
      officeLocation: '事業所 所在地',
      distanceStartingPoint: '起点からの距離',
      faxResponseRate: 'FAX返答率',
      boStatus: 'BO有無',
      achievement: '実績',
      achievementPast: '実績（過去）',
      headOffice: '本社事業所',
      masterDataAvailable: 'マスタ更新データ有',
      clientDetail: 'クライアント詳細',
      client: 'クライアント',
      corporation: '法人',
      contractStatus: '契約状態',
      contractInfo: '契約先情報',
      personIncharge: '担当者',
      contactPerson: '連絡先担当者',
      basicInfoUpdated: '基本情報 最終更新',
      infoUpdated: '情報 最終更新',
      performedBy: '実行者',
      editor: '編集者',
      displayMasterInfo: 'マスタ情報を表示',
      basicInfoMasterData: '基本情報マスタデータ',
      note: '注意',
      basicInfoNote: '基本情報を変更しているので、情報の更新が入っても自動で更新されません',
      overwriteBasicInfo: '基本情報をマスタで上書き',
      search: '検索',
      conditionSearch: '条件・エリア検索',
      searchResults: '検索結果',
      searchButton: '検索する',
      keywordSearch: 'キーワード検索',
      saveKeywords: 'キーワードを保存する',
      advancedSearch: '詳細条件を設定して検索する',
      searchFromMap: '地図から検索する',
      searchFromPref: '都道府県一覧から検索する',
      detailedConditionSearch: '詳細条件検索',
      faxNotAvailable: 'Fax送信不可',
      keyboard: 'キーワード',
      presenceContract: '基本契約締結',
      availJobPostings: '求人情報掲載有無',
      jobPostings: '求人情報掲載',
      teleAppointmentInfo: '最新テレアポ情報',
      contactPeroneName: '事業所 担当者',
      postingStartDate: '掲載期間開始日',
      postingEndDate: '期間最終日',
      evaluationRank: '評価ランク',
      dispatchIndex: '派遣指標',
      referralMetrics: '紹介指標',
      status: '状態',
      point: 'ポイント',
      periodStartDate: '期間開始日',
      numBOsAcquired: '取得したBO数',
      numBOs: 'BO数',
      listBO: 'BOリスト',
      officeDetail: '事業所詳細情報',
      officeHead: '本社事業所',
      variousAchievements: '各種実績数',
      numFixResults: 'FIX実績数',
      jobSearchResults: '職見実績数',
      numJobOffers: '内定実績数',
      hiringRecord: '入職実績数',

      dispatchRecord: '派遣実績',
      referralResults: '紹介実績',
      dispatchedOtherCompanies: '（コンサル限定）他社派遣実績',
      otherCompanyReferralResults: '（コンサル限定）他社紹介実績',
      pastEmploymentRecord: '過去雇用実績',
      numFullTimeEmployees: '正社員雇用数',
      numPartTimeEmployees: 'アルバイト・パート雇用数',
      numTempEmployees: '一般派遣雇用数',
      historySearch: '指標・行動履歴 検索',
      appointLastMonths: '直近２ヶ月以内のテレアポ実施企業',
      allTeleAppointedCompanies: 'テレアポした企業全て',
      connectedCompanies: '接電した企業のみ',
      companiesOutService: '全て不通の企業のみ',
      saveSearchConditions: '検索条件保存',
      areaSearch: 'エリア検索',
      listPrefectures: '都道府県一覧',
      mapSearch: '地図検索',
      regionalSearch: '地域検索',
      originationStaff: '起点候補スタッフ',
      distanceFromOrigin: '起点からの距離 (km)',
      corporateSearch: '法人検索',
      addNewClient: 'クライアント新規追加',
      basicContractConclusion: '基本契約 締結',
      contactMorning: '接電傾向午前',
      contactAfternoon: '接電傾向午後',
      contactEvening: '接電傾向夕方',
      numDispatchedBOs: '自社派遣BO数',
      numInhouseDispatchedFIX: '自社派遣FIX数',
      numInhouseDispatchedJobs: '自社派遣職見数',
      businessLocation: '事業所所在地',
      callingTendency: '今の時間帯の接電傾向',
      businessAddress: '事業所住所',
      tradingPerformance: '取引実績',
      officesConcludedBasicContract: '同一法人内で基本契約締結済みの他事務所',
      contactTendency: '接電傾向',
      position: '役職',


    },
    add: {
      newReg: 'クライアント 新規登録',
      clientBasicInfo: 'クライアント基本情報',
      clientName: 'クライアント名',
      clientLabel: '例）株式会社◯◯◯',
      updatingFax: 'FAXリスト更新中',
      faxReceptionNGTemp: 'FAX受取NG（60日間）',
      cancelDate: '解除日',
      faxReceptionNG: 'FAX受け取り状態（永久）',
      pharmacistClient: '薬剤師向けクライアント',
      clientType: 'クライアント種別',
      jobType: '取扱職種',
      nurse: '看護',
      nursing: '介護',
      clientRepresentative: 'クライアント担当者',
      clientRepLabel: '例）総務部：鈴木 太郎',
      address: '住所',
      addressLabel: '例）東京都新宿区◯◯◯',
      latitude: '緯度',
      longitude: '経度',
      latitudeLabel: '例）35.658581',
      memo: 'メモ欄',
      memoLabel: '例）ここに必要事項等があればご記入ください。',
      workplaceInformation: '職場情報',
      contractor: '契約先',
      contractorLabel: 'このクライアントの契約先：法人一括（すべての事業所の契約先となります）',
      prSheetDestination: 'PRシート送付先',
      priorityFlag: '優先フラグ',
      priorityFlagLabel:
        '子事業所表示の際にクライアントの情報を優先して表示する',
      phoneNumber: '電話番号',
      phoneLabel: '例）080-1234-5678',
      faxNumber: 'FAX番号',
      email: 'メールアドレス',
      emailLabel1: '例）example',
      emailLabel2: 'example.co.jp',
      manager: '担当者名',
      managerLabel: '例）鈴木 太郎',

      //
      integrationSource: '統合元',
      copInfo: '企業情報',
      options: {
        transactionHistory: '取引実績有',
        noFaxSending: 'FAX送信NG',
        faxSending: 'FAX送信',
        fixNumberLimit: 'FIX数上限',
      },
      facilityType: '施設形態',
      facilityOp: {
        medicalClinic: '診療所 ',
        homeVisitCare: '訪問介護',
        dayCare: 'デイケア',
        homeVisitRehabilitation: '訪問リハビリ',
        longMedicalFacility: '介護療養型医療施設',
        homeNursing: '訪問看護',
        shortStay: 'ショートステイ',
        dayService: 'デイサービス',
        nursingCareElderly: '介護老人保健施設',
        specialElderlyNursingHome: '特別養護老人ホーム',
        paidNursingHome: '有料老人ホーム',
        groupHome: 'グループホーム',
        smallMultifunFacility: '小規模多機能',
        homeCareNursing: '訪問介護看護',
        elderlyHousingServices: 'サービス付き高齢者向け住宅',
        clinic: 'クリニック',
        hospital: '病院',
        careHouse: 'ケアハウス',
        nursingCareClinic: '介護医療院',
        dementiaLivingCare: '認知症対応型共同生活介護',
        longCareWelfareFacilityElderly: '介護老人福祉施設',
        communityNursingElderly: '地域密着型介護老人',
        communitySpecificFacility: '地域密着型特定施設',
        dayCareFacility: '通所介護',
        homeCare: '居宅介護',
        specifiedWelfareSales: '特定福祉用具販売',
        shortResidentialCare: '短期入所生活介護',
        lendingWelfareEquipment: '福祉用具貸与',
        homeBathingCare: '訪問入浴介護',
        livelihoodResidentFacility: '認知症対応型共同生活介護',
        outpatientRehabilitation: '通所リハビリ',
        dentalClinic: '歯科診療所',
        pharmacy: '薬局',
      },
      busInfoReg: '事業情報登録',
      mainOffice: '本社',
      officeName: '事業所名',
      officeInfo: '事業所情報',
      location: '所在地',
      prefectures: '都道府県',
      prefectureLabel: '例）東京都',
      municipalitieLabel: '例）新宿区',
      addressBuildingLabel: '例）◯◯◯',
      municipalities: '市区町村',
      addressBuildingName: '番地・建物名',
      sameOfficeInfo: '事業所情報と同じにする',
      officeEnvironment: '事業所環境',
      smokingPermitted: '喫煙可否',
      separateSmokingArea: '分煙',
      noSmoking: '禁煙',
      smokingAllowed: '喫煙可',
      commutingCar: '車通勤',
      carCommutingPossible: '車通勤可能',
      parkingAvailable: '駐車場有',
      parkingLotRemarks: '駐車場備考',
      officeMemo: '事業所メモ',
      longLatInfo: '経度・緯度情報',
      calOfficeInfo: '事業所情報から算出する',
      numTeleAppoint: 'テレアポ件数',
      lastTeleAppointDate: '最終テレアポ日',
      numBOs: 'BO件数',
      lastBODate: '最終BO日時',
      basicContract: '基本契約',
      basicContractSigned: '基本契約締結済み',
      basicContractNG: '基本契約 未締結',
      parentClientName: '親クライアント名',
      companyAddress: '会社住所',
      reprPhoneNumber: '代表電話番号',
      contractUnit: '契約単位',
      corporateBatch: '法人一括',
      businessOffice: '事業所単位',
      addClientButton: 'クライアント追加登録',
    },
    tele: {
      teleAppointHistory: 'テレアポ履歴',
      openTeleAppointForm: 'テレアポ追加フォームを開く',
      displayAll: '全件表示',
      noAppointHistory: '過去のテレアポ履歴はありません',
      addTeleAppoint: 'テレアポ追加',
      teleAppointmentReg: 'テレアポ登録',
      teleAppointmentClientName: 'テレアポ先 クライアント名 / 事業所名',
      teleAppointDateTime: 'テレアポ日時',
      teleAppointIncharge: 'テレアポ担当者',
      teleAppointResult: 'テレアポ結果',
      notConnected: '繋がらず',
      connected: '接電',
      teleAppointContactPerson: 'テレアポ先 担当者',
      jobInterviewResults: '求人ヒアリング結果',
      noJobOffer: '求人不要',
      needForRecruiting: '求人必要',
      reasonNoJobOffer: '求人不要の理由',
      reasonNoJobOfferOption: {
        supplierNG: '業者NG',
        companyJobsOnly: '自社求人のみ',
        noTrader: '指定業者あり',
        noDecisionMakingAuthority: '決裁権限無し/本社採用のみ',
        halloweenOnly: 'ハロワのみ',
        otherDetails: 'その他詳細',
        others: 'その他'
      },
      noNeedContact: '連絡不要',
      reqRecruitmentServices: '必要な求人サービス',
      reqRecruitmentServicesOption: {
        referral: '紹介（直接雇用のみ）',
        introduction: '紹介（NTTP）',
        referralNTTP: '紹介（通常NTTP）',
        dispatch: '派遣',
      },
      remark: '備考',
      list: {
        id: 'テレアポID',
        appointmentDay: 'テレアポ日',
        contactPerson: '連絡者',
        teleAppointmentResult: 'テレアポ結果',
      }

    },
    backOrder: {
      title: 'バックオーダー',
      noOrders: '過去のバックオーダーはありません',
      add: 'バックオーダー追加',
      reg: 'BO登録',
      clientName: 'BO クライアント名 / 事業所名',
      acquisitionDate: 'BO 取得日時',
      personIncharge: 'BO 担当者',
      route: 'BO経路',
      teleAppointment: 'テレアポ経由',
      viaFax: 'FAX経由',
      others: 'その他',
      nurse: '看護',
      nursingCare: '介護',
      endDateTime: 'BO 終了日時',
      clientPersonIncharge: 'クライアント側 担当者',
      caseType: '案件種別',
      publicRelationsConsultant: '生活相談員',
      careManager: 'ケアマネジャー',
      transactionType: '取引種別',
      introduction: '紹介',
      dispatch: '一般派遣',
      reqQualification: '必要な資格',
      regularReview: '正看',
      assistant: '准看',
      careWorker: '介護福祉士',
      practitioners: '実務者',
      newcomer: '初任者',
      experienceReq: '必要な経験',
      moreHalfYearExp: '半年以上の経験',
      unnecessary: '不要',
      necessary: '必要',
      upperAgeLimit: '年齢上限',
      talent: '才',
      employmentStatus: '雇用形態',
      fullTime: '正社員',
      dispatchEm: '派遣',
      partTime: 'アルバイト',
      baito: 'パート',
      retirementAge: '定年',
      hourlywage: '時給',
      dispatchPrice: '派遣単価',
      monthlySalary: '月給',
      bonuses: '賞与・昇給・インセンティブ',
      payday: '給料日',
      transportationExpenses: '交通費',
      workingDays: '就業可能日数',
      workingDaysWeek: '就業可能曜日',
      workingHoursEarly: '就業時間（早番）',
      workingHoursDay: '就業時間（日勤）',
      workingHoursLate: '就業時間（遅番）',
      workingHoursNight: '就業時間（夜勤）',
      dateOfRegistration: '登録日',
      customerReprisentative: '顧客担当者',
      businessContent: '業務内容',
      onCallPickUP: 'オンコール・送迎',
      overtimeHours: '残業時間',
      holidaysWeekly: '休日（週単位）',
      holidayAnnual: '休日（年間）',
      welfare: '福利厚生',
      leaveChildcare: '育児・介護他休暇',
      otherNotes: 'その他メモ欄',
      regBOButton: 'BO 登録',
      list: {
        id: 'BOID',
        dateBO: 'BO発生日',
      }
    },
    pastRecord: {
      title: '過去の実績',
      job: '職見',
      offer: '内定',
      hired: '入職'
    },
    workExperience: {
      title: '就業経験者',
    },
    variousAchievement: {
      displayPeriod: '表示期間',
      inHouseBO: '自社BO',
      inHouseFIX: '自社FIX',
      companyJob: '自社職見',
      inHouseOffer: '自社内定',
      inHouseEmployment: '自社入職',
      otherCompanyBO: '他社BO',
      competitorFIX: '他社FIX',
      otherCompanyJob: '他社職見',
      otherCompany: '他社内定',
      joiningAnotherCompany: '他社入職',
      referralResults: '紹介実績',
      partTimeJob: 'パート・アルバイト',
    }
  },
  detal: {
    teleAppoint: {
      registredUser: '登録ユーザー',
      date: '連絡日時',
      teleAppointmentResult: 'テレアポ結果',
      jobResult: '求人ヒアリング結果',
      requiredService: '必要なサービス',
      remark: '備考',
    },
    memo: {
      registredUser: '登録ユーザー',
      contents: '内容',
      creationDay: '作成日',
      updateDate: '更新日',
      addNew: '新規追加',
      addNewMemo: 'メモ新規追加'
    },
    boList: {
      clientCorporationName: 'クライアント法人名'
    }
  },
  applicant: {
    add: {
      name: '氏名',
      kanaName: 'フリガナ',
      postCode: '郵便番号',
      prefecture: '都道府県',
      municipalities: '市区町村',
      street: '町名・番地',
      apartment: 'マンション名',
      phone: '電話番号',
      email: 'メールアドレス',
      status: 'ステータス',
      branchIncharge: '担当支店',
      sex: '性別',
      male: '男性',
      female: '女性',
      dob: '生年月日',
      occupation: '職種',
      nurse: '看護',
      nursingCare: '介護',
      lifeCounselor: '生活相談員',
      careManager: 'ケアマネジャー',
      others: 'その他',
      qualification: '持っている資格',
      applicationDate: '応募日',
      registeredNurse: '正看護師',
      assistantNurse: '準看護師',
      newcomer: '初任者',
      careWorker: '介護福祉士',
      applicationMedia: '応募媒体',
      applicationMetod: '応募方法',
      image: '応募者画像',
    },
    list: {
      name: 'スタッフ名 ',
      category: '区分',
      address: 'スタッフ住所',
      rank: 'スタッフランク',
      status: '応募ステータス',
      qualification: '資格',
      memo: 'スタッフメモ',
      contactInfo: 'コンタクト情報',
      applicationInfo: '応募／誘致情報',
      attendanceInfo: 'アテンド情報',
      fixEmployInfo: 'FIX-入職情報',
      operationInfo: '稼働情報',
      contacts: {
        openContactForm: 'コンタクト追加フォームを開く',
        dateTime: '日時',
        contactMethod: '連絡方法',
        userInharge: '担当ユーザー',
        content: '内容',
        note: 'ノート',
        phone: '電話',
        
      },


    },
    statusOption: {
      notCompatible: '未対応',
      excludedApplicant: '応募除外',
      waitingContact: '応募済み／接触待ち',
      contactNG: '接触NG',
      contactedWI: '接触済み／誘致待ち',
      invitationNG: '誘致NG',
      invitedWaiting: '誘致済み／アテンド待ち',
      invitedNoContact: '誘致済み／連絡不通',
      attendedNG: 'アテンドNG',
      attendedWaitingFix: 'アテンド済み／FIX待ち',
      fixNG: 'FIXNG',
      fixedWaiting: 'FIX済み／職見待ち',
      visitingNG: '職見NG',
      visitedWaitingOffer: '職見済み／内定待ち',
      offerNG: '内定NG',
      OfferedWaitingEntry: '内定済み／入職待ち',
      entryNG: '入職NG',
      entered: '入職済み（満期終了待ち）',
      expiryNG: '満期終了NG（離脱）',
      end: '終了',
      update: '更新',
      futureTalent: '未来人材',
    }
  },
  prefectures: {
    hokkaido: '北海道',
    aomori: '青森県',
    iwate: '岩手県',
    miyagi: '宮城県',
    akita: '秋田県',
    yamagata: '山形県',
    fukushima: '福島県',
    ibaraki: '茨城県',
    tochigi: '栃木県',
    gunma: '群馬県',
    saitama: '埼玉県',
    chiba: '千葉県',
    tokyo: '東京都',
    kanagawa: '神奈川県',
    nigata: '新潟県',
    toyama: '富山県',
    ishikawa: '石川県',
    fukui: '福井県',
    yamanashi: '山梨県',
    nagano: '長野県',
    gifu: '岐阜県',
    shizuoka: '静岡県',
    aichi: '愛知県',
    mie: '三重県',
    shiga: '滋賀県',
    kyoto: '京都府',
    osaka: '大阪府',
    hyogo: '兵庫県',
    nara: '奈良県',
    wakayama: '和歌山県',
    tottori: '鳥取県',
    shimane: '島根県',
    okayama: '岡山県',
    hiroshima: '広島県',
    yamaguchi: '山口県',
    tokushima: '徳島県',
    kagawa: '香川県',
    ehime: '愛媛県',
    kochi: '高知県',
    fukuoka: '福岡県',
    saga: '佐賀県',
    nagasaki: '長崎県',
    kumamoto: '熊本県',
    oita: '大分県',
    miyazaki: '宮崎県',
    kagoshima: '鹿児島県',
    okinawa: '沖縄県',

  },
  office: {
    commonItems: '全職種共通項目',
    referralFee: '紹介料の規定％',
    referralFeeAmount: '紹介料の規定金額',
    hourlyWage: '時給',
    monthlySalary: '月給',
    loansRaises: '貸与・昇給・インセンティブ',
    payDay: '給料日',
    transportationExpenses: '交通費',
    retirementAge: '定年',
    overtimeHours: '残業時間',
    annualholiday: '休日（年間）',
    welfare: '福利厚生',
    childcareLeave: '育児・介護他休暇',
    businessContent: '業務内容',
    weeklyHolidays: '休日（週単位）',
    smokingPermitted: '喫煙可否',
    commutingByCar: '車通勤',
    workingHours: '就業時間',
    earlyShift: '早番',
    dayShift: '日勤',
    lateShift: '遅番',
    nightShift: '夜勤',
    nursingCareItem: '介護独自項目',
    availabilityParkingLot: '駐車場の有無',
    parkingLotRemarks: '駐車場備考',
    headquarterSettlement: '本部決済の有無',
    presenceAbsenceApproval: '稟議の有無',
    hiringDate: '入職日',
    averageLevelCare: '平均介護度',
    vaccination: 'ワクチン接種',
    numberUsers: '利用者の数',
    medicalCheckup: '健康診断',
    withWithoutLunch: '昼食の有無',
    onCallCorrespondence: 'オンコール対応',
    presenceAbsenceUniform: '制服の有無',
    numberEmployees: '従業員数',
    numberOfUsers: '利用者数',
    headOfficeInformation: '本社事業所情報',
    officeTel: '事業所TEL',
    personInChargeTel: '担当者TEL',
    contactAddress: '担当者アドレス',
    clientInformation: 'クライアント情報',
    representativeName: '代表者名',
    established: '設立',
    capital: '資本金',
    earnings: '売上',
    numOffices: '事業所数',
    companyProfile: '会社概要',
    latestHistory: '最新履歴',
    relatedOffice: '関連事業所',
    office: '事業所',
    backOrder: 'バックオーダー',
    employmentRecord: '就業実績',
    fullTimeEmployment: '正社員入職',
    nonRegularEmployment: '非正規社員入職',
    temporaryEmployee: '派遣入職',
    originalOperation: '原稼働',

  },
  failed: 'アクションに失敗しました',
  success: 'アクションが成功しました',
  authErrorCode: {
    'auth/email-already-in-use': 'メールアドレスまたはパスワードが違います',
    'auth/invalid-email': 'メールアドレスまたはパスワードが違います',
    'auth/user-not-found': 'メールアドレスまたはパスワードが違います',
    'auth/invalid-password': 'メールアドレスまたはパスワードが違います',
    'auth/wrong-password': 'メールアドレスまたはパスワードが違います',
  },
};
