<template>
  <q-card class="no-shadow full-width">
    <q-card-section class="q-pa-xs q-mb-none">
      <span class="text-primary text-h6 q-pt-md"> {{ $t('applicant.list.fixEmployment.fixDestinationOffice') }} </span>
      <q-btn :label="$t('common.addNew')" color="primary" icon="mdi-plus-thick" size="sm" @click="drawerRight = true"
        class="no-shadow q-ml-lg" />
    </q-card-section>

    <q-table :columns="columns" :rows="contactListData" row-key="id" v-model:pagination="pagination" hide-pagination>

      <template v-slot:body-cell-contactMethod="props">
        <q-td :props="props">
          <div v-if="props.value == 'phone'">
            {{ $t('applicant.list.contacts.phone') }}
          </div>
          <div v-else-if="props.value == 'sms'">
            SMS
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_by="props">
        <q-td :props="props">
          {{ getUserName(props.value) }}
        </q-td>
      </template>

      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn icon="mdi-pencil-outline" size="sm" round style="color: #175680" flat
            @click="showEditDialog(props.row)" />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn style="color: #222222" icon="delete" size="sm" round flat @click="showDeleteDialog(props.row)" />
        </q-td>
      </template>

    </q-table>


    <q-drawer v-model="drawerRight" show :width="800" :breakpoint="500" side="right" overlay elevated bordered>
      <q-scroll-area class="fit text-left"><!-- v-if="selectedApplicant" -->
        <q-card class="no-shadow">
          <q-card-section class="text-white bg-grey-3 rounded-borders">
            <div class="row">
              <div class="col-12 flex items-start">
                <q-btn dense flat icon="close" @click="drawerRight = false" class="q-mr-md" color="black" />
                <span class="text-primary text-h6"> {{ $t('applicant.list.fixEmployment.fixDestinationOffice') }}
                </span>
              </div>
            </div>
          </q-card-section>
          <q-separator />


          <q-card-section>
            <div class="row">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.fixedDestination') }}
              </div>
              <div class="col-5 q-pl-sm">
                <q-select outlined dense :options="options" v-model="fixData['fixedDestination']" />
              </div>
            </div>

            <div class="row q-mt-sm">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.fixDate') }}
              </div>
              <div class="col-10 q-pl-sm">
                <div class="row">
                  <div class="col-6">
                    <q-input outlined v-model="fixData['fixDate']" mask="date" dense>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fixData['fixDate']" minimal>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6 q-pl-sm">
                    <div>
                      <q-radio v-model="fixData['fixDateStatus']" val="ok" label="OK" @click="fixData['fixDateNGReason'] = ''"/>
                      <q-radio v-model="fixData['fixDateStatus']" val="ng" label="NG" class="q-ml-sm" />
                    </div>
                  </div>
                  <div class="col-12 q-pa-sm" v-if="fixData['fixDateStatus'] == 'ng'">
                      <q-input outlined dense v-model="fixData['fixDateNGReason']" class="bg-white" />
                    </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-sm">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.workDay') }}
              </div>
              <div class="col-10 q-pl-sm">
                <div class="row">
                  <div class="col-6">
                    <q-input outlined v-model="fixData['workDay']" mask="date" dense>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fixData['workDay']" minimal>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6 q-pl-sm">
                    <div>
                      <q-radio v-model="fixData['workDayStatus']" val="ok" label="OK" @click="fixData['workDayNGReason'] = ''"/>
                      <q-radio v-model="fixData['workDayStatus']" val="ng" label="NG" class="q-ml-sm" />
                    </div>
                  </div>
                  <div class="col-12 q-pa-sm" v-if="fixData['workDayStatus'] == 'ng'">
                      <q-input outlined dense v-model="fixData['workDayNGReason']" class="bg-white" />
                    </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-sm">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.informalOfferDate') }}
              </div>
              <div class="col-10 q-pl-sm">
                <div class="row">
                  <div class="col-6">
                    <q-input outlined v-model="fixData['informalOfferDate']" mask="date" dense>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fixData['informalOfferDate']" minimal>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6 q-pl-sm">
                    <div>
                      <q-radio v-model="fixData['informalOfferStatus']" val="ok" label="OK" @click="fixData['informalOfferNGReason'] = ''"/>
                      <q-radio v-model="fixData['informalOfferStatus']" val="ng" label="NG" class="q-ml-sm" />
                    </div>
                  </div>
                  <div class="col-12 q-pa-sm" v-if="fixData['informalOfferStatus'] == 'ng'">
                      <q-input outlined dense v-model="fixData['informalOfferNGReason']" class="bg-white" />
                    </div>
                </div>
              </div>
            </div>

            <div class="row q-mt-sm">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.hiringDate') }}
              </div>
              <div class="col-10 q-pl-sm">
                <div class="row">
                  <div class="col-6">
                    <q-input outlined v-model="fixData['hiringDate']" mask="date" dense>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="fixData['hiringDate']" minimal>
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-6 q-pl-sm">
                    <div>
                      <q-radio v-model="fixData['hiringStatus']" val="ok" label="OK" @click="fixData['hiringNGReason'] = ''"/>
                      <q-radio v-model="fixData['hiringStatus']" val="ng" label="NG" class="q-ml-sm" />
                    </div>
                  </div>
                  <div class="col-12 q-pa-sm" v-if="fixData['hiringStatus'] == 'ng'">
                      <q-input outlined dense v-model="fixData['hiringNGReason']" class="bg-white" />
                    </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-2 flex justify-end q-pa-sm">
                {{ $t('applicant.list.fixEmployment.memo') }}
              </div>
              <div class="col-10 q-pa-sm">
                <q-input outlined dense v-model="fixData['fixedDestination']" type="textarea" row="2" />
              </div>
            </div>


          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-drawer>

  </q-card>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref, computed, onBeforeUnmount } from 'vue';
