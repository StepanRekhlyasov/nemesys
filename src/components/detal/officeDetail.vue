<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary">
      {{ $t('office.commonItems') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row rowBorder" v-for="(rowItem, index) in common" :key="index"
        :class="index % 2 == 0 ? 'background1' : 'bg-grey-2'">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label }}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ officeData[rowItem[0].name] }}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[1].label }}
        </div>
        <div class="col-3 q-pa-sm">
          {{ officeData[rowItem[1].name] }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-xs">
      <div class="row q-mt-xs text-h6 text-primary">
        {{ $t('office.workingHours') }}
      </div>

      <div class="row q-mt-xs background1 rowBorder">
        <div class="col-3 q-pa-sm" v-for="(colItem, index) in workingHours" :key="index"
          :class="index < 3 ? 'rightBorder' : ''">
          {{ colItem.label }}
        </div>
      </div>
      <div class="row bg-grey-2">
        <div class="col-3 q-pa-sm" v-for="(colItem, index) in workingHours" :key="index"
          :class="index < 3 ? 'rightBorder' : ''">
          {{ officeData[colItem.name] }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-mt-xs">
      {{ $t('office.nursingCareItem') }}
    </q-card-section>

    <q-card-section class="q-ma-none q-pa-none">
      <div class="row rowBorder" v-for="(rowItem, index) in nursingItems" :key="index"
        :class="index % 2 == 0 ? 'background1' : 'bg-grey-2'">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label }}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ officeData[rowItem[0].name] }}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[1].label }}
        </div>
        <div class="col-3 q-pa-sm">
          {{ officeData[rowItem[1].name] }}
        </div>
      </div>
    </q-card-section>


  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
//import { addDoc, collection, serverTimestamp, getFirestore, query, onSnapshot, where, updateDoc, doc, orderBy } from 'firebase/firestore';
//import { useQuasar } from 'quasar';
//import { toDate } from 'src/shared/utils/utils';


export default {
  name: 'officeDetails',
  components: {
  },

  props: {
    client: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const officeData = ref({})


    const common = computed(() => {
      return [
        [
          {
            name: 'referralFee',
            label: t('office.referralFee'),
          },
          {
            name: 'referralFeeAmount',
            label: t('office.referralFeeAmount'),
          },
        ],
        [
          {
            name: 'hourlyWage',
            label: t('office.hourlyWage'),
          },
          {
            name: 'monthlySalary',
            label: t('office.monthlySalary'),
          },
        ],
        [
          {
            name: 'loansRaises',
            label: t('office.loansRaises'),
          },
          {
            name: 'payDay',
            label: t('office.payDay'),
          },
        ],
        [
          {
            name: 'transportationExpenses',
            label: t('office.transportationExpenses'),
          },
          {
            name: 'retirementAge',
            label: t('office.retirementAge'),
          },
        ],
        [
          {
            name: 'overtimeHours',
            label: t('office.overtimeHours'),
          },
          {
            name: 'annualholiday',
            label: t('office.annualholiday'),
          },
        ],
        [
          {
            name: 'welfare',
            label: t('office.welfare'),
          },
          {
            name: 'childcareLeave',
            label: t('office.childcareLeave'),
          },
        ],
        [
          {
            name: 'businessContent',
            label: t('office.businessContent'),
          },
          {
            name: 'weeklyHolidays',
            label: t('office.weeklyHolidays'),
          },
        ],
        [
          {
            name: 'smokingPermitted',
            label: t('office.smokingPermitted'),
          },
          {
            name: 'commutingByCar',
            label: t('office.commutingByCar'),
          },
        ],
      ];
    });

    const workingHours = computed(() => {
      return [
        {
          name: 'earlyShift',
          label: t('office.earlyShift'),
        },
        {
          name: 'dayShift',
          label: t('office.dayShift'),
        },
        {
          name: 'lateShift',
          label: t('office.lateShift'),
        },
        {
          name: 'nightShift',
          label: t('office.nightShift'),
        },
      ];
    });

    const nursingItems = computed(() => {
      return [
        [
          {
            name: 'availabilityParkingLot',
            label: t('office.availabilityParkingLot'),
          },
          {
            name: 'parkingLotRemarks',
            label: t('office.parkingLotRemarks'),
          },
        ],
        [
          {
            name: 'headquarterSettlement',
            label: t('office.headquarterSettlement'),
          },
          {
            name: 'presenceAbsenceApproval',
            label: t('office.presenceAbsenceApproval'),
          },
        ],
        [
          {
            name: 'averageLevelCare',
            label: t('office.averageLevelCare'),
          },
          {
            name: 'vaccination',
            label: t('office.vaccination'),
          },
        ],
        [
          {
            name: 'numberUsers',
            label: t('office.numberUsers'),
          },
          {
            name: 'medicalCheckup',
            label: t('office.medicalCheckup'),
          },
        ],
        [
          {
            name: 'withWithoutLunch',
            label: t('office.withWithoutLunch'),
          },
          {
            name: 'onCallCorrespondence',
            label: t('office.onCallCorrespondence'),
          },
        ],
        [
          {
            name: 'presenceAbsenceUniform',
            label: t('office.presenceAbsenceUniform'),
          },
          {
            name: 'parkingLotRemarks',
            label: t('office.parkingLotRemarks'),
          },
        ],
        [
          {
            name: 'numberEmployees',
            label: t('office.numberEmployees'),
          },
          {
            name: 'numberOfUsers',
            label: t('office.numberOfUsers'),
          },
        ],
      ];
    });

    loadofficeData()
    function loadofficeData() {
      console.log(props.client)
      officeData.value = {
        referralFee: '10%',
        referralFeeAmount: '未設定',
        hourlyWage: '1200円',
        monthlySalary: '未設定',
        loansRaises: 'インセンティブあり',
        payDay: '月末',
        transportationExpenses: '月30000円上限',
        retirementAge: '60歳',
        overtimeHours: '40時間未満',
        annualholiday: '150日',
        welfare: '未設定',
        childcareLeave: '育児休暇取得可能',
        businessContent: '病院での看護業務',
        weeklyHolidays: '土・日',
        smokingPermitted: '喫煙可',
        commutingByCar: '可能',
        earlyShift: '6:00-14:00',
        dayShift: '10:00-19:00',
        lateShift: '14:00-23:00',
        nightShift: '日によって変動あり',
        availabilityParkingLot: 'なし',
        parkingLotRemarks: '45台分',
        headquarterSettlement: 'あり',
        presenceAbsenceApproval: 'あり',
        averageLevelCare: '固定',
        vaccination: '',
        numberUsers: '必要',
        medicalCheckup: '',
        withWithoutLunch: '必要',
        onCallCorrespondence: 'あり',
        presenceAbsenceUniform: '不要',
        parkingLotRemarks: 'あり',
        numberEmployees: '30名',
        numberOfUsers: '未設定',


      }
    }


    return {
      common,
      officeData,
      workingHours,
      nursingItems,
    };
  },
};
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}

.rowBorder {
  border-bottom: 1px solid white;
  border-top: 1px solid white;
}

.background1 {
  background-color: #E3ECF0;
}
</style>

