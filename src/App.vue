<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useSession } from 'src/stores/session'

export default defineComponent({
  name: 'App'
})
</script>


<script setup lang="ts">
const sessionStore = useSession()

onMounted(() => {
  if (!auth.currentUser) {
    return
  }
  sessionStore.trackSession(auth.currentUser.uid)
})

onBeforeUnmount(() => {
  sessionStore.unsubscribeSnapshot?.()
  unsunscribeAuth()
})
const auth = getAuth();


const unsunscribeAuth = onAuthStateChanged(auth, async (user) => {
  try {
    if (!user) {
      sessionStore.unsubscribeSnapshot?.()
      return
    }
    await sessionStore.checkSession(user.uid)
    sessionStore.trackSession(user.uid)
  } catch (error) {
    console.log(error);
    await sessionStore.logOut()
  }
})

</script>
