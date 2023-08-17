<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAllMunicipalities } from 'src/shared/constants/Municipalities.const';
import { DocumentData } from 'firebase/firestore';

const props = defineProps<{
  theme: string
}>()

const emit = defineEmits<{ (e: 'updateArea', wards) }>()

const { t } = useI18n({ useScope: 'global' });

const searchInput = ref('')
const regionList = ref<DocumentData>({})
const prefectures = ref<string[]>([])
const wards = ref<string[]>([])
const selectedWards = ref<string[]>([])
const isLoadingProgress = ref(false)
const allPref = ref<string[]>([])
const allWards = ref<string[]>([])
const searchKeyword = ref<string[]>([])

onMounted(async () => {
  isLoadingProgress.value = true
  regionList.value = await getAllMunicipalities() as DocumentData;

  let region = Object.keys(regionList.value)
  for (var i = 0; i < region.length; i++) {
    let pref = regionList.value[region[i]];
    for (var j = 0; j < pref.length; j++) {
      allPref.value.push(Object.keys(pref[j])[0])
      allWards.value = [...allWards.value, ...pref[j][Object.keys(pref[j])[0]]]
    }
  }

  isLoadingProgress.value = false
});

watch(
  () => (wards.value),
  (newVal, oldVal) => {
    const oldValue = oldVal || []
    const addedItem = newVal.filter(item => oldValue.indexOf(item) < 0)
    const removedItem = oldValue.filter(item => newVal.indexOf(item) < 0)
    for (let i = 0; i < addedItem.length; i++) {
      const index = selectedWards.value.indexOf(addedItem[i]);
      if (index == -1) {
        selectedWards.value.push(addedItem[i])
      }
    }
    for (let i = 0; i < removedItem.length; i++) {
      const index = selectedWards.value.indexOf(removedItem[i]);
      if (index > -1) {
        selectedWards.value.splice(index, 1);
      }
    }
    emit('updateArea', selectedWards.value);
  }, { deep: true, immediate: true }
);

watch(
  () => (prefectures.value),
  (newVal, oldVal) => {
    const addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
    const removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
    const regList = Object.keys(regionList.value);

    for (let i = 0; i < regList.length; i++) {
      let prefecture = regionList.value[regList[i]];

      for (let j = 0; j < prefecture.length; j++) {
        let pref = Object.keys(prefecture[j])[0];
        if (addedItem.includes(pref)) {
          for (let k = 0; k < prefecture[j][pref].length; k++) {
            const index = wards.value.indexOf(prefecture[j][pref][k]);
            if (index == -1) {
              wards.value.push(prefecture[j][pref][k])
            }
            const swIndex = selectedWards.value.indexOf(prefecture[j][pref][k]);
            if (swIndex > -1) {
              selectedWards.value.splice(swIndex, 1);
            }
            selectedWards.value.push(prefecture[j][pref][k])
          }
        }
        else if (removedItem.includes(pref)) {
          for (let k = 0; k < prefecture[j][pref].length; k++) {
            const index = wards.value.indexOf(prefecture[j][pref][k]);
            if (index > -1) {
              wards.value.splice(index, 1);
            }
            const swIndex = selectedWards.value.indexOf(prefecture[j][pref][k]);
            if (swIndex > -1) {
              selectedWards.value.splice(swIndex, 1);
            }
          }
          if (searchKeyword.value.includes(pref)) {
            searchKeyword.value.splice(searchKeyword.value.indexOf(pref), 1);
          }
        }
      }
    }
    emit('updateArea', selectedWards.value);
  },
);


const onInputSubmit = () => {
  if (allPref.value.includes(searchInput.value)) {
    if (!prefectures.value.includes(searchInput.value)) {
      prefectures.value = [...prefectures.value, ...[searchInput.value]]
    }
    if (!searchKeyword.value.includes(searchInput.value)) {
      searchKeyword.value.push(searchInput.value)
    }
    searchInput.value = ''
  }
  if (allWards.value.includes(searchInput.value)) {
    if (!wards.value.includes(searchInput.value)) {
      wards.value = [...wards.value, ...[searchInput.value]]
    }
    if (!searchKeyword.value.includes(searchInput.value)) {
      searchKeyword.value.push(searchInput.value)
    }
    searchInput.value = ''
  }

}
const OnInputClear = () => {
  searchInput.value = ''
}

const removeSearchKeyword = (value: string) => {
  if (searchKeyword.value.includes(value)) {
    searchKeyword.value.splice(searchKeyword.value.indexOf(value), 1);
  }
  if (wards.value.includes(value)) {
    let ward = [...wards.value]
    ward.splice(ward.indexOf(value),1);
    wards.value = [...ward]
  }
  if (prefectures.value.includes(value)) {
    let pref = [...prefectures.value];
    pref.splice(pref.indexOf(value), 1);
    prefectures.value = [...pref]
  }
}

</script>

<template>
  <q-card class="no-shadow full-height q-pb-sm">
    <div style="height: 5px;">
      <q-separator v-if="!isLoadingProgress" />
      <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
    </div>

    <q-card class="no-shadow q-pl-md">
      <q-card-section>
        <div class="row">
          <div class="col-6">
            <q-input v-model:model-value="searchInput" v-bind="$attrs" outlined input-style="height: 36px;" class="input"
              :placeholder="t('form.searchPlaceholder')" dense />
          </div>
          <div class="col-6 q-pl-sm">

            <q-btn :label="$t('common.search')" square color="primary" @click="onInputSubmit" />
            <q-btn :label="$t('common.clear')" square class="q-ml-sm" @click="OnInputClear" />
          </div>
        </div>
        <q-chip removable v-for="keyword in searchKeyword" @remove="removeSearchKeyword(keyword)" :key="keyword">
          {{ keyword }}
        </q-chip>
      </q-card-section>
    </q-card>
    <q-list bordered class="rounded-borders">
      <q-expansion-item expand-separator :label="region" v-for="region in Object.keys(regionList)" :key="region">
        <div class="row" v-for="prefecture in regionList[region]" :key="prefecture">
          <div class="col-1 text-right">
            <q-checkbox size="sm" v-model="prefectures" :val="Object.keys(prefecture)[0]" />
          </div>
          <div class="col-11">
            <q-expansion-item dense dense-toggle expand-separator :label="Object.keys(prefecture)[0]"
              :style="{ backgroundColor: 'bg-white' }">
              <div class="bg-white q-pt-sm q-pb-sm">
                <q-checkbox dense size="sm" v-model="wards" :val="ward" :label="ward" class="q-pr-sm"
                  v-for="ward in prefecture[Object.keys(prefecture)[0]]" :key="ward.value" />
              </div>
            </q-expansion-item>
          </div>
        </div>
      </q-expansion-item>
    </q-list>
    <q-separator />
  </q-card>
</template>

<style lang="scss" scoped></style>
