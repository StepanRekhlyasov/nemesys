<template>
  <q-btn-dropdown v-if="state.organizations && (state.activeOrganization || state.activeOrganization === 0)"
    :label="state.organizations[state.activeOrganization]?.name" flat color="black">
    <q-list>
      <q-item clickable v-close-popup v-for="item in state.organizations" :key="item.code"
        @click="switchOrganization(item.id)" :active="item.id === currentOrganizationId" active-class="active">
        <q-item-section>
          <q-item-label>{{ 'name' in item ? item['name'] : '' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useOrganization } from 'src/stores/organization'
import { storeToRefs } from 'pinia';

const organization = useOrganization()
const { state, currentOrganizationId } = storeToRefs(organization)

const switchOrganization = (organizationId: string) => {
  const organizations = state.value.organizations
  if (!organizations.length) {
    return
  }
  state.value.organizations.forEach((org, index) => {
    if (org.id == organizationId) {
      state.value.activeOrganization = index;
    }
  })
}
</script>

<style lang="scss" scoped>
.active {
  background-color: $grey-3;
}
</style>
