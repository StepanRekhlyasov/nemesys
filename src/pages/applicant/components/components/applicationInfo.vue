<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none justify-between flex">
      <div class="flex">
        <span class="text-primary text-h6"> {{ $t('applicant.list.info.application') }} </span>
        <div>
          <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
            class="text-grey-9" @click="showApplication = false" v-if="showApplication" />
          <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
            class="text-grey-9" @click="showApplication = true" v-else />
        </div>
      </div>
      <q-btn v-if="showApplication" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="drawerRight = true" class="no-shadow q-ml-lg" />
    </q-card-section>
    <q-card-section class="q-pa-sm" v-if="showApplication">
      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.date') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.applicationDate }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.name') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm">
          {{ applicant.name }}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.media') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm">
          indeed
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.kana') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm">
          タナカ　タロウ
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.apply') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.applicationDate }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.gender') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm ">
          {{$t('applicant.add.'+applicant.sex)}}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.tel') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.phone || '' }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.birth') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm ">
          {{ applicant.birth || ''}}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.email') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm">
          {{ applicant.email || '' }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.lon') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm ">
          {{ applicant.lon || ''}}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.postCode') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.postCode || '' }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.lat') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm">
          {{ applicant.lat || ''}}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.addres') }}
        </div>
        <div class="col-9 q-pa-sm">
          {{ applicant.addres || '' }}
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none justify-between flex">
      <div class="flex">
        <span class="text-primary text-h6"> {{ $t('applicant.list.info.attraction') }} </span>
        <div>
          <q-btn :label="$t('common.closeArea')" :icon="'arrow_drop_up'" flat size="md"
            class="text-grey-9" @click="showAttraction = false" v-if="showAttraction" />
          <q-btn :label="$t('common.openArea')" :icon="'arrow_drop_down'" flat size="md"
            class="text-grey-9" @click="showAttraction = true" v-else />
        </div>
      </div>
      <q-btn v-if="showAttraction" :label="$t('common.edit')" color="primary" outline  icon="edit" @click="drawerRight = true" class="no-shadow q-ml-lg" />
    </q-card-section>
    <q-card-section class="q-pa-sm" v-if="showAttraction">
      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.attractionsStatus') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm blue text-bold">
          {{ applicant.attractionsStatus }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.seductionDay') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm blue text-bold">
          {{ applicant.seductionDay }}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.employmentStatus') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.employmentStatus }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.seduser') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm ">
          {{ applicant.seduser || '' }}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.classiffication') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm blue text-bold">
          {{ applicant.classiffication || ''}}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.position') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm blue text-bold">
          {{ applicant.position || '' }}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.qualifications') }}
        </div>
        <div class="col-3 q-pl-md q-pb-sm ">
          {{ applicant.qualification.map(applic => $t('applicant.add.'+applic)).join(', ') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.period') }}
        </div>
        <div class="col-2 q-pl-md q-pb-sm ">
          {{ applicant.period || ''}}
        </div>
      </div>

      <div class="row">
        <div class="col-3 q-pl-md q-pb-sm text-right text-blue text-weight-regular">
          {{ $t('applicant.list.info.memo') }}
        </div>
        <div class="col-9 q-pa-sm blue text-bold">
          {{ applicant.addres || '' }}
        </div>
      </div>
    </q-card-section>
  </q-card>

  <div class="q-drawer-off-top">
    <q-drawer
      v-model="drawerRight"
      class="bg-grey-3"
      full-height
      :width="1000"
      side="right" style="top: unset !important"
      overlay elevated
      bordered>
      <ApplicationInfoForm :applicant="applicant" @closeDialog="drawerRight = false"/>
    </q-drawer>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import ApplicationInfoForm from './applicationInfo.form.vue'

export default {
  name: 'ApplicationInfo',
  components: {
    ApplicationInfoForm
  },
  props: {
    applicant: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    console.log(props)

    const loading = ref(false);
    const drawerRight = ref(false)
    const showApplication = ref(false)
    const showAttraction = ref(false)
    const applicantData = ref({});

    return  {
      loading,
      drawerRight,
      applicantData,
      showApplication,
      showAttraction

    }
  }
}
</script>

<style lang="scss">
.q-drawer-off-top{
  .q-drawer{
    top: 0 !important;
  }
}
</style>
