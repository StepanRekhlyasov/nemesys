import { computed, ref } from 'vue';
import { i18n } from 'boot/i18n';
import { useOrganization } from 'src/stores/organization';
import { getDocs, getFirestore, DocumentData, query, where } from '@firebase/firestore';
import { templateCollection } from 'src/shared/utils/utils';

export const destinationApplicant = computed(() => {
  const { t } = i18n.global
  return [
    {
      name: 'selected',
      required: true,
      label: '',
      field: 'selected',
      align: 'left',
    },
    {
      name: 'staffApplication',
      required: true,
      label: '',
      field: 'staffApplication',
      align: 'left',
    },
    {
      name: 'occupationAdress',
      required: true,
      label: '',
      field: 'occupationAdress',
      align: 'left',
    },
    {
      name: 'staffRank',
      required: true,
      label: t('applicant.list.rank'),
      field: 'staffRank',
      align: 'left',
    },
    {
      name: 'status',
      required: true,
      label: t('applicant.list.status'),
      field: 'status',
      align: 'left',
    },
    {
      name: 'qualificationExp',
      required: true,
      label: '',
      field: 'qualificationExp',
      align: 'left',
    },
    {
      name: 'lineStation',
      required: true,
      label: '',
      field: 'station',
      align: 'left',
    },
  ]
})

export const options = computed(async () => {
  const organization = useOrganization();
  const templates = ref<DocumentData[]>([]);
  const db = getFirestore();
  const q = query(templateCollection(db, organization.currentOrganizationId), where('deleted', '==', false));
  const querySnapshot = await getDocs(q);

  const fetchedTemplates: DocumentData[] = [];

  querySnapshot.forEach((doc) => {
    const template = doc.data();
    template['label'] = template.name;
    fetchedTemplates.push(template);
  });

  templates.value = fetchedTemplates;

  return templates.value;
});
