export const uniqueItemsMask = (val : string)=>{
  return /^[\p{L}\p{N}_$()（）。、,.]*$/u.test(val)
}