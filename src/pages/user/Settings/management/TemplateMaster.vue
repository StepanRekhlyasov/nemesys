<template>
  <div  class="new">
    <q-card-section class="bg-grey-3 q-pa-md">
      <div class="row">
        <div class="text-h6 q-pr-md text-primary">
          <q-icon name="mdi-cog-outline" color="primary" class="q-pr-sm" size="md"/>
          {{$t('menu.template')}}
        </div>
        <q-btn color="primary" text-color="white" class="no-shadow" icon="mdi-plus" :label="$t('settings.template.addNew')" @click="openDialog=true" />
      </div>
    </q-card-section>
    <q-separator color="grey-5" size="2px"/>
    <q-card-section>
      <q-card class="bg-white no-shadow no-border-radius" style="border: 1px solid #E6E6E6">
        <q-card-section class="row text-center">
          <span class="row content-center">{{$t('common.keyboard')}}</span>
          <q-input v-model="search.keyboard" square outlined class="col-6 q-mr-md q-ml-md bg-grey-2 input-md" dense >
            <template v-slot:append>
              <q-icon v-if="search.keyboard" name="close" @click="search.keyboard='';loadTemplateList();" class="cursor-pointer" />
            </template>
          </q-input>
          <q-btn :label="$t('common.search')" color="primary" text-color="white" size="md" @click="loadTemplateList()"/>
        </q-card-section>
        <q-card-section class="q-pa-none" >
          <q-table
            :columns="columns"
            :rows="templates"
            row-key="id"
            :loading="loading"
            v-model:pagination="pagination"
            hide-pagination
            class="no-shadow"
            >
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <span v-if="props.row.type">{{$t('settings.template.'+props.row.type)}}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-created_at="props">
              <q-td :props="props">
                {{props.row.created_at.date}}<br/>
                {{props.row.created_at.time}}
              </q-td>
            </template>

            <template v-slot:body-cell-updated_at="props">
              <q-td :props="props">
                {{props.row.updated_at.date}}<br/>
                {{props.row.updated_at.time}}
              </q-td>
            </template>

            <template v-slot:body-cell-delete="props">
              <q-td :props="props" auto-width>
                <q-btn icon="delete" flat @click="deleteTemplate(props.row)" />
              </q-td>
            </template>

            <template v-slot:body-cell-edit="props">
              <q-td :props="props" auto-width>
                <q-btn icon="edit" flat @click="editTemplate=props.row;openDialog=true;" color="primary"/>
              </q-td>
            </template>
          </q-table>

          <div class="row justify-start q-mt-md q-mb-md pagination">
              <q-pagination
                v-model="pagination.page"
                color="grey-8"
                padding="5px 16px"
                gutter="md"
                :max="(templates.length/pagination.rowsPerPage) >= 1 ?  templates.length/pagination.rowsPerPage : 1"
                direction-links
                outline
              />
            </div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </div>
  <q-dialog v-model="openDialog" @hide="editTemplate=undefined">
    <TemplateCreateForm  @closeDialog="openDialog = false; loadTemplateList()" :editTemplate="editTemplate"/>
  </q-dialog>
</template>

<script lang="ts">
import { doc, getFirestore, updateDoc} from '@firebase/firestore';
import { computed, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { branchFlags } from 'src/shared/model/Branch.model';
import { getTemplates, toDateObject } from 'src/shared/utils/utils';
import TemplateCreateForm from './components/TemplateCreateForm.vue';
import { Template } from 'src/shared/model/Template.model';
import { useQuasar } from 'quasar';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useOrganization } from 'src/stores/organization';
export default {
  name: 'templateManager',
  components:{
    TemplateCreateForm
  },
  setup(){
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();
    const $q = useQuasar()

    const search = ref({
      keyboard: ''
    });
    const templates: Ref<Template[]> = ref([])
    const editTemplate: Ref<Template | undefined> = ref(undefined)
    const loading = ref(false)

    // dialog date
    const openDialog = ref(false)

    // table date
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => [{
      name: 'edit'
    },{
      name: 'name',
      required: true,
      label: t('settings.template.name') ,
      field: 'name',
      align: 'left',
    }, {
      name: 'type',
      label: t('settings.template.type') ,
      field: 'type',
      align: 'left',
    }, {
      name: 'subject',
      required: true,
      label: t('settings.template.subject') ,
      field: 'subject',
      align: 'left',
    },{
      name: 'created_at',
      required: true,
      label: t('settings.template.create_at') ,
      field: 'created_at',
      align: 'left',
    },{
      name: 'updated_at',
      label: t('settings.template.last_update') ,
      field: 'updated_at',
      align: 'left',
    },{
      name: 'delete'
    }])

    const organization  = useOrganization()

    watch(()=> organization.currentOrganizationId, ()=>{
      loadTemplateList()
    })

    loadTemplateList()
    async function loadTemplateList() {
      loading.value = true;

      try {
        if (organization.currentOrganizationId) {
          const branchesSnapshot = getTemplates(db, organization.currentOrganizationId, search.value.keyboard);
          branchesSnapshot.then(branch => {
            const list: Template[] = []
            branch.forEach((doc) => {
              const data = doc.data();
              data.id = doc.id
              list.push({...data, created_at: toDateObject(data.created_at), updated_at: toDateObject(data.updated_at)} as Template)
            })
            templates.value = list;
            loading.value = false;
          })
        }
      } catch (e) {
        console.log(e)
        loading.value = false;
        Alert.warning($q, t)
      }
    }

    return {
      search,
      columns,
      pagination,
      loading,

      openDialog,
      editTemplate,

      templates,
      branchFlags,

      async deleteTemplate(template) {
        $q.dialog({
          title: t('common.delete'),
          message: t('settings.template.deletedInfo'),
          ok:{
            label: t('common.delete'),
            color: 'negative',
            class: 'no-shadow',
            unelevated: true
          },
        }).onOk(async () => {
          loading.value = true;
          try {
            const boRef = doc(db, 'organization/'+organization.currentOrganizationId+'/template/'+template.id);
            await updateDoc(boRef, {
              deleted: true
            })

            Alert.success($q, t)
            loadTemplateList()
          } catch {
            Alert.success($q, t)
            loading.value = false;
          }
        })
      },
      loadTemplateList
    }
  }
}
</script>

<style>

</style>
