<template>
  <q-page class="bg-grey-3">
    <q-card-section class="bg-grey-3 flex items-center q-pb-none">
      <div class="text-h6 text-primary">
        <span style="font-size: 28px">■</span>{{ $t('menu.KPI') }}
      </div>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-end gap">
      <label class="text-subtitle1">
        {{ $t('KPI.aggregationMethods') }}
        <MySelect
          :options="[
            {
              label: $t('KPI.dailyTotal'),
              value: 'day',
            },
            {
              label: $t('KPI.modeBranch'),
              value: 'branch',
            },
            {
              label: $t('KPI.modeMedia'),
              value: 'media',
            },
          ]"
          :width="'175px'"
          v-model="mode"
          :clearable="false"
          @update:model-value="getData()"
        />
      </label>
      <label
        class="text-subtitle1"
        v-if="mode === 'branch' || mode === 'media'"
      >
        {{ $t('KPI.item') }}
        <MySelect
          :options="[
            {
              label: $t('KPI.actualFigures'),
              value: 'actualFigures',
            },
            {
              label: $t('KPI.unitPrice'),
              value: 'unitPrice',
            },
            {
              label: $t('KPI.applicationAttribute'),
              value: 'applicationAttribute',
            },
          ]"
          :width="'175px'"
          v-model="item"
          :clearable="false"
          @update:model-value="getData()"
        />
      </label>
      <label
        class="text-subtitle1"
        v-if="mode === 'branch' || mode === 'media'"
      >
        {{ $t('KPI.targetPeriod') }}
        <DateRange
          v-model="dateRange"
          :width="'250px'"
          :height="'40px'"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'day'">
        {{ $t('applicant.progress.filters.month') }}
        <DateRange
          v-model="day"
          :width="'150px'"
          :height="'40px'"
          @update:model-value="getData()"
          :range="false"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'day'">
        {{ $t('common.branch') }}
        <MySelect
          :width="'150px'"
          v-model="branch"
          :options="branchs"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="mode === 'media'">
        {{ $t('KPI.media') }}
        <MySelect
          :width="'150px'"
          :options="mediaListToShow"
          v-model="media"
          @update:model-value="getData()"
        />
      </label>
      <label class="text-subtitle1" v-if="false">
        {{ $t('KPI.username') }}
        <MySelect
          :options="userListToShow"
          :width="'175px'"
          v-model="user"
          @update:model-value="getData()"
        />
      </label>
      <label
        class="text-subtitle1"
        v-if="mode === 'branch' || mode === 'media'"
      >
        {{ $t('applicant.add.occupation') }}
        <MySelect
          :options="occupationList"
          :width="'100px'"
          v-model="occupation"
          @update:model-value="getData()"
        />
      </label>
      <q-btn color="primary" style="margin-left: auto" @click="downloadCSV">
        {{ $t('common.downloadCSV') }}
      </q-btn>
    </q-card-section>
    <q-card-section class="bg-grey-3 flex items-center">
      <KpiTable :rows="rowData" :mode="mode" :item="item" ref="kpiTableRef" />
      <q-linear-progress query v-if="loading" color="primary" />
    </q-card-section>
    <ApplicantDetails ref="detailsDrawer" />
  </q-page>
</template>
<script setup lang="ts">
import MySelect from 'src/components/inputs/MySelect.vue';
import DateRange from 'src/components/inputs/DateRange.vue';
import KpiTable from './components/KPITable.vue';
import { ref, onMounted, watch } from 'vue';
import { useOrganization } from 'src/stores/organization';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';
import { occupationList } from 'src/shared/constants/Applicant.const';
import { useGetReport } from 'src/stores/getReport';
import { useBranch } from 'src/stores/branch';
import {
  mediaItemList,
  dayItemList,
  mediaItemRateList,
  applicationAttributeItemList,
} from './const/kpi.const';
import { useMedia } from 'src/stores/media';
const { getReport, getDailyReport } = useGetReport();
const UserBranch = useBranch();
const { getAllmedia } = useMedia();
// const dummyDataDateRange = {from:'1900/01/01',to:'1900/12/31'};
// const dummyDate = '1900/07/01';
const day = ref('');
const media = ref<string>('');
const dateRange = ref<{ from: string; to: string }>({ from: '', to: '' });
const branch = ref('');
const occupation = ref('');
const user = ref('');
const userListToShow = ref<{ value: string; label: string }[]>([]);
const mediaListToShow = ref<{ value: string; label: string }[]>([]);
const mode = ref('day');
const item = ref('actualFigures');
const branchs = ref<{ value: string; label: string }[]>([]);
const resetData = () => {
  user.value = '';
  day.value = '';
  branch.value = '';
};

