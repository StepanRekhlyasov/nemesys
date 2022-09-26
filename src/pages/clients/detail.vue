<template>
  <div class="q-pa-sm">
    <!-- {{clientData}} -->
    <div class="row full-width">
      <div class="col-8">
        <q-card class="bg-yellow-1 q-ma-xs">
          <q-card-section class="q-pb-none" horizontal>
            <q-card-section>
              <div class="text-h5 text-weight-medium">
                <q-icon name="mdi-domain" size="2rem"></q-icon>
                {{ clientData['name'] }}
              </div>
              <div class="q-pt-xs">{{ clientData['address1'] }}</div>
              <div class="q-pt-xs">
                <span class="text-weight-medium">TEL: </span>
                {{ clientData['tel'] }}
                <span class="q-ml-md text-weight-medium">FAX: </span>
                {{ clientData['office_fax'] }}
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" @click="showBasicEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section horizontal>
            <q-card-section>{{ clientData['note'] }}</q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" @click="showNoteEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-xs">
          <q-card-section horizontal>
            <q-card-section v-if="clientData['options']">
              <q-chip
                size="sm"
                :color="
                  arrayColors[
                    Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                  ]
                "
                text-color="white"
                v-for="option in clientData['options']"
                :key="option"
              >
                {{ $t('client.add.options.' + option) }}
              </q-chip>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" @click="showOptionEditDailog" />
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
                <q-chip
                  size="sm"
                  :color="
                    arrayColors[
                      Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                    ]
                  "
                  text-color="white"
                  v-for="option in clientData['facilityType']"
                  :key="option"
                >
                  {{ $t('client.add.facilityOp.' + option) }}
                </q-chip>
              </div>
              <div class="text-weight-bolder q-pt-sm">
                {{ $t('client.add.copInfo') }}
              </div>
              <div>{{ clientData['coperationInfo'] }}</div>
              <div class="text-weight-bolder q-pt-xs">
                {{ $t('client.add.integrationSource') }}
              </div>
              <div>
                <q-chip
                  size="sm"
                  :color="
                    arrayColors[
                      Math.floor(Math.random() * (arrayColors.length - 1) + 1)
                    ]
                  "
                  text-color="white"
                  v-for="option in clientData['integrationSource']"
                  :key="option"
                >
                  {{ option }}
                </q-chip>
              </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-actions vertical>
              <q-btn flat round icon="edit" @click="showFacilityEditDailog" />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4"></div>
    </div>

    <!-- Edit Dialog -->
    <q-dialog v-model="basicInfoDialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Edit</div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-form class="q-gutter-none">
            <q-list>
              <q-item v-if="editClientData['name']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.clientName')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['name']" />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['address1']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.address')
                  }}</q-item-label>
                  <q-input
                    outlined
                    dense
                    v-model="editClientData['address1']"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['tel']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.phoneNumber')
                  }}</q-item-label>
                  <q-input outlined dense v-model="editClientData['tel']" />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['office_fax']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.faxNumber')
                  }}</q-item-label>
                  <q-input
                    outlined
                    dense
                    v-model="editClientData['office_fax']"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['note']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.memo')
                  }}</q-item-label>
                  <q-input
                    outlined
                    dense
                    type="textarea"
                    v-model="editClientData['note']"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['options']">
                <div class="q-gutter-sm">
                  <q-checkbox
                    size="sm"
                    v-model="editClientData['options']"
                    val="transactionHistory"
                    :label="$t('client.add.options.transactionHistory')"
                  />
                  <q-checkbox
                    size="sm"
                    v-model="editClientData['options']"
                    val="noFaxSending"
                    :label="$t('client.add.options.noFaxSending')"
                  />
                  <q-checkbox
                    size="sm"
                    v-model="editClientData['options']"
                    val="fixNumberLimit"
                    :label="$t('client.add.options.fixNumberLimit')"
                  />
                </div>
              </q-item>
              <q-item v-if="editClientData['facilityType']">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.memo')
                  }}</q-item-label>
                  <q-checkbox
                    size="sm"
                    v-model="editClientData['facilityType']"
                    :val="option.value"
                    :label="option.name"
                    v-for="option in facilityOp"
                    :key="option"
                  />
                </div>
              </q-item>
              <q-item v-if="editClientData['facilityType']">
                <q-item-section>
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.copInfo')
                  }}</q-item-label>
                  <q-input
                    outlined
                    dense
                    type="textarea"
                    v-model="editClientData['coperationInfo']"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="editClientData['facilityType']">
                <div class="q-gutter-sm">
                  <q-item-label class="q-pb-xs">{{
                    $t('client.add.integrationSource')
                  }}</q-item-label>
                  <q-checkbox
                    size="sm"
                    v-model="editClientData['integrationSource']"
                    :val="option.value"
                    :label="option.name"
                    v-for="option in intSourceOption"
                    :key="option"
                  />
                </div>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn :label="$t('common.cancel')" flat v-close-popup color="red" />
          <q-btn flat :label="$t('common.save')" @click="updateClientInfo" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { doc, onSnapshot, getFirestore, updateDoc } from 'firebase/firestore';
