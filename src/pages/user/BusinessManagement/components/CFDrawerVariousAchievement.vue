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
        <q-input  dense outlined v-model="filter['endDate']" mask="date" :rules="['date']" hide-bottom-space >
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

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-mt-xs">
      {{ $t('client.list.dispatchRecord') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="dispatchRecord" :columns="dispatchColumns" row-key="name" hide-pagination class="no-shadow  rowBorder" />
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-pt-sm q-mt-sm">
      {{ $t('client.list.referralResults') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="dispatchRecord" :columns="columnsdispatch" row-key="name" hide-pagination class="no-shadow  rowBorder"  />
    </q-card-section>

    <q-card-section class="text-h6 q-ma-none q-pa-none text-primary q-pt-sm q-mt-sm">
      {{ $t('office.employmentRecord') }}
    </q-card-section>
    <q-card-section class="q-ma-none q-pa-none">
      <q-table :rows="empRecord" :columns="columnsemp" row-key="name" hide-pagination style="max-width: 500px;" class="no-shadow  rowBorder"  />
    </q-card-section>


  </q-card>
</template>

<script lang="ts" setup>
import { ref , Ref , onMounted } from 'vue';
import { today, lastMonth } from 'src/shared/utils/utils';
import { dispatchColumns, empRecordColumns } from 'src/shared/constants/VariousAchievement.const'
import { dispatchModel , employment } from 'src/shared/model/VariousAchievement.model'
import { QTableProps } from 'quasar';
const columnsdispatch = ref(dispatchColumns)
const columnsemp  = ref(empRecordColumns)
const filter = ref({
startDate: lastMonth(),
endDate: today()
});
defineProps<{
  columnsemp: QTableProps['columns']
  columnsdispatch: QTableProps['columns']
  dispatchColumns: QTableProps['columns']
}>()
const dispatchRecord : Ref<dispatchModel[]> = ref([]);
const empRecord : Ref<employment[]>= ref([]);
const loadData = () => {
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
          dispatch: 1,
          TemptoPerm:0
        }
      ]
    }
    onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
.rightBorder {
  border-right: 2px solid rgb(201, 199, 199);
}

.rowBorder {
  border-bottom: 2px solid rgb(201, 199, 199);
  border-top: 2px solid rgb(201, 199, 199);
}

.background1 {
  background-color: #E3ECF0;
}

</style>