const loading = ref(false);
const rowData = ref<{ [key: string]: number | string }[]>([]);
const organizationStore = useOrganization();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
const kpiTableRef = ref<InstanceType<typeof KpiTable> | null>(null);

const devideByAmount = (rows) => {
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      const num = row[key];
      if (
        typeof num == 'number' &&
        typeof row['amount'] == 'number' &&
        num != 0 &&
        key != 'amount'
      ) {
        row[key] = row['amount'] / num;
      }
    }
  }
  return [...rows];
};

const convertObjToIdNameList = (objList) => {
  return objList.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });
};

const getBranchList = async () => {
  branchs.value = convertObjToIdNameList(
    Object.values(
      await UserBranch.getBranchesInOrganization(
        organizationStore.currentOrganizationId
      )
    )
  );
};

async function getData() {
  if (mode.value == 'media') {
      mediaListToShow.value = convertObjToIdNameList([
        ...(await getAllmedia()),
      ]);}
  if ((dateRange.value.from == '' || dateRange.value.to == '') && mode.value !== 'day') {
    rowData.value = [];
    return;
  }
  if (organizationStore.currentOrganizationId) {
    rowData.value = [];
    loading.value = true;
    // we need to care switching mode while loading
    const modeNow = mode.value;
    if (mode.value == 'day' && day.value) {
      rowData.value = [];
      rowData.value = await getDailyReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        queryNames: dayItemList,
        dateInMonth: day.value,
        branch: branch.value,
        isAverage: false,
      });
    }
    if (mode.value == 'branch' && item.value == 'applicationAttribute') {
      rowData.value = [];
      let rows = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branch: branch.value,
        queryNames: applicationAttributeItemList,
        medias: [...(await getAllmedia())],
        isAverage: false,
        occupation: occupation.value,
      });
      rowData.value = rows;
    } else if (mode.value == 'branch' && branch.value) {
      rowData.value = [];
      let rows = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branch: branch.value,
        queryNames: mediaItemList,
        rateNames: mediaItemRateList,
        medias: [...(await getAllmedia())],
        isAverage: false,
        occupation: occupation.value,
      });
      if (item.value == 'unitPrice') rows = devideByAmount(rows);
      rowData.value = rows;
    } else if (mode.value == 'branch' && occupation.value) {
      rowData.value = [];
      let rows = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        queryNames: mediaItemList,
        rateNames: mediaItemRateList,
        medias: [...(await getAllmedia())],
        isAverage: false,
        occupation: occupation.value,
      });
      if (item.value == 'unitPrice') rows = devideByAmount(rows);
      rowData.value = rows;
    } else if (mode.value == 'branch') {
      rowData.value = [];
    }

    if (mode.value == 'media' && item.value == 'applicationAttribute') {
      rowData.value = [];
      let rows = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branch: branch.value,
        queryNames: applicationAttributeItemList,
        medias: [...(await getAllmedia())],
        isAverage: false,
        occupation: occupation.value,
      });
      rowData.value = rows;
    } else if (mode.value == 'media' && media.value) {
      rowData.value = [];
      let rows = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branches: Object.values(
          await UserBranch.getBranchesInOrganization(
            organizationStore.currentOrganizationId
          )
        ),
        queryNames: mediaItemList,
        rateNames: mediaItemRateList,
        media: media.value,
        isAverage: false,
        occupation: occupation.value,
      });
      if (item.value == 'unitPrice') rows = devideByAmount(rows);
      rowData.value = [...rows];
    } else if (mode.value == 'media') {
      rowData.value = [];
    }
    if (modeNow != mode.value) {
      resetData();
      rowData.value = [];
    }
    loading.value = false;
  }
}
watch(
  () => organizationStore.currentOrganizationId,
  async () => {
    await getBranchList();
    getData();
  }
);
watch(
  () => [mode.value, item.value, branch.value],
  async () => {
    resetData();
    await getData();
  }
);

function downloadCSV() {
  kpiTableRef.value?.exportTable();
}

onMounted(async () => {
  await getBranchList();
  getData();
});
</script>
<style scoped lang="scss">
.gap {
  gap: 10px;
}
</style>
