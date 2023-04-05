<template>
  <q-page>
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t("applicant.progress.title") }}</div>
    </q-card-section>

    <q-separator color="white" size="2px" />

    <q-card-section class="bg-grey-3">
      <div class="row q-pt-md q-gutter-sm">
        <div class="col-2">
          <p>{{ $t("applicant.progress.filters.branch") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureOption"
            v-model="applicantData['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
          />
        </div>
        <div class="col-2">
          <p>{{ $t("applicant.progress.filters.userInCharge") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureOption"
            v-model="applicantData['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
          />
        </div>
        <div class="col-1">
          <p>{{ $t("applicant.progress.filters.prefecture") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureOption"
            v-model="applicantData['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
          />
        </div>
        <div class="col-1">
          <p>{{ $t("applicant.progress.filters.month") }}</p>
          <q-select
            outlined
            dense
            :options="prefectureOption"
            v-model="applicantData['prefecture']"
            bg-color="white"
            :label="$t('common.pleaseSelect')"
            emit-value
            map-options
          />
        </div>
        <div class="col-1">
          <p>{{ $t("applicant.progress.entry") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="entireApplicants" />
        </div>
        <div class="col-1">
          <p>{{ $t("applicant.progress.retire") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="entireApplicants" />
        </div>
        <div class="col-1">
          <p>{{ $t("applicant.progress.working") }}</p>
          <q-input readonly outlined dense bg-color="white" v-model="entireApplicants" />
        </div>
      </div>

      <div v-if="isLoading" class="q-pt-xl">
        <q-spinner color="primary" size="3em" />
      </div>
      <div v-else class="q-pt-md">
        <q-scroll-area style="height: 80vh; max-width: 90vw">
          <div class="row no-wrap justify-between">
            <Column
              v-for="column in columns"
              :key="column.id"
              :column="column"
              :columns="columns"
            />
          </div>
        </q-scroll-area>
      </div>
    </q-card-section>
  </q-page>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUnmounted } from "vue";
//import { useQuasar } from 'quasar';
//import api from '../../firebaseData/dashboard.js';
import Column from "./components/Column.vue";
import ManageCard from "../dashboard/components/ManageCard.vue";
import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";
import { prefectureList } from "../../shared/constants/Prefecture.const";
import { APPLICANT_COLUMNS } from "./const/applicantColumns";
import { useApplicant } from "src/stores/applicant";

const { t } = useI18n({ useScope: "global" });
const isLoading = ref(false);
const prefectureOption = ref(prefectureList);
const applicantData = ref({
  prefecture: "",
});
const entireApplicants = ref(5);
const columns = ref<object[]>(
  APPLICANT_COLUMNS.map((item) => ({ ...item, label: t(item.label) }))
);

const applicantStore = useApplicant();
</script>
