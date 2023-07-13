import { ApplicantFix, ApplicantInputs } from 'src/shared/model';
import { Ref, watch } from 'vue';

export const useNGWatchers = (data: Ref<Partial<ApplicantFix>> | Ref<Partial<ApplicantInputs>>, hightlightError: Ref<string[]>, reasonKey: string, detailKey: string, statusKey: string) => {
  watch(() => data.value[reasonKey], (newVal) => {
    if (newVal) {
      hightlightError.value = hightlightError.value.filter((row) => {
        return row !== 'reason'
      })
    }
  })
  watch(() => data.value[detailKey], (newVal) => {
    if (newVal) {
      hightlightError.value = hightlightError.value.filter((row) => {
        return row !== 'detail'
      })
    }
  })
  watch(() => data.value[statusKey], (newVal) => {
    if (newVal) {
      data.value[reasonKey] = ''
      data.value[detailKey] = ''
    }
  })
}
export const useSaveHandler = (data: Ref<Partial<ApplicantFix>> | Ref<Partial<ApplicantInputs>>, hightlightError: Ref<string[]>, reasonKey: string, detailKey: string, statusKey: string) => {
  hightlightError.value = []
  if (!data.value[statusKey]) {
    if (!data.value[reasonKey]) {
      hightlightError.value.push('reason')
    }
    if (!data.value[detailKey] && data.value[reasonKey] !== 'break_contact') {
      hightlightError.value.push('detail')
    }
  }
  if (hightlightError.value.length) {
    return false;
  }
  return true;
}
