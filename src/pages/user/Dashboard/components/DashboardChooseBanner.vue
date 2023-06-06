<template> 
  <q-popup-proxy
    :offset="offset"
    class="dashboardPopup"
  >
    <q-banner>
      <div class="title">{{ $t('common.select') }}</div>
      <router-link :to="link" class="applicant-link myLink">
        {{ $t('dashboard.showWhiteboard') }}
      </router-link>
      <q-btn 
        class="myLink" 
        unelevated 
        square 
        :padding="'0px'" 
        :label="$t('dashboard.showList')" 
        v-close-popup
        @click="emit('openPreview')"
      />
    </q-banner>
  </q-popup-proxy>
</template>
<script setup lang="ts">
defineProps<{
  link: string,
  offset?: number[]
}>()
const emit = defineEmits(['openPreview'])
</script>
<style lang="scss" scoped>
.q-btn:before{
  border-bottom: none;
  box-shadow: none;
}
.dashboardPopup {
  .q-banner {
    padding: 0;
  }
  .myLink{
    font-size: 25px;
    line-height: 30px;
    color: $primary;
    display: block;
    margin: 20px 10px;
    white-space: nowrap;
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
    .q-focus-helper{
      background: none;
    }
  }
  .title{
    background-color: $primary;
    color: #fff;
    padding: 10px;
    font-size: 25px;
  }
}
</style>