<template>
  <div class="q-pa-sm">
    <!-- {{clientData}} -->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="breadcrumbs">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" ></q-icon>
        </template>

        <q-breadcrumbs-el :label="$t('client.list.client')" @click="$router.push('/clients')" class="link"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="$t('client.list.corporation')" class="link"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="clientData['name']" @click="$router.push('/clientDetail/' + clientId)" class="link"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="$t('client.list.clientDetail')" ></q-breadcrumbs-el>
      </q-breadcrumbs>
    </div>

    <div class="row full-width q-pl-lg" >
      <div class="col-8">
        <q-card class="bg-yellow-1 q-ma-xs q-pa-md q-mb-md">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section>
              <div class="text-h4 text-weight-medium text-grey-9">
                <q-icon name="mdi-domain" size="2rem"></q-icon>
                {{ clientData['name'] }}
              </div>
              <div class="q-pt-xs text-grey-7 text-h6 text-weight-regular">{{ clientData['address1'] }}</div>
              <div class="q-pt-xs text-grey-7 text-h6 text-weight-regular">
                <span class="">TEL</span>
                {{ clientData['tel'] }}
                <span class="q-ml-md">FAX </span>
                {{ clientData['fax'] }}

              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="mdi-pencil-outline" size="md" class="text-grey-6" @click="showBasicEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs q-mb-md q-pa-xm q-pl-md q-pr-md">
          <q-card-section horizontal>
            <q-card-section class="text-grey-7">
              <div class="q-pb-sm text-h6 text-weight-regular">
                  {{$t('client.add.memo')}}
              </div>
              <span class="text-h7 text-weight-regular">{{ clientData['note'] }}</span>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="mdi-pencil-outline" size="md" class="text-grey-6" @click="showNoteEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs q-mb-md q-pa-xm q-pl-md q-pr-md">
          <q-card-section horizontal>
            <q-card-section v-if="clientData['options']">
              <q-chip size="md" :color="
                arrayColors[
                  Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                ]
              "
              text-color="white" v-for="option in clientData['options']"
              class="q-pa-md"
              :key="option">
                {{ $t('client.add.options.' + option) }}
              </q-chip>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="mdi-pencil-outline" size="md" class="text-grey-7" @click="showOptionEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="bg-yellow-1 q-ma-xs q-mb-md q-pa-md">
          <q-card-section class="q-pb-none text-grey-7" horizontal>
            <q-card-section>
              <div class="q-pb-md">
                <div class="text-weight-regular text-h6 text-weight-regular q-pb-sm">
                  {{ $t('client.add.facilityType') }}
                </div>
                <div class="flex">
                  <div v-for="option in clientData['facilityType']" :key="option" class="text-h7 q-pr-md">
                    {{ $t('client.add.facilityOp.' + option) }}
                  </div>
                </div>
              </div>

              <div class="q-pb-md">
                <div class="text-weight-regular q-pt-sm text-h6 q-pb-sm">
                  {{ $t('client.add.copInfo') }}
                </div>
                <div class="text-h7 text-weight-regular">{{ clientData['coperationInfo'] }}</div>
              </div>

              <div class="flex">
                <div class="text-weight-regular text-h7">
                  {{ $t('client.add.integrationSource') }}
                </div>
                <div>
                  <div v-for="option in clientData['integrationSource']" :key="option" class="text-h7 q-pl-md text-weight-bolder">
                    {{ option }}
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="mdi-pencil-outline" size="md" class="text-grey-7" @click="showFacilityEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>


        <q-card class="q-ma-xs q-pa-md">
          <q-card-section class="q-pb-none" horizontal>
            <div class="full-width text-h7">
              <q-table dense flat :title="$t('client.add.busInfoReg')" title-class="text-grey-7 text-weight-regular" :rows="officeListCurrent" :columns="officeColumn" row-key="id" hide-bottom :pagination="pagination">
                <template v-slot:body-cell-office_name="props">
                  <q-td :props="props">
                    <!-- <q-side-link tag="a" @click="$router.push('/clientDetail/' + clientId + '/' + props.key)" class="cursor-pointer text-primary">{{ props.value }}</q-side-link> -->

                    <q-btn flat dense no-caps @click="$router.push('/clientDetail/' + clientId + '/' + props.key)" color="primary" :label="props.value"
                    class="q-pt-none q-pb-none"
                    />
                  </q-td>
                </template>
                <template v-slot:body-cell-main_office="props">
                  <q-td :props="props">
                  <q-icon v-if="props.value" name="check_circle" size="xs"></q-icon>
                  </q-td>
                </template>
              </q-table>
              <div class="text-center" v-if="officeList.length > 3">
                <q-btn flat round size="sm" icon="expand_less" v-if="showMore" @click="showMore=!showMore"/>
                <q-btn flat round size="sm" icon="expand_more" v-else @click="showMore=!showMore" />
                </div>
              </div>
              <q-space></q-space>
              <q-card-actions vertical>
                <q-btn flat round icon="mdi-pencil-outline" size="md" class="text-grey-6" @click="showBusInfoDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4"></div>
    </div>

    <!-- Edit Dialog -->
    <q-dialog v-model="basicInfoDialog">
      <q-card style="width: 1000px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">{{ editTitle }}</div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-pa-none scroll" style="max-height: 80vh">
          <q-form class="q-gutter-none">
            <q-list>
              <q-item v-if="checkIfExist('name')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.clientName')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['name']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('address1')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.address')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['address1']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('tel')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.phoneNumber')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['tel']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('fax')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.faxNumber')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['fax']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('note')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.memo')
                  }}</q-item-label>
                  <q-input outlined dense type="textarea" v-model="editClientData['note']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('options')">
                <div class="q-gutter-sm">
                  <q-checkbox size="xs" v-model="editClientData['options']" val="transactionHistory"
                    :label="$t('client.add.options.transactionHistory')" />
                  <q-checkbox size="xs" v-model="editClientData['options']" val="noFaxSending"
                    :label="$t('client.add.options.noFaxSending')" />
                  <q-checkbox size="xs" v-model="editClientData['options']" val="fixNumberLimit"
                    :label="$t('client.add.options.fixNumberLimit')" />
                </div>
              </q-item>
              <q-item v-if="checkIfExist('facilityType')">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.facilityType')
                  }}</q-item-label>
                  <q-checkbox size="xs" v-model="editClientData['facilityType']" :val="option.value"
                    :label="option.name" v-for="option in facilityOp" :key="option.name" />
                </div>
              </q-item>
              <q-item v-if="checkIfExist('coperationInfo')">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.copInfo')
                  }}</q-item-label>
                  <q-input outlined dense type="textarea" v-model="editClientData['coperationInfo']" />
                </q-item-section>
              </q-item>
              <q-item v-if="checkIfExist('integrationSource')">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.integrationSource')
                  }}</q-item-label>
                  <q-checkbox size="xs" v-model="editClientData['integrationSource']" :val="option.value"
                    :label="option.name" v-for="option in intSourceOption" :key="option.name" />
                </div>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
          <q-btn flat :label="$t('common.save')" @click="updateClientInfo" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- Add office Dialog -->
    <q-dialog v-model="officeDialog" persistent>
      <q-card style="width: 1000px; max-width: 80vw">
        <q-form class="q-gutter-none" @submit="addOfficeInfo">
          <q-card-section>
            <div class="text-h6">{{ $t('client.add.busInfoReg') }}</div>
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pa-none scroll" style="max-height: 80vh">

            <q-list>
              <!-- office_name -->
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">
                    {{ $t('client.add.officeName') }}
                    <span class="text-red-5">*</span>
                  </q-item-label>
                  <q-input outlined dense v-model="officeData['office_name']"
                    :placeholder="$t('client.add.clientLabel')"  lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '']"
                  />
                </q-item-section>
              </q-item>
              <q-item>
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                  $t('client.add.facilityType')
                  }}</q-item-label>
                  <q-checkbox size="xs" v-model="officeData['office_facilityType']" :val="option.value"
                    :label="option.name" v-for="option in facilityOp" :key="option.name" />
                </div>
              </q-item>

              <!-- office_name -->
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs  text-weight-bolder">{{
                  $t('client.add.officeInfo')
                  }}</q-item-label>
                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">TEL</q-item-label>
                      <q-input outlined dense v-model="officeData['office_tel']"
                        :placeholder="$t('client.add.phoneLabel')" />
                    </div>
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">FAX</q-item-label>
                      <q-input outlined dense v-model="officeData['office_fax']"
                        :placeholder="$t('client.add.phoneLabel')" />
                    </div>
                  </div>
                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.email') }}</q-item-label>
                      <q-input outlined dense v-model="officeData['office_mailaddress']" :placeholder="
                        $t('client.add.emailLabel1') +
                        '@' +
                        $t('client.add.emailLabel2')
                      " />
                    </div>
                    <div class="col-6 q-pr-xs q-pt-lg">
                      <q-checkbox size="xs" v-model="officeData['office_flg_faxng']"
                        :label="$t('client.add.faxReceptionNG')" />
                    </div>
                  </div>

                  <q-item-label class="q-pb-xs q-pt-xs"> {{$t('client.add.manager') }}</q-item-label>
                  <q-input outlined dense v-model="officeData['manager']" :placeholder="$t('client.add.managerLabel')" />

                  <q-item-label class="q-pt-sm  text-weight-bolder"> {{$t('client.add.location') }}</q-item-label>
                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">{{$t('client.add.prefectures') }}</q-item-label>
                      <q-input outlined dense v-model="officeData['office_prefecture']"
                        :placeholder="$t('client.add.prefectureLabel')" />
                    </div>
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">{{$t('client.add.municipalities') }}</q-item-label>
                      <q-input outlined dense v-model="officeData['office_municipality']"
                        :placeholder="$t('client.add.municipalitieLabel')" />
                    </div>
                  </div>

                  <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.addressBuildingName') }}</q-item-label>
                  <q-input outlined dense v-model="officeData['office_building']"
                    :placeholder="$t('client.add.addressBuildingLabel')" />

                  <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.basicContract') }}</q-item-label>
                  <q-checkbox size="xs" v-model="officeData['basicContractSigned']" :label="$t('client.add.basicContractSigned')" />

                  <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.contractor') }}</q-item-label>
                  <q-item-label class="q-pb-xs text-red-5 text-caption">{{$t('client.add.contractorLabel') }}
                  </q-item-label>
                  <q-checkbox size="xs" v-model="officeData['sameOfficeInfo']"
                    :label="$t('client.add.sameOfficeInfo')" />

                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">TEL</q-item-label>
                      <q-input outlined dense v-model="officeData['contract_tel']"
                        :placeholder="$t('client.add.phoneLabel')" />
                    </div>
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs">FAX</q-item-label>
                      <q-input outlined dense v-model="officeData['contract_fax']"
                        :placeholder="$t('client.add.phoneLabel')" />
                    </div>
                  </div>
                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.email') }}</q-item-label>
                      <q-input outlined dense v-model="officeData['contract_mailaddress']" :placeholder="
                        $t('client.add.emailLabel1') +
                        '@' +
                        $t('client.add.emailLabel2')
                      " />
                    </div>
                    <div class="col-6 q-pr-xs ">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.manager') }}</q-item-label>
                      <q-input outlined dense v-model="officeData['contract_user_name']"
                        :placeholder="$t('client.add.managerLabel')" />
                    </div>
                  </div>

                  <q-item-label class="q-pt-md text-weight-bolder">{{$t('client.add.officeEnvironment') }}
                  </q-item-label>
                  <div class="q-gutter-sm">
                    <q-item-label class="q-pt-sm">{{$t('client.add.smokingPermitted') }}</q-item-label>
                    <q-radio class="q-ma-none q-ml-sm" dense v-model="officeData['smoking']" checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye" val="separateSmokingArea"
                      :label="$t('client.add.separateSmokingArea')" />
                    <q-radio class="q-ma-sm" dense v-model="officeData['smoking']" checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye" val="noSmoking" :label="$t('client.add.noSmoking')" />
                    <q-radio class="q-ma-sm" dense v-model="officeData['smoking']" checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye" val="smokingAllowed"
                      :label="$t('client.add.smokingAllowed')" />
                  </div>

                  <q-item-label class="q-pt-sm text-weight-bolder">{{$t('client.add.commutingCar') }}</q-item-label>
                  <div class="q-gutter-sm">
                    <q-checkbox size="xs" v-model="officeData['car_commuting']"
                      :label="$t('client.add.carCommutingPossible')" />
                    <q-checkbox size="xs" v-model="officeData['parking_available']"
                      :label="$t('client.add.parkingAvailable')" />
                  </div>

                  <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.parkingLotRemarks') }}</q-item-label>
                  <q-input outlined dense v-model="officeData['parking_remarks']"
                    :placeholder="$t('client.add.memoLabel')" />

                  <q-item-label class="q-pt-sm q-pb-xs">{{$t('client.add.officeMemo') }}</q-item-label>
                  <q-input outlined dense v-model="officeData['office_memo']"
                    :placeholder="$t('client.add.memoLabel')" />

                  <q-item-label class="q-pt-sm q-pb-xs text-weight-bolder">{{$t('client.add.longLatInfo') }}
                  </q-item-label>
                  <q-checkbox class="q-ml-none" size="xs" v-model="officeData['cal_from_office_info']"
                    :label="$t('client.add.calOfficeInfo')" />

                  <div class="row q-mt-sm">
                    <div class="col-6 q-pr-xs">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.longitude') }}</q-item-label>
                      <q-input outlined dense type="number" v-model.number="officeData['lon']"
                        :placeholder="$t('client.add.latitudeLabel')" />
                    </div>
                    <div class="col-6 q-pr-xs ">
                      <q-item-label class="q-pb-xs"> {{$t('client.add.latitude') }}</q-item-label>
                      <q-input outlined dense type="number" v-model.number="officeData['lat']"
                        :placeholder="$t('client.add.latitudeLabel')" />
                    </div>
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
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { doc, onSnapshot, getFirestore, updateDoc, addDoc, collection, where, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, computed, onBeforeUnmount } from 'vue';
//import { defineComponent } from "vue";
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { facilityOp } from './consts/facilityType.const';

