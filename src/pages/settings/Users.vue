<template>
  <div class="branches-page text-caption text-weight-medium">
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('menu.users')" class="text-h5"></div>
        <q-btn color="white" text-color="black">
          {{ $t('settings.branch.addBranch') }}
        </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'UsersPage',
};
</script>

<!-- <style lang="scss">
@import '../../css/app.scss';
.branches-page {
  .text-h5 {
    color: $muted-color;
  }
}
</style> -->
