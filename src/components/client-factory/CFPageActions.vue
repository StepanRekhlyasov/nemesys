<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineEmits, defineProps, withDefaults } from 'vue';
import {ActionsType} from './types'
import { useRouter } from 'vue-router';
const { t } = useI18n({ useScope: 'global' });
const router = useRouter()
const props = withDefaults(defineProps<{
    isReset:boolean
    actionsType?: ActionsType
    theme?: string
}>(), {
    actionsType: ActionsType.CLIENT,
    theme: 'primary'
})

const emit = defineEmits<{
    (e: 'openClientDrawer'),
    (e: 'openClientFactoryDrawer'),
    (e:'openFaxDrawer')
    (e:'resetSelectedId')
}>()

const resetSelectedCFsId = () =>{
    emit('resetSelectedId')
}

const openNewClientDrawer = () => {
    emit('openClientDrawer')
}

const openNewClientFactoryDrawer = () => {
    emit('openClientFactoryDrawer')
}
const openNewFaxDrawer=()=>{
  emit('openFaxDrawer')
}
const changeRoute = ()=>{
    if(props.actionsType === ActionsType.ADMIN){
        router.push('/admin/officeSearch')
    }
    else{
        router.push('/officeSearch')
    }
}
</script>

<template>
    <q-card-section class="bg-white">
        <div class="row items-center justify-between">
            <div v-if="actionsType === ActionsType.ADMIN" class="text-subtitle1">
                {{ t('common.searchCondition') }} /
                {{ t('common.area') }} :
                {{ t('common.aroundTokio') }},
                {{ t('common.detailedConditions') }}
            </div>

            <div v-else class="text-subtitle1">
                <div class="text-subtitle2">検索条件 / 東京都全域, 今の時間帯のテレアポ接電率:高い</div>
            </div>

            <div>
                <a :class="`action_link text-${theme}`" @click="openNewClientDrawer">
                    {{ t('actions.clickToAddNewClient') }}
                </a>
            </div>
        </div>

        <div class="row items-center justify-between q-mt-sm">
            <div v-if="actionsType === ActionsType.ADMIN">
                <q-btn class="action_btn" :color="theme" @click="changeRoute">
                    {{ t('actions.searchConditionChange') }}
                </q-btn>
                <q-btn class="q-ml-sm" @click="resetSelectedCFsId" :label="t('client.list.resetConditions')" v-if="props.isReset" :color="theme"/>
            </div>
            <div v-else>
                <div class="row q-mt-xs">
                    <!-- <div class="q-gutter-md" style="max-width: 150px">
                        <q-select outlined dense class="bg-white" model-value="Test">
                            <template v-slot:prepend>
                                <q-icon name="filter_alt" color="primary" />
                            </template>
                        </q-select>
                    </div>

                    <div class="q-gutter-md q-ml-sm" style="max-width: 250px">
                        <q-select outlined dense class="bg-white" model-value="Test">

                        </q-select>
                    </div> -->
                    <div class="q-gutter-md">
                        <q-btn outline color="primary" :label="t('actions.changeSearchCriteria')" @click="changeRoute"></q-btn>
                    </div>
                    <div class="q-gutter-md q-ml-sm">
                      <q-btn class="action_btn"  @click="openNewFaxDrawer" :color="theme"> {{ t('actions.faxBatchTransmission') }}</q-btn>
                    </div>
                    <div class="q-gutter-md q-ml-sm">
                        <q-btn @click="resetSelectedCFsId" :label="t('client.list.resetConditions')" v-if="props.isReset" :color="theme"/>
                    </div>
                </div>
            </div> 

            <q-btn icon="add" class="action_btn" @click="openNewClientFactoryDrawer" :color="theme">
                {{ t('menu.addOffice') }}
            </q-btn>
        </div>
    </q-card-section>
</template>

<style lang="scss" scoped>
.action_btn {
    color: white;
    font-weight: bold;
}
.action_link {
    text-decoration: underline;
    line-height: 14px;
    cursor: pointer;
}
</style>
