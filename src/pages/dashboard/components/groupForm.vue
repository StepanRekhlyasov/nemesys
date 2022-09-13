<template>
<q-dialog
      v-model="model"
    >
      <q-card style="width: 500px; max-width: 80vw;" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 q-pb-md">
            <span v-if="group['id']">Update</span>
            <span v-else>Create</span>
            Group
          </div>
          <q-form
            ref="groupForm"
            @submit="$emit('onSubmitGroup')"
            class="q-gutter-md"
          >

            <q-input
              outlined
              v-model="group['label']"
              label="Name"
              lazy-rules
              dense
              :rules="[ val => val && val.length > 0 || 'Please type something']"
            />

            <q-card-actions class="flex">
              <div class="col">
                <q-btn label="Submit" type="submit" color="primary"/>
                <q-btn label="Cancel" color="negative" flat class="q-ml-sm"  @click="$emit('closeGroup')"/>
              </div>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed  } from 'vue'
import { useQuasar } from 'quasar'
import api from '../../../firebaseData/dashboard.js'

export default {
  name: 'applicantForm',
  components: {  },

  props: {
    groupDialog: {
      type: Boolean,
      required: true
    },
    groupData: {
      type: Object,
      required: true
    }
   },

   setup(props, { emit }) {

    const model = computed({
      get() { return props.groupDialog }
    })

    const group = computed({
      get() { return props.groupData }
    })

    return { model, group };
  }

  }

</script>
