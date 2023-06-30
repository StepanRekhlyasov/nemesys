<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { withDefaults, defineEmits, defineProps, ref, watch } from 'vue';
import { useApplicant } from 'src/stores/applicant';
import { timestampToDateFormat } from 'src/shared/utils/utils';
import { useFax } from 'src/stores/fax';

const { t } = useI18n({ useScope: 'global' });
const faxStore = useFax();

withDefaults(
    defineProps<{
        isDrawer: boolean
        theme?: string
    }>(), {
    theme: 'primary'
}
)

const faxDataDataSample = { setTransmissionDateTime: true, transmissionDateTime: '' };
const faxData = ref(JSON.parse(JSON.stringify(faxDataDataSample)));
const faxFile = ref<FileList | []>([]);
const applicantList = ref(<{ value: string; label: string }[]>[]);
const applicantStore = useApplicant();
const loading = ref(false)
const faxForm = ref();

const emit = defineEmits<{
    (e: 'hideDrawer')
}>()

const hideDrawer = () => {
    emit('hideDrawer')
}

watch(
    () => (applicantStore.state.applicantList),
    (newVal) => {
        applicantList.value = [];
        for (let i = 0; i < newVal.length; i++) {
            let label = newVal[i]['name'] || ''
            if (newVal[i]['dob']) {
                label += ' (' + timestampToDateFormat(newVal[i]['dob']) + ')'
            }
            applicantList.value.push({ label: label, value: newVal[i]['id'] })
        }
    },
)
watch(
    () => (faxData.value.setTransmissionDateTime),
    () => {
        faxData.value.transmissionDateTime = '';
    },
)

const filterFn = (val: string, update) => {
    const pagination = {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 100
    };
    update(async () => {
        if (val === '') {
            applicantStore.state.applicantList = []
        }
        else {
            loading.value = true;
            await applicantStore.loadApplicantData({ 'keyword': val as string }, pagination)
            loading.value = false;
        }
    })
}
const save = async () => {
    await faxStore.saveFax(faxData.value, faxFile.value);
    faxData.value = JSON.parse(JSON.stringify(faxDataDataSample));
    faxForm.value.resetValidation();
}
</script>

<template>
    <q-drawer :model-value="isDrawer" :width="900" :breakpoint="500" overlay elevated bordered side="right" show>
        <q-scroll-area class="fit text-left">
            <q-form ref="faxForm" @submit="save">
                <q-card class="no-shadow bg-grey-3">
                    <q-card-section class="text-white bg-primary">
                        <div class="text-h6">
                            <q-btn dense flat icon="close" @click="hideDrawer" />
                            <span class="q-pl-sm text-bold">{{ $t('client.add.options.faxSending') }}</span>
                            <q-btn :label="t('clientFactory.fax.transmissionConfirmation')" color="white"
                                text-color="primary" class="text-bold q-ml-lg q-px-md q-py-none" dense type="submit" />
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="bg-grey-1">
                        <div class="row">
                            <q-icon name="square" color="primary" class="q-mt-xs" />
                            <span class="text-primary text-bold q-ml-xs">{{ $t('clientFactory.fax.applicantLinkage')
                            }}</span>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('report.categories.applicant') }}
                            </div>
                            <div class="col-9">
                                <q-select dense outlined emit-value map-options v-model="faxData['applicants']" use-input
                                    use-chips multiple input-debounce="0" :options="applicantList" @filter="filterFn"
                                    :loading="loading" :rules="[(val) => !!val || '']" hide-bottom-space />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.clientCategoryNG') }}
                            </div>
                            <div class="col-9">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.clientFacilityNG') }}
                            </div>
                            <div class="col-9">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.previousEmploymentClient') }}
                            </div>
                            <div class="col-9">
                            </div>
                        </div>
                        <div class="row q-mt-sm">
                            <q-icon name="square" color="primary" class="q-mt-xs" />
                            <span class="text-primary text-bold q-ml-xs">
                                {{ $t('clientFactory.fax.transmissionContentSettings') }}
                            </span>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.prSheet') }}
                            </div>
                            <div class="col-9">
                                <q-file name="fax_files" v-model="faxFile" dense outlined multiple use-chips
                                    :label="t('clientFactory.fax.attachPRSheet')" style="max-width: 350px;"
                                    accept="application/pdf" :rules="[(val) => !!val || '']" hide-bottom-space />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.setTransmissionDateTime') }}
                            </div>
                            <div class="col-9">
                                <q-checkbox v-model="faxData['setTransmissionDateTime']"
                                    :label="t('clientFactory.fax.set')" />
                            </div>
                        </div>
                        <div class="row" v-if="faxData['setTransmissionDateTime']">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.transmissionDateTime') }}
                            </div>
                            <div class="col-9">
                                <q-input dense outlined v-model="faxData['transmissionDateTime']" style="max-width: 350px;">
                                    <template v-slot:prepend>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="faxData['transmissionDateTime']" mask="YYYY-MM-DD HH:mm">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup :label="$t('common.close')" color="primary"
                                                            flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>

                                    <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-time v-model="faxData['transmissionDateTime']" mask="YYYY-MM-DD HH:mm"
                                                    format24h>
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup :label="$t('common.close')" color="primary"
                                                            flat />
                                                    </div>
                                                </q-time>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>

                            </div>
                        </div>
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
                            <div class="col-9 flex inline">
                                <q-input v-model="faxData['maxTransmissions']" outlined dense type="number"
                                    style="max-width: 150px;" :min="0" />
                                <span class="q-mt-sm q-ml-sm">{{ $t('applicant.attendant.items') }}</span>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.clientNG') }}
                            </div>
                            <div class="col-9">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-3 text-right q-pr-sm text-primary q-pt-sm">
                                {{ $t('clientFactory.fax.refinementConditions') }}
                            </div>
                            <div class="col-9">
                            </div>
                        </div>


                    </q-card-section>
                </q-card>
            </q-form>
        </q-scroll-area>
    </q-drawer>
</template>

<style lang="scss" scoped></style>
