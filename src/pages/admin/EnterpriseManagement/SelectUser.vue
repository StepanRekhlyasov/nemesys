<template>
  <q-select color="accent" :options="options" option-label='displayName' :model-value="props.modelValue"
    @filter="(_, doneFn) => filterFn(doneFn, organizationId)"
    @update:model-value="(user: User) => { emit('onUserChange', user); }" outlined dense :rules="[
        (val: User | string) => {
          if (typeof val == 'string') {
            return val.length > 0 || ''
          }
          return val?.name && val?.name?.length > 0 || ''
        }]" />
</template>

<script setup lang="ts">
import { QSelect, QSelectProps } from 'quasar';
import { User } from 'src/shared/model';
import { useUserStore } from 'src/stores/user';

import { ref } from 'vue';

interface SelectOrganozationProps extends QSelectProps {
  organizationId?: string;
}
const props = defineProps<SelectOrganozationProps>()
const options = ref<User[]>();
const emit = defineEmits<{ (e: 'onUserChange', id: User) }>()

const userStore = useUserStore()

async function getUsers(id?: string) {
  const users = await userStore.getAllUsers(id)
  if (!users || !users.length) {
    return
  }
  return users
}

async function filterFn(update, id?: string) {

  if (options.value) {
    update()
    return
  }

  const users = await getUsers(id)
  if (!users || !users.length) {
    return
  }
  update(() => {
    options.value = users
  })

}

</script>

