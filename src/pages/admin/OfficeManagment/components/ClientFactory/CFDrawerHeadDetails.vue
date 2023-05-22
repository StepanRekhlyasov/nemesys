<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { defineProps, ref, watchEffect } from 'vue';
import DropDownEditGroup from 'src/components/buttons/DropDownEditGroup.vue';
import TwoColumnLayout from 'src/components/TwoColumnLayout.vue';
import EditableTwoColumnLayout, {Data} from 'src/components/EditableTwoColumnLayout.vue';
import { useHeadDetails, updateClientFactoryHangler } from '../../handlers/ClientFactory';
import { ClientFactory } from 'src/shared/model/ClientFactory.model';
import { RenderHeadDetails } from '../../types'

const { t } = useI18n({ useScope: 'global' });

const props = defineProps<{
    clientId: string
}>()

// const headDetails = ref<RenderHeadDetails>(useHeadDetails(props.clientFactory))
const isLoading = ref(false)

const isOpedEditDropDown = ref({
    headOfficeInfo: false,
    clientInfo: false,
    contractInfo: false
})

// const dataForUpdating = ref<Record<string, Data[]>>({
//     headOfficeInfo: headDetails.value.headOfficeInfo,
//     clientInfo: headDetails.value.clientInfo,
//     contractInfo: headDetails.value.contractInfo
// })

// const getNewDataToUpdate = (data: Data[], key: string) => {
//     dataForUpdating.value[key] = data
// }

// watchEffect(() => {
//     headDetails.value = useHeadDetails(props.clientFactory);
// });

</script>

<!-- <template>
    <DropDownEditGroup
    :label="t('clientFactory.drawer.headOfficeInfo')"
    :isEdit="isOpedEditDropDown.headOfficeInfo"
    :isLabelSquare="true"
    theme="accent"
    @openEdit="isOpedEditDropDown.headOfficeInfo = true"
    @closeEdit="isOpedEditDropDown.headOfficeInfo = false"
    @onSave="isOpedEditDropDown.headOfficeInfo = false; updateClientFactoryHangler(dataForUpdating.headOfficeInfo, clientFactory)">
        <TwoColumnLayout :data="headDetails.headOfficeInfo" theme="accent"
            v-if="!isOpedEditDropDown.headOfficeInfo"/>

        <EditableTwoColumnLayout v-else @data-changed="e => getNewDataToUpdate(e, 'headOfficeInfo')" :data="headDetails.headOfficeInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.clientInfo')"
    :isEdit="isOpedEditDropDown.clientInfo"
    :isLabelSquare="true"
    theme="accent"
    @openEdit="isOpedEditDropDown.clientInfo = true"
    @closeEdit="isOpedEditDropDown.clientInfo = false"
    @onSave="isOpedEditDropDown.clientInfo = false; updateClientFactoryHangler(dataForUpdating.clientInfo, clientFactory)">
        <TwoColumnLayout :data="headDetails.clientInfo" theme="accent"
            v-if="!isOpedEditDropDown.clientInfo"/>

        <EditableTwoColumnLayout v-else @data-changed="e => getNewDataToUpdate(e, 'clientInfo')" :data="headDetails.clientInfo" theme="accent"/>
    </DropDownEditGroup>

    <DropDownEditGroup
    :label="t('clientFactory.drawer.contractInfo')"
    :isEdit="isOpedEditDropDown.contractInfo"
    :isLabelSquare="true"
    theme="accent"
    @openEdit="isOpedEditDropDown.contractInfo = true"
    @closeEdit="isOpedEditDropDown.contractInfo = false"
    @onSave="isOpedEditDropDown.contractInfo = false; updateClientFactoryHangler(dataForUpdating.contractInfo, clientFactory)">
        <TwoColumnLayout :data="headDetails.contractInfo" theme="accent"
            v-if="!isOpedEditDropDown.contractInfo"/>

        <EditableTwoColumnLayout v-else @data-changed="e => getNewDataToUpdate(e, 'contractInfo')" :data="headDetails.contractInfo" theme="accent"/>
    </DropDownEditGroup>
</template> -->

<style lang="scss" scoped>

</style>