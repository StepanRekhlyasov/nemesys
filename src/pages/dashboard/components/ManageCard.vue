<template>
  <div>
    <div class="justify-right">
      <q-space></q-space>
      <q-btn
        label="New Group"
        class="q-mr-sm"
        color="primary"
        icon="add"
        outline
        @click="onCreateGroup"
      />
      <q-btn
        label="New Applicant"
        color="primary"
        icon="add"
        outline
        @click="onCreate"
      />
    </div>

    <groupForm
      :groupDialog="groupDialog"
      :groupData="group"
      @onSubmitGroup="onSubmitGroup"
      @closeGroup="closeGroup"
    />
    <applicantForm
      :applicantDialog="applicantDialog"
      :applicantData="applicant"
      :columns="columns"
      :tags="tags"
      @close="close"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import api from '../../../firebaseData/dashboard';
import applicantForm from './applicantForm';
import groupForm from './groupForm';

export default {
  name: 'ManageCard',
  components: { applicantForm, groupForm },

  props: {
    columns: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },

  computed: {},

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const $q = useQuasar();

    const applicantDialog = ref(false);
    const applicant = ref({});
    const applicantForm = ref(null);

    const groupForm = ref(null);
    const group = ref({});
    const groupDialog = ref(false);

    return {
      applicantDialog,
      applicant,
      applicantForm,
      groupDialog,
      group,
      groupForm,

      onCreate() {
        applicant.value = {};
        applicantDialog.value = true;
      },
      onCreateGroup() {
        group.value = {};
        groupDialog.value = true;
      },
      onSubmitGroup() {
        api
          .createGroup(group.value)
          .then((doc) => {
            if (doc.id) {
              group.value = {};
              //groupForm.value.resetValidation();
              groupDialog.value = false;
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: t('success'),
              });
            } else {
              $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: t('failed'),
              });
            }
          })
          .catch((error) => console.log(error));
      },
      onSubmit() {
        api
          .createCard(applicant.value)
          .then((doc) => {
            if (doc.id) {
              applicantDialog.value = false;
              applicant.value = {};
              //applicantForm.value.resetValidation();
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: t('success'),
              });
            } else {
              $q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: t('failed'),
              });
            }
          })
          .catch((error) => console.log(error));
      },
      close() {
        applicantDialog.value = false;
      },
      closeGroup() {
        groupDialog.value = false;
      },
    };
  },
};
</script>
