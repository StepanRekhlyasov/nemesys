<template>
  <q-dialog v-model="model">
    <q-card style="width: 700px; max-width: 80vw" class="q-pa-lg">
      <q-card-section>
        <div class="text-h6 q-pb-md">
          <span v-if="applicant['id']">Update</span>
          <span v-else>Create</span>
          Applicant
        </div>
        <q-form
          ref="applicantForm"
          @submit="$emit('onSubmit')"
          class="q-gutter-md"
        >
          <q-input
            outlined
            v-model="applicant['name']"
            label="Name"
            lazy-rules
            dense
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />
          <q-input
            outlined
            v-model="applicant['address']"
            label="Address"
            lazy-rules
            dense
          />
          <q-input
            outlined
            v-model="applicant['branch']"
            label="Branch"
            lazy-rules
            dense
          />

          <q-select
            outlined
            v-model="applicant['groupId']"
            :options="columns"
            label="Group"
            lazy-rules
            dense
            option-value="id"
            option-text="id"
            emit-value
            map-options
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            type="date"
            outlined
            v-model="applicant['employmentDate']"
            :stack-label="true"
            label="Employment Date"
            dense
          />

          <q-select
            label="Tag"
            outlined
            v-model="applicant['tag']"
            :options="tags"
            dense
          ></q-select>

          <q-card-actions class="flex">
            <div class="col">
              <q-btn
                label="Cancel"
                color="negative"
                flat
                @click="$emit('close')"
              />
              <q-btn
                v-if="applicant['id']"
                label="Delete"
                class="q-ml-sm"
                color="negative"
                @click="$emit('onDelete', applicant)"
              />
            </div>
            <q-btn label="Submit" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
//import { useI18n } from 'vue-i18n'
import { computed } from 'vue';
// import { useQuasar } from 'quasar'
// import api from '../../../firebaseData/dashboard.js'

export default {
  name: 'applicantForm',
  components: {},

  props: {
    applicantDialog: {
      type: Boolean,
      required: true,
    },
    applicantData: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },

  setup(props, {}) {
    const model = computed({
      get() {
        return props.applicantDialog;
      },
    });

    const applicant = computed({
      get() {
        return props.applicantData;
      },
    });

    return { model, applicant };
  },
};
</script>
