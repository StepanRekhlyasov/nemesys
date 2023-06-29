<template>
  <q-card style="width: 1000px; max-width: 80vw">
    <q-form class="q-gutter-none" @submit="addTeleAppointments">
      <q-card-section>
        <div class="text-h6">{{ $t('client.tele.teleAppointmentReg') }} </div>
      </q-card-section>
      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">
                {{ $t('client.tele.teleAppointmentClientName') }}
                <span class="text-red-5">*</span>
              </q-item-label>
              <q-input outlined dense v-model="teleAppointmentData['client_name']"
                :placeholder="$t('client.add.clientLabel')" lazy-rules
                :rules="[(val) => (val && val.length > 0) || '']" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <div class="row">
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.tele.teleAppointDateTime') }}
                  </q-item-label>
                  <div class="q-pr-md">
                    <q-input outlined dense v-model="teleAppointmentData['tele_appoint_dateTime']">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="teleAppointmentData['tele_appoint_dateTime']" mask="YYYY/MM/DD HH:mm">
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
                            <q-time v-model="teleAppointmentData['tele_appoint_dateTime']" mask="YYYY-MM-DD HH:mm"
                              format24h>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="col-6">
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.tele.teleAppointIncharge') }}
                  </q-item-label>
                  <q-input outlined dense v-model="teleAppointmentData['tele_appoint_incharge']"
                    :placeholder="$t('client.add.managerLabel')" />
                </div>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{
              $t('client.tele.teleAppointResult')
              }}</q-item-label>
              <q-toggle v-model="teleAppointmentData['tele_appoint_result']" color="green"
                :label="$t('client.tele.notConnected')" />
            </q-item-section>
          </q-item>
          <template v-if="!teleAppointmentData['tele_appoint_result']">
            <q-item>
              <q-item-section>
                <div class="row">
                  <div class="col-6">
                    <q-item-label>{{
                    $t('client.tele.teleAppointContactPerson')
                    }}</q-item-label>
                    <q-input outlined dense v-model="teleAppointmentData['tele_appoint_contact_person']"
                      :placeholder="$t('client.add.clientLabel')" />
                  </div>
                </div>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>{{
                $t('client.tele.jobInterviewResults')
                }}</q-item-label>
                <q-toggle v-model="teleAppointmentData['tele_job_offer']" color="green"
                  :label="$t('client.tele.noJobOffer')" />
              </q-item-section>
            </q-item>

            <q-item v-if="!teleAppointmentData['tele_job_offer']">
              <q-item-section>
                <q-item-label>
                  {{ $t('client.tele.reasonNoJobOffer') }}
                </q-item-label>
                <div class="q-gutter-sm q-mt-xs">
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="supplierNG"
                    :label="$t('client.tele.reasonNoJobOfferOption.supplierNG')" />
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="companyJobsOnly"
                    :label="$t('client.tele.reasonNoJobOfferOption.companyJobsOnly')" />
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="noTrader"
                    :label="$t('client.tele.reasonNoJobOfferOption.noTrader')" />
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="noDecisionMakingAuthority"
                    :label="$t('client.tele.reasonNoJobOfferOption.noDecisionMakingAuthority')" />
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="halloweenOnly"
                    :label="$t('client.tele.reasonNoJobOfferOption.halloweenOnly')" />
                  <q-radio dense v-model="teleAppointmentData['reason_no_job_offer']" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" val="others"
                    :label="$t('client.tele.reasonNoJobOfferOption.others')" />
                  <q-input outlined dense v-model="teleAppointmentData['reason_no_job_offer_detail']"
                    :placeholder="$t('client.add.memoLabel')"
                    v-if="teleAppointmentData['reason_no_job_offer'] == 'others'" />
                </div>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ $t('client.tele.noNeedContact') }}
                </q-item-label>
                <q-toggle v-model="teleAppointmentData['no_need_contact']" color="green" />
              </q-item-section>
            </q-item>

            <q-item v-if="!teleAppointmentData['no_need_contact']">
              <q-item-section>
                <q-item-label>
                  {{ $t('client.tele.reqRecruitmentServices') }}</q-item-label>
                <div>
                  <q-checkbox size="xs" v-model="teleAppointmentData['req_recruitment_services']"
                    val="transactionHistory" :label="$t('client.tele.reqRecruitmentServicesOption.referral')" />
                  <q-checkbox size="xs" v-model="teleAppointmentData['req_recruitment_services']" val="noFaxSending"
                    :label="$t('client.tele.reqRecruitmentServicesOption.introduction')" />
                  <q-checkbox size="xs" v-model="teleAppointmentData['req_recruitment_services']" val="referralTTP"
                    :label="$t('client.tele.reqRecruitmentServicesOption.referralTTP')" />
                  <q-checkbox size="xs" v-model="teleAppointmentData['req_recruitment_services']" val="dispatch"
                    :label="$t('client.tele.reqRecruitmentServicesOption.dispatch')" />
                </div>

              </q-item-section>
            </q-item>
          </template>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ $t('client.tele.remark') }}
              </q-item-label>
              <q-input outlined dense v-model="teleAppointmentData['remark']"
                :placeholder="$t('client.add.memoLabel')" />
            </q-item-section>
          </q-item>

        </q-list>

      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
        <q-btn flat :label="$t('common.save')" type="submit" />
      </q-card-actions>

    </q-form>
  </q-card>
</template>

<script lang="ts">
import { watch, reactive, SetupContext } from 'vue'; //ref,
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';
import { Alert } from 'src/shared/utils/Alert.utils';

interface Props {
  clientId: string
  officeId: string
}

export default {
  name: 'teleAppointmentReg',

  props: {
    clientId: {
      type: String,
      required: true,
    },
    officeId: {
      type: String,
      required: true,
    },
  },

  setup(props: Props, context: SetupContext) {
    const teleAppointmentData = reactive({
      tele_appoint_result: false,
      tele_job_offer: false,
      tele_appoint_contact_person: '',
      no_need_contact: false,
      req_recruitment_services: [],
      reason_no_job_offer: '',
      reason_no_job_offer_detail: '',
    });
    const db = getFirestore();

    watch(
      () => (teleAppointmentData.tele_appoint_result),
      (newVal, oldVal) => {
        if (newVal && !oldVal) {
          teleAppointmentData.tele_job_offer = false;
          teleAppointmentData.no_need_contact = false;
          teleAppointmentData.req_recruitment_services = [];
          teleAppointmentData.tele_appoint_contact_person = '';
          teleAppointmentData.reason_no_job_offer = '';
          teleAppointmentData.reason_no_job_offer_detail = '';
        }
      },
    ),
      watch(
        () => (teleAppointmentData.no_need_contact),
        () => {
          teleAppointmentData.req_recruitment_services = [];
        },
      ),
      watch(
        () => (teleAppointmentData.tele_job_offer),
        () => {
          teleAppointmentData.reason_no_job_offer = '';
          teleAppointmentData.reason_no_job_offer_detail = '';
        },
      )

    const addTeleAppointments = async () => {
      let data = JSON.parse(JSON.stringify(teleAppointmentData));
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      data['main_office'] = false;

      const clientRef = collection(db, 'clients/' + props.clientId + '/office/' + props.officeId + '/teleAppointments');
      await addDoc(clientRef, data);
      //officeDialog.value = false;
      context.emit('closeDialog')
      Alert.success()
    };

    return {
      teleAppointmentData,

      addTeleAppointments
    }
  }
}
</script>
