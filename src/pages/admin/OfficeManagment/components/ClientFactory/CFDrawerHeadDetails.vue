<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect } from 'vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import TwoColumnLayout from 'src/components/TwoColumnLayout.vue';
import { useHeadDetails } from '../../handlers/ClientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from '../../types'

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientFactory: ClientFactory
}>()

const headDetails = ref<RenderHeadDetails>(useHeadDetails(props.clientFactory))

watchEffect(() => {
    headDetails.value = useHeadDetails(props.clientFactory);
});

</script>

<template>
    <DropDownEditGroup
    :label="t('clientFactory.drawer.headOfficeInfo')"
    :isEdit="false"
    :isLabelSquare="true"
    theme="accent">
        <TwoColumnLayout :data="headDetails.headOfficeInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.clientInfo')"
    :isEdit="false"
    :isLabelSquare="true"
    theme="accent">
        <TwoColumnLayout :data="headDetails.clientInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.contractInfo')"
    :isEdit="false"
    :isLabelSquare="true"
    theme="accent">
        <TwoColumnLayout :data="headDetails.contractInfo" theme="accent"/>
    </DropDownEditGroup>
</template>

<style lang="scss" scoped>

</style>