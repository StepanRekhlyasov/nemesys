<template>
  <q-card-section>
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('menu.users')" class="text-h5"></div>
        <q-btn color="white" text-color="black" to="/system/users/add">
          {{ $t('settings.users.contactPersonName') }}
        </q-btn>
      </div>
  </q-card>
  </q-card-section>
  <q-separator />
  <q-card-section>

  </q-card-section>
</template>

<script>
export default {
  name: 'SystemSettings',

}
</script>

<style>

</style>
