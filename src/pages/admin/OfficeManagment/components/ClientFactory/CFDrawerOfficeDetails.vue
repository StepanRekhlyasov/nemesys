<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, watchEffect, ref } from 'vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import TwoColumnLayout from 'src/components/TwoColumnLayout.vue';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { useOfficeDetails } from '../../handlers/ClientFactory';
import {RenderOfficeDetails} from '../../types'

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory
}>()

const officeDetails = ref<RenderOfficeDetails>(useOfficeDetails(props.clientFactory))

watchEffect(() => {
    officeDetails.value = useOfficeDetails(props.clientFactory);
});

</script>

<template>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.registeredInformation')"
    theme="accent"
    :isEdit="false"
    :isLabelSquare="true">
        <TwoColumnLayout :data="officeDetails.registeredInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.commonItems')"
    theme="accent"
    :isEdit="false"
    :isLabelSquare="true">
        <TwoColumnLayout :data="officeDetails.commonItems" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.uniqueItems')"
    theme="accent"
    :isEdit="false"
    :isLabelSquare="true">
        <TwoColumnLayout :data="officeDetails.uniqueItems" theme="accent"/>
    </DropDownEditGroup>
</template>

<style lang="scss" scoped>
</style>