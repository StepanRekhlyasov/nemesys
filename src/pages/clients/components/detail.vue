<template>
    <q-card>
        <q-tabs v-model="tab" dense class="bg-grey-3 text-primary" active-color="primary" indicator-color="primary"
            align="left" narrow-indicator active-bg-color="white">
            <q-tab name="teleAppointHistory" :label="$t('client.tele.teleAppointHistory')" />
            <q-tab name="listBO" :label="$t('client.list.listBO')" />
            <q-tab name="officeDetail" :label="$t('client.list.officeDetail')" />
            <q-tab name="variousAchievements" :label="$t('client.list.variousAchievements')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="teleAppointHistory">
                <div class="text-h6"> {{ $t('client.tele.teleAppointHistory') }}</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="listBO">
                <div class="text-h6"> {{$t('client.list.listBO')}} </div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="officeDetail">
                <div class="text-h6">{{ $t('client.list.officeDetail') }}</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="variousAchievements">
                <div class="text-h6">{{ $t('client.list.variousAchievements') }}</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>
        </q-tab-panels>
    </q-card>
</template>



<script>
//import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

export default {
  name: 'clientDetails',
  components: {
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