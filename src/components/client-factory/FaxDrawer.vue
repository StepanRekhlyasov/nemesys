<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { withDefaults, defineEmits, defineProps, ref, watch } from 'vue';
import { useApplicant } from 'src/stores/applicant';
import { myDateFormat } from 'src/shared/utils/utils';
import { useFax } from 'src/stores/fax';
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils'
import PdfViewer from 'src/pages/user/BusinessManagement/components/PdfViewer.vue';
import { pdfViewer } from 'src/pages/user/BusinessManagement/consts/index';
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const { t } = useI18n({ useScope: 'global' });
const faxStore = useFax();
const $q = useQuasar();

const props = withDefaults(defineProps<{
  isDrawer: boolean;
  theme?: string;
  selectedCF: string[];
}>(),
  {
    theme: 'primary',
  },
);
const faxDataDataSample = {
  setTransmissionDateTime: true,
  transmissionDateTime: '',
};
const faxData = ref(JSON.parse(JSON.stringify(faxDataDataSample)));
const faxFile = ref<FileList | []>([]);
const applicantList = ref(<{ value: string; label: string }[]>[]);
const applicantStore = useApplicant();
const loading = ref(false);
const faxForm = ref();
const emit = defineEmits<{
  (e: 'hideDrawer');
}>();

const hideDrawer = () => {
  emit('hideDrawer');
};

watch(
  () => (applicantStore.state.applicantList),
  (newVal) => {
    applicantList.value = [];
    for (let i = 0; i < newVal.length; i++) {
      let label = newVal[i]['name'] || ''
      if (newVal[i]['dob']) {
        label += ' (' + myDateFormat(newVal[i]['dob']) + ')'
      }
      applicantList.value.push({ label: label, value: newVal[i]['id'] })
    }
  },
)
watch(
  () => faxData.value.setTransmissionDateTime,
  () => {
    faxData.value.transmissionDateTime = '';
  }
);
watch(
  faxFile, () => {
    if (faxFile.value.length === 0) {
      pdfUrl.value = ''
    }
  }
);
const filterFn = (val: string, update) => {
  const pagination = {
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 100,
  };
  update(async () => {
    if (val === '') {
      applicantStore.state.applicantList = [];
    } else {
      loading.value = true;
      await applicantStore.loadApplicantData(
        { keyword: val as string },
        pagination
      );
      loading.value = false;
    }
  });
};


watchCurrentOrganization(async () => {
  await applicantStore.loadApplicantData()
})