import { addDoc, collection, serverTimestamp, getFirestore, query, onSnapshot, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useQuasar } from 'quasar';
import { toDate } from 'src/shared/utils/utils';

//import { TeleAppointmentHistory } from 'src/shared/model/TeleAppoint.model';
//import { teleAppointmentData } from 'src/shared/constants/TeleAppoint.const';

export default {
  name: 'contactInfo',
  components: {
  },

  props: {
    applicant: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const { t } = useI18n({ useScope: 'global' });
    const contactListData = ref([])
    const deleteItemId = ref('');
    const drawerRight = ref(false);
    const options = [
      'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
    ]
    const fixData = ref({})

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    });

    const columns = computed(() => {
      return [
        {
          name: 'edit',
          align: 'left',
        },
        {
          name: 'created_at',
          required: true,
          label: t('applicant.list.fixEmployment.fixedDestination'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'created_at',
          required: true,
          label: t('applicant.list.fixEmployment.fixDate'),
          field: 'created_at',
          align: 'left',
        },
        {
          name: 'contactMethod',
          required: true,
          label: t('applicant.list.fixEmployment.workDay'),
          field: 'contactMethod',
          align: 'left',
        },
        {
          name: 'created_by',
          label: t('applicant.list.fixEmployment.informalOfferDate'),
          field: 'created_by',
          align: 'left',
        },
        {
          name: 'content',
          label: t('applicant.list.fixEmployment.hiringDate'),
          field: 'content',
          align: 'left',
        },
        {
          name: 'note',
          label: t('applicant.list.fixEmployment.memo'),
          field: 'note',
          align: 'left',
        },
        {
          name: 'delete',
          align: 'left',
        }
      ];
    });

    const loading = ref(false);
    const showAddForm = ref(false)
    const contactData = ref({
    });

    const db = getFirestore();
    const $q = useQuasar();
    const unsubscribe = ref();
    const unsubscribeUsers = ref();

    const dialogType = ref('create')

    loadContactData()
    function loadContactData() {
      const q = query(collection(db, 'applicants/' + props.applicant.id + '/contacts'), where('deleted', '==', false), orderBy('created_at', 'desc'));
      unsubscribe.value = onSnapshot(q, (querySnapshot) => {
        let contData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data['id'] = doc.id;
          contData.push({ ...data, id: doc.id, created_at: toDate(data.created_at) });
        });
        contactListData.value = contData;
      },
        (error) => {
          console.log(error)
          // ...
        });
    }


    const users = ref([]);
    loadUsers()
    function loadUsers() {
      const q = query(collection(db, 'users/'), where('deleted', '==', false));
      unsubscribeUsers.value = onSnapshot(q, (querySnapshot) => {
        let userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, name: doc.data().name });
        });
        users.value = userList;
      });
    }


    onBeforeUnmount(() => {
      unsubscribe.value();
      unsubscribeUsers.value();
    });


    return {
      columns,
      contactListData,
      pagination,

      contactData,
      showAddForm,
      loading,
      drawerRight,
      fixData,

      options,

      async onSubmit() {
        loading.value = true;
        let data = contactData.value;
        if (!data['contactMethod']) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: t('failed'),
          });
          return

        }
        const user = $q.localStorage.getItem('user');

        try {
          if (dialogType.value == 'update') {
            let updateData = {}
            updateData['updated_at'] = serverTimestamp();
            updateData['updated_by'] = user.uid;
            //updateData['result'] = data['result']
            updateData['content'] = data['content']
            updateData['contactMethod'] = data['contactMethod']
            updateData['note'] = data['note']

            await updateDoc(
              doc(db, 'applicants/' + props.applicant.id + '/contacts/' + data['id']),
              updateData
            );
          }
          else {
            data['created_at'] = serverTimestamp();
            data['updated_at'] = serverTimestamp();
            data['deleted'] = false;
            data['created_by'] = user.uid;

            await addDoc(
              collection(db, 'applicants/' + props.applicant.id + '/contacts'),
              data
            );
          }

          loading.value = false;
          contactData.value = {};
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
          dialogType.value = 'create';
          //applicantData.value = JSON.parse(JSON.stringify(applicantDataSample));
          //applicantForm.value.resetValidation();
        } catch (error) {
          console.log(error);
          loading.value = false;
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: t('failed'),
          });
        }
      },

      async deleteItem() {
        if (!deleteItemId.value) {
          return false;
        }
        const user = $q.localStorage.getItem('user');

        let updateData = {}
        updateData['deleted'] = true;
        updateData['deleted_by'] = user.uid;
        updateData['deleted_at'] = serverTimestamp();

        await updateDoc(
          doc(db, 'applicants/' + props.applicant.id + '/contacts/' + deleteItemId.value),
          updateData
        );

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: t('success'),
        });
      },
      onReset() {
        //contactData.value = JSON.parse(JSON.stringify(applicantDataSample));
        //applicantForm.value.resetValidation();
        contactData.value = {};
        dialogType.value = 'create';
        showAddForm.value = false;
      },
      getUserName(uid) {
        const value = users.value.find(x => x['id'] === uid)
        if (value) {
          return value['name'];
        }
        return '';
      },
      showEditDialog(data) {
        dialogType.value = 'update';
        contactData.value = JSON.parse(JSON.stringify(data));
        showAddForm.value = true;
      },
      showDeleteDialog(data) {
        $q.dialog({
          title: t('common.delete'),
          message: t('common.deleteInfo'),
          cancel: true,
          persistent: true,
          cancel: t('common.cancel'),
        }).onOk(async () => {
          const user = $q.localStorage.getItem('user');

          let updateData = {}
          updateData['deleted'] = true;
          updateData['deleted_by'] = user.uid;
          updateData['deleted_at'] = serverTimestamp();

          await updateDoc(
            doc(db, 'applicants/' + props.applicant.id + '/contacts/' + data.id),
            updateData
          );

          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: t('success'),
          });
        })
      }

    };
  },
};
</script>

<style>
.rightBorder {
  border-right: 2px solid white;
}
</style>

