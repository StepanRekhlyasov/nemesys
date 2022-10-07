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
  common: {
    add: '追加',
    cancel: 'キャンセル',
    description: '説明',
    delete: '削除',
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
  },
  menu: {
    clientManagement: 'クライアント管理',
    clientList: 'クライアント一覧・検索',
    clientReg: 'クライアント情報登録',
    dashboard: 'ダッシュボード',
    system: 'システム設定',
    branches: '支店マスタ管理',
    users: '担当マスタ管理',
  },
  settings: {
    branch: {
      addBranch: '新規支店追加',
    },
    users: {
      addUser: '新規担当者追加',
      fio: '氏名',
      email: 'メールアドレス',
      password: 'パスワード'
    }
  },
  client: {
    list: {
      destination: '送信先',
      address: '住所',
      distance: '距離',
      score: 'スコア',
      phone: '電話番号',
      fax: 'FAX番号	',
      faxResponseRate: 'FAX返答率',
      boStatus: 'BO有無',
      achievement: '実績',
      achievementPast: '実績（過去）',
    },
    add: {
      clientName: 'クライアント名',
      clientLabel: '例）株式会社◯◯◯',
      updatingFax: 'FAXリスト更新中',
      faxReceptionNGTemp: 'FAX受取NG（60日間）',
      cancelDate: '解除日',
      faxReceptionNG: 'FAX受取NG（永久）',
      pharmacistClient: '薬剤師向けクライアント',
      clientType: 'クライアント種別',
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
      manager: '担当者',
      managerLabel: '例）鈴木 太郎',

      //
      integrationSource: '統合元',
      copInfo: '企業情報',
      options: {
        transactionHistory: '取引実績有',
        noFaxSending: 'FAX送信NG',
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
    },
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