import { ref, computed } from 'vue';
//import { defineComponent } from "vue";
import { useRoute } from 'vue-router';

export default {
  name: 'clientDetail',
  components: {},

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const clientData = ref({
      name: '',
      address1: '',
      office_fax: '',
      tel: '',
      note: '',
      facilityType: [],
      integrationSource: [],
      coperationInfo: '',
      options: [],
    });
    const editClientData = ref({});
    const route = useRoute();
    const basicInfoDialog = ref(false);
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

    const intSourceOption = [
      { name: '旧オーパスその１', value: '旧オーパスその１' },
      { name: '旧オーパスその２', value: '旧オーパスその２' },
    ];

    loadClientData();
    function loadClientData() {
      console.log(route.params.id);
      onSnapshot(doc(db, 'clients/' + route.params.id), (doc) => {
        console.log('Current data: ', doc.data());
        let data = doc.data();
        clientData.value.name = data?.name;
        clientData.value.address1 = data?.address1;
        clientData.value.office_fax = data?.office_fax;
        clientData.value.tel = data?.tel;
        clientData.value.note = data?.note;
        clientData.value.facilityType = data?.facilityType;
        clientData.value.integrationSource = data?.integrationSource;
        clientData.value.coperationInfo = data?.coperationInfo;
        clientData.value.options = data?.options;
      });
    }

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
        office_fax: clientData.value['office_fax'],
        tel: clientData.value['tel'],
      };
      basicInfoDialog.value = true;
    };
    const showNoteEditDailog = () => {
      editClientData.value = { note: clientData.value['note'] };
      basicInfoDialog.value = true;
    };
    const showFacilityEditDailog = () => {
      let facilityType = ref([]);
      if (clientData.value['facilityType']) {
        facilityType.value = clientData.value['facilityType'];
      }
      let integrationSource = ref([]);
      if (clientData.value['integrationSource']) {
        integrationSource.value = clientData.value['integrationSource'];
      }
      editClientData.value = {
        facilityType: facilityType,
        coperationInfo: clientData.value['coperationInfo'],
        integrationSource: integrationSource,
      };
      basicInfoDialog.value = true;
    };
    const showOptionEditDailog = () => {
      let options = ref([]);
      if (clientData.value['options']) {
        options.value = clientData.value['options'];
      }
      editClientData.value = { options: options };
      basicInfoDialog.value = true;
    };

    const updateClientInfo = async () => {
      const clientRef = doc(db, 'clients', ' route.params.id');
      await updateDoc(clientRef, editClientData.value);
      basicInfoDialog.value = false;
    };

    return {
      clientData,
      editClientData,
      facilityOp,
      arrayColors,
      intSourceOption,

      //dialog
      basicInfoDialog,

      //function
      updateClientInfo,
      showBasicEditDailog,
      showNoteEditDailog,
      showFacilityEditDailog,
      showOptionEditDailog,
    };
  },
};
</script>
