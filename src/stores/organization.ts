import { defineStore } from 'pinia';
import { Organization } from 'src/shared/model';
import { computed, ref, watch } from 'vue';

interface OrganizationState {
  organizations: Organization[],
  activeOrganization: number,
}

const organization = 'organization'

export const useOrganization = defineStore('organization', () => {

  const state = ref<OrganizationState>({
    organizations: [],
    activeOrganization: 0,
  })

  const currentOrganizationId = computed(()=>{
    return  state.value.organizations[state.value.activeOrganization].id
  })

  const storage = localStorage.getItem(organization)

  if (storage) {
    state.value = JSON.parse(storage)
  }

  watch(state, (stateVal) => {
    localStorage.setItem(organization, JSON.stringify(stateVal))
  },
    { deep: true }
  )

  return { state, currentOrganizationId }
})
