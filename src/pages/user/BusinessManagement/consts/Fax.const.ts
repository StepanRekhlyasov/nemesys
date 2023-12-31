import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const faxColumns = computed(() => {
    return [
        {
            label: t('clientFactory.fax.list.senderId'),
            field: 'senderId',
            name: 'senderId',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.sender'),
            field: 'sender',
            name: 'sender',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.jobSeeker'),
            field: 'applicantName',
            name: 'applicantName',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.attachment'),
            field: 'attachment',
            name: 'attachment',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.numPages'),
            field: 'numPDFPages',
            name: 'numPDFPages',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.selectedCF'),
            field: 'selectedCF',
            name: 'selectedCF',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.numItemsSent'),
            field: 'numItemsSent',
            name: 'numItemsSent',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.numCFsFax'),
            field: 'numCFsFax',
            name: 'numCFsFax',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.numDestinations'),
            field: 'numDestinations',
            name: 'numDestinations',
            align: 'left',
        },
        {
            label: t('clientFactory.fax.list.numTransmissions'),
            field: 'numSuccessDelivery',
            name: 'numSuccessDelivery',
            align: 'left',
        },

        {
            label: t('clientFactory.fax.list.sentDateTime'),
            field: 'sentDateTime',
            name: 'sentDateTime',
            align: 'left',
        },
    ]
});