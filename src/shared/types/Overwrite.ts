type _Overwrite<T, U> = U extends object ? (
  { [K in keyof T]: K extends keyof U ? _Overwrite<T[K], U[K]> : T[K] } & U
) : U

// eslint-disable-next-line @typescript-eslint/ban-types
type ExpandRecursively<T> = T extends Function ? T : T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

export type Overwrite<T, U> = ExpandRecursively<_Overwrite<T, U>>
