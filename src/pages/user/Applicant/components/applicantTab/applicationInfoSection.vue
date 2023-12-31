<template>
  <DropDownEditGroup :isHiddenActions="bo ? true : false" :isEdit="edit" :label="$t('applicant.list.info.application')"
    @openEdit="edit = true" @closeEdit="resetData(); edit = false;" @onSave="save">
    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.date') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ myDateFormat(applicant['applicationDate'], "YYYY/MM/DD HH:mm") || '' }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['applicationDate']">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm">
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
                <q-time v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.name') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.name || '' }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['name']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.media') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ getMediaName(applicant.media) }}</span>
        <template v-if="edit">
          <q-select outlined dense v-model="data['media']" :options="mediaList" bg-color="white" hide-bottom-space
            :label="$t('common.pleaseSelect')" emit-value map-options option-value="id" option-label="name" />
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.kanaName') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.kanaName || '' }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['kanaName']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.apply') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.applicationMetod ? $t('applicant.add.' + applicant.applicationMetod) : ''
        }}</span>
        <q-select v-if="edit" outlined dense :options="applicationMethodOption" emit-value map-options
          v-model="data['applicationMetod']" :disable="loading" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.gender') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.sex ? $t(`applicant.add.${applicant.sex}`) : '' }}</span>
        <template v-if="edit">
          <q-radio v-model="data['sex']" :label="$t('applicant.add.male')" val="male" />
          <q-radio v-model="data['sex']" :label="$t('applicant.add.female')" val="female" />
        </template>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.tel') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.phone" />
        <q-input v-if="edit" outlined dense v-model="data['phone']" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.birth') }}
      </div>
      <div class="col-3 q-pl-md blue self-center">
        <span v-if="!edit">{{ myDateFormat(applicant['dob'], 'YYYY/MM/DD') }} {{ age ? `(${age})` : '' }}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['dob']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dob']" default-view="Years" :options="limitDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.email') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.email" />
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['email']" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.lon') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.lon?.toString()" />
        <q-input v-if="edit" outlined dense v-model="data['lon']" :placeholder="$t('client.add.latitudeLabel')" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.postCode') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.postCode" />
        <q-input v-if="edit" outlined dense v-model="data['postCode']" bg-color="white" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.lat') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <hidden-text v-if="!edit" :value="applicant.lat?.toString()" />
        <q-input v-if="edit" outlined dense v-model="data['lat']" :placeholder="$t('client.add.latitudeLabel')" />
      </div>
    </div>

    <div class="row q-pb-sm" v-if="!edit">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.addres') }}
      </div>
      <div class="col-3 q-pl-md">
        <hidden-text :value="applicant.address" />
      </div>
    </div>
    <div class="row q-pb-sm" v-if="edit">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.prefecture') }}
      </div>
      <div class="col-3 q-pl-sm">
        <q-select outlined dense :options="prefectureOption" v-model="data['prefecture']"
			:rules="[creationRule]" hide-bottom-space bg-color="white"
			:label="$t('common.pleaseSelect')" emit-value map-options use-input input-debounce="0"
			@filter="filterPrefecturre" @update:model-value="data['municipalities'] = ''; data['street'] = ''" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center" />
      <div class="col-3 q-pl-md blue relative-position" />

      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.municipalities') }}
      </div>
      <div class="col-3 q-pl-sm">
        <q-select outlined dense :disable="!fetchMunicipalities" emit-value bg-color="white"
          :options="municipalities" v-model="data['municipalities']" :label="$t('common.pleaseSelect')"
          :rules="[creationRule]" hide-bottom-space use-input input-debounce="0" @filter="filterMunicipalities"
          @update:model-value="data['street'] = ''" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center" />
      <div class="col-3 q-pl-md blue relative-position" />

      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.street') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <q-input outlined dense v-model="data['street']" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center" />
      <div class="col-3 q-pl-md blue relative-position" />

      <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.add.apartment') }}
      </div>
      <div class="col-3 q-pl-md blue relative-position">
        <q-input outlined dense v-model="data['apartment']" />
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center" />
      <div class="col-3 q-pl-md blue relative-position" />
    </div>

  </DropDownEditGroup>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';
import { applicationMethod } from 'src/shared/constants/Applicant.const';
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { Applicant, ApplicantInputs, BackOrderModel } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { limitDate, myDateFormat } from 'src/shared/utils/utils'
import { Alert } from 'src/shared/utils/Alert.utils';
import { useMedia } from 'src/stores/media';
import { Media } from 'src/shared/model/Media.model';
import { creationRule } from 'src/components/handlers/rules';
import { prefectureList } from 'src/shared/constants/Prefecture.const';
import { getMunicipalities } from 'src/shared/constants/Municipalities.const';

const props = defineProps<{
  applicant: Applicant,
  bo?: BackOrderModel
}>()

const defaultData = ref<Partial<ApplicantInputs>>({})
const data = ref<Partial<ApplicantInputs>>({})
const edit = ref(false);
const loading = ref(false);
const applicantStore = useApplicant();
const media = useMedia();
const mediaList = ref<Media[]>([]);

const applicationMethodOption = ref(applicationMethod)
const prefectureOption = ref(prefectureList.value);
const fetchMunicipalities = ref(false)
const municipalities = ref<string[]>([])

function resetData() {
  defaultData.value = {
    applicationDate: myDateFormat(props?.applicant['applicationDate'], 'YYYY/MM/DD HH:mm'),
    name: props?.applicant['name'],
    media: props?.applicant['media'],
    kanaName: props?.applicant['kanaName'],
    applicationMetod: props?.applicant['applicationMetod'],
    sex: props?.applicant['sex'],
    dob: myDateFormat(props?.applicant['dob'], 'YYYY/MM/DD HH:mm'),
    phone: props?.applicant['phone'],
    email: props?.applicant['email'],
    lon: props?.applicant['lon'],
    lat: props?.applicant['lat'],
    address: props.applicant['address'] || '',
    postCode: props?.applicant['postCode'],
    prefecture: props?.applicant['prefecture'],
    municipalities: props?.applicant['municipalities'],
    street: props?.applicant['street'],
    apartment: props?.applicant['apartment'],
  }
  data.value = JSON.parse(JSON.stringify(defaultData.value));
}
resetData()

const age = computed(() => data.value['dob'] ? RankCount.ageCount(data.value['dob']) : '');

watch(() => data.value.prefecture, async (newVal, oldVal) => {
  if (newVal !== oldVal && newVal) {
    fetchMunicipalities.value = false
    municipalities.value = await getMunicipalities(newVal)
    fetchMunicipalities.value = true
  } else {
    fetchMunicipalities.value = false
  }
}, { immediate: true })

const filterMunicipalities = async (val: string, update) => {
  if (val === '' && data.value.prefecture) {
    update(async () => {
      municipalities.value = await getMunicipalities(data.value.prefecture)
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    municipalities.value = municipalities.value.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};

const filterPrefecturre = async (val: string, update) => {
  if (val === '') {
    update(async () => {
      prefectureOption.value = prefectureList.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    prefectureOption.value = prefectureOption.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
};

async function save() {
  loading.value = true
  try {
    data.value.address = [data.value.prefecture, data.value.municipalities, data.value.street, data.value.apartment].join(' ')
    await applicantStore.updateApplicant(data.value);
    edit.value = false;

  } catch (error) {
    Alert.warning(error)
  }
  loading.value = false
}

onMounted(async () => {
  mediaList.value = await media.getAllmedia();
});

const getMediaName = (mediaId) => {
  const media = mediaList.value.find(x => x.id === mediaId)
  if (media) {
    return media.name
  }
  return ''
};


</script>
