<template>
  <div class="q-pa-sm">
    <div class="row q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="primary"></q-icon>
        </template>

        <q-breadcrumbs-el :label="$t('client.list.client')" icon="mdi-domain" @click="$router.push('/clients')"
          class="cursor-pointer"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="$t('client.list.corporation')"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="clientData['name']" icon="mdi-domain"
          @click="$router.push('/clientDetail/' + clientId)" class="cursor-pointer"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="officeData['office_name']" icon="maps_home_work"></q-breadcrumbs-el>
      </q-breadcrumbs>

      <q-space />
      <q-btn color="primary" size="sm" :label="$t('client.list.displayMasterInfo')" @click="rightDrawerOpen=true"
        v-if="!rightDrawerOpen" />

    </div>

    <div class="row full-width">
      <div :class="rightDrawerOpen ? 'col-12' : 'col-8'">
        <q-card class="bg-yellow-1 q-ma-xs">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section class="full-width q-pa-sm">
              <div class="row full-width">
                <div class="col-1 text-center q-pt-sm">
                  <q-icon name="maps_home_work" size="2rem"></q-icon>
                </div>
                <div class="col">
                  {{ clientData['name'] }}<br>
                  <span class="text-h5 text-weight-medium">
                    {{ officeData['office_name'] }}
                    <q-chip color="red" size="sm" text-color="white" :label="$t('client.list.headOffice')"
                      class="q-ml-sm" v-if="officeData['main_office']" />
                    <q-chip color="green" size="sm" text-color="white" :label="$t('client.list.masterDataAvailable')"
                      class="q-ml-sm" />
                  </span>

                </div>
              </div>

              <div class="q-pt-xs">{{ officeData['office_prefecture'] }} {{ officeData['office_municipality'] }} {{
              officeData['office_building'] }}</div>
              <div class="q-pt-xs">
                <span class="text-weight-medium">TEL: </span>
                {{ officeData['office_tel'] }}
                <span class="q-ml-md text-weight-medium">FAX: </span>
                {{ officeData['office_fax'] }}

                <q-btn color="primary" :label="$t('client.add.options.faxSending')" size="xs" class="q-ml-md"
                  :disable="!officeData['office_flg_faxng']" />
              </div>
              <div class="q-pt-xs">
                <span class="text-weight-medium">{{$t('client.add.longitude') }}: </span>
                {{ officeData['lon'] }}
                <span class="text-weight-medium q-pl-md">{{$t('client.add.latitude') }}: </span>
                {{ officeData['lat'] }}
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showBasicEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section horizontal>

            <q-card-section>
              <q-item-label>
                {{ $t('client.add.memo') }}
              </q-item-label>
              {{ officeData['office_memo'] }}
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showNoteEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section horizontal>
            <q-card-section v-if="officeData['options']">
              <q-chip size="sm" :color="
                arrayColors[
                  Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                ]
              " text-color="white" v-for="option in officeData['options']" :key="option">
                {{ $t('client.add.options.' + option) }}
              </q-chip>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showOptionEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="bg-yellow-1 q-ma-xs">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section>
              <div class="text-weight-bolder">
                {{ $t('client.add.facilityType') }}
              </div>
              <div>
                <q-chip size="sm" :color="
                  arrayColors[
                    Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                  ]
                " text-color="white" v-for="option in officeData['office_facilityType']" :key="option">
                  {{ $t('client.add.facilityOp.' + option) }}
                </q-chip>
              </div>
              <div class="q-pt-sm">
                <span class="text-weight-medium">{{$t('client.add.faxReceptionNG')}}: </span>
                <span v-if="officeData['office_flg_faxng']">OK</span>
                <span v-else>NG</span>
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showFacilityEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="bg-yellow-1 q-ma-xs" v-if="!officeData['main_office']">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section>
              <div>
                <span class="text-weight-medium">
                  {{ $t('client.add.smokingPermitted') }} :
                </span>
                <span v-if="officeData['smoking'] == 'separateSmokingArea'" class="q-pl-sm">
                  {{ $t('client.add.separateSmokingArea') }}
                </span>
                <span v-else-if="officeData['smoking'] == 'noSmoking'" class="q-pl-sm">
                  {{ $t('client.add.noSmoking') }}
                </span>
                <span v-else-if="officeData['smoking'] == 'smokingAllowed'" class="q-pl-sm">
                  {{ $t('client.add.smokingAllowed') }}
                </span>
              </div>

              <div class="q-pt-sm">
                <span class="text-weight-medium">{{$t('client.add.carCommutingPossible')}} :</span>
                <span v-if="officeData['car_commuting']" class="q-pl-sm">
                  {{$t('common.possible')}}
                </span>
                <span v-else class="q-pl-sm">
                  {{$t('common.impossible')}}
                </span>
              </div>

              <div class="q-pt-sm">
                <span class="text-weight-medium"> {{$t('client.add.parkingAvailable')}} :</span>
                <span v-if="officeData['parking_available']" class="q-pl-sm">
                  {{$t('common.yes')}}
                </span>
                <span v-else class="q-pl-sm">
                  {{$t('common.no')}}
                </span>
              </div>

              <div class="q-pt-sm">
                <span class="text-weight-medium">{{$t('client.add.parkingLotRemarks')}} :</span>
                <div> {{ officeData["parking_remarks"] }} </div>
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showSmokingEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>


        <q-card class="q-ma-xs">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section>
              <div class="full-width">
                <span class="text-weight-bolder"> {{ $t('client.list.contractStatus') }}: </span>
                <q-chip color="green" size="sm" text-color="white" :label="$t('client.add.basicContractSigned')"
                  class="q-ml-sm" v-if="officeData['basic_contract_signed']" />
                <q-chip color="red" size="sm" text-color="white" :label="$t('client.add.basicContractNG')"
                  class="q-ml-sm" v-else />

              </div>
              <div class="full-width q-mt-sm">
                <span class="text-weight-bolder"> {{ $t('client.list.contractInfo') }}</span>
                <div>
                  <span>TEL: </span>
                  {{ officeData['contract_tel'] }}
                  <span class="q-ml-md">FAX: </span>
                  {{ officeData['contract_fax'] }}
                  <span class="q-ml-md">MAIL: </span>
                  {{ officeData['contract_mailaddress'] }}
                </div>
              </div>
              <div class="full-width q-mt-sm">
                <span class="text-weight-bolder"> {{ $t('client.list.personIncharge') }} :</span>
                {{ officeData['contract_user_name'] }}
              </div>
              <div class="full-width q-mt-sm">
                <span class="text-weight-bolder"> {{ $t('client.list.contactPerson') }} :</span>
                {{ officeData['manager'] }}
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" size="sm" @click="showContractorDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>


        <q-card class="q-ma-xs">
          <q-card-section>
            <div class="row full-width">
              <div class="col-6">
                <q-item-label class="q-pb-xs"> {{$t('client.list.basicInfoUpdated') }}</q-item-label>
                {{officeData["updated_at"]}}
                <span class="q-pl-md">
                  {{$t('client.list.performedBy') }}: {{officeData["updated_by_name"]}}
                </span>
              </div>
              <div class="col-6">
                <q-item-label class="q-pb-xs"> {{$t('client.list.infoUpdated') }}</q-item-label>
                {{officeData["updated_at"]}}
                <span class="q-pl-md">
                  {{$t('client.list.editor') }}: {{officeData["updated_by_name"]}}
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>

      </div>

      <div class="col-4" v-if="!rightDrawerOpen">
        <q-card class="q-ma-xs">
          <q-card-section>
            <div class="row">
              {{ $t('client.tele.teleAppointHistory') }}
              <q-space />
              <q-btn color="primary" size="xs" :label="$t('client.tele.displayAll')" />
              <q-btn color="primary" size="xs" :label="$t('client.tele.addTeleAppoint')" class="q-ml-sm"
                @click="teleDialog = true" />
            </div>
            <q-table dense flat :rows="teleAppointList" :columns="teleAppointColumn" row-key="id" class="q-pt-sm"
              hide-bottom :pagination="pagination" v-if="teleAppointList.length > 0">
              <!-- <template v-slot:body-cell-office_name="props">
          <q-td :props="props">
            <q-btn flat dense no-caps @click="$router.push('/clientDetail/' + clientId + '/' + props.key)" color="primary"
              :label="props.value" class="q-pt-none q-pb-none" />
          </q-td>
        </template> -->
              <template v-slot:body-cell-tele_appoint_result="props">
                <q-td :props="props">
                  <q-chip color="green" size="xs" text-color="white" :label="$t('client.tele.connected')"
                    class="q-ma-none" v-if="props.value" />
                  <q-chip color="red" size="xs" text-color="white" :label="$t('client.tele.notConnected')"
                    class="q-ma-none" v-else />
                </q-td>
              </template>
            </q-table>
            <div class="row justify-center q-pa-lg" v-else>
              {{ $t('client.tele.noAppointHistory') }}
            </div>

          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section>
            <div class="row">
              {{ $t('client.backOrder.title') }}
              <q-space />
              <q-btn color="primary" size="xs" :label="$t('client.tele.displayAll')" />
              <q-btn color="primary" size="xs" :label="$t('client.backOrder.add')" class="q-ml-sm"
                @click="backOrderDialog = true" />
            </div>
            <q-table dense flat :rows="backordersList" :columns="backordersColumn" row-key="id" class="q-pt-sm"
              hide-bottom :pagination="pagination" v-if="backordersList.length > 0">
              <!-- <template v-slot:body-cell-office_name="props">
          <q-td :props="props">
            <q-btn flat dense no-caps @click="$router.push('/clientDetail/' + clientId + '/' + props.key)" color="primary"
              :label="props.value" class="q-pt-none q-pb-none" />
          </q-td>
        </template> -->
              <template v-slot:body-cell-case_type="props">
                <q-td :props="props">
                  <span v-if="props.value"> {{ $t('client.backOrder.' + props.value) }} </span>
                </q-td>
              </template>
            </q-table>
            <div class="row justify-center q-pa-lg" v-else>
              {{ $t('client.backOrder.noOrders') }}
            </div>

          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section>
            <div class="row">
              {{ $t('client.pastRecord.title') }}
            </div>
            <div class="row q-pa-sm text-caption">
              <div class="col-3">
                FIX: 0
              </div>
              <div class="col-3">
                {{ $t('client.pastRecord.job') }}: 0
              </div>
              <div class="col-3">
                {{ $t('client.pastRecord.offer') }}: 0
              </div>
              <div class="col-3">
                {{ $t('client.pastRecord.hired') }}: 0
              </div>
            </div>

          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section>
            <div class="row">
              {{ $t('client.workExperience.title') }}
            </div>
            <div class="text-caption q-pt-xs">
              <div class="row">
                大白テ 応募者11
              </div>
              <div class="row">
                大白テ 応募者122
              </div>
            </div>

          </q-card-section>
        </q-card>


      </div>
    </div>

    <!-- Edit Dialog -->
    <q-dialog v-model="basicInfoDialog" persistent>
      <q-card style="width: 1000px; max-width: 80vw">
        <q-form class="q-gutter-none" @submit="updateOfficeInfo">
          <q-card-section>
            <div class="text-h6">{{ editTitle }}</div>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

            <q-list>
              <!-- office_name -->
              <q-item v-if="checkIfExist('office_name')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.officeName') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="editofficeData['office_name']"
                    :placeholder="$t('client.add.clientLabel')" lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('office_facilityType')">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.facilityType')
                  }}</q-item-label>
                  <q-checkbox size="xs" v-model="editofficeData['office_facilityType']" :val="option.value"
                    :label="option.name" v-for="option in facilityOp" :key="option" />
                </div>
              </q-item>

              <!-- office_name -->
              <q-item>
                <q-item-section>
                  <div v-if="checkIfExist('office_tel')">
                    <q-item-label class="q-pb-xs  text-weight-bolder">{{
                    $t('client.add.officeInfo')
                    }}</q-item-label>
                    <div class="row q-mt-sm">
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">TEL</q-item-label>
                        <q-input outlined dense v-model="editofficeData['office_tel']"
                          :placeholder="$t('client.add.phoneLabel')" />
                      </div>
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">FAX</q-item-label>
                        <q-input outlined dense v-model="editofficeData['office_fax']"
                          :placeholder="$t('client.add.phoneLabel')" />
                      </div>
                    </div>
                    <div class="row q-mt-sm">
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs"> {{$t('client.add.email') }}</q-item-label>
                        <q-input outlined dense v-model="editofficeData['office_mailaddress']" :placeholder="
                          $t('client.add.emailLabel1') +
                          '@' +
                          $t('client.add.emailLabel2')
                        " />
                      </div>
                      <div class="col-6 q-pr-xs q-pt-lg">
                        <q-checkbox size="xs" v-model="editofficeData['office_flg_faxng']"
                          :label="$t('client.add.faxReceptionNG')" />
                      </div>
                    </div>
                  </div>
                  <div v-if="checkIfExist('office_prefecture')">
                    <q-item-label class="q-pt-sm  text-weight-bolder"> {{$t('client.add.location') }}</q-item-label>
                    <div class="row q-mt-sm">
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">{{$t('client.add.prefectures') }}</q-item-label>
                        <q-input outlined dense v-model="editofficeData['office_prefecture']"
                          :placeholder="$t('client.add.prefectureLabel')" />
                      </div>
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">{{$t('client.add.municipalities') }}</q-item-label>
                        <q-input outlined dense v-model="editofficeData['office_municipality']"
                          :placeholder="$t('client.add.municipalitieLabel')" />
                      </div>
                    </div>

                    <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.addressBuildingName') }}</q-item-label>
                    <q-input outlined dense v-model="editofficeData['office_building']"
                      :placeholder="$t('client.add.addressBuildingLabel')" />
                  </div>
                  <div v-if="checkIfExist('contract_tel')">
                    <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.basicContract') }}</q-item-label>
                    <q-checkbox size="xs" v-model="editofficeData['basic_contract_signed']"
                      :label="$t('client.add.basicContractSigned')" />

                    <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.contractor') }}</q-item-label>
                    <q-item-label class="q-pb-xs text-red-5 text-caption">{{$t('client.add.contractorLabel') }}
                    </q-item-label>
                    <q-checkbox size="xs" v-model="editofficeData['sameOfficeInfo']"
                      :label="$t('client.add.sameOfficeInfo')" />

                    <div class="row q-mt-sm">
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">TEL</q-item-label>
                        <q-input outlined dense v-model="editofficeData['contract_tel']"
                          :placeholder="$t('client.add.phoneLabel')" />
                      </div>
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs">FAX</q-item-label>
                        <q-input outlined dense v-model="editofficeData['contract_fax']"
                          :placeholder="$t('client.add.phoneLabel')" />
                      </div>
                    </div>
                    <div class="row q-mt-sm">
                      <div class="col-6 q-pr-xs">
                        <q-item-label class="q-pb-xs"> {{$t('client.add.email') }}</q-item-label>
                        <q-input outlined dense v-model="editofficeData['contract_mailaddress']" :placeholder="
                          $t('client.add.emailLabel1') +
                          '@' +
                          $t('client.add.emailLabel2')
                        " />
                      </div>
                      <div class="col-6 q-pr-xs ">
                        <q-item-label class="q-pb-xs"> {{$t('client.add.manager') }}</q-item-label>
                        <q-input outlined dense v-model="editofficeData['contract_user_name']"
                          :placeholder="$t('client.add.managerLabel')" />
                      </div>
                    </div>
                  </div>

                  <div v-if="checkIfExist('manager')" class="q-pb-xs q-pt-xs">
                    <q-item-label class="q-pb-xs q-pt-xs"> {{$t('client.add.manager') }}</q-item-label>
                    <q-input outlined dense v-model="editofficeData['manager']"
                      :placeholder="$t('client.add.managerLabel')" />
                  </div>

                  <div v-if="checkIfExist('smoking')">
                    <q-item-label class="q-pt-md text-weight-bolder">{{$t('client.add.officeEnvironment') }}
                    </q-item-label>
                    <div class="q-gutter-sm">
                      <q-item-label class="q-pt-sm">{{$t('client.add.smokingPermitted') }}</q-item-label>
                      <q-radio class="q-ma-none q-ml-sm" dense v-model="editofficeData['smoking']"
                        checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="separateSmokingArea"
                        :label="$t('client.add.separateSmokingArea')" />
                      <q-radio class="q-ma-sm" dense v-model="editofficeData['smoking']" checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye" val="noSmoking" :label="$t('client.add.noSmoking')" />
                      <q-radio class="q-ma-sm" dense v-model="editofficeData['smoking']" checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye" val="smokingAllowed"
                        :label="$t('client.add.smokingAllowed')" />
                    </div>
                  </div>

                  <div v-if="checkIfExist('car_commuting')">
                    <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.commutingCar') }}</q-item-label>
                    <div class="q-gutter-sm">
                      <q-checkbox size="xs" v-model="editofficeData['car_commuting']"
                        :label="$t('client.add.carCommutingPossible')" />
                      <q-checkbox size="xs" v-model="editofficeData['parking_available']"
                        :label="$t('client.add.parkingAvailable')" />
                    </div>
                  </div>

                  <div v-if="checkIfExist('parking_remarks')">
                    <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.parkingLotRemarks') }}</q-item-label>
                    <q-input outlined dense v-model="editofficeData['parking_remarks']"
                      :placeholder="$t('client.add.memoLabel')" />
                  </div>

                  <div v-if="checkIfExist('office_memo')">
                    <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.officeMemo') }}</q-item-label>
                    <q-input outlined dense type="textarea" v-model="editofficeData['office_memo']"
                      :placeholder="$t('client.add.memoLabel')" />
                  </div>

                  <div v-if="checkIfExist('cal_from_office_info')">
                    <q-item-label class="q-pt-sm q-pb-xs text-weight-bolder">{{$t('client.add.longLatInfo') }}
                    </q-item-label>
                    <q-checkbox class="q-ml-none" size="xs" v-model="editofficeData['cal_from_office_info']"
                      :label="$t('client.add.calOfficeInfo')" />

                  </div>

                  <div class="row q-mt-sm" v-if="checkIfExist('lon')">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.longitude') }}</q-item-label>
                      <q-input outlined dense type="number" v-model.number="editofficeData['lon']"
                        :placeholder="$t('client.add.latitudeLabel')" step="any" />
                    </div>
                    <div class="col-6 q-pr-xs ">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.latitude') }}</q-item-label>
                      <q-input outlined dense type="number" v-model.number="editofficeData['lat']"
                        :placeholder="$t('client.add.latitudeLabel')" step="any" />
                    </div>
                  </div>

                  <div class="q-gutter-sm" v-if="checkIfExist('options')">
                    <q-checkbox size="xs" v-model="editofficeData['options']" val="transactionHistory"
                      :label="$t('client.add.options.transactionHistory')" />
                    <q-checkbox size="xs" v-model="editofficeData['options']" val="noFaxSending"
                      :label="$t('client.add.options.noFaxSending')" />
                    <q-checkbox size="xs" v-model="editofficeData['options']" val="fixNumberLimit"
                      :label="$t('client.add.options.fixNumberLimit')" />
                  </div>

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
    </q-dialog>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered v-if="rightDrawerOpen" class="q-pa-sm">
      <div class="full-height column justify-between">
        <div>
          <div class="row">
            <span class="text-h6 text-weight-medium"> {{ $t('client.list.basicInfoMasterData') }} </span>
            <q-space />
            <q-btn dense flat icon="close" @click="rightDrawerOpen = false" size="sm" />
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.officeName') }}</div>
            <div class="text-caption"> 横浜営業所</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.parentClientName') }}</div>
            <div class="text-caption"> 株式会社オーパス</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.companyAddress') }}</div>
            <div class="text-caption"> 東京都新宿区新宿2-15-26第三玉屋ビル 5F</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.reprPhoneNumber') }}</div>
            <div class="text-caption"> 03-1234-5678</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.faxNumber') }}</div>
            <div class="text-caption"> 03-1234-5678</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.facilityType') }}</div>
            <div class="text-caption"> 特別養護老人ホーム</div>
            <div class="text-caption"> 歯科診療所</div>
          </div>

          <div class="q-pt-sm">
            <div class="text-weight-bolder">{{ $t('client.add.faxReceptionNG') }}</div>
            <div class="text-caption"> OK </div>
          </div>
          <div v-if="!officeData['main_office']">
            <div class="q-pt-sm">
              <div class="text-weight-bolder">{{ $t('client.add.smokingPermitted') }}</div>
              <div class="text-caption"> 可能</div>
            </div>
            <div class="q-pt-sm">
              <div class="text-weight-bolder">{{ $t('client.add.carCommutingPossible') }}</div>
              <div class="text-caption"> 可能</div>
            </div>
            <div class="q-pt-sm">
              <div class="text-weight-bolder">{{ $t('client.add.parkingLotRemarks') }}</div>
              <div class="text-caption"> 有り</div>
            </div>
            <div class="q-pt-sm">
              <div class="text-weight-bolder">{{ $t('client.add.parkingAvailable') }}</div>
              <div class="text-caption"> 駐車場10台分　近くに臨時駐車場あり</div>
            </div>
          </div>
        </div>
        <div>
          <div class="q-pt-sm text-caption">
            <div class="text-weight-bolder text-red">{{ $t('client.list.note') }}</div>
            <div> {{ $t('client.list.basicInfoNote') }} </div>
          </div>
          <div class="q-ma-sm">
            <q-btn color="primary" class="full-width" :label="$t('client.list.overwriteBasicInfo') " />
          </div>
        </div>
      </div>

    </q-drawer>


    <q-dialog v-model="teleDialog" persistent>
      <teleAppointmentReg :clientId="clientId" :officeId="officeId" @closeDialog="teleDialog = false" />
    </q-dialog>

    <q-dialog v-model="backOrderDialog" persistent>
      <backOrderReg :clientId="clientId" :officeId="officeId" @closeDialog="backOrderDialog = false" />
    </q-dialog>

  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { doc, getDoc, onSnapshot, getFirestore, updateDoc, addDoc, collection, serverTimestamp, Timestamp, query, where, orderBy } from 'firebase/firestore';
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import teleAppointmentReg from './teleAppointmentReg.vue';
import backOrderReg from './backOrderReg.vue';
import { Alert } from 'src/shared/utils/Alert.utils';

