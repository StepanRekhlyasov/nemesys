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
        <MySelect :options="[
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
        ]" :width="'175px'" v-model="mode" :clearable="false" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('KPI.item') }}
        <MySelect :options="[
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
        ]" :width="'175px'" v-model="item" :clearable="false" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('KPI.targetPeriod') }}
        <DateRange v-model="dateRange" :width="'250px'" :height="'40px'" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'day'">
        {{ $t('applicant.progress.filters.month') }}
        <YearMonthPicker v-model="month" :width="'150px'" :height="'40px'" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'day'">
        {{ $t('common.branch') }}
        <MySelect :width="'150px'" v-model="branch" :options="branchs" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'media'">
        {{ $t('KPI.media') }}
        <MySelect :width="'150px'" :options="mediaListToShow" v-model="media" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="false">
        {{ $t('KPI.username') }}
        <MySelect :options="userListToShow" :width="'175px'" v-model="user" @update:model-value="getData()" />
      </label>
      <label class="text-subtitle1" v-if="mode === 'branch' || mode === 'media'">
        {{ $t('applicant.add.occupation') }}
        <MySelect :options="occupationList" :width="'100px'" v-model="occupation" @update:model-value="getData()" />
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
import YearMonthPicker from 'src/components/inputs/YearMonthPicker.vue';
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
import {
  devideByAmount,
  convertObjToIdNameList,
} from 'src/shared/utils/KPI.utils';

import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();

const { getReport, getDailyReport, getAgeReport } = useGetReport();
const UserBranch = useBranch();
const { getAllmedia } = useMedia();
const media = ref<string>('');
const dateRange = ref<{ from: string; to: string }>({ from: '', to: '' });
const branch = ref<string|undefined>(undefined);
const occupation = ref('');
const month = ref('');
const user = ref('');
const userListToShow = ref<{ value: string; label: string }[]>([]);
const mediaListToShow = ref<{ value: string; label: string }[]>([]);
const mode = ref('day');
const item = ref('actualFigures');
const branchs = ref<{ value: string; label: string }[]>([]);
const resetData = () => {
  user.value = '';
  branch.value = undefined;
  month.value = '';
};

const loading = ref(false);
const rowData = ref<{ [key: string]: number | string }[]>([]);
const organizationStore = useOrganization();
const detailsDrawer = ref<InstanceType<typeof ApplicantDetails> | null>(null);
const kpiTableRef = ref<InstanceType<typeof KpiTable> | null>(null);

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
    rowData.value = [];
    mediaListToShow.value = convertObjToIdNameList([...(await getAllmedia())]);
  } else if (mode.value == 'branch') {
    rowData.value = [];
  }
  if (
    (dateRange.value.from == '' || dateRange.value.to == '') &&
    mode.value !== 'day'
  ) {
    rowData.value = [];
    return;
  }
  if (organizationStore.currentOrganizationId) {
    rowData.value = [];
    loading.value = true;
    // we need to care switching mode while loading
    const modeNow = mode.value;
    console.log(branch.value, 'branch')
    if (mode.value == 'day' && month.value) {
      rowData.value = await getDailyReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        queryNames: dayItemList,
        dateInMonth: month.value,
        branch: branch.value,
        isAverage: false,
      });
    }
    if (mode.value == 'branch' && item.value == 'applicationAttribute') {
      const medias = await getAllmedia();
      rowData.value = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branch: branch.value,
        queryNames: applicationAttributeItemList,
        medias: medias,
        isAverage: false,
        occupation: occupation.value,
      });
      //add age data
      for (const [i, media] of Object.entries(medias)) {
        const ageData = await getAgeReport({
          dateRange: dateRange.value,
          media: media,
        });
        rowData.value[i] = { ...rowData.value[i], ...ageData };
      }
    } else if (mode.value == 'branch' && branch.value) {
      rowData.value = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branch: branch.value,
        queryNames: mediaItemList,
        rateNames: mediaItemRateList,
        medias: [...(await getAllmedia())],
        isAverage: false,
        occupation: occupation.value,
      });
      if (item.value == 'unitPrice')
        rowData.value = devideByAmount(rowData.value);
    }
    if (mode.value == 'media' && item.value == 'applicationAttribute') {
      const organizationList = Object.values(
        await UserBranch.getBranchesInOrganization(
          organizationStore.currentOrganizationId
        )
      );
      rowData.value = await getReport({
        dateRange: dateRange.value,
        graphType: 'BasedOnEachItemDate',
        branches: organizationList,
        queryNames: applicationAttributeItemList,
        media: media.value,
        isAverage: false,
        occupation: occupation.value,
      });
      //add age data
      for (const [i, organization] of Object.entries(organizationList)) {
        const ageData = await getAgeReport({
          dateRange: dateRange.value,
          branch: organization,
        });
        rowData.value[i] = { ...rowData.value[i], ...ageData };
      }
    } else if (mode.value == 'media' && media.value) {
      rowData.value = await getReport({
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
      if (item.value == 'unitPrice')
        rowData.value = devideByAmount(rowData.value);
    }
    if (modeNow != mode.value) {
      rowData.value = [];
    }
    loading.value = false;
  }
}

const getBranchUsers = async () => {
  const users = await userStore.getAllUsersInBranch(branch.value)
  userListToShow.value = users.map((user) => {
    return { value: user.id, label: user.name }
  })
}


watch(
  () => organizationStore.currentOrganizationId,
  async () => {
    await getBranchList();
    getData();
  }
);
watch(
  () => [mode.value, item.value],
  async () => {
    resetData();
    await getData();
  }
);

watch(
  () => branch.value,
  async () => {
    user.value = ''
    await getBranchUsers();
    getData();
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
