<script lang="ts" setup>
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
const props = defineProps<{
    selectedItem: ClientFactory
}>();

</script>

<template>
    <div>
        <div class="label q-pa-lg">
            <div class="row justify-between items-center">
                <div class="subtitle row justify-between items-center">
                    <div class="square"></div>
                    {{ t('client.add.officeInfo')}}
                </div>
                <q-btn text-color="accent" dense padding="xs md">
                    <q-icon name="edit" color="accent" size="xs" left/>
                    {{ t('common.edit') }}
                </q-btn>
            </div>

            <div class="info-container">
                <div class="row justify-between items-center">
                    <div>
                        <div class="info-container__label q-mt-md row items-center">
                            <span class="q-mx-md">事業所MAIL</span>
                            <span class="info-container__data">{{ props.selectedItem.mail }}</span>
                        </div>
                        <div class="info-container__label q-mt-md row items-center">
                            <span class="q-mx-md">{{ t('clientFactory.numberEmployees') }}</span>
                            <span class="info-container__data">{{ props.selectedItem.numberEmployees }}</span>
                        </div>
                        <div class="info-container__label q-mt-md row">
                            <span class="q-mx-md">{{ t('clientFactory.facilityType') }}</span>
                            <div class="column">
                                <span v-for="facility in props.selectedItem.facilityType" :key="facility" class="info-container__data">{{ facility }}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="info-container__label q-mt-md row items-center">
                            <span class="q-mx-md">{{ t('clientFactory.homePage') }}</span>
                            <a class="link" :href="props.selectedItem.homepageUrl" target="_blank">{{ props.selectedItem.homepageUrl }}</a>
                        </div>
                        <div class="info-container__label q-mt-md row items-center">
                            <span class="q-mx-md">{{ t('clientFactory.conclusionDispatchContract') }}</span>
                            <q-icon color="black" :name="props.selectedItem.isSignedDispatchContract ? 'circle' : 'mdi-close'"/>
                        </div>
                        <div class="info-container__label q-mt-md row items-center">
                            <span class="q-mx-md">{{ t('clientFactory.conclusionReferralContract') }}</span>
                            <q-icon color="black" :name="props.selectedItem.isSignedReferralContract ? 'circle' : 'mdi-close'" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="row justify-between q-mt-md items-center">
                <div class="subtitle row justify-between items-center">
                    <div class="square"></div>
                    {{ t('client.add.contactInfo') }}
                </div>
                <q-btn text-color="accent" dense padding="xs md">
                    <q-icon name="edit" color="accent" size="xs" left/>
                    {{ t('common.edit') }}
                </q-btn>
            </div>


            <div class="info-container">
                <div class="row justify-between items-center">
                    <div>
                        <div class="info-container__label q-mt-md">
                            <span class="q-mx-md">{{ t('clientFactory.namePersonInCharge') }}</span>
                            <span class="info-container__data">{{ props.selectedItem.nameContact }}</span>
                        </div>
                        <div class="info-container__label q-mt-md">
                            <span class="q-mx-md">担当者TEL</span>
                            <span class="info-container__data">{{ props.selectedItem.telContact }}</span>
                        </div>
                    </div>
                    <div>
                        <div class="info-container__label q-mt-md">
                            <span class="q-mx-md">{{ t('clientFactory.personInChargeTitle') }}</span>
                            <span class="info-container__data">{{ props.selectedItem.positionContact }}</span>
                        </div>
                        <div class="info-container__label q-mt-md">
                            <span class="q-mx-md">担当者MAIL</span>
                            <span class="info-container__data">{{ props.selectedItem.mailContact }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <q-separator color="bg-grey-3 q-mt-md"></q-separator>

        <div class="info-footer column justify-between q-pa-lg">
            <div class="info-footer__row row justify-between items-center">
                <div class="info-container__label">
                    <span class="q-mx-md">{{ t('clientFactory.masterData') }}</span>
                    <span class="info-container__data q-mr-xs">{{ t('office.office') }}</span>
                    <span class="text-bold q-mr-md">{{ props.selectedItem.existingOfficeFlag ? ': ✓' : ': なし' }}</span>
                    <span class="info-container__data q-mr-xs">{{ t('client.list.client') }}</span>
                    <span class="text-bold">{{ props.selectedItem.clientFlag ? ': ✓' : ': なし' }}</span>
                </div>
                <div class="info-footer__actions-column row justify-between items-center">
                    <div class="info-container__label">{{ t('clientFactory.lastReflected') }}</div>
                    <div class="row justify-between items-center">
                        <div class="circle q-mx-md"></div>
                        <q-btn text-color="accent" dense padding="xs md">
                            <q-icon name="mdi-tray-arrow-up" color="accent" size="xs" left/>
                            {{ t('common.reflect') }}
                        </q-btn>
                    </div>
                </div>
            </div>
 
            <div class="info-footer__row row justify-between items-center q-mt-lg">
                <div class="info-container__label">
                    <span class="q-mx-md">{{ t('clientFactory.changeBasicInformation') }}</span>
                    <span class="text-bold">{{ props.selectedItem.basicInfoChangingFlag ? '✓' : 'なし' }}</span>
                </div>
                <div class="info-footer__actions-column row justify-between items-center ">
                    <div class="info-container__label">
                        <span class="q-mx-md">{{ t('clientFactory.lastCaptured') }}</span>
                        <span>{{}}</span>
                    </div>
                    <div class="row justify-between items-center">
                        <div class="circle q-mx-md"></div>
                        <q-btn text-color="accent" dense padding="xs md">
                            <q-icon name="mdi-tray-arrow-down" color="accent" size="xs" left/>
                            {{ t('common.capture') }}
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "src/css/imports/colors";

.label {
    max-width: 90%;
    margin: auto;
}

.link {
    color: #2196F3;
    text-decoration-line: underline;
    cursor: pointer;
}

.info-container {
    max-width: 85%;
    margin: auto;

    &__label {
        color: $main-purple;
    }

    &__data {
        color: #222222;
    }
}

.info-footer {
    max-width: 90%;
    margin: auto;

    &__actions-column {
        flex: 0 1 50%;
    }

}

.circle {
    height: 10px;
    width: 10px;
    border-radius:50%;
    border: 1px solid $main-purple;
}

.square {
    height: 12px;
    width: 12px;
    background-color: $main-purple;
}
.subtitle {
    color: $main-purple;
    font-size: 1rem;
    font-weight: bold;
}
</style>