export default {
  name: 'clientDetail',
  components: { teleAppointmentReg, backOrderReg },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();

    const clientData = ref({
      name: '',
      address1: '',
      fax: '',
      tel: '',
      note: '',
      facilityType: [],
      integrationSource: [],
      coperationInfo: '',
      options: [],
    });
    const officeDataSample = {
      office_name: '',
      office_facilityType: [],
      office_tel: '',
      office_fax: '',
      office_mailaddress: '',
      office_flg_faxng: false,
      office_prefecture: '',
      office_municipality: '',
      office_building: '',
      basic_contract_signed: false,
      sameOfficeInfo: false,
      contract_tel: '',
      contract_fax: '',
      contract_mailaddress: '',
      contract_user_name: '',
      smoking: '',
      car_commuting: false,
      parking_available: false,
      cal_from_office_info: false,
      parking_remarks: '',
      office_memo: '',
      lon: '',
      lat: '',
    };
    const editofficeData = ref({});
    const officeData = ref(JSON.parse(JSON.stringify(officeDataSample)));
    const route = useRoute();
    const clientId = route.params.clientId;
    const officeId = route.params.officeId;
    const basicInfoDialog = ref(false);
    const officeDialog = ref(false);

    const facilityOp = computed(() => {
      return [
        {
          name: t('client.add.facilityOp.medicalClinic'),
          value: 'medicalClinic',
        },
        {
          name: t('client.add.facilityOp.homeVisitCare'),
          value: 'homeVisitCare',
        },
        { name: t('client.add.facilityOp.dayCare'), value: 'dayCare' },
        {
          name: t('client.add.facilityOp.homeVisitRehabilitation'),
          value: 'homeVisitRehabilitation',
        },
        {
          name: t('client.add.facilityOp.longMedicalFacility'),
          value: 'longMedicalFacility',
        },
        {
          name: t('client.add.facilityOp.homeNursing'),
          value: 'homeNursing',
        },
        { name: t('client.add.facilityOp.shortStay'), value: 'shortStay' },
        { name: t('client.add.facilityOp.dayService'), value: 'dayService' },
        {
          name: t('client.add.facilityOp.nursingCareElderly'),
          value: 'nursingCareElderly',
        },
        {
          name: t('client.add.facilityOp.specialElderlyNursingHome'),
          value: 'specialElderlyNursingHome',
        },
        {
          name: t('client.add.facilityOp.paidNursingHome'),
          value: 'paidNursingHome',
        },
        { name: t('client.add.facilityOp.groupHome'), value: 'groupHome' },
        {
          name: t('client.add.facilityOp.smallMultifunFacility'),
          value: 'smallMultifunFacility',
        },
        {
          name: t('client.add.facilityOp.homeCareNursing'),
          value: 'homeCareNursing',
        },
        {
          name: t('client.add.facilityOp.elderlyHousingServices'),
          value: 'elderlyHousingServices',
        },
        { name: t('client.add.facilityOp.clinic'), value: 'clinic' },
        { name: t('client.add.facilityOp.hospital'), value: 'hospital' },
        { name: t('client.add.facilityOp.careHouse'), value: 'careHouse' },
        {
          name: t('client.add.facilityOp.nursingCareClinic'),
          value: 'nursingCareClinic',
        },
        {
          name: t('client.add.facilityOp.dementiaLivingCare'),
          value: 'dementiaLivingCare',
        },
        {
          name: t('client.add.facilityOp.longCareWelfareFacilityElderly'),
          value: 'longCareWelfareFacilityElderly',
        },
        {
          name: t('client.add.facilityOp.communityNursingElderly'),
          value: 'communityNursingElderly',
        },
        {
          name: t('client.add.facilityOp.communitySpecificFacility'),
          value: 'communitySpecificFacility',
        },
        {
          name: t('client.add.facilityOp.dayCareFacility'),
          value: 'dayCareFacility',
        },
        { name: t('client.add.facilityOp.homeCare'), value: 'homeCare' },
        {
          name: t('client.add.facilityOp.specifiedWelfareSales'),
          value: 'specifiedWelfareSales',
        },
        {
          name: t('client.add.facilityOp.shortResidentialCare'),
          value: 'shortResidentialCare',
        },
        {
          name: t('client.add.facilityOp.lendingWelfareEquipment'),
          value: 'lendingWelfareEquipment',
        },
        {
          name: t('client.add.facilityOp.homeBathingCare'),
          value: 'homeBathingCare',
        },
        {
          name: t('client.add.facilityOp.livelihoodResidentFacility'),
          value: 'livelihoodResidentFacility',
        },
        {
          name: t('client.add.facilityOp.outpatientRehabilitation'),
          value: 'outpatientRehabilitation',
        },
        {
          name: t('client.add.facilityOp.dentalClinic'),
          value: 'dentalClinic',
        },
        { name: t('client.add.facilityOp.pharmacy'), value: 'pharmacy' },
      ];
    });

    const teleAppointColumn = computed(() => {
      return [
        { name: 'client_id', align: 'center', label: t('client.tele.list.id'), field: 'client_id', sortable: false },
        { name: 'tele_appoint_dateTime', align: 'center', label: t('client.tele.list.appointmentDay'), field: 'tele_appoint_dateTime', sortable: false },
        { name: 'tele_appoint_contact_person', align: 'center', label: t('client.tele.list.contactPerson'), field: 'tele_appoint_contact_person', sortable: false },
        { name: 'tele_appoint_result', align: 'center', label: t('client.tele.list.teleAppointmentResult'), field: 'tele_appoint_result', sortable: false },
      ];
    });
    const backordersColumn = computed(() => {
      return [
        { name: 'client_id', align: 'center', label: t('client.backOrder.list.id'), field: 'client_id', sortable: false },
        { name: 'end_dateTime', align: 'center', label: t('client.backOrder.list.dateBO'), field: 'end_dateTime', sortable: false },
        { name: 'case_type', align: 'center', label: t('client.backOrder.caseType'), field: 'case_type', sortable: false },
      ];
    });

    const intSourceOption = [
      { name: '旧オーパスその１', value: '旧オーパスその１' },
      { name: '旧オーパスその２', value: '旧オーパスその２' },
    ];

    const officeColumn = [
      { name: 'office_name', align: 'center', label: t('client.add.officeName'), field: 'office_name', sortable: false },
      { name: 'main_office', align: 'center', label: t('client.add.mainOffice'), field: 'main_office', sortable: false },
      { name: 'numTeleAppoint', align: 'center', label: t('client.add.numTeleAppoint'), field: 'numTeleAppoint', sortable: false },
      { name: 'lastTeleAppointDate', align: 'center', label: t('client.add.lastTeleAppointDate'), field: 'lastTeleAppointDate', sortable: false },
      { name: 'numBOs', align: 'center', label: t('client.add.numBOs'), field: 'numBOs', sortable: false },
      { name: 'lastBODate', align: 'center', label: t('client.add.lastBODate'), field: 'lastBODate', sortable: false },

    ];
    const officeList = ref([]);
    const showMore = ref(false);
    const officeListCurrent = computed(() => {
      if (showMore.value) {
        return officeList.value;
      }
      return officeList.value.slice(0, 3);
    });

    const editTitle = ref('');

    const pagination = ref({
      page: 1,
      rowsPerPage: 100,
    })
    const unsubscribe = ref();
    const unsubscribeOffice = ref();
    const unsubscribeBackorders = ref();
    const unsubscribeTele = ref();

    const rightDrawerOpen = ref(false);
    const teleDialog = ref(false);
    const backOrderDialog = ref(false);
    const teleAppointList = ref([]);
    const backordersList = ref([]);


    loadofficeData();
    function loadofficeData() {
      unsubscribe.value = onSnapshot(doc(db, 'clients/' + clientId), (doc) => {
        let data = doc.data();
        clientData.value.name = data?.name || '';
        clientData.value.address1 = data?.address1 || '';
        clientData.value.tel = data?.tel || '';
        clientData.value.fax = data?.fax || '';
        clientData.value.note = data?.note || '';
        clientData.value.facilityType = data?.facilityType || [];
        clientData.value.integrationSource = data?.integrationSource || [];
        clientData.value.coperationInfo = data?.coperationInfo || '';
        clientData.value.options = data?.options || [];
      });

      unsubscribeOffice.value = onSnapshot(doc(db, 'clients/' + clientId + '/office/' + officeId), (doc) => {
        let data = doc.data();
        officeData.value.main_office = data?.main_office || false;
        officeData.value.office_name = data?.office_name || '';
        officeData.value.office_facilityType = data?.office_facilityType || [];
        officeData.value.office_tel = data?.office_tel || '';
        officeData.value.office_fax = data?.office_fax || '';
        officeData.value.office_mailaddress = data?.office_mailaddress || '';
        officeData.value.office_flg_faxng = data?.office_flg_faxng || false;
        officeData.value.office_prefecture = data?.office_prefecture || '';
        officeData.value.office_municipality = data?.office_municipality || '';
        officeData.value.office_building = data?.office_building || '';
        officeData.value.sameOfficeInfo = data?.sameOfficeInfo || false;
        officeData.value.basic_contract_signed = data?.basic_contract_signed || false;
        officeData.value.contract_tel = data?.contract_tel || '';
        officeData.value.contract_fax = data?.contract_fax || '';
        officeData.value.contract_mailaddress = data?.contract_mailaddress || '';
        officeData.value.contract_user_name = data?.contract_user_name || '';
        officeData.value.smoking = data?.smoking || '';
        officeData.value.manager = data?.manager || '';
        officeData.value.car_commuting = data?.car_commuting || false;
        officeData.value.parking_available = data?.parking_available || false;
        officeData.value.cal_from_office_info = data?.cal_from_office_info || false;
        officeData.value.parking_remarks = data?.parking_remarks || '';
        officeData.value.office_memo = data?.office_memo || '';
        officeData.value.lon = data?.lon || '';
        officeData.value.lat = data?.lat || '';
        officeData.value.options = data?.options || [];
        officeData.value.updated_at = doDate(data?.updated_at);
        officeData.value.updated_by = data?.updated_by;
        getUpdatedBy(data?.updated_by);
        officeData.value.updated_by_name = '';
      });

      const qTele = query(collection(db, 'clients/' + clientId + '/office/' + officeId + '/teleAppointments'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribeTele.value = onSnapshot(qTele, (querySnapshot) => {
        let items: object[] = [];
        let count = 1;
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data['id'] = doc.id;
          data['client_id'] = count;
          count += 1;
          items.push(data);
        });
        teleAppointList.value = items as never;
      },
        (error) => {
          console.log(error)
        });

      const qBackorders = query(collection(db, 'clients/' + clientId + '/office/' + officeId + '/backorders'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribeBackorders.value = onSnapshot(qBackorders, (querySnapshot) => {
        let items: object[] = [];
        let count = 1;
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data['id'] = doc.id;
          data['client_id'] = count;
          count += 1;
          items.push(data);
        });
        backordersList.value = items as never;
      },
        (error) => {
          console.log(error)
        });




    }
    onBeforeUnmount(() => {
      unsubscribe.value();
      unsubscribeOffice.value();
      unsubscribeBackorders.value();
      unsubscribeTele.value();
    });

    const arrayColors = [
      'lime-4',
      'light-green-4',
      'teal-3',
      'indigo-4',
      'red-5',
      'deep-orange-5',
      'orange-5',
      'amber-4',
      'blue-grey-4',
      'brown-5',
      'purple-3',
      'pink-4',
      'cyan-3',
    ];

    const showBasicEditDailog = () => {
      editofficeData.value = {
        office_name: officeData.value['office_name'],
        office_tel: officeData.value['office_tel'],
        office_fax: officeData.value['office_fax'],
        office_mailaddress: officeData.value['office_mailaddress'],
        office_flg_faxng: officeData.value['office_flg_faxng'],
        office_prefecture: officeData.value['office_prefecture'],
        office_municipality: officeData.value['office_municipality'],
        office_building: officeData.value['office_building'],
        lon: officeData.value['lon'],
        lat: officeData.value['lat'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showNoteEditDailog = () => {
      editofficeData.value = { office_memo: officeData.value['office_memo'] };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showFacilityEditDailog = () => {
      editofficeData.value = {
        office_facilityType: officeData.value['office_facilityType'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showContractorDailog = () => {
      editofficeData.value = {
        sameOfficeInfo: officeData.value['sameOfficeInfo'],
        basic_contract_signed: officeData.value['basic_contract_signed'],
        contract_tel: officeData.value['contract_tel'],
        contract_fax: officeData.value['contract_fax'],
        contract_mailaddress: officeData.value['contract_mailaddress'],
        contract_user_name: officeData.value['contract_user_name'],
        manager: officeData.value['manager'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };

    const showSmokingEditDailog = () => {
      editofficeData.value = {
        smoking: officeData.value['smoking'],
        car_commuting: officeData.value['car_commuting'],
        parking_available: officeData.value['parking_available'],
        parking_remarks: officeData.value['parking_remarks'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };

    const showOptionEditDailog = () => {
      editofficeData.value = { options: officeData.value['options'] };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };

    const doDate = (timestamp: Timestamp) => {
      let data = '';
      if (timestamp) {
        data = timestamp.toDate().toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        data += ' ' + timestamp.toDate().toLocaleTimeString('ja-JP');
      }
      return data;
    };

    const updateOfficeInfo = async () => {
      const officeRef = doc(db, 'clients/' + clientId + '/office/' + officeId);
      let data = JSON.parse(JSON.stringify(editofficeData.value));
      data['updated_at'] = serverTimestamp();
      let user = $q.localStorage.getItem('user') as { uid: '' };
      if (user) {
        data['updated_by'] = user['uid'];
      }
      await updateDoc(officeRef, data);
      basicInfoDialog.value = false;
    };

    const getUpdatedBy = async (userId: string) => {
      if (userId) {
        const docRef = doc(db, 'users/' + userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          officeData.value.updated_by_name = docSnap.data()['name'];
        } else {
          console.log('No such document!');
        }
      }
    };

    const addOfficeInfo = async () => {
      let data = officeData.value;
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      data['main_office'] = false;
      const clientRef = collection(db, 'clients/' + route.params.id + '/office');
      await addDoc(clientRef, data);
      officeDialog.value = false;
      Alert.success()
    };
    const checkIfExist = (key: string) => {
      return Object.keys(editofficeData.value).includes(key)
    };

    return {
      editTitle,
      officeData,
      facilityOp,
      arrayColors,
      intSourceOption,
      officeColumn,
      officeList,
      pagination,
      officeListCurrent,
      showMore,
      officeId,
      clientId,
      clientData,
      rightDrawerOpen,
      teleAppointList,
      teleAppointColumn,
      backordersList,
      backordersColumn,

      //dialog
      editofficeData,
      basicInfoDialog,
      officeDialog,
      teleDialog,
      backOrderDialog,

      //function
      updateOfficeInfo,
      showBasicEditDailog,
      showNoteEditDailog,
      showFacilityEditDailog,
      showOptionEditDailog,
      showContractorDailog,
      checkIfExist,
      addOfficeInfo,
      showSmokingEditDailog,
    };
  },
};
</script>
