<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineEmits, onMounted, ref } from 'vue';
import TaskRegister from '../../Applicant/components/TaskRegister.vue';
import { ClientFactory } from 'src/shared/model';
import {evaluateAll} from '../utils/evaluateIndex'
const props =defineProps<{
  clientFactory: ClientFactory,
}>()
const emit = defineEmits<{

    (e: 'openFaxDrawer')
}>()
const openFaxDrawer = () =>{
    emit('openFaxDrawer')
}
const { t } = useI18n({ useScope: 'global' });
const openTaskRegister = ref(false)
const dispatchIndex = ref<number|'loading'>('loading')
const refarralIndex = ref<number|'loading'>('loading')
onMounted(async()=>{
    dispatchIndex.value = await evaluateAll(props.clientFactory,'dispatch')
    refarralIndex.value = await evaluateAll(props.clientFactory,'referral')
})
</script>

<template>
    <div class="info-footer row justify-between q-pa-lg">
            <div class="info-footer__column row items-center text-bold">
                <q-icon name="mdi-information-outline" size="1.5rem" color="primary" class="q-mr-sm"/>
                <div>
                    <p class="q-ma-none">{{ t('clientFactory.drawer.withMasterData') }}</p>
                    <p class="q-ma-none">{{ t('clientFactory.drawer.noAutoRenewal') }}</p>
                </div>
            </div>

            <div class="info-footer__column">
                <p class="row q-ma-none q-pt-sm">
                    <span class="info-footer__label q-mr-sm">
                        {{ t('clientFactory.drawer.situation') }}
                    </span>

                    <span class="info-footer__value">
                        TEST
                    </span>
                </p>
                <p class="row q-ma-none q-pt-sm">
                    <span class="info-footer__label q-mr-sm">
                        {{ t('clientFactory.drawer.contactTendency') }}
                    </span>

                    <span class="info-footer__value">
                        <span class="q-mr-sm">{{ t('clientFactory.drawer.morning') }} :</span>
                        <span class="q-mr-sm">test</span>
                        <span class="q-mr-sm">{{ t('clientFactory.drawer.afternoon') }} :</span>
                        <span class="q-mr-sm">test</span>
                        <span class="q-mr-sm">{{ t('clientFactory.drawer.evening') }} :</span>
                        <span>test</span>
                    </span>
                </p>
            </div>

            <div class="info-footer__column">
                <p class="row q-ma-none q-pt-sm">
                    <span class="info-footer__label q-mr-sm">
                        {{ t('clientFactory.drawer.dispatchIndex') }}
                    </span>

                    <span class="info-footer__value">
                        {{ dispatchIndex }}
                    </span>
                </p>

                <p class="row q-ma-none q-pt-sm">
                    <span class="info-footer__label q-mr-sm">
                        {{ t('clientFactory.drawer.referralMetrics') }}
                    </span>

                    <span class="info-footer__value">
                        {{ refarralIndex }}
                    </span>
                </p>
            </div>

            <div class="info-footer__column text-right">
                <div class="full-width">
                  <q-btn outline size="sm" :label="$t('task.taskRegister')" color="primary" @click="openTaskRegister = true" />
                </div>
                <div class="full-width">
                    <q-btn size="sm" outline color="primary" class="q-mt-sm" @click="openFaxDrawer" style="width: 5rem;">
                        FAX送信
                    </q-btn>
                </div>
            </div>
            <task-register
              :entity="'office'"
              :entityData="clientFactory"
              v-model="openTaskRegister"
              @closeDrawer="openTaskRegister=false"
            />
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";
.info-footer {
    padding: 1% 5%;
    color: $main-primary;

    &__column:nth-child(1) {
        flex: 1 1 20%;
    }

    &__column:nth-child(2) {
        flex: 1 1 50%;
    }

    &__column:nth-child(3) {
        flex: 1 1 15%;
    }

    &__column:nth-child(4) {
        flex: 1 1 15%;
    }

    &__label {
        font-size: 1rem;
    }

    &__value {
        color: $main-black;
        word-wrap: break-word;
    }
}
</style>
