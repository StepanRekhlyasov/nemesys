<template>
  <div class="row no-shadow full-height new">
    <q-card class="no-shadow full-width bg-grey-1">
      <q-card-section class="bg-grey-3">
        <div class="text-h6 text-primary">{{ $t('menu.applicantSearch') }}</div>
      </q-card-section>

      <q-separator color="white" size="2px" />

      <q-card-section class="q-pa-xs">
        <searchForm @load-search-staff="loadSearchStaff" @is-loading="isLoading" />
      </q-card-section>

      <q-separator color="white" size="2px" />
      <q-card-section class=" q-pa-none">
        <q-table :columns="columns" :rows="applicantData" row-key="id" selection="multiple" class="no-shadow"
          v-model:selected="selected" v-model:pagination="pagination" hide-pagination :loading="isLoadingProgress">
          <template v-slot:header-cell-name="props">
            <q-th :props="props" class="q-pa-none">
              <div> {{ $t('applicant.list.name') }} </div>
              <div> {{ $t('applicant.add.occupation') }} | {{ $t('applicant.list.category') }} </div>
              <div> {{ $t('applicant.list.address') }} </div>
            </q-th>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props" class="q-pa-none">
              <q-btn flat dense no-caps @click="openDrawer(props.row)" color="primary" :label="props.value"
                class="q-pa-none text-body1" />
              <div>
                {{ props.row.occupation }} <span v-if="props.row.category">| {{ props.row.category }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span v-if="props.value">{{ getStatus(props.value) }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-qualification="props">
            <q-td :props="props">
              <span v-if="props.value && props.value.length > 0">
                {{ props.value.map(item => $t('applicant.add.' + item)).join(', ') }}
              </span>
            </q-td>
          </template>

        </q-table>
        <div class="row justify-start q-mt-md pagination">
          <q-pagination v-model="pagination.page" color="grey-8" padding="5px 16px" gutter="md"
            :max="(applicantData.length / pagination.rowsPerPage) >= 1 ? applicantData.length / pagination.rowsPerPage : 1"
            direction-links outline />
        </div>
      </q-card-section>
    </q-card>
  </div>
  <ApplicantDetails ref="detailsDrawer" />
</template>


<script>
import { useI18n } from 'vue-i18n';
import { ref, computed } from 'vue';
import {
  getFirestore,
  doc,
  updateDoc,
  query,
  onSnapshot,
  collection,
  where
} from 'firebase/firestore';
import { statusList } from 'src/shared/constants/Applicant.const';
import { getStorage, ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RankCount } from 'src/shared/utils/RankCount.utils';
import searchForm from './components/search/searchForm.vue';
import { api } from 'src/boot/axios';
import ApplicantDetails from '../Applicant/ApplicantDetails.vue';

export default {
  name: 'applicantList',

  components: {
    searchForm,
    ApplicantDetails
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    const db = getFirestore();

    const filters = ref(null);
    const applicantData = ref([]);
    const selected = ref([])
    const drawerRight = ref(false);
    const selectedApplicant = ref(null)
    const applicantImage = ref([]);
    const fileUploadRef = ref({});
    const statusOption = ref(statusList);
    const age = computed(()=>selectedApplicant.value['dob']?RankCount.ageCount(selectedApplicant.value['dob']):'0')
    const isLoadingProgress = ref(true)
    const detailsDrawer = ref(null)
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
          label: t('applicant.list.rank'),
          field: 'rank',
          align: 'left',
        },
        {
          name: 'status',
          required: true,
          label: t('applicant.list.status'),
          field: 'status',
          align: 'left',
        },
        {
          name: 'qualification',
          required: true,
          label: t('applicant.list.qualification'),
          field: 'qualification',
          align: 'left',
        },

      ];
    });


    const currentIds = ref([]);
    loadApplicantData();
    async function loadApplicantData(searchData = {}) {
      isLoadingProgress.value = true
      applicantData.value = []

      let filters = { 'all': [{ 'deleted': 'false' }] };

      let queryString = ''
      if (searchData.keyword) {
        queryString = searchData.keyword
      }
      if (searchData.status) {
        filters['all'].push({
          'status': searchData.status
        });
      }
      // if (searchData.applicationDate) {
      //   filters['all'].push({
      //     'applicationdate': '2023/03/28 11:11' //searchData.applicationDate.replaceAll('-', '/') + ' *'
      //   });
      // }
      if (searchData.ageMin) {
        filters['all'].push({
          'dob': { 'to': getDate(searchData.ageMin) }
        });
      }
      if (searchData.ageMax) {
        filters['all'].push({
          'dob': { 'from': getDate(searchData.ageMax) }
        });
      }
      let items = ['sex', 'classification', 'occupation', 'qualification', 'daysperweek', 'prefecture']
      for (var i = 0; i < items.length; i++) {
        if (searchData[items[i]] && searchData[items[i]].length > 0) {
          let obj = {}
          obj[items[i]] = searchData[items[i]]
          filters['all'].push(obj);
        }
      }
      if (searchData.availableShift && searchData.availableShift.length > 0) {
        for (var i = 0; i < searchData.availableShift.length; i++) {
          let obj = {}
          obj[searchData.availableShift[i]] = 'true'
          filters['all'].push(obj);
        }

      }

      if (searchData.mapData) {
        filters['all'].push({
          'geohash': {
            'center': `${searchData.mapData.lat}, ${searchData.mapData.lng}`,
            'distance': searchData.mapData.radiusInM,
            'unit': 'm'
          }
        });
      }

      await api.post(
        process.env.elasticSearchStaffURL,
        {
          'query': queryString,
          // "page": { "size": tableOptions.itemsPerPage, "current": tableOptions.page },
          // "sort": sort,
          'filters': filters,
        },
        {
          headers: { 'Authorization': process.env.elasticSearchKey, 'Content-Type': 'application/json' },
        }
      ).then((response) => {
        if (response.status == 200) {
          let responseData = response.data.results;
          for (var i = 0; i < responseData.length; i++) {
            currentIds.value.push(responseData[i]['id']['raw'])
          }
          //applicantData.value = data;
          loadFirestoreApplicantData()
        }
      }).catch((error) => {
        console.log(error)
      });

    };
    const unsubscribeList = ref([]);
    async function loadFirestoreApplicantData() {
      for (var i = 0; i < unsubscribeList.value; i++) {
        unsubscribeList.value[i]();
      }
      unsubscribeList.value = [];
      while (currentIds.value.length) {
        const batch = currentIds.value.splice(0, 10);
        const q = query(collection(db, 'applicants'), where('deleted', '==', false), where('id', 'in', batch));
        let unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            let editedIndex = applicantData.value.findIndex((p) => p.id == data['id']);
            if (editedIndex > -1) {
              applicantData.value.splice(editedIndex, 1, data);
            } else {
              applicantData.value.push(data);
            }
          });
        });
        unsubscribeList.value.push(unsubscribe)
      }
      isLoadingProgress.value = false

    }
    function getDate(ageInYears) {
      var calDate = new Date(new Date().getTime() - (ageInYears * 365 * 24 * 60 * 60 * 1000));
      var year = calDate.toLocaleString('default', { year: 'numeric' });
      var month = calDate.toLocaleString('default', { month: '2-digit' });
      var day = calDate.toLocaleString('default', { day: '2-digit' });

      return year + '-' + month + '-' + day + 'T00:00:00+00:00';
    }

    async function updateApplicant(applicant) {
      const applicantRef = doc(db, 'applicants/' + selectedApplicant.value.id);
      await updateDoc(applicantRef, applicant)
      selectedApplicant.value = {
        ...selectedApplicant.value,
        ...applicant,
        staffRank: RankCount.countRank(selectedApplicant.value)}
    };

    return {
      age,
      columns,
      filters,
      pagination,
      applicantData,
      selected,
      drawerRight,
      selectedApplicant,
      fileUploadRef,
      applicantImage,
      updateApplicant,
      isLoadingProgress,
      statusOption,
      detailsDrawer,

      async openDrawer(data) {
        detailsDrawer.value?.openDrawer(data)
      },
      getStatus(status) {
        let item = statusList.value.find(x => x.value === status);
        if (item) {
          return item.label;
        }
      },
      async onFileChange() {
        if (applicantImage.value && applicantImage.value.length > 0) {
          const file = applicantImage.value[0];
          const storage = getStorage();
          const storageRef = refStorage(storage, 'applicants/' + selectedApplicant.value.id + '/image/' + file['name']);

          try {
            const ret = {}
            const snapshot = await uploadBytes(storageRef, file)
            ret['imagePath'] = snapshot.ref.fullPath;
            ret['imageURL'] = await getDownloadURL(storageRef)
            await updateApplicant(ret)
          }
          catch (error) {
            console.log(error);
            $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: t('failed'),
            });
          }
        }
      },
      chooseFiles() {
        fileUploadRef.value.pickFiles()
      },
      loadSearchStaff(data) {
        loadApplicantData(data)
      },
      isLoading(flag) {
        isLoadingProgress.value = flag
      }
    };
  },
};
</script>

<style lang="scss">

</style>
