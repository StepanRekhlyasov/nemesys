<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <q-form class="q-gutter-none" @submit="searchClients">
      <q-card-actions>
        <q-btn :label="$t('client.list.settingFromMap')" unelevated color="primary" class="no-shadow text-weight-bold"
          icon="add" />
        <q-btn :label="$t('client.list.settingFromArea')" unelevated color="primary" class="no-shadow text-weight-bold"
          icon="add" />
        <q-btn :label="$t('client.list.searchByCondition')" outline color="primary" class="text-weight-bold" />
      </q-card-actions>
      <q-separator />

      <q-card-actions>
        <q-select outlined v-model="backOrderData['saved']" dense :label="$t('client.list.savedSearchList')"
          style="width: 250px" />
        <q-btn :label="$t('client.list.saveSearchConditions')" outline color="primary"
          class="text-weight-bold q-ml-md" />

      </q-card-actions>
      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.keyboard') }}
              </q-item-label>
              <q-input outlined dense v-model="backOrderData['client_name']"
                :placeholder="$t('client.list.keyboard')" />
            </q-item-section>
          </q-item>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.add.clientType') }}
              </q-item-label>
              <div>
                <q-checkbox v-model="backOrderData['nursing']" dense :label="$t('client.add.nurse')" val="nurse" />
                <q-checkbox v-model="backOrderData['nursing']" dense :label="$t('client.add.nursing')" class="q-ml-md"
                  val="nursing" />
              </div>
              <q-item v-if="backOrderData['nursing'].length > 0">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.facilityType')
                  }}</q-item-label>
                  <q-checkbox size="xs" v-model="backOrderData['office_facilityType']" :val="option.value"
                    :label="option.name" v-for="option in facilityOp" :key="option"
                    :disable="backOrderData['nursing'].length == 0" />
                </div>
              </q-item>
            </q-item-section>
          </q-item>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.presenceContract') }}
              </q-item-label>
              <div>
                <q-checkbox v-model="backOrderData['basic_contract_signed']" dense :label="$t('common.yesShort')" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row">
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.availJobPostings') }}
                  </q-item-label>
                  <div class="q-mt-sm">
                    <q-checkbox v-model="backOrderData['avail_job_postings']" dense :label="$t('common.yesShort')" />
                  </div>
                </div>
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.postingStartDate') }}
                  </q-item-label>
                  <div>
                    <q-input outlined dense v-model="backOrderData['postingStartDate']" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="backOrderData['postingStartDate']">
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
                <div class="col-1 text-center self-center q-pt-sm ">～</div>
                <div class="col-2">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.list.postingEndDate') }}
                  </q-item-label>
                  <div>
                    <q-input outlined dense v-model="backOrderData['postingEndDate']" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="backOrderData['postingEndDate']">
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
              </div>

            </q-item-section>
          </q-item>

          <q-separator />


          <q-item-label class="row q-ml-md q-mt-md">
            {{ $t('client.list.evaluationRank') }}
          </q-item-label>

          <q-item-label class="row q-ml-md q-pt-sm">
            {{ $t('client.list.dispatchIndex') }}
          </q-item-label>
          <q-item-label class="row q-ml-md text-caption">
            {{ $t('client.list.point') }}
          </q-item-label>
          <div class="row q-ml-md q-mt-xs">
            <div class="col-3">
              <q-input outlined dense v-model="backOrderData['dispatchIndex']" type="number">
                <template v-slot:append>
                  <span class="text-caption">{{ $t('common.above') }}</span>
                </template>
              </q-input>
            </div>
          </div>


          <q-item-label class="row q-ml-md q-pt-md">
            {{ $t('client.list.referralMetrics') }}
          </q-item-label>
          <q-item-label class="row q-ml-md text-caption">
            {{ $t('client.list.point') }}
          </q-item-label>
          <div class="row q-ml-md">
            <div class="col-3">
              <q-input outlined dense v-model="backOrderData['referralMetrics']" type="number">
                <template v-slot:append>
                  <span class="text-caption">{{ $t('common.above') }}</span>
                </template>
              </q-input>
            </div>
          </div>

          <q-item class="q-mt-sm">
            <q-item-section>
              <q-item-label>
                {{ $t('client.list.status') }}
              </q-item-label>
              <div>
                <q-checkbox v-model="backOrderData['status']" dense val="excited">
                  <q-icon size="1.5em" name="mdi-emoticon-excited" color="green"></q-icon>
                </q-checkbox>
                <q-checkbox v-model="backOrderData['status']" dense val="happy" class="q-ml-md">
                  <q-icon size="1.5em" name="mdi-emoticon-happy" color="light-green"></q-icon>
                </q-checkbox>
                <q-checkbox v-model="backOrderData['status']" dense val="neutral" class="q-ml-md">
                  <q-icon size="1.5em" name="mdi-emoticon-neutral" color="yellow-8"></q-icon>
                </q-checkbox>
                <q-checkbox v-model="backOrderData['status']" dense val="wink" class="q-ml-md">
                  <q-icon size="1.5em" name="mdi-emoticon-wink" color="yellow-10"></q-icon>
                </q-checkbox>
                <q-checkbox v-model="backOrderData['status']" dense val="sad" class="q-ml-md">
                  <q-icon size="1.5em" name="mdi-emoticon-sad" color="amber-10"></q-icon>
                </q-checkbox>
                <q-checkbox v-model="backOrderData['status']" dense val="angry" class="q-ml-md">
                  <q-icon size="1.5em" name="mdi-emoticon-angry" color="red"></q-icon>
                </q-checkbox>
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <div class="q-pt-sm" v-for="dispatch in dispatchOp" :key="dispatch.value" :class="dispatch.class">
            <q-item-label class="q-pl-md">
              {{ dispatch.name }}
            </q-item-label>

            <q-item v-for="record in recordOp" :key="record.value">
              <q-item-section>
                <q-item-label>
                  {{ record.name }}
                </q-item-label>

                <div class="row">
                  <div class="col-2">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ $t('client.list.postingStartDate') }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData['postingStartDate']" mask="date" clearable
                        clear-icon="close">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="backOrderData['postingStartDate']">
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
                  <div class="col-1 text-center self-center q-pt-sm ">～</div>
                  <div class="col-2">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ $t('client.list.postingEndDate') }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData['postingEndDate']" mask="date" clearable
                        clear-icon="close">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="backOrderData['postingEndDate']">
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
                  <div class="col-2 q-pl-md">
                    <q-item-label class="q-pt-xs text-caption">
                      {{ record.label }}
                    </q-item-label>
                    <div>
                      <q-input outlined dense v-model="backOrderData['numBOsAcquired']" type="number" />
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-separator />
          </div>


          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.pastEmploymentRecord') }}
              </q-item-label>
              <div v-for="employee in numEmployees" :key="employee.value">
                <q-item-label class="q-pb-xs text-caption">
                  {{ employee.name }}
                </q-item-label>
                <div class="row q-pb-sm">
                  <div class="col-2">
                    <q-input outlined dense v-model="backOrderData['client_name']" type="number">
                      <template v-slot:after>
                        <span class="text-caption">{{ $t('common.moreThan') }}</span>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.list.historySearch') }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t('client.list.appointLastMonths') }}
              </q-item-label>
              <div class="q-gutter-sm q-mt-xs">
                <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye" val="teleAppointment"
                  :label="$t('client.list.allTeleAppointedCompanies')" />
                <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye" val="viaFax" :label="$t('client.list.connectedCompanies')" />
                <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye" val="others" :label="$t('client.list.companiesOutService')" />
              </div>
            </q-item-section>
          </q-item>


        </q-list>

      </q-card-section>

    </q-form>

    <q-dialog v-model="confirmSaveDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 400px; max-width: 80vw">
        <q-card-section class="row items-center">
          <q-avatar icon="save" color="primary" text-color="white" size="md" />
          <span class="q-ml-sm">Do you really want save?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" color="red" v-close-popup />
          <q-btn flat :label="$t('common.save')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-card>