export default {
  name: 'clientDetail',
  components: {},

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
      sameOfficeInfo: false,
      basicContractSigned: false,
      manager: '',
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
    const editClientData = ref({});
    const officeData = ref(JSON.parse(JSON.stringify(officeDataSample)));
    const route = useRoute();
    const clientId = route.params.id;
    const basicInfoDialog = ref(false);
    const officeDialog = ref(false);

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
      if (showMore.value){
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

    loadClientData();
    function loadClientData() {
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

      const q = query(collection(db, 'clients/' + clientId + '/office'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribeOffice.value = onSnapshot(q, (querySnapshot) => {
        let items: object[] = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          data['id'] = doc.id;
          if (data['main_office']){
            items.unshift(data);
          } else {
            items.push(data);
          }
        });
         officeList.value = items as never;
      },
      (error) => {
        console.log(error)
      });

    }
    onBeforeUnmount(() => {
      unsubscribeOffice.value();
      unsubscribe.value();
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
      editClientData.value = {
        name: clientData.value['name'],
        address1: clientData.value['address1'],
        fax: clientData.value['fax'],
        tel: clientData.value['tel'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showNoteEditDailog = () => {
      editClientData.value = { note: clientData.value['note'] };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showFacilityEditDailog = () => {
      editClientData.value = {
        facilityType: clientData.value['facilityType'],
        coperationInfo: clientData.value['coperationInfo'],
        integrationSource: clientData.value['integrationSource'],
      };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };
    const showBusInfoDailog = () => {
      officeData.value = JSON.parse(JSON.stringify(officeDataSample));
      editTitle.value = t('client.add.busInfoReg');
      officeDialog.value = true;
    };

    const showOptionEditDailog = () => {
      editClientData.value = { options: clientData.value['options'] };
      editTitle.value = t('common.edit');
      basicInfoDialog.value = true;
    };

    const updateClientInfo = async () => {
      const clientRef = doc(db, 'clients/' + clientId);
      let data = JSON.parse(JSON.stringify(editClientData.value));
      data['updated_at'] = serverTimestamp();
      let user = $q.localStorage.getItem('user') as { uid: '' };
      if (user) {
        data['updated_by'] = user['uid'];
      }
      await updateDoc(clientRef, data);
      basicInfoDialog.value = false;
    };

    const addOfficeInfo = async () => {
      let data = officeData.value;
      data['created_at'] = serverTimestamp();
      data['updated_at'] = serverTimestamp();
      data['deleted'] = false;
      data['main_office'] = false;
      const clientRef = collection(db, 'clients/' + clientId + '/office');
      await addDoc(clientRef, data);
      officeDialog.value = false;
      $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: t('success'),
      });
    };
    const checkIfExist = (key: string) => {
      return Object.keys(editClientData.value).includes(key)
    };

    return {
      editTitle,
      clientData,
      facilityOp,
      arrayColors,
      intSourceOption,
      officeColumn,
      officeList,
      pagination,
      officeListCurrent,
      showMore,
      clientId,

      //dialog
      editClientData,
      basicInfoDialog,
      officeData,
      officeDialog,

      //function
      updateClientInfo,
      showBasicEditDailog,
      showNoteEditDailog,
      showFacilityEditDailog,
      showOptionEditDailog,
      showBusInfoDailog,
      checkIfExist,
      addOfficeInfo,
    };
  },
};
</script>
