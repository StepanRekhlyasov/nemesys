<template>
  <q-card style="width: 1000px; max-width: 40vw" class="no-scroll">
    <q-form  @submit="addTemplate">
      <q-card-section>
        {{$t('settings.template.addNew')}}
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pb-none">
        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm  q-pt-sm">
            {{ $t('settings.template.name') }}
          </div>
          <div class="col-9 q-pl-sm ">
            <q-input
              v-model="templateData['name']"
              :rules="[val => !!val || $t('form.required') ]"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right self-center q-pr-sm">
            {{ $t('client.backOrder.reqQualification') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-radio
              v-for="key in TemplateType"
              v-model="templateData['types']"
              :label="$t('settings.template.'+key)"
              :disable="loading"
              :val="key"
              :key="key"
              class="q-pr-md"/>
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm q-pt-sm">
            {{ $t('settings.template.subject') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input
              v-model="templateData['subject']"
              :rules="[val => !!val || $t('form.required') ]"
              :disable="loading"
              outlined
              dense
            />
          </div>
        </div>

        <div class="row q-pb-sm">
          <div class="col-3 text-right q-pr-sm q-pt-sm">
            {{ $t('settings.template.contents') }}
          </div>
          <div class="col-9 q-pl-sm">
            <q-input
              v-model="templateData['contents']"
              :rules="[val => !!val || $t('form.required') ]"
              :disable="loading"
              type="textarea"
              outlined
              dense
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { ref, SetupContext} from 'vue';
import { TemplateType } from 'src/shared/model/Template.model'
import { Alert } from 'src/shared/utils/Alert.utils';
import { addDoc, collection, getFirestore, serverTimestamp } from '@firebase/firestore';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export default {
  name: 'TemplateCreateForm',
  setup(_, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();

    const loading = ref(false);
    const templateData = ref({});

    return {
      templateData,
      TemplateType,
      loading,

      async addTemplate() {
        loading.value = true;
        let data = JSON.parse(JSON.stringify(templateData.value));
        data['created_at'] = serverTimestamp();
        data['updated_at'] = serverTimestamp();
        data['deleted'] = false;
        try {
          const clientRef = collection(db, 'templates/');
          await addDoc(clientRef, data);

          context.emit('closeDialog');
          Alert.success($q, t);
          loading.value = false;
        } catch {
          Alert.success($q, t);
          loading.value = false;
        }
      }
    }
  }
}
</script>

<style>

</style>
