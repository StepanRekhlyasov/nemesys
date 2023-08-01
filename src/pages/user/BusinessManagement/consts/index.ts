import { ClientFactoryTableColumn } from 'src/components/client-factory/types'
import { computed, ComputedRef, ref } from 'vue';
import { i18n } from 'boot/i18n';

const { t } = i18n.global
export const pdfViewer = ref(false);

export const tableColumnsClientFactory: ComputedRef<ClientFactoryTableColumn[]> = computed(() => {
    return [
        {
            name: 'name',
            required: true,
            align: 'left',
            field: 'office',
            sortable: true,
            label: t('client.list.name')
        },
        {
            name: 'distance',
            required: true,
            align: 'left',
            field: 'distance',
            sortable: true,
            label: t('client.list.distanceStartingPoint')
        },
        {
            name: 'address',
            required: true,
            align: 'left',
            field: 'address',
            sortable: true,
            label: t('client.list.officeLocation')
        },
        {
            name: 'telephone',
            required: true,
            align: 'left',
            field: 'telephone',
            sortable: true,
            label: t('client.list.phone')
        },
        {
            name: 'fax',
            required: true,
            align: 'left',
            field: 'fax',
            sortable: true,
            label: t('client.list.fax')
        },
        {
            name: 'office master',
            required: true,
            align: 'left',
            field: 'officeMaster',
            sortable: true,
            label: t('client.list.officeMaster')
        },
        {
            name: 'client master',
            required: true,
            align: 'left',
            field: 'clientMaster',
            sortable: true,
            label: t('client.list.clientMaster')
        },
        {
            name: 'basic information',
            required: true,
            align: 'left',
            field: 'basicInfo',
            sortable: true,
            label: t('client.list.basicInfo')
        }
    ]
})

export const tableColumnsSavedCriteriaList: ComputedRef<ClientFactoryTableColumn[]> = computed(() => [
    {
        name: 'search condition name',
        required: true,
        align: 'left',
        field: 'search condition name',
        sortable: false,
        label: t('office.searchConditionName')
    },
    {
        name: 'registered user',
        required: true,
        align: 'left',
        field: 'registered user',
        sortable: false,
        label: t('office.registeredUser')
    },
    {
        name: 'registered Date',
        required: true,
        align: 'left',
        field: 'registered Date',
        sortable: false,
        label: t('office.registeredDate')
    },
    {
        name: 'updated user',
        required: true,
        align: 'left',
        field: 'updated user',
        sortable: false,
        label: t('office.updatedUser')
    },
    {
        name: 'last modified',
        required: true,
        align: 'left',
        field: 'last modified',
        sortable: false,
        label: t('office.lastModified')
    }
])

export const customSortMethod = (rows, sortBy, descending) => {
  const collator = new Intl.Collator('ja', { sensitivity: 'base', numeric: true });
if (sortBy === 'distance') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.distance.toString();
      const second = b.distance.toString();
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    });
    return sortedRows;
  }
  else if (sortBy === 'name') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.name?a.name:'';
      const second = b.name?b.name:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'telephone') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.telephone;
      const second = b.telephone;
      return descending ? second.localeCompare(first) : first.localeCompare(second);
    });
    return sortedRows;
  }
  else if (sortBy === 'address') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.address?a.address:'';
      const second = b.address?b.address:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'fax') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.fax?a.fax:'';
      const second = b.fax?b.fax:'';
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'office master') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.officeMaster;
      const second = b.officeMaster;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'client master') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.clientMaster;
      const second = b.clientMaster;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else if (sortBy === 'basic information') {
    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      const first = a.basicInfo;
      const second = b.basicInfo;
      return descending ? collator.compare(second, first) : collator.compare(first, second);
    });
    return sortedRows;
  }
  else{
    return rows;
  }
};
