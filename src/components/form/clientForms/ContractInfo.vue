<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps, withDefaults } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: {[key: string]: any } | undefined
    theme?: string
}>(), {
    theme: 'primary',
})

const emit = defineEmits(['update:modelValue']);

const clientData = reactive({ ...props.modelValue });

watch(clientData, () => {
    emit('update:modelValue', clientData);
}, { deep: true });

</script>

<template>
    <q-item>
        <q-item-section>
            <div class="row q-pt-sm">
                <div class="col-6 q-pr-sm">
                    <q-checkbox size="xs" v-model="clientData['conclusionDispatchContract']"
                        :color="`${theme}`"
                        :label="t('client.add.conclusionDispatchContract')" />
            </div>
            <div class="col-6 q-pl-sm">
                <q-checkbox size="xs" v-model="clientData['conclusionReferralContract']" :color="`${theme}`"
                        :label="t('client.add.conclusionReferralContract')" />
                </div>
            </div>

        </q-item-section>
    </q-item>

    <q-item>
        <q-item-section>
            <q-item-label class="q-pb-xs">
                {{t('office.contractInfo')}}
            </q-item-label>
            <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contractUnit') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientData['contractUnit']" />
                </div>
                <div class="col-6 q-pl-sm q-pt-lg">
                    <q-checkbox size="xs" v-model="clientData['conclusionContract']" :color="`${theme}`"
                        :label="t('client.list.presenceContract')" />
                </div>
                </div>
                <div class="row q-mt-sm">
                    <div class="col-6">
                      <q-item-label class="q-pb-xs">
                        {{ t('client.add.contractor') }} : TEL
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['personInChargeTel']"
                        :placeholder="t('client.add.phoneLabel')" />
                    </div>
                    <div class="col-6 q-pl-sm">
                      <q-item-label class="q-pb-xs">
                        {{ t('client.add.contractor') }} : FAX
                      </q-item-label>
                      <q-input outlined dense v-model="clientData['personInChargeFax']"
                        :placeholder="t('client.add.phoneLabel')" />
                    </div>
                </div>
                <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contractor') }} : MAIL
                    </q-item-label>
                    <q-input outlined dense v-model="clientData['personInChargeMail']"
                        :placeholder="t('client.add.emailLabel1') + '@' + t('client.add.emailLabel2')" />
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contractor') }} : {{ t('client.list.personIncharge') }}
                    </q-item-label>
                    <q-input outlined dense v-model="clientData['personInCharge']"
                        :placeholder="t('client.add.managerLabel')" />
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>