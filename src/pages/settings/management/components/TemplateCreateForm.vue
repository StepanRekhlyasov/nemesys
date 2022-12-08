<template>
  <q-card style="width: 1000px; max-width: 40vw" class="no-scroll">
    <q-form  @submit="addTemplate">
      <q-card-section>
        <span v-if="!editTemplate?.id">
          {{$t('settings.template.addNew')}}
        </span>
        <span v-if="editTemplate?.id">
          {{$t('settings.template.edit')}}
        </span>
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
              :disable="loading"
              name="name"
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
              v-model="templateData['type']"
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
              :disable="loading"
              name="subject"
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
              :disable="loading"
              name="contents"
              type="textarea"
              outlined
              dense
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="bg-white text-teal q-pb-md q-pr-md">
        <q-btn v-if="!editTemplate?.id" :label="$t('common.addNew')" color="primary" class="no-shadow" type="submit" :loading="loading"/>
        <q-btn v-if="editTemplate?.id" :label="$t('common.edit')" color="primary" class="no-shadow" :loading="loading" @click="saveTemplate"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { ref, SetupContext} from 'vue';
import { TemplateType } from 'src/shared/model/Template.model'
import { Alert } from 'src/shared/utils/Alert.utils';
import { addDoc, collection, doc, getFirestore, serverTimestamp, updateDoc } from '@firebase/firestore';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { getAuth } from '@firebase/auth';
import { getOrganizationId } from 'src/shared/utils/utils';

export default {
  name: 'TemplateCreateForm',
  props: {
    editTemplate: {
      type: Object,
      required: false
    }
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar();
    const auth = getAuth();

    const loading = ref(false);
    const templateData = ref(props.editTemplate || {});

    return {
      templateData,
      TemplateType,
      loading,

      async addTemplate() {
        loading.value = true;
        let data = JSON.parse(JSON.stringify(templateData.value));
        try {
          const active_organization_id = getOrganizationId($q);
          data['created_at'] = serverTimestamp();
          data['updated_at'] = serverTimestamp();
          data['created_user'] = auth.currentUser?.uid;
          data['deleted'] = false;
          const clientRef = collection(db, 'organization/'+active_organization_id+'/template/');
          await addDoc(clientRef, data);

          context.emit('closeDialog');
          Alert.success($q, t);
          loading.value = false;
        } catch {
          Alert.warning($q, t);
          loading.value = false;
        }
      },

      async saveTemplate() {
        loading.value = true;
        const data = templateData.value
        try {
            const active_organization_id = getOrganizationId($q);
            const boRef = doc(db, 'organization/'+active_organization_id+'/template/'+props.editTemplate?.id);
            await updateDoc(boRef, {
              updated_at: serverTimestamp(),
              contents: data.contents,
              name: data.name,
              subject: data.subject,
              type: data.type
            })

            context.emit('closeDialog');
            Alert.success($q, t);
            loading.value = false;
        } catch (e) {
          console.log(e)
          Alert.warning($q, t);
          loading.value = false;
        }
      }
    }
  }
}
</script>

<style>

</style>
