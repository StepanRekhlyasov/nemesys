<template>
  <div class="q-pa-sm">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="breadcrumbs">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" ></q-icon>
        </template>
        <q-breadcrumbs-el :label="$t('settings.title')" class="link"></q-breadcrumbs-el>
        <q-breadcrumbs-el :label="$t('menu.organization')" @click="$router.push('/system/organization')" class="link"></q-breadcrumbs-el>
      </q-breadcrumbs>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'OrgainzationCreate',
  setup() {
    return {

    }
  }
}
</script>

<style>

</style>
