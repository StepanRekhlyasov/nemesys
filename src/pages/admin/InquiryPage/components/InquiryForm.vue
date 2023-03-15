<template>
  <q-card flat class="bg-grey-2 q-pa-md">
    <div class="q-mx-md ">
      <p class="text-bold">{{ $t('inquiry.detail.responseTitle') }}</p>
    </div>
    <q-card-section>
     <q-form v-if="!inquiryAnswerContent && !updatedResponseContent" class="q-mb-xs inquiry-form">
        <div class="row items-start q-gutter-md q-mb-xs">
          <div class="col-2 text-right ">
            {{ $t('inquiry.detail.replyContent') }}
          </div>
          <div class="col-8 text-right">
            <q-input
            type="textarea"
            dense  v-model="responseContent" borderless input-style="height: 150px;" input-class="inquiry-form__field" />
          </div>
        </div>


        <div class="row items-center q-mx-lg q-my-md">
          <div class="offset-md-2 row q-gutter-sm">
            <q-btn
              :ripple="false"
              color="accent"
              class="q-py-none text-weight-bold text-caption "
              size="sm"
              @click.once="sendResponse"
              :disable="!responseContent"
              style="margin-left: 2px;"
            >
              {{ $t('releaseNotes.form.send') }}
            </q-btn>

            <q-btn
              class="q-py-none text-weight-bold text-accent"
              size="sm"
              outline
              color="accent"
              no-caps
              :unelevated="false"
              @click.once="clearAllValues"
              >
              {{ $t('releaseNotes.form.cancel') }}
            </q-btn>
          </div>
        </div>




      </q-form>
      <div v-else class="row items-start q-gutter-md q-mb-xs">
        <div class="col-2 text-right ">
          {{ $t('inquiry.detail.replyContent') }}
        </div>
        <div class="col-8">
          {{ inquiryAnswerContent ?? updatedResponseContent }}
        </div>
      </div>
    </q-card-section>
 </q-card>
</template>

<script lang="ts" setup>
  import { serverTimestamp } from '@firebase/firestore';
  import { useQuasar } from 'quasar';
  import { ref, computed } from 'vue'
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useI18n } from 'vue-i18n';
  import { useInquiry } from 'src/stores/admin/inquiry';
  import { INQUIRY_STATUS } from '../types/inquiryTypes'

  const $q = useQuasar();
  const { t } = useI18n({ useScope: 'global' });


  const inquiryStore = useInquiry()

  const responseContent = ref('')
  const inquiryAnswerContent = computed(() => inquiryStore.state.currentRowData.responseContent);
  const inquiryId =  computed(() => inquiryStore.state.currentRowData.id);
  const updatedResponseContent = ref('')


  const sendResponse = async () => {
    if (responseContent.value && inquiryId.value) {
      try {
        await inquiryStore.replyOnInquiry(inquiryId.value, {
          replyDate: serverTimestamp(),
          replyContent: responseContent.value,
          status: INQUIRY_STATUS[0]
        })
        Alert.success($q, t)
        inquiryStore.setCurrentRowResponse(responseContent.value)
      } catch {
        Alert.warning($q, t)
      }
    }
  }

  const clearAllValues = () => {
    responseContent.value = ''
  }


</script>

<style lang="scss">
@import "src/css/imports/colors";
  .inquiry-form {
    &__field {
      border: 1px solid $input-border;
      border-radius: 3px;
      max-height: fit-content;
      resize: vertical;
      min-height: 151px;
      padding-top: 0;
      width: 100%;
      padding: 6px 10px;
      margin: auto;
    }
  }

</style>
