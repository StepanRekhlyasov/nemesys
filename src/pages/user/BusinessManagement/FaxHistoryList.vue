<template>
    <div>
        <div class="row no-shadow full-height new">
            <q-card class="no-shadow full-width bg-grey-3">
                <q-card-section class="bg-grey-3">
                    <div class="title">{{ $t('menu.faxHistory') }}</div>
                </q-card-section>
                <q-card-section>
                    <div class="row">
                        <div class="col-3">
                            <q-select v-model="selectedYear" :options="yearOptions" class="q-ml-sm" outlined
                                style="max-width: 250px;min-width: 100px;" color="black" dense bg-color="white" emit-value
                                map-options />
                        </div>
                        <div class="col-3">
                            <q-select v-model="selectedYear" :options="yearOptions" class="q-ml-sm" outlined
                                style="max-width: 250px;min-width: 100px;" color="black" dense bg-color="white" emit-value
                                map-options />
                        </div>
                    </div>

                </q-card-section>
            </q-card>


            <span class="text-h6 text-primary ">{{ $t('menu.faxHistory') }}</span>
            <span class="q-pl-md q-pt-sm">{{ $t('client.variousAchievement.displayPeriod') }}</span>
            <q-select v-model="selectedYear" :options="yearOptions" class="q-ml-sm" outlined
                style="max-width: 250px;min-width: 100px;" color="black" dense bg-color="white" emit-value map-options />
            <span class="q-ml-sm q-pt-sm">{{ $t('common.year') }}</span>
            <q-select v-model="selectedMonth" :options="monthOptions" class="q-ml-sm" outlined
                style="max-width: 150px;min-width: 100px;" color="black" dense bg-color="white" emit-value map-options />

            <span class="q-ml-sm q-pt-sm">{{ $t('common.month') }}</span>
        </div>

        <div class="row q-pl-lg q-mb-sm q-mt-sm">
            <q-input outlined :placeholder="$t('form.searchPlaceholder')" style="width: 350px" color="black" dense
                bg-color="white" v-model="searchText" />
            <q-btn dense style="color: white" :label="$t('common.search')" class="q-ml-sm q-px-lg buttonbg" />
            <q-btn dense :label="$t('common.clear')" outline class="q-ml-sm q-px-md text-bold buttonbg" @click="clear" />
        </div>
        <q-table :columns="columns" :rows="faxList" row-key="name" v-model:pagination="pagination" hide-pagination
            :loading="loading">
            <template v-slot:body-cell-sender="props">
                <q-td :props="props" class="no-wrap q-pa-none">
                    {{ getUserName(props.row.senderId) }}
                </q-td>
            </template>
            <template v-slot:body-cell-attachment="props">
                <q-td :props="props" class="no-wrap q-pa-none">
                    <q-btn flat color="primary" label="Flat" />
                </q-td>
            </template>
            <template v-slot:body-cell-numDestinations="props">
                <q-td :props="props" class="no-wrap q-pa-none">
                    {{ props.row.applicants.length }}
                </q-td>
            </template>
            <template v-slot:body-cell-sentDateTime="props">
                <q-td :props="props" class="no-wrap q-pa-none">
                    {{ toDate(props.row.created_at) }}
                </q-td>
            </template>
        </q-table>
        <div class="row justify-start q-mt-md pagination q-ml-sm">
            <TablePagination :pagination="pagination" :isAdmin="true" v-model="pagination.page" :key="loadPagination" />
        </div>

        <vue-pdf-app style="height: 100vh;" pdf="https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_1MB.pdf"></vue-pdf-app>

    </div>
</template>
     
<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { faxColumns } from './consts/Fax.const';
import { useFax } from 'src/stores/fax';
import { useUserStore } from 'src/stores/user';
import { toDate } from 'src/shared/utils/utils';
import { DateOption } from '../budget/type/budget'
// import { timestampToDateFormat } from 'src/shared/utils/utils';
import TablePagination from 'src/components/pagination/TablePagination.vue';
import { orderBy, where, Timestamp } from 'firebase/firestore';
import { User } from 'src/shared/model';
import VuePdfApp from 'vue3-pdf-app';

const yearOptions = ref<DateOption[]>([]);
const monthOptions = ref<DateOption[]>([]);


const columns = ref(faxColumns);
const selected = ref(false);


const faxStore = useFax();
const useStore = useUserStore();
const allUsers = ref(<User[]>[]);
const loading = ref(true);
const searchText = ref('')
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const nextMonth = selectedMonth.value == 12 ? 1 : selectedMonth.value + 1;
const nextYear = selectedMonth.value == 12 ? selectedYear.value + 1 : selectedYear.value;
const start = Timestamp.fromDate(new Date(`${selectedYear.value}-${('0' + selectedMonth.value).slice(-2)}-01`))
const end = Timestamp.fromDate(new Date(`${nextYear}-${('0' + nextMonth).slice(-2)}-01`))
const pagination = ref({
    page: 1,
    rowsPerPage: 30,
    path: 'fax',
    order: orderBy('created_at', 'asc'),
    constraints: [
        where('deleted', '==', false),
        where('created_at', '>=', start),
        where('created_at', '<', end),
    ]
});
const loadPagination = ref(0);
const faxList = computed(() => {
    if (!searchText.value) {
        return faxStore.faxList
    }
    const needle = searchText.value.toLowerCase()
    return faxStore.faxList.filter(function (el) {
        return el['media'].toLowerCase().includes(needle) || el['branch'].toLowerCase().includes(needle)
    });
});


const clear = () => {
    searchText.value = ''
}

watch(() => selectedYear.value, async (newValue) => {
    loading.value = true;
    await faxStore.getFaxList(newValue, selectedMonth.value);
    loading.value = false;
})
watch(() => selectedMonth.value, async (newValue) => {
    loading.value = true;
    await faxStore.getFaxList(selectedYear.value, newValue);
    loading.value = false;
});
watch(() => selected.value, (newValue) => {
    for (let i = 0; i < faxList.value.length; i++) {
        faxList.value[i]['selected'] = newValue
    }
});

onMounted(async () => {
    const ten = 10;
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - ten;
    const endYear = currentYear + ten;
    for (let year = startYear; year <= endYear; year++) {
        yearOptions.value.push({ label: String(year), value: year });
    }
    for (let month = 1; month <= 12; month++) {
        monthOptions.value.push({ label: ('0' + month).slice(-2), value: month });
    }


    await faxStore.getFaxList(selectedYear.value, selectedMonth.value);
    allUsers.value = await useStore.getAllUsers()
    loading.value = false;

})

const getUserName = (userId: string) => {
    return allUsers.value.find(user => user.id === userId)?.name
}
</script>
<style lang="scss">
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

thead tr:first-child th {
    background-color: #f3f0f0;
}

.buttonbg {
    background-color: #154c79;
}

.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}
</style>