<template>
  <q-btn-dropdown :label="branchList[activeBranch]?.label" flat color="black">
    <q-list>
      <q-item clickable v-close-popup v-for="item in branchList" :key="item.value" @click="switchBranch(item.value)"
        :active="item.value === activeBranchId" active-class="active">
        <q-item-section>
          <q-item-label>{{ 'label' in item ? item['label'] : '' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useOrganization } from 'src/stores/organization';
import { useI18n } from 'vue-i18n';
import { useBudget } from 'src/stores/budgetData';
import { OptionData, SelectOption } from '../type/budget'
import { watchCurrentOrganization } from 'src/shared/hooks/WatchCurrentOrganization';
const emit = defineEmits<{ (e: 'getBranchId', branchId: string) }>()

const budgetStore = useBudget();

const { t } = useI18n({ useScope: 'global' });
const organization = useOrganization()
const activeBranch = ref(0);
const activeBranchId = ref('');
const intialBranch = { value: '', label: t('common.all') }
const branchList = ref<SelectOption[]>([]);

const options = ref<OptionData>({ occupation: [] });

onMounted(async () => {
  options.value = await budgetStore.getOptionData(organization.currentOrganizationId);
  branchList.value = [intialBranch, ...options.value['branch']]
});


const switchBranch = (branchId: string) => {
  branchList.value.forEach((org, index) => {
    if (org.value == branchId) {
      activeBranch.value = index;
      activeBranchId.value = branchId;
    }
  })
}

watch(() => activeBranchId.value, (newValue) => {
  emit('getBranchId', newValue)
})

watchCurrentOrganization(async (currentOrganizationId) => {
  options.value = await budgetStore.getOptionData(currentOrganizationId);
  branchList.value = [intialBranch, ...options.value['branch']]
  activeBranchId.value = ''
  activeBranch.value = 0

})

</script>

<style lang="scss" scoped>
.active {
  background-color: $grey-3;
}
</style>
