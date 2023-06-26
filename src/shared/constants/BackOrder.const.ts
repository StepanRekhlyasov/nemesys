
import { i18n } from 'boot/i18n'
import { computed } from 'vue';

const { t } = i18n.global

export const DaysPerWeekList = computed(() => [{
  label: t('backOrder.daysPerWeek.one'),
  value: 'one'
},{
  label: t('backOrder.daysPerWeek.two'),
  value: 'two'
},{
  label: t('backOrder.daysPerWeek.three'),
  value: 'three'
},{
  label: t('backOrder.daysPerWeek.four'),
  value: 'four'
},{
  label: t('backOrder.daysPerWeek.five'),
  value: 'five'
},]) 