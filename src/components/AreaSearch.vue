<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from '@firebase/auth';
import { api } from 'src/boot/axios';
import { useI18n } from 'vue-i18n';
import SearchField from './SearchField.vue';
import { searchConfig } from 'src/shared/constants/SearchClientsAPI';

const props = defineProps<{
    theme: string
}>()
const emit = defineEmits<{ (e: 'getClients', clients) }>()
const db = getFirestore();

const { t } = useI18n({ useScope: 'global' })
const searchInput = ref('')
const officeData = ref([])
const regionList = ref([])
const prefectures = ref([])
const wards = ref([])
const selectedPrefectures = ref([])
const selectedWards = ref([])
const isLoadingProgress = ref(false)

onMounted(async () => {
    isLoadingProgress.value = true
    const docRef = doc(db, 'metadata', 'regionData');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        regionList.value = docSnap.data();
    }

    isLoadingProgress.value = false
});

watch(
    () => (wards.value),
    (newVal, oldVal) => {
        let addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
        let removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
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
        let addedItem = newVal.filter(item => oldVal.indexOf(item) < 0)
        let removedItem = oldVal.filter(item => newVal.indexOf(item) < 0)
        let regList = Object.keys(regionList.value);
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
    const auth = getAuth();
    const user = auth.currentUser;
    if (user == null) {
        console.log('invalid user')
        return false
    }

    const token = await user.getIdToken();
    let data = { 'wards': selectedWards.value, 'prefectures': selectedPrefectures.value }

    if (searchInput.value) {
        data['prefectures'].push(searchInput.value);
        data['wards'].push(searchInput.value);
    }

    try {
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
        emit('getClients', response.data)
    } catch(error) {
        isLoadingProgress.value = false

        console.error('Failed to create user', error);
    }
};

const onInputSubmit = () => {
    console.log()
}
const OnInputClear = () => {
    searchInput.value = ''
}
</script>

<template>
    <q-card class="no-shadow full-height q-pb-sm">
        <q-card-actions>
            <q-btn
            unelevated
            :label="$t('client.list.conditionalSearch')" 
            :color="props.theme"
            class="no-shadow text-weight-bold"
            icon="add" />
            <q-btn 
            :label="$t('client.list.searchByCondition')"
            outline
            :color="props.theme"
            class="text-weight-bold"
            @click="searchClients" />
        </q-card-actions>
        <q-separator v-if="!isLoadingProgress"/>
        <q-linear-progress v-if="isLoadingProgress" indeterminate rounded :color="props.theme" />

        <q-card class="no-shadow q-pl-md">
            <SearchField
            :on-click-search="onInputSubmit"
            :on-click-clear="OnInputClear"
            :model-value="searchInput"
            :searchButtonColor="props.theme"
            :is-title="false"/>
        </q-card>
        <q-list bordered class="rounded-borders">
            <q-expansion-item
            expand-separator
            :label="region"
            v-for="region in Object.keys(regionList)"
            :key="region">
                <div
                class="row"
                v-for="prefecture in regionList[region]"
                :key="prefecture">
                    <div class="col-1 text-right">
                        <q-checkbox size="sm" v-model="prefectures" :val="Object.keys(prefecture)[0]" />
                    </div>
                    <div class="col-11">
                        <q-expansion-item
                        dense dense-toggle
                        expand-separator
                        :label="Object.keys(prefecture)[0]"
                        :style="{ backgroundColor: 'bg-white' }">
                            <div class="bg-white q-pt-sm q-pb-sm">
                                <q-checkbox
                                dense size="sm"
                                v-model="wards" :val="ward"
                                :label="ward" class="q-pr-sm"
                                v-for="ward in prefecture[Object.keys(prefecture)[0]]"
                                :key="ward.value"
                                :disable="prefectures.includes(Object.keys(prefecture)[0])" />
                            </div>
                        </q-expansion-item>
                    </div>
                </div>
            </q-expansion-item>
        </q-list>
        <q-separator />
    </q-card>
</template>

<style lang="scss" scoped>

</style>