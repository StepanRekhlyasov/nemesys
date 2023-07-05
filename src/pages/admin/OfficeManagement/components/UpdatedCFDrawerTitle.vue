<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

import { ClientFactory } from 'src/shared/model/ClientFactory.model';

const { t } = useI18n({ useScope: 'global' });
defineProps<{
    clientFactory: ClientFactory,
}>();

const emit = defineEmits<{
    (e: 'importHandle')
}>()

const importHandle = () => {
    emit('importHandle')
}

</script>

<template>
    <div class="wrapper q-ml-md row justify-between items-center">
        <div>
            {{ clientFactory.client?.representativeName }}

            <div class="text-bold text-h5">
                {{ clientFactory.name }}
            </div>
        </div>

        <div class="text-bold text-h5 text-right">
            {{ clientFactory.client?.companyProfile }}

            <div>
                <q-btn
                    class="bg-white"
                    text-color="accent"
                    dense padding="xs md" size="sm"
                    @click="importHandle">
                    <q-icon name="mdi-tray-arrow-down" color="accent" size="xs" left/>
                    {{ t('common.capture') }}
                </q-btn>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    flex: 1 1 90%;
    height: 4rem;
}
</style>