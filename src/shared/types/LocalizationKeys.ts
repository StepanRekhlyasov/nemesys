import enUS from 'src/i18n/index'
import jaJP from 'src/i18n/index'

type MessageSchema = typeof enUS | typeof jaJP

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`
type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>]
  : '') extends infer D ? Extract<D, string> : never;

export type LocalizationKeys = DotNestedKeys<MessageSchema['en-US'] | MessageSchema['ja-JP']>
