<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { ActionsType } from 'src/components/client-factory/types';
import { useUserStore } from 'src/stores/user';
import { toDate } from 'src/shared/utils/utils';
import { User } from 'src/shared/model';
import { useOrganization } from 'src/stores/organization';
import AdvanceSearchDrawer from './AdvanceSearchDrawer.vue';
import { useAdvanceSearchAdmin } from 'src/stores/advanceSearchAdmin';
import { useI18n } from 'vue-i18n';
import consts from './consts';
import { useSaveSearchConditionAdmin } from 'src/stores/saveSearchConditionAdmin';
const saveSearchCondition = useSaveSearchConditionAdmin();
const advanceSearch = useAdvanceSearchAdmin();
const { t } = useI18n({ useScope: 'global' });
const loading = ref(true);
const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
    // rowsNumber: xx if getting data from a server
});


const useStore = useUserStore();
const allUsers = ref(<User[]>[]);


const conditionList = computed(() => {
    return saveSearchCondition.searchConditions;
});


onMounted(async () => {
    loading.value = true;
    await saveSearchCondition.getSaveSearchConditions();
    allUsers.value = await useStore.getAllUsers();
    loading.value = false;
});

const getUserName = (userId: string) => {
    return allUsers.value.find((user) => user.id === userId)?.name;
};
const keyword = ref('');
const filterConditionList = ref();
const filter = ref(false)
const filterFn = () => {
    filterConditionList.value = conditionList.value.filter(item => {if(check(item['conditionName'])){return item}})
    filter.value=true;
};
const clearFilter = () =>{
    filter.value=false;
    filterConditionList.value={}
    keyword.value=''
}
const check = (name:string) => {
    const regex = new RegExp(keyword.value.split('').join('.*'), 'i');
    return regex.test(name)
}
const deleteCondition = (id) => {
    saveSearchCondition.deleteSaveSearchCondition(id)
}
const isDrawer =ref(false);
const rowId = ref('')
const key = ref(0)
const openDrawer = (id,row) => {
    rowId.value = id
    key.value = key.value===0?1:0;
    advanceSearch.saveConditionData = row
    isDrawer.value = true;
}
const hideDrawer = () => {
    isDrawer.value = false;
}
const searchCF = async(row) => {
    const [office,cfsId] = await advanceSearch.getCFsId()
    advanceSearch.saveConditionData = row
    await advanceSearch.searchClients(office,cfsId,'saveCondition')
}
</script>

<template>
    <div class="row no-shadow full-height new">
        <q-card class="no-shadow full-width bg-grey-2">
            <q-card-section class="bg-grey-3">
                <div class="title text-h6 text-weight-bold">{{ t('menu.admin.masterSearch') }}</div>
            </q-card-section>
            <q-separator color="white" size="2px" />
            <q-card-section class="bg-grey-3 q-pa-md">
                <div class="text-subtitle1">
                    {{ t('common.searchKeyword') }} / {{ t('common.searchCondition') }}
                </div>
                <form class="form q-mt-sm">
                    <input class="form__input" type="text" v-model="keyword" :placeholder="t('form.searchPlaceholder')">
                    <q-btn color="accent" @click="filterFn">
                        {{ t('common.search') }}
                    </q-btn>
                    <q-btn @click="clearFilter">
                        {{ t('common.clear') }}
                    </q-btn>
                </form>
            </q-card-section>
            <q-card-section class="no-padding">
                <q-markup-table class="table" :bordered="false" :square="false" separator="none" flat :loading="loading">
                    <thead>
                        <tr>
                            <th class="table__column text-left"></th>
                            <th class="table__column text-left" :key="item.name" v-for="item in consts.tableColumnsSavedCriteriaList.value">
                                {{ item.label }}
                            </th>
                            <th class="table__column text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table__row wrapper_animate_left_border_client" :key="item.id" v-for="item in !filter?conditionList:filterConditionList">
                            <td class="table__btn-wrapper q-ml-xs"><q-icon size="1.5rem" color="accent"
                                    class="table__edit-btn" name="edit" @click="openDrawer(item.id,item)"/></td>
                            <td class="table__row_name text-left">
                                <span style="cursor:pointer" @click="searchCF(item)">
                                    {{ item.conditionName }}
                                </span>
                            </td>
                            <td class="text-left">{{ getUserName(item.created_by) }}</td>
                            <td class="text-left"> {{ toDate(item.created_at) }}</td>
                            <td class="text-left">{{ getUserName(item.updated_by) }}</td>
                            <td class="text-left">{{ toDate(item.updated_at) }}</td>
                            <td class="table__btn-wrapper"><q-icon size="1.5rem" color="accent" class="table__delete-btn"
                                    name="delete_outline" @click="deleteCondition(item.id)"/></td>
                        </tr>
                    </tbody>
                </q-markup-table>
                <div class="pagination">
                    <q-pagination v-model="pagination.page" gutter="md" color="white" size="18px" text-color="black"
                        active-text-color="white" active-color="accent"
                        :max="(conditionList.length / pagination.rowsPerPage) >= 1 ? conditionList.length / pagination.rowsPerPage : 1"
                        direction-links outline />
                </div>
            </q-card-section>
        </q-card>
        <AdvanceSearchDrawer 
            @hide-c-s-drawer="hideDrawer" 
            :actions-type="ActionsType.ADMIN"
            :isDrawer="isDrawer" 
            :rowId="rowId"
            from="saveCondition"
            :key="key"/>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
@import "src/css/animate-left-border.scss";

.table {
    &__column {}

    &__row {
        position: relative;

        &_name {
            text-decoration: underline;
            color: $main-purple;
            font-size: 1rem;
        }
    }

    &__btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__edit-btn {
        display: block;
        cursor: pointer;
        padding: 5px;
    }

    &__delete-btn {
        display: block;
        cursor: pointer;
        padding: 5px;
    }
}

.wrapper_animate_left_border_client::after {
    width: 1.5%;
    z-index: 11;
}

.title {
    color: $main-black;
    font-weight: bold;
    font-size: 1rem;
}

.form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 40%;

    &__input {
        min-height: 35px;
        border: 1px solid $main-black;
        flex: 0 1 60%;
        border-radius: 4px;
        padding: 1%;
    }

    &__input:focus {
        outline: none;
    }
}

.pagination {
    padding: 2% 2%;
}
</style>