const save = async () => {
  $q.dialog({
    message: `${t('clientFactory.fax.faxPRSheet')}<br />${t('clientFactory.fax.areYouSure')}`,
    persistent: true,
    html: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    faxData.value.selectedCF = props.selectedCF
    await faxStore.saveFax(faxData.value, faxFile.value);
  });
};
const pdfUrl = ref('');
function viewFile(event) {
  const file = event.target.files[0];
  pdfUrl.value = URL.createObjectURL(file);
}
const openPdfViewer = () => {
  pdfViewer.value = true;
}
const confirm = ref(false);
const confirmContent = () => {
  if (pdfUrl.value.length === 0 || !('applicants' in faxData.value) || faxData.value['applicants'] == null) {
    Alert.warning()
    return
  }
  $q.dialog({
    message: `${t('clientFactory.fax.transMissionConfirmation')}<br />${t('clientFactory.fax.areYouSure')}`,
    persistent: true,
    html: true,
    cancel: t('common.cancel'),
  }).onOk(async () => {
    confirm.value = true
  });
}
</script>
<template>
  <q-drawer :model-value="isDrawer" :width="900" :breakpoint="500" overlay elevated bordered side="right" show>
    <q-scroll-area class="fit text-left">
      <q-form ref="faxForm" @submit="save">
        <q-card class="no-shadow bg-grey-3">
          <q-card-section class="text-white bg-primary">
            <div class="text-h6">
              <q-btn dense flat icon="close" @click="hideDrawer" v-if="!confirm" />
              <q-btn dense flat icon="edit" @click="(() => { confirm = !confirm })" v-else />
              <span class="q-pl-sm text-bold">{{
                $t('client.add.options.faxSending')
              }}</span>
              <q-btn :label="t('clientFactory.fax.transmissionConfirmation')" color="white" text-color="primary"
                class="text-bold q-ml-lg q-px-md q-py-none" dense type="submit" v-if="confirm" />
              <q-btn :label="t('clientFactory.fax.confirmAction')" color="white" text-color="primary"
                class="text-bold q-ml-lg q-px-md q-py-none" dense @click="confirmContent" v-else />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="bg-grey-1">
            <div class="row">
              <q-icon name="square" color="primary" class="q-mt-xs" />
              <span class="text-primary text-bold q-ml-xs">{{
                $t('clientFactory.fax.applicantLinkage')
              }}</span>
            </div>
            <div class="row">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('report.categories.applicant') }}
              </div>
              <div class="col-9" v-if="!confirm">
                <q-select dense outlined map-options v-model="faxData['applicants']" use-input use-chips
                  input-debounce="0" :options="applicantList" @filter="filterFn" :loading="loading"
                  :rules="[(val) => !!val || '']" hide-bottom-space />
              </div>
              <div class="col-9 q-mt-sm" v-else>
                <p>{{ faxData['applicants']['label'] }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.clientCategoryNG') }}
              </div>
              <div class="col-9"></div>
            </div>
            <div class="row">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.clientFacilityNG') }}
              </div>
              <div class="col-9"></div>
            </div>
            <div class="row">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.previousEmploymentClient') }}
              </div>
              <div class="col-9"></div>
            </div>
            <div class="row q-mt-sm">
              <q-icon name="square" color="primary" class="q-mt-xs" />
              <span class="text-primary text-bold q-ml-xs">
                {{ $t('clientFactory.fax.transmissionContentSettings') }}
              </span>
            </div>
            <div class="row q-mt-sm q-mb-xs q-pl-xl q-ml-xl" v-if="!confirm">
              <div class="col-6 text-negative q-pl-xl q-ml-xl">
                <div class="q-pl-lg">
                  {{ $t('clientFactory.fax.onlyPdfFomratCanBeAttached') }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.prSheet') }}
              </div>
              <div class="col-5" v-if="!confirm">
                <q-file name="fax_files" v-model="faxFile" dense outlined multiple use-chips
                  :label="t('clientFactory.fax.attachPRSheet')" style="max-width: 350px" accept="application/pdf"
                  :rules="[(val) => !!val || '']" hide-bottom-space @input="viewFile" />
              </div>
              <div class="col-9" v-else>
                <q-btn class="col-3" color="primary" :label="t('common.preview')" @click="openPdfViewer" />
                <p class="col-6 q-ml-sm">{{ faxFile[0]['name'] }}</p>
              </div>
            </div>
            <div class="row" v-if="!confirm">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.setTransmissionDateTime') }}
              </div>
              <div class="col-9">
                <q-checkbox v-model="faxData['setTransmissionDateTime']" :label="t('clientFactory.fax.set')" />
              </div>
            </div>
            <div class="row" v-if="faxData['setTransmissionDateTime'] || confirm">
              <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                {{ $t('clientFactory.fax.transmissionDateTime') }}
              </div>
              <div class="col-9" v-if="!confirm">
                <q-input dense outlined v-model="faxData['transmissionDateTime']" style="max-width: 350px">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="faxData['transmissionDateTime']" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="faxData['transmissionDateTime']" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-9 q-mt-sm" v-else>
                <p>{{ faxData['transmissionDateTime'] }}</p>
              </div>
            </div>
            <div v-if="selectedCF.length > 1 || selectedCF.includes('all')">
              <div class="row q-mt-sm">
                <q-icon name="square" color="primary" class="q-mt-xs" />
                <span class="text-primary text-bold q-ml-xs">
                  {{ $t('clientFactory.fax.destinationSettings') }}
                </span>
              </div>

              <div class="row flex">
                <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                  {{ $t('clientFactory.fax.maxTransmissions') }}
                </div>
                <div class="col-9 flex inline" v-if="!confirm">
                  <q-select dense outlined emit-value map-options v-model="faxData['maxTransmissions']" use-input
                    use-chips input-debounce="0" :options="[50, 100, 150, 200, 300, 500, 1000, 1500, 2000]" />
                  <span class="q-mt-sm q-ml-sm">{{
                    $t('applicant.attendant.items')
                  }}</span>
                </div>
                <div class="col-9 q-mt-sm" v-else>
                  <p>{{ faxData['maxTransmissions'] }}</p>
                </div>
              </div>

              <div class="row">
                <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                  {{ $t('clientFactory.fax.clientNG') }}
                </div>
                <div class="col-9"></div>
              </div>

              <div class="row">
                <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                  {{ $t('clientFactory.fax.refinementConditions') }}
                </div>
                <div class="col-9"></div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-form>
    </q-scroll-area>
  </q-drawer>
  <PdfViewer :url="pdfUrl" />
</template>

<style lang="scss" scoped></style>
