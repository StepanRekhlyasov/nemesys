<template>
  <q-select color="accent" :options="options" option-label='displayName' :model-value="props.modelValue"
    @filter="(_, doneFn) => filterFn(doneFn, organizationId)"
    @update:model-value="(user: User) => {emit('onUserChange', user); }" />
</template>

<script setup lang="ts">
import { getFirestore } from '@firebase/firestore';
import { QSelect, QSelectProps } from 'quasar';
import { User } from 'src/shared/model';
import { getAllUsers } from 'src/shared/utils/User.utils';
import { ref } from 'vue';

interface SelectOrganozationProps extends QSelectProps {
  organizationId: string;
}
const props = defineProps<SelectOrganozationProps>()
const db = getFirestore();
const options = ref<User[]>();
const emit = defineEmits<{ (e: 'onUserChange', id: User) }>()

async function getAllUsersInOrganization(id: string) {
  const users = await getAllUsers(db, id)
  if (!users || !users.length) {
    return
  }
  return users.map((user) => user)
}

async function filterFn(update, id) {

  if (options.value) {
    update()
    return
  }

  const users = await getAllUsersInOrganization(id)
  if (!users || !users.length) {
    return
  }
  update(() => {
    options.value = users
  })

}

</script>

