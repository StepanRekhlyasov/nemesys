<template>
  <q-card class="no-shadow full-width">
    <q-card-section>
      <div class="row self-center items-center">
        {{ $t('client.variousAchievement.displayPeriod') }}
        <q-input outlined dense v-model="filter['startDate']" mask="date" :rules="['date']" hide-bottom-space
          class="q-ml-md">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="filter['startDate']">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <span class="q-ml-md q-mr-md text-h6">~</span>
        <q-input dense outlined v-model="filter['endDate']" mask="date" :rules="['date']" hide-bottom-space>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="filter['endDate']">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary">
      {{ $t('client.list.dispatchRecord') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="dispatchRecord" :columns="dispatchColumns" row-key="name" hide-pagination />
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-pt-sm">
      {{ $t('client.list.referralResults') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="dispatchRecord" :columns="dispatchColumns" row-key="name" hide-pagination />
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-pt-sm">
      {{ $t('office.employmentRecord') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="empRecord" :columns="empRecordColumns" row-key="name" hide-pagination style="max-width: 500px;" />
    </q-card-section>


  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import { today, lastMonth } from 'src/shared/utils/utils';

export default {
  name: 'VariousAchievements',

  props: {
    client: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const filter = ref({
      startDate: lastMonth(),
      endDate: today()
    });
    const dispatchRecord = ref([]);
    const empRecord = ref([]);

    const dispatchColumns = computed(() => {
      return [
        {
          name: 'inHouseBO',
          required: true,
          label: t('client.variousAchievement.inHouseBO'),
          align: 'center',
          field: 'inHouseBO',
          sortable: false,
        },
        {
          name: 'inHouseFIX',
          required: true,
          label: t('client.variousAchievement.inHouseFIX'),
          align: 'center',
          field: 'inHouseFIX',
          sortable: false,
        },
        {
          name: 'companyJob',
          required: true,
          label: t('client.variousAchievement.companyJob'),
          align: 'center',
          field: 'companyJob',
          sortable: false,
        },
        {
          name: 'inHouseOffer',
          required: true,
          label: t('client.variousAchievement.inHouseOffer'),
          align: 'center',
          field: 'inHouseOffer',
          sortable: false,
        },
        {
          name: 'inHouseEmployment',
          required: true,
          label: t('client.variousAchievement.inHouseEmployment'),
          align: 'center',
          field: 'inHouseEmployment',
          sortable: false,
        },
        {
          name: 'otherCompanyBO',
          required: true,
          label: t('client.variousAchievement.otherCompanyBO'),
          align: 'center',
          field: 'otherCompanyBO',
          sortable: false,
          headerClasses: 'bg-yellow-4',
          classes: 'bg-yellow-4 ellipsis',
        },
        {
          name: 'competitorFIX',
          required: true,
          label: t('client.variousAchievement.competitorFIX'),
          align: 'center',
          field: 'competitorFIX',
          sortable: false,
          headerClasses: 'bg-yellow-4',
          classes: 'bg-yellow-4 ellipsis',
        },
        {
          name: 'otherCompanyJob',
          required: true,
          label: t('client.variousAchievement.otherCompanyJob'),
          align: 'center',
          field: 'otherCompanyJob',
          sortable: false,
          headerClasses: 'bg-yellow-4',
          classes: 'bg-yellow-4 ellipsis',
        },
        {
          name: 'otherCompany',
          required: true,
          label: t('client.variousAchievement.otherCompany'),
          align: 'center',
          field: 'otherCompany',
          sortable: false,
          headerClasses: 'bg-yellow-4',
          classes: 'bg-yellow-4 ellipsis',
        },
        {
          name: 'joiningAnotherCompany',
          required: true,
          label: t('client.variousAchievement.joiningAnotherCompany'),
          align: 'center',
          field: 'joiningAnotherCompany',
          sortable: false,
          headerClasses: 'bg-yellow-4',
          classes: 'bg-yellow-4 ellipsis',
        },
      ];
    });

    const empRecordColumns = computed(() => {
      return [
        {
          name: 'fullTime',
          required: true,
          label: t('client.backOrder.fullTime'),
          align: 'center',
          field: 'fullTime',
          sortable: false,
        },
        {
          name: 'partTimeJob',
          required: true,
          label: t('client.variousAchievement.partTimeJob'),
          align: 'center',
          field: 'partTimeJob',
          sortable: false,
        },
        {
          name: 'dispatch',
          required: true,
          label: t('client.backOrder.dispatch'),
          align: 'center',
          field: 'dispatch',
          sortable: false,
        },
      ]
    });




    loadData()
    function loadData() {
      console.log(props.client)
      dispatchRecord.value = [{
        inHouseBO: 3,
        inHouseFIX: 4,
        companyJob: 3,
        inHouseOffer: 5,
        inHouseEmployment: 1,
        otherCompanyBO: 13,
        competitorFIX: 15,
        otherCompanyJob: 12,
        otherCompany: 17,
        joiningAnotherCompany: 13,

      }
      ]

      empRecord.value = [
        {
          fullTime: 0,
          partTimeJob: 0,
          dispatch: 1
        }
      ]
    }


    return {
      filter,
      dispatchRecord,
      empRecord,
      dispatchColumns,
      empRecordColumns


    };
  },
}
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
