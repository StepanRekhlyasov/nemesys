import { date } from 'quasar'
export const dataTimeFormat = (val: Date) => date.formatDate(val, 'YYYY-MM-DD  hh:mm:ss')
