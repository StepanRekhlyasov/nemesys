<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { reactive, watch, defineEmits, defineProps, withDefaults } from 'vue';
const { t } = useI18n({ useScope: 'global' });

const props = withDefaults(defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modelValue: Record<string, any>
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
            <q-item-label class="q-pb-xs">
                {{t('client.add.contactInformation')}}
            </q-item-label>

            
            <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contactPersonName') }}
                    </q-item-label>

                    <q-input
                        :color="theme"
                        outlined dense
                        v-model="clientData['contactPersonName']"
                        :placeholder="t('client.add.managerLabel')"
                        :rules="[val => (val === '' || (val && val.trim().length > 0)) || true]"/>
                </div>
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contactPersonTel') }}
                    </q-item-label>

                    <q-input
                        :color="theme"
                        outlined dense
                        v-model="clientData['contactPersonTel']"
                        :placeholder="t('client.add.phoneLabel')"
                        :rules="[val => (val === '' || (val && val.trim().length > 0)) || true]"/>
                </div>
            </div>

            <div class="row q-mt-sm">
                <div class="col-6">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contactPersonTitle') }}
                    </q-item-label>

                <q-input
                    :color="theme"
                    outlined dense
                    v-model="clientData['contactPersonTitle']"
                    :placeholder="t('client.add.regularEmployee')"
                    :rules="[val => (val === '' || (val && val.trim().length > 0)) || true]"/>
                </div>
                
                <div class="col-6 q-pl-sm">
                    <q-item-label class="q-pb-xs">
                        {{ t('client.add.contactPersonMail') }}
                    </q-item-label>

                    <q-input
                        :color="theme"
                        outlined dense
                        v-model="clientData['contactPersonMail']"
                        :placeholder="t('client.add.emailLabel1') + '@' + t('client.add.emailLabel2')"
                        :rules="[val => (val === '' || /.+@.+\..+/.test(val)) || true]"/>
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>