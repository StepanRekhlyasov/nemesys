<template>
<q-card style="width: 1000px; max-width: 80vw">
    <q-form class="q-gutter-none" @submit="addBackOrder">
        <q-card-section>
            <div class="text-h6">{{ $t('client.backOrder.reg') }} </div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.backOrder.clientName') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="backOrderData['client_name']" :placeholder="$t('client.add.clientLabel')"
                    lazy-rules :rules="[(val) => (val && val.length > 0) || '']" />
                </q-item-section>
              </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6">
                        <q-item-label class="q-pb-xs">
                          {{ $t('client.backOrder.acquisitionDate') }}
                        </q-item-label>
                        <div class="q-pr-md">
                          <q-input outlined dense v-model="backOrderData['acquisition_dateTime']">
                            <template v-slot:prepend>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="backOrderData['acquisition_dateTime']" mask="YYYY/MM/DD HH:mm">
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
                                  <q-time v-model="backOrderData['acquisition_dateTime']" mask="YYYY-MM-DD HH:mm" format24h>
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
                          {{ $t('client.backOrder.personIncharge') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['person_incharge']"
                          :placeholder="$t('client.add.managerLabel')" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.route') }}
                    </q-item-label>
                    <div class="q-gutter-sm q-mt-xs">
                      <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye" val="teleAppointment"
                        :label="$t('client.backOrder.teleAppointment')" />
                      <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye" val="viaFax"
                        :label="$t('client.backOrder.viaFax')" />
                      <q-radio dense v-model="backOrderData['route']" checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye" val="others" :label="$t('client.backOrder.others')" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6">
                        <q-item-label class="q-pb-xs">
                          {{ $t('client.backOrder.endDateTime') }}
                        </q-item-label>
                        <div class="q-pr-md">
                          <q-input outlined dense v-model="backOrderData['end_dateTime']">
                            <template v-slot:prepend>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="backOrderData['end_dateTime']" mask="YYYY/MM/DD HH:mm">
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
                                  <q-time v-model="backOrderData['end_dateTime']" mask="YYYY-MM-DD HH:mm" format24h>
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
                          {{ $t('client.backOrder.clientPersonIncharge') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['client_person_incharge']"
                          :placeholder="$t('client.add.managerLabel')" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.caseType') }}
                    </q-item-label>
                    <div class="q-gutter-sm q-mt-xs">
                      <q-radio dense v-model="backOrderData['case_type']" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="nurse" :label="$t('client.add.nurse')" />
                      <q-radio dense v-model="backOrderData['case_type']" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="nursing" :label="$t('client.add.nursing')" />
                      <q-radio dense v-model="backOrderData['case_type']" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="publicRelationsConsultant" :label="$t('client.backOrder.publicRelationsConsultant')" />
                      <q-radio dense v-model="backOrderData['case_type']" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                        val="careManager" :label="$t('client.backOrder.careManager')" />
                      <q-radio dense v-model="backOrderData['case_type']" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="others"
                        :label="$t('client.backOrder.others')" />
                    </div>
                  </q-item-section>
                </q-item>


                <q-item>
                  <q-item-section>
                    <q-item-label>{{
                    $t('client.backOrder.transactionType')
                    }}</q-item-label>
                    <div>
                      <q-checkbox size="xs" v-model="backOrderData['transaction_type']" val="introduction"
                        :label="$t('client.backOrder.introduction')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['transaction_type']" val="TTP" label="TTP" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['transaction_type']" val="dispatch"
                        :label="$t('client.backOrder.dispatch')" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{
                    $t('client.backOrder.reqQualification')
                    }}</q-item-label>
                    <div>
                      <q-checkbox size="xs" v-model="backOrderData['req_qualification']" val="regularReview"
                        :label="$t('client.backOrder.regularReview')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['req_qualification']" val="assistant" :label="$t('client.backOrder.assistant')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['req_qualification']" val="careWorker"
                        :label="$t('client.backOrder.careWorker')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['req_qualification']" val="practitioners"
                        :label="$t('client.backOrder.practitioners')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['req_qualification']" val="newcomer"
                        :label="$t('client.backOrder.newcomer')" />
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.experienceReq') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['experience_req']"
                      :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{
                    $t('client.backOrder.moreHalfYearExp')
                    }}</q-item-label>
                    <q-toggle v-model="backOrderData['half_year_exp']" color="green" :label="$t('client.backOrder.unnecessary')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6">
                        <q-item-label>
                          {{ $t('client.backOrder.upperAgeLimit') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['upper_age_limit']"
                          :placeholder="$t('client.add.clientLabel')">
                          <template v-slot:append>
                            <span> {{ $t('client.backOrder.talent') }} </span>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>{{
                    $t('client.backOrder.employmentStatus')
                    }}</q-item-label>
                    <div>
                      <q-checkbox size="xs" v-model="backOrderData['employment_status']" val="fullTime"
                        :label="$t('client.backOrder.fullTime')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['employment_status']" val="dispatch"
                        :label="$t('client.backOrder.dispatchEm')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['employment_status']" val="partTime"
                        :label="$t('client.backOrder.partTime')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['employment_status']" val="baito"
                        :label="$t('client.backOrder.baito')" />

                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6 q-pr-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.retirementAge') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['retirement_age']" />
                      </div>
                      <div class="col-6 q-pl-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.hourlywage') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['hourly_wage']" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6 q-pr-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.dispatchPrice') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['dispatch_price']" />
                      </div>
                      <div class="col-6 q-pl-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.monthlySalary') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['monthly_salary']" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                    <q-item-section>
                        <q-item-label>
                          {{ $t('client.backOrder.bonuses') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['bonuses']" :placeholder="$t('client.add.memoLabel')" />
                    </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6 q-pr-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.payday') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['payday']" />
                      </div>
                      <div class="col-6 q-pl-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.transportationExpenses') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['transportation_expenses']" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingDays') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['working_days']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingDaysWeek') }}
                    </q-item-label>
                    <div>
                      <q-checkbox size="xs" v-model="backOrderData['working_days_week']" val="sunday"
                        :label="$t('weekDay.sunday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="monday"
                        :label="$t('weekDay.monday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="tuesday"
                        :label="$t('weekDay.tuesday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="wednesday"
                        :label="$t('weekDay.wednesday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="thursday"
                        :label="$t('weekDay.thursday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="friday"
                        :label="$t('weekDay.friday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="saturday"
                        :label="$t('weekDay.saturday')" />
                      <q-checkbox size="xs" class="q-ml-sm" v-model="backOrderData['working_days_week']" val="holiday"
                        :label="$t('weekDay.holiday')" />

                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingHoursEarly') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['working_hours_early']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingHoursDay') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['working_hours_day']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingHoursLate') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['working_hours_late']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>


                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.workingHoursNight') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['working_hours_night']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>


                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.businessContent') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['business_content']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.onCallPickUP') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['call_pick_up']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.overtimeHours') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['overtime_hours']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="row">
                      <div class="col-6 q-pr-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.holidaysWeekly') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['holidays_weekly']" />
                      </div>
                      <div class="col-6 q-pl-sm">
                        <q-item-label>
                          {{ $t('client.backOrder.holidayAnnual') }}
                        </q-item-label>
                        <q-input outlined dense v-model="backOrderData['holiday_annual']" />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.welfare') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['welfare']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.overtimeHours') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['overtime_hours']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.leaveChildcare') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['leave_childcare']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <q-item-label>
                      {{ $t('client.backOrder.otherNotes') }}
                    </q-item-label>
                    <q-input outlined dense v-model="backOrderData['other_notes']" :placeholder="$t('client.add.memoLabel')" />
                  </q-item-section>
                </q-item>



            </q-list>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-white text-teal">
            <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
            <q-btn flat :label="$t('client.backOrder.regBOButton')" type="submit" />
        </q-card-actions>

    </q-form>
</q-card>
</template>

<script lang="ts">
import { reactive, SetupContext } from 'vue'; //ref,
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

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
        const { t } = useI18n({ useScope: 'global' });
        const backOrderData = reactive({
            tele_appoint_result: false,
            tele_job_offer: false,
            tele_appoint_contact_person: '',
            no_need_contact: false,
            req_recruitment_services: [],
            reason_no_job_offer: '',
            reason_no_job_offer_detail: '',
            //new
            transaction_type: [],
            req_qualification: [],
            half_year_exp: false,
            employment_status: [],
            working_days_week: [],
        });
        const db = getFirestore();
        const $q = useQuasar();

        const addBackOrder = async () => {
            let data = JSON.parse(JSON.stringify(backOrderData));
            data['created_at'] = serverTimestamp();
            data['updated_at'] = serverTimestamp();
            data['deleted'] = false;

            const clientRef = collection(db, 'clients/' + props.clientId + '/office/' + props.officeId + '/backorders');
            await addDoc(clientRef, data);
            context.emit('closeDialog')
            $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: t('success'),
            });
        };

        return {
            backOrderData,

            addBackOrder
        }
    }
}
</script>
