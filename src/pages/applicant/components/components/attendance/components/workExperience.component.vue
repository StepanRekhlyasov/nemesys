<template>
  <q-form>
    <div class="row q-pb-md justify-between">
      <div class="flex self-center">
        <span class="text-primary text-h6">2.{{ $t('applicant.attendant.experience') }}</span>
        <div>
          <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
            class="text-grey-9" @click="show = false" v-if="show" />
          <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
            class="text-grey-9" @click="show = true" v-else />
        </div>
      </div>
      <div class="col-3 text-right" v-if="show">
        <q-btn v-if="!edit" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="edit = true" class="no-shadow q-ml-lg" />
        <q-btn v-if="edit" :label="$t('common.save')" color="primary" type="submit"/>
        <q-btn v-if="edit" :label="$t('common.cancel')" class="q-ml-md" outline color="primary" @click="edit=false" />
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'workExperienceComponent',
  props: {
    applicant: {
      type: Object,
      required: true
    },
    updateApplicant: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const edit = ref(false);
    const show = ref(false);
    const loading = ref(false);
    const data = ref( {
      attendingStatus: props?.applicant['attendingStatus'] || '',
      attendingDate: props?.applicant['attendingDate'] || '',
      attendee: props?.applicant['attendee'] || '',
      memo: props?.applicant['memo'] || '',
    })

    const { t } = useI18n({
      useScope: 'global',
    });
    const $q = useQuasar();

    return {
      edit,
      show,
      data,
      loading,

      async saveInfo() {
        loading.value = true
        try {
          await props.updateApplicant(data.value);
          Alert.success($q, t);
          edit.value = false;
        } catch (error) {
          console.log(error);
          loading.value = false;
          Alert.warning($q, t);
        }
        loading.value = false
      }
    }
  }
}
</script>

<style>

</style>
