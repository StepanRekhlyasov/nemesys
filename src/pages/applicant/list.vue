<template>
  <q-card class="no-shadow full-width bg-grey-1">
    <q-card-section class="bg-grey-3">
      <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
    </q-card-section>

    <q-separator color="white" size="2px" />

    <q-card-section class="bg-grey-3">
      <div class="text-subtitle2">検索条件 / 東京都全域, 今の時間帯のテレアポ接電率:高い</div>
      <div class="row q-mt-xs">
          <div class="q-gutter-md" style="max-width: 150px">
            <q-select outlined dense class="bg-white" v-model="filters">
              <template v-slot:prepend>
                <q-icon name="filter_alt" color="primary" />
              </template>
            </q-select>
          </div>
          <div class="q-gutter-md q-ml-sm" style="max-width: 250px">
            <q-select outlined dense class="bg-white" v-model="filters">

            </q-select>
          </div>
        </div>
    </q-card-section>

    <q-separator color="white" size="2px" />

    <q-card-section>

      <q-table
          :columns="columns"
          :rows="applicantData"
          row-key="id"
          selection="multiple"
          v-model:selected="selected"
          v-model:pagination="pagination"
          hide-pagination
          
        >
        <template v-slot:header-cell-name="props">
          <q-th :props="props" class="q-pa-none" >
            <div> {{ $t('applicant.list.name') }} </div>
            <div> {{ $t('applicant.add.occupation') }} | {{ $t('applicant.list.category') }} </div>
            <div> {{ $t('applicant.list.address') }} </div>
          </q-th>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="q-pa-none" >
            <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary"
              :label="props.value" class="q-pa-none text-body1" />
            <div>
              {{props.row.occupation}} <span v-if="props.row.category">| {{props.row.category}}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <span v-if="props.value">{{getStatus(props.value)}}</span>
          </q-td>
        </template>


        </q-table>
        <div class="row justify-start q-mt-md pagination">
          <q-pagination
            v-model="pagination.page"
            color="grey-8"
            padding="5px 16px"
            gutter="md"
            :max="(applicantData.length/pagination.rowsPerPage) >= 1 ?  applicantData.length/pagination.rowsPerPage : 1"
            direction-links
            outline
          />
        </div>
    </q-card-section>

  </q-card>
</template>


<script>
import { useI18n } from 'vue-i18n';
import {  ref, computed } from 'vue';
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';
import { statusList } from '../../shared/constants/Applicant.const';

export default {
  name: 'applicantList',

  components: {
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();

    const filters = ref(null);
    const applicantData = ref([]);
    const selected = ref([])
    //const selectedRows = ref([]);

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
      // rowsNumber: xx if getting data from a server
    });

    const columns = computed(() => {
      return [
      {
          name: 'name',
          required: true,
          label: '',
          align: 'left',
          field: 'name',
          sortable: false,
        },
        {
          name: 'rank',
          required: true,
          label: t('applicant.list.rank') ,
          field: 'rank',
          align: 'left',
        },
        {
          name: 'status',
          required: true,
          label: t('applicant.list.status') ,
          field: 'status',
          align: 'left',
        },
        {
          name: 'qualification',
          required: true,
          label: t('applicant.list.qualification') ,
          field: 'qualification',
          align: 'left',
        },

      ];
    });

    const unsubscribe = ref();

    loadApplicantData();
    function loadApplicantData() {
      const q = query(collection(db, 'applicants'), where('deleted', '==', false));
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(data);
        
        applicantData.value = data;
      });
    };


    return {
      columns,
      filters,
      pagination,
      applicantData,
      selected,

  

      openDrawer(){
        return false
      },
      getStatus(status){
        let item = statusList.value.find(x => x.value === status);
        if (item){
          return item.label;
        }
      }
      
    };
  },
};
</script>

<style lang="scss">

</style>
