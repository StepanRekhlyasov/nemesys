<script lang="ts" setup>
import { ref, defineProps, watch, onMounted } from 'vue';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { api } from 'src/boot/axios';
import SearchField from '../SearchField.vue';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';
import { useClientFactory } from 'src/stores/clientFactory';
import { useRouter } from 'vue-router';
import { useAdvanceSearch } from 'src/stores/advanceSearch';
import AdvancedSearch from 'src/pages/user/BusinessManagement/AdvancedSearch.vue'
const advanceSearch = useAdvanceSearch();
const router = useRouter()
const clientFactoryStore = useClientFactory()
const props = defineProps<{
    theme: string,
}>()
const db = getFirestore();

const searchInput = ref('')
const officeData = ref([])
const regionList = ref([])
const prefectures = ref([])
const wards = ref([])
const selectedPrefectures = ref([])
const selectedWards = ref([])
const isLoadingProgress = ref(false)
const allPref = ref<string[]>([])
const allWards = ref<string[]>([])
const searchKeyword = ref<string[]>([])
onMounted(async () => {
    isLoadingProgress.value = true
    const docRef = doc(db, 'metadata', 'regionData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        regionList.value = docSnap.data();
    }

    isLoadingProgress.value = false
    let region = Object.keys(regionList.value)
    for (var i = 0; i < region.length; i++) {
        let pref = regionList.value[region[i]];
        for (var j = 0; j < pref.length; j++) {
            allPref.value.push(Object.keys(pref[j])[0])
            allWards.value = [...allWards.value, ...pref[j][Object.keys(pref[j])[0]]]
        }
    }
});

watch(
    () => (wards.value),
    (newVal, oldVal) => {
        const addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
        const removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
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
    }
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
                    }
                    selectedPrefectures.value.push(pref);
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
                    const index = selectedPrefectures.value.indexOf(pref);
                    if (index > -1) {
                        selectedPrefectures.value.splice(index, 1);
                    }
                }
            }
        }
    },
);


const searchClients = async () => {
    isLoadingProgress.value = true
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user == null) {
            throw new Error('invalid user')
        }

        const token = await user.getIdToken();
        
        let data = { 'wards': selectedWards.value, 'prefectures': selectedPrefectures.value }
        if (searchInput.value) {
            data['prefectures'].push(searchInput.value);
            data['wards'].push(searchInput.value);
        }


        const response = await api.post(
            searchConfig.getOfficeDataURL,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000,
            }
        )
        officeData.value = response.data
        isLoadingProgress.value = false
        if(advanceSearch.areaSelected){
            const office = advanceSearch.getCFsId(officeData.value,advanceSearch.areaConditionData);
            clientFactoryStore.condition = true
            clientFactoryStore.selectedCFsId = []
            office.forEach((id)=>{
                clientFactoryStore.selectedCFsId.push(id)
            })
            router.push('/client-factories')
        }
        else{
            searchClientsByCondition()
        }
    } catch (error) {
        isLoadingProgress.value = false

        throw new Error('Failed to create user')
    }
};

const searchClientsByCondition = () => {
    clientFactoryStore.condition = true
    clientFactoryStore.selectedCFsId = []
    officeData.value.forEach((item) => {
        const id: string = item.id || ''
        clientFactoryStore.selectedCFsId.push(id)
    })
    router.push('/client-factories')
}

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
const removeSearchKeyword = (value: never) => {
    if (searchKeyword.value.includes(value)) {
        searchKeyword.value.splice(searchKeyword.value.indexOf(value), 1);
    }
    if (wards.value.includes(value)) {
        let ward = [...wards.value]
        ward.splice(wards.value.indexOf(value), 1);
        wards.value = [...ward]
    }
    if (prefectures.value.includes(value)) {
        let pref = [...prefectures.value];
        pref.splice(pref.indexOf(value), 1);
        prefectures.value = [...pref]
    }
}
const drrawer = ref(false)
const openCSDrawer = () =>{
  drrawer.value = true
}
const hideCSDrawer = () =>{
  drrawer.value = false
}
</script>

<template>
    <q-card class="no-shadow full-height q-pb-sm">
        <q-card-actions>
            <q-btn unelevated :label="$t('client.list.conditionalSearch')" :color="props.theme"
                class="no-shadow text-weight-bold" icon="add" @click="openCSDrawer"/>
            <q-btn :label="$t('client.list.searchByCondition')" outline :color="props.theme" class="text-weight-bold"
                @click="searchClients" />
            <q-btn label="Reset Condtions" outline color="red" class="text-weight-bold"
                @click="advanceSearch.resetArea" v-if="advanceSearch.areaSelected"/>
        </q-card-actions>
        <div style="height: 5px;">
            <q-separator v-if="!isLoadingProgress" />
            <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />
        </div>

        <q-card class="no-shadow q-pl-md">
            <SearchField :on-click-search="onInputSubmit" :on-click-clear="OnInputClear" v-model:model-value="searchInput"
                :searchButtonColor="props.theme" :is-title="false" />
            <q-chip removable v-for="keyword in searchKeyword" @remove="removeSearchKeyword(keyword)" :key="keyword">
                {{ keyword }}
            </q-chip>
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
                                    v-for="ward in prefecture[Object.keys(prefecture)[0]]" :key="ward.value"
                                    :disable="prefectures.includes(Object.keys(prefecture)[0])" />
                            </div>
                        </q-expansion-item>
                    </div>
                </div>
            </q-expansion-item>
        </q-list>
        <q-separator />
    </q-card>
    <q-drawer :model-value="drrawer" :width="900" overlay elevated bordered side="right" show>
        <AdvancedSearch from="area" :isDrawer="true" @hide-c-s-drawer="hideCSDrawer" />
    </q-drawer>
</template>

<style lang="scss" scoped></style>