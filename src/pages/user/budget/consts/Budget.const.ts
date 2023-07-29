import { computed } from 'vue';
import { i18n } from 'boot/i18n'
import { QTableProps } from 'quasar';

const { t } = i18n.global

export const budgetAddItem = computed(() => {
  return [
    {
      label: 'ID',
      key: 'id',
      type: '',
      required: true,
    },
    {
      label: t('budget.recordNumber'),
      key: 'recordNumber',
      type: '',
      required: true,
    },
    {
      label: t('budget.media'),
      key: 'media',
      type: 'select',
      required: true,
    },
    {
      label: t('settings.branch.name'),
      key: 'branch',
      type: 'select',
      required: true,
    },
    {
      label: t('applicant.add.occupation'),
      key: 'occupation',
      type: 'select',
      required: true,
    },
    {
      label: t('budget.postingStartDate'),
      key: 'postingStartDate',
      type: 'date',
      required: true,
    },
    {
      label: t('budget.postingEndDate'),
      key: 'postingEndDate',
      type: 'date',
      required: true,
    },
    {
      label: t('budget.accountingMonth'),
      key: 'accountingMonth',
      type: 'date',
      required: true,
      format: 'month'
    },
    {
      label: t('budget.amount'),
      key: 'amount',
      type: 'number',
      required: true,
      icon: true,
    },
    {
      label: t('budget.numberOfSlots'),
      key: 'numberOfSlots',
      type: 'number',
      required: false,
    },
    {
      label: t('billing.feeAggregates.unitPrice'),
      key: 'unitPrice',
      type: 'number',
      required: false,
      icon: true,
    },
    {
      label: t('budget.agency'),
      key: 'agency',
      type: 'text',
      required: false,
    },
    {
      label: t('backOrder.create.remarks'),
      key: 'remark',
      type: 'text',
      required: false,
    },
  ]
});

export const budgetColumns = computed<QTableProps['columns']>(() => {
  return [
    {
      label: '',
      field: 'select',
      name: 'select',
      align: 'left',
    },
    {
      label: t('budget.recordNumber'),
      field: 'recordNumber',
      name: 'recordNumber',
      align: 'left',
      sortable: true
    },
    {
      label: t('budget.mediaName'),
      field: 'media',
      name: 'media',
      align: 'left',
      sortable: true
    },
    {
      label: '',
      field: 'branchRomaji',
      name: 'branchRomaji',
      align: 'left',
      sortable: true
    },
    {
      label: '',
      field: 'postingStartDate',
      name: 'postingStartDate',
      align: 'left',
      sortable: true
    },
    {
      label: t('budget.accountingMonth'),
      field: 'accountingMonth',
      name: 'accountingMonth',
      align: 'left',
      sortable: true
    },
    {
      label: t('budget.amount'),
      field: 'amount',
      name: 'amount',
      align: 'left',
      sortable: true
    },
    {
      label: '',
      field: 'numberOfSlots',
      name: 'numberOfSlots',
      align: 'left',
      sortable: true
    },
    {
      label: t('budget.agency'),
      field: 'agency',
      name: 'agency',
      align: 'left',
      sortable: true
    },
    {
      label: t('backOrder.create.remarks'),
      field: 'remark',
      name: 'remark',
      align: 'left',
      sortable: true
    },
    {
      label: t('budget.updatedAt'),
      field: 'updated_at',
      name: 'updated_at',
      align: 'left',
      sortable: true
    },
    {
      label: '',
      field: 'action',
      name: 'action',
      align: 'left',
    },
  ]
});

export const budgetSearchItem = computed(() => {
  return [
    [{
      label: t('budget.recordNumber'),
      key: 'recordNumber',
      type: 'number',
      range: false,
      icon: null
    },
    {
      label: t('budget.mediaName'),
      key: 'media',
      type: 'select',
      required: true,
    },
    {
      label: t('settings.branch.name'),
      key: 'branch',
      type: 'select',
      required: true,
    },
    {
      label: t('applicant.add.occupation'),
      key: 'occupation',
      type: 'select',
      required: true,
    },
    {
      label: t('budget.postingPeriod'),
      key: 'postingPeriod',
      type: 'date',
      required: true,
      range: true,
    },
    {
      label: t('budget.accountingMonth'),
      key: 'accountingMonth',
      type: 'date',
      required: true,
      format: 'month'
    }],
    [
      {
        label: t('budget.amount'),
        key: 'amount',
        type: 'number',
        required: true,
        icon: true,
        range: true,
      },
      {
        label: t('budget.numberOfSlots'),
        key: 'numberOfSlots',
        type: 'number',
        required: false,
        range: true,
      },
      {
        label: t('billing.feeAggregates.unitPrice'),
        key: 'unitPrice',
        type: 'number',
        required: false,
        icon: true,
        range: true,
      },
      {
        label: t('budget.agency'),
        key: 'agency',
        type: 'text',
        required: false,
      },
      {
        label: t('backOrder.create.remarks'),
        key: 'remark',
        type: 'text',
        required: false,
      },
    ]
  ]
});

export const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: '50px',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            formatter: function (_val, opt) {
              const series = opt.w.config.series
              const idx = opt.dataPointIndex
              const total = series.reduce((total, self) => total + self.data[idx], 0)
              if (total > 0) {
                return '計: ¥' + total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              return ''
            },
            offsetX: 25

          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    title: {
      text: ''
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      }
    },
    yaxis: {
      max: function (val: number) {
        return val + val / 8
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'middle',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        const series = opt.w.config.series
        let total = 0;
        for (let i = 0; i < 3; i++) {
          const _total = series.reduce((total, self) => total + self.data[i], 0)
          if (_total > total) {
            total = _total
          }
        }
        if (val > total / 10) {
          return `¥${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} / ${Math.round((val / opt.w.globals.stackedSeriesTotals[opt.dataPointIndex]) * 1000) / 10}%`
        }
        return ''
      },
      offsetX: 0,
      offsetY: 0,
      dropShadow: {
        enabled: true
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return '¥' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
      }
    },
    fill: {
      opacity: 1

    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40
    }
  }
})
