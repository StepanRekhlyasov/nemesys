<template>
  <div class="column q-py-sm" style="min-width: 250px">
    <div class="flex bg-grey-1 q-pa-md q-mx-xs rounded-borders text-blue-grey">
      <b>{{ column.label }}</b>
      <q-space />
      <q-btn flat class="q-pa-none" size="10px" icon="mdi-dots-vertical">
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup @click="onEditGroup(column)">
              <q-item-section>Edit</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onDeleteGroup(column)">
              <q-item-section>Delete</q-item-section>
            </q-item>
            <q-separator></q-separator>
            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <draggable
      v-model="cards"
      :animation="200"
      group="all-cards"
      ghost-class="moving-card"
      filter=".action-button"
      class="q-pa-xs q-mx-xs q-gutter-sm bg-grey-1 rounded-borders c-column"
      @change="changed($event, column)"
      item-key="id"
      style="min-height: 250px"
    >
      <!-- <Card v-for="card in cards" :key="card.id" :card="card" /> -->
      <template #item="{ element }">
        <div class="list-group-item">
          <q-card bordered class="cursor-move">
            <q-card-section>
              <div class="row items-center">
                <q-avatar
                  size="24px"
                  color="orange"
                  text-color="white"
                  v-if="element.name"
                  class="text-capitalize"
                >
                  {{ element.name[0] }}
                </q-avatar>

                <span class="q-px-md col"
                  ><strong>{{ element.name }}</strong></span
                >
                <q-btn
                  flat
                  class="col-2"
                  size="10px"
                  @click="onEdit(element)"
                  icon="mdi-pencil-outline"
                />
              </div>

              <div class="row items-center">
                <div class="col-6">{{ element.address }}</div>
                <div class="col-6">{{ element.branch }}</div>
              </div>
              <div class="row items-center">
                Employment Date: {{ element.employmentDate }}
              </div>

              <div class="row justify-center items-center">
                <span class="col text-italic q-pt-sm">
                  <!-- {{ card.date | moment("MMM D") }} -->
                </span>
                <q-chip
                  v-if="element.tag"
                  :color="`purple-1`"
                  :class="`text-purple-9 text-weight-medium`"
                >
                  {{ element.tag }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </draggable>
    <applicantForm
      :applicantDialog="applicantDialog"
      :applicantData="applicant"
      :columns="columns"
      :tags="tags"
      @close="close"
      @onSubmit="onSubmit"
      @onDelete="onDelete"
    />
    <groupForm
      :groupDialog="groupDialog"
      :groupData="group"
      @onSubmitGroup="onSubmitGroup"
      @closeGroup="closeGroup"
    />
    <q-dialog v-model="deleteDialog">
      <q-card style="width: 400px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">
            <q-icon
              name="mdi-trash-can-outline"
              class="text-red"
              size="1.5em"
            />
            Delete Group
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Do you really want to delete <strong>{{ group['label'] }} </strong>?
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            label="Delete"
            class="q-ml-sm"
            color="negative"
            @click="deleteGroup"
          />
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
//import { useI18n } from 'vue-i18n';
import { ref, onMounted, onBeforeUnmount } from 'vue';

import api from '../../../firebaseData/dashboard';
import Draggable from 'vuedraggable';

import applicantForm from './applicantForm';
import groupForm from './groupForm';

import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from 'firebase/firestore';

export default {
  name: 'ColumnPage',
  components: {
    Draggable,
    applicantForm,
    groupForm,
  },

  props: {
    column: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },

  computed: {},

  setup(props) {
    // const { t, te } = useI18n({
    //   useScope: 'global',
    // });

    const cards = ref([]);

    const applicantDialog = ref(false);
    const applicant = ref({});
    const applicantForm = ref(null);
    const unsubscribe = ref(null);
    const group = ref({});
    const groupDialog = ref(false);
    const deleteDialog = ref(false);

    onMounted(() => {
      const db = getFirestore();
      const q = query(
        collection(db, 'applicant'),
        where('groupId', '==', props.column.id),
        where('deleted', '==', false)
      );
      unsubscribe.value = onSnapshot(q, (snapshot) => {
        let items = [];
        snapshot.docChanges().forEach((change) => {
          console.log(
            'applicant: ' + change.doc.id + ', change.type:' + change.type
          );
          if (change.type === 'added' || change.type === 'modified') {
            let data = {
              ...{
                id: change.doc.id,
              },
              ...change.doc.data(),
            };
            let index = cards.value.findIndex((x) => x.id === change.doc.id);
            if (index > -1) {
              cards.value[index] = data;
            } else {
              items.push(data);
            }
          } else if (change.type === 'removed') {
            let index = cards.value.findIndex((x) => x.id === change.doc.id);
            if (index > -1) {
              cards.value.splice(index, 1);
            }
          }
        });
        cards.value = [...cards.value, ...items];
      });
    });

    onBeforeUnmount(() => {
      unsubscribe.value();
    });

    return {
      cards,
      applicantDialog,
      applicant,
      applicantForm,
      group,
      groupDialog,
      deleteDialog,

      changed(e, column) {
        console.log(e);
        console.log(column);
        let groupItems = [];
        for (let i = 0; i < cards.value.length; i++) {
          groupItems.push(cards.value[i].id);
        }
        console.log(groupItems);
        if (e && e.added) {
          const updatedApplicant = {
            id: e.added.element.id,
            groupId: column.id,
          };
          api
            .updateApplicant(updatedApplicant)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => console.log(error));

          const updatedGroup = {
            id: column.id,
            groupItems: groupItems,
          };
          api
            .updateGroup(updatedGroup)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => console.log(error));
        }
      },
      onEdit(element) {
        console.log(element);
        api
          .getApplicant(element.id)
          .then((doc) => {
            console.log(doc.data());
            applicant.value = {
              ...{
                id: doc.id,
              },
              ...doc.data(),
            };
            applicantDialog.value = true;
          })
          .catch((error) => console.log(error));
      },
      close() {
        applicantDialog.value = false;
      },
      onSubmit() {
        api
          .updateApplicant(applicant.value)
          .then((response) => {
            console.log(response);
            applicantDialog.value = false;
          })
          .catch((error) => console.log(error));
      },
      onDelete(applicant) {
        console.log(applicant);
        const updatedCard = {
          id: applicant.id,
          deleted: true,
        };
        api
          .updateApplicant(updatedCard)
          .then((response) => {
            console.log(response);
            applicantDialog.value = false;
          })
          .catch((error) => console.log(error));
      },
      //group
      closeGroup() {
        groupDialog.value = false;
      },
      onEditGroup(element) {
        console.log(element);
        api
          .getGroup(element.id)
          .then((doc) => {
            console.log(doc.data());
            group.value = {
              ...{
                id: doc.id,
              },
              ...doc.data(),
            };
            groupDialog.value = true;
          })
          .catch((error) => console.log(error));
      },
      onSubmitGroup() {
        api
          .updateGroup(group.value)
          .then((response) => {
            console.log(response);
            groupDialog.value = false;
          })
          .catch((error) => console.log(error));
      },
      deleteGroup() {
        const data = {
          id: group.value['id'],
          deleted: true,
        };
        api
          .updateGroup(data)
          .then((response) => {
            console.log(response);
            groupDialog.value = false;
          })
          .catch((error) => console.log(error));
      },
      onDeleteGroup(element) {
        group.value = element;
        deleteDialog.value = true;
      },
    };
  },
};
</script>
