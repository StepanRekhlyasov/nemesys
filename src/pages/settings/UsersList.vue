<template>
  <div class="text-caption text-weight-medium">
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('menu.users')" class="text-h5"></div>
        <q-btn color="white" text-color="black" to="/system/users/add">
          {{ $t('settings.users.addUser') }}
        </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
</script>
