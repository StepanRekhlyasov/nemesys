<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed, defineEmits, onMounted, ref } from 'vue';
import TaskRegister from '../../Applicant/components/TaskRegister.vue';
import { ClientFactory } from 'src/shared/model';

const props = defineProps<{
  clientFactory: ClientFactory,
}>()
const emit = defineEmits<{
    (e: 'openFaxDrawer')
}>()
const openFaxDrawer = () =>{
    emit('openFaxDrawer')
}
const situation = ref<number | undefined>()

onMounted(()=>{
  const situationUpdated = ref<number | undefined>()
  situationUpdated.value = props.clientFactory.offerRate;
  if(situationUpdated.value){
    situationUpdated.value += props.clientFactory.avgWorkLength;
  }
  situationUpdated.value = Number((situationUpdated.value)?.toFixed(2));
  situation.value = situationUpdated.value
})

const { t } = useI18n({ useScope: 'global' });
const openTaskRegister = ref(false)
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
                    <span v-if="situation" class="info-footer__value q-mr-sm">
                      <q-icon v-if="situation>=90" size="1.5em" name="mdi-emoticon-excited" color="green"></q-icon>
                      <q-icon v-if="situation<90 && situation>=80"
                       size="1.5em" name="mdi-emoticon-happy" color="light-green"></q-icon>
                      <q-icon v-if="situation<80 && situation>=70"
                      size="1.5em" name="mdi-emoticon-neutral" color="yellow-8"></q-icon>
                      <q-icon v-if="situation<70 && situation>=60"
                      size="1.5em" name="mdi-emoticon-wink" color="yellow-10"></q-icon>
                      <q-icon v-if="situation<60 && situation>=50"
                      size="1.5em" name="mdi-emoticon-sad" color="amber-10"></q-icon>
                      <q-icon v-if="situation<50"
                      size="1.5em" name="mdi-emoticon-angry" color="red"></q-icon>
                    </span>
                    <span v-else class="info-footer__value q-mr-sm">-</span>
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
                        TEST
                    </span>
                </p>

                <p class="row q-ma-none q-pt-sm">
                    <span class="info-footer__label q-mr-sm">
                        {{ t('clientFactory.drawer.referralMetrics') }}
                    </span>

                    <span class="info-footer__value">
                        TEST
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
