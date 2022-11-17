<template>
  <q-tabs
    v-model="tab"
    dense
    class="bg-grey-3 text-primary new tabs"
    active-color="primary"
    indicator-color="primary"
    :breakpoint="0"
    align="justify"
    narrow-indicator
    inline-label
    switch-indicator
    active-bg-color="white">
      <q-tab name="teleAppointHistory" class="col-2 q-pa-none" :label="$t('client.tele.teleAppointHistory')" />
      <q-tab name="officeDetail" class="col-2  q-pa-none"  :label="$t('client.list.officeDetail')" />
      <q-tab name="listBO" class="col-2  q-pa-none"  :label="$t('client.list.listBO')" />
      <q-tab name="officeHead" class="col-2 q-pa-none"  :label="$t('client.list.officeHead')" />
      <q-tab name="variousAchievements" class="col-2 q-pa-none"  :label="$t('client.list.variousAchievements')" />
      <q-tab name="memo" class="col-2 q-pa-none"  :label="$t('client.list.memo')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="teleAppointHistory" class="q-pa-none">
        <teleAppointHistory :client="client" />
      </q-tab-panel>

    <q-tab-panel name="officeDetail">
      <officeDetail :client="client" />
    </q-tab-panel>

      <q-tab-panel name="listBO" class="q-pa-none">
        <backOrder />
      </q-tab-panel>

      <q-tab-panel name="officeHead">
          <div class="text-h6">{{ $t('client.list.officeHead') }}</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="variousAchievements">
          <div class="text-h6">{{ $t('client.list.variousAchievements') }}</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="memo" class="q-pa-none">
        <memo :client="client" />
      </q-tab-panel>
  </q-tab-panels>
</template>



<script>
//import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import teleAppointHistory from 'src/components/detal/TeleAppointHistory.vue';
import backOrder from 'src/components/detal/BackOrder.vue';
import memo from 'src/components/detal/Memo.vue';
import officeDetail from 'src/components/detal/officeDetail.vue';

export default {
  name: 'clientDetails',
  components: {
    teleAppointHistory,
    backOrder,
    memo,
    officeDetail
  },
  props: {
    client: {
      required: true
    }
  },
  setup() {
    //const { t } = useI18n({ useScope: 'global' });

    const tab = ref('teleAppointHistory');


    return {
      tab,
    };
  },
};
</script>
