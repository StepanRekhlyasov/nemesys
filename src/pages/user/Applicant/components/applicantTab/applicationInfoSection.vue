<template>

  <DropDownEditGroup
    :isEdit="edit"
    :label="$t('applicant.list.info.application')"
    @openEdit="edit = true"
    @closeEdit="onReset();edit = false;"
    @onSave="save">
    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.date') }}
      </div>
      <div class="col-3 q-pl-md blue ">
        <span v-if="!edit">{{ applicant.applicationDate || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['applicationDate']">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="data['applicationDate']" mask="YYYY/MM/DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
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
        <span v-if="!edit">{{ applicant.name || ''}}</span>
        <q-input  v-if="edit" dense outlined bg-color="white" v-model="data['name']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.media') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.media? applicant.media == 'hr' && $t('applicant.add.hr') || 'indeed' : ''}}</span>
        <template v-if="edit">
          <q-radio v-model="data['media']" label="indeed" val="indeed"/>
          <q-radio v-model="data['media']" :label="$t('applicant.add.hr')" val="hr"/>
        </template>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.kana') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.kanaName || ''}}</span>
        <q-input v-if="edit" dense outlined bg-color="white" v-model="data['kanaName']" />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.apply') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.applicationMetod? $t('applicant.add.'+applicant.applicationMetod) :''}}</span>        
        <q-select v-if="edit" outlined dense :options="applicationMethodOption"
          emit-value map-options v-model="data['applicationMetod']" :disable="loading"/>
      </div>
      <div class="col-3 q-pl-md text-right text-blue text-weight-regular self-center">
        {{ $t('applicant.list.info.gender') }}
      </div>
      <div class="col-3 q-pl-md blue">
        <span v-if="!edit">{{ applicant.sex || ''}}</span>
        <template  v-if="edit" >
          <q-radio v-model="data['sex']" :label="$t('applicant.add.male')" val="male"/>
          <q-radio v-model="data['sex']" :label="$t('applicant.add.female')" val="female"/>
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
        <span v-if="!edit">{{ applicant.dob? applicant.dob+` (${age})` :''}}</span>
        <q-input v-if="edit"  dense outlined bg-color="white" v-model="data['dob']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="data['dob']" default-view="Years" :options="limitDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
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
        <hidden-text v-if="!edit" :value="applicant.lon" />
        <q-input
          v-if="edit"
          outlined
          dense
          v-model="data['lon']"
          :placeholder="$t('client.add.latitudeLabel')"
        />
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
        <hidden-text v-if="!edit" :value="applicant.lat" />
        <q-input
          v-if="edit"
          outlined
          dense
          v-model="data['lat']"
          :placeholder="$t('client.add.latitudeLabel')"
        />
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
        {{ $t('applicant.list.info.addres') }}
      </div>
      <div class="col-9 q-pl-md">
        <hidden-text v-if="!edit" :value="applicant.address" />
        <q-input v-if="edit" outlined dense v-model="data['addres']" />
      </div>
    </div>
  </DropDownEditGroup>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { applicationMethod } from 'src/shared/constants/Applicant.const';
import hiddenText from 'src/components/hiddingText.component.vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import { Applicant } from 'src/shared/model';
import { useApplicant } from 'src/stores/applicant';
import { limitDate } from 'src/shared/utils/utils'

const props = defineProps<{
  applicant: Applicant
}>()
const edit = ref(false);
const loading = ref(false);
const applicationMethodOption = ref(applicationMethod)
const applicantStore = useApplicant();
const data = ref({})

function onReset(){
  data.value = {
    applicationDate: props?.applicant['applicationDate'] || '',
    name: props?.applicant['name'] || '',
    media: props?.applicant['media'] || '',
    kanaName: props?.applicant['kanaName'] || '',
    applicationMetod: props?.applicant['applicationMetod'] || '',
    sex: props?.applicant['sex'],
    dob: props?.applicant['dob'] || '',
    phone: props?.applicant['phone'] || '',
    email: props?.applicant['email'] || '',
    lon: props?.applicant['lon'] || '',
    lat: props?.applicant['lat'] || '',
    postCode: props?.applicant['postCode'] || '',
  }
}

onReset();
const age = computed(()=>data.value['dob']?RankCount.ageCount(data.value['dob']):'');

async function save() {
  loading.value = true
  try {
    await applicantStore.updateApplicant(data.value);
    edit.value = false;
  } catch (error) {
    loading.value = false;
  }
  loading.value = false
}
</script>