</template>

<script lang="ts">
import { reactive, computed, watch, ref } from 'vue'; //ref,
// import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { facilityList } from 'src/shared/constants/Organization.const';

export default {
  name: 'advanceSearch',

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const backOrderData = reactive({
      nursing: [],
      office_facilityType: [],
      basic_contract_signed: false,
      avail_job_postings: false,
      status: [],
    });
    const confirmSaveDialog = ref(false);
    //const $q = useQuasar();
    const facilityOp = facilityList;

    const recordOp = computed(() => {
      return [
        { name: t('client.list.numBOs'), value: 'numBOs', label: t('client.list.numBOsAcquired') },
        { name: t('client.list.numFixResults'), value: 'numFixResults', label: t('client.list.numFixResults') },
        { name: t('client.list.jobSearchResults'), value: 'jobSearchResults', label: t('client.list.jobSearchResults') },
        { name: t('client.list.numJobOffers'), value: 'numJobOffers', label: t('client.list.numJobOffers') },
        { name: t('client.list.hiringRecord'), value: 'hiringRecord', label: t('client.list.hiringRecord') },
      ];
    });

    const dispatchOp = computed(() => {
      return [
        { name: t('client.list.dispatchRecord'), value: 'dispatchRecord', class: '' },
        { name: t('client.list.referralResults'), value: 'referralResults', class: '' },
        { name: t('client.list.dispatchedOtherCompanies'), value: 'dispatchedOtherCompanies', class: 'bg-yellow-1' },
        { name: t('client.list.otherCompanyReferralResults'), value: 'otherCompanyReferralResults', class: 'bg-yellow-1' },
      ];
    });

    const numEmployees = computed(() => {
      return [
        { name: t('client.list.numFullTimeEmployees'), value: 'numFullTimeEmployees' },
        { name: t('client.list.numPartTimeEmployees'), value: 'numPartTimeEmployees' },
        { name: t('client.list.numTempEmployees'), value: 'numTempEmployees' },
      ];
    });

    watch(
      () => (backOrderData.nursing),
      (newVal) => {
        if (newVal.length == 0) {
          backOrderData.office_facilityType = [];
        }
      },
    );

    const searchClients = async () => {
      return false;
    };

    return {
      backOrderData,
      facilityOp,
      recordOp,
      dispatchOp,
      numEmployees,
      confirmSaveDialog,

      searchClients
    }
  }
}
</script>
