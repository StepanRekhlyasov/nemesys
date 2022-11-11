import { BackOrderModel, BackOrderStatus, TypeOfCase, TypeOfTransaction } from '../model/BackOrder.model';

export const backOrderData: BackOrderModel[] = [
  {
    typeCase: TypeOfCase.Nurse,
    typeTransaction: TypeOfTransaction.DispatchEm,
    qualifications: '准看護師',
    experience: '実務経験3年以上',
    ageLimit: 50,
    status: BackOrderStatus.Dispatch,
    unitPrice: 10000,
    posibleDays: 20,
    posibleObsidianDays: '月／火／水／木／金',
    buissnesDescription: '病院での看護業務',
    otherNotes: '特日出勤あり',
    dateRegistration: '2022-10-31',
    customerRepresentative: '加藤一樹',
    early: '未設定',
    datetime: '10:00-18:00',
    shortened: '未設定',
    nightShift: '21:00-30:00'
  },
  {
    typeCase: TypeOfCase.NursingCare,
    typeTransaction: TypeOfTransaction.Introduction,
    qualifications: '准看護師',
    experience: '実務経験3年以上',
    ageLimit: 50,
    status: BackOrderStatus.FullTime,
    unitPrice: 1000000,
    posibleDays: 10,
    posibleObsidianDays: '月／火／水／木／金',
    buissnesDescription: '病院での看護業務',
    otherNotes: '特日出勤あり',
    dateRegistration: '2022-10-10',
    customerRepresentative: '加藤一樹',
    early: '未設定',
    datetime: '10:00-18:00',
    shortened: '未設定',
    nightShift: '21:00-30:00'
  }
]
