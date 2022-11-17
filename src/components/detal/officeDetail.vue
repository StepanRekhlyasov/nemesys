<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary">
      {{ $t('office.commonItems') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <div class="row q-mt-xs" v-for="rowItem in common" :key="rowItem" style="background-color: #E3ECF0;">
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[0].label}}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ client.manager }}
        </div>
        <div class="col-3 q-pa-sm rightBorder">
          {{ rowItem[1].label}}
        </div>
        <div class="col-3 q-pa-sm">
          {{ client.manager }}
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
    const officeData = ref([])


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

    loadofficeData()
    function loadofficeData() {
      console.log(props.client)
    }


    return {
      common,
      officeData,




    };
  },
};
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}
</style>

