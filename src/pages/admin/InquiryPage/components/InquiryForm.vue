<template>
  <q-card flat class="bg-grey-2 q-pa-md">
    <div class="q-mx-md ">
      <p class="text-bold">{{ $t('inquiry.detail.responseTitle') }}</p>
    </div>
    <q-card-section>
     <q-form  class="q-mb-xs inquiry-form">
        <div class="row items-start q-gutter-md q-mb-xs">
          <div class="col-2 text-right ">
            {{ $t('inquiry.detail.replyContent') }}
          </div>
          <div class="col-8 text-right">
            <q-input
            type="textarea"
            :disable="loading"
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

              :disable="!responseContent || loading"
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
              :disable="loading"
              @click.once="clearAllValues"
              >
              {{ $t('releaseNotes.form.cancel') }}
            </q-btn>
          </div>
        </div>

      </q-form>
    </q-card-section>
 </q-card>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { Alert } from 'src/shared/utils/Alert.utils';
  import { useInquiry } from 'src/stores/inquiry';
  import { INQUIRY_MESSAGE_TYPE, INQUIRY_STATUS } from '../types/inquiryTypes'

  const inquiryStore = useInquiry()

  const responseContent = ref('')
  const loading = ref(false);
  const inquiryId =  computed(() => inquiryStore.state.currentRowData.id);


  const sendResponse = async () => {
    if (responseContent.value && inquiryId.value) {
      loading.value = true;
      try {
        await inquiryStore.replyOnInquiry({
          inquiryId: inquiryId.value,
          message: {
            date: new Date(),
            content: responseContent.value,
            type: INQUIRY_MESSAGE_TYPE.response
          },
         data: {status: INQUIRY_STATUS.answered}
        })
        Alert.success()
        await inquiryStore.getAllInquires()
        inquiryStore.updateCurrentRowDataMessages({message: {
            date: new Date(),
            content: responseContent.value,
            type: INQUIRY_MESSAGE_TYPE.response
          },
         data: {status: INQUIRY_STATUS.answered}})

         responseContent.value = ''
        loading.value = false;
      } catch(e) {
        Alert.warning(e)

        loading.value = false;
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
