<template>
  <div class="column" style="width: 120px">
    <div class="flex q-mx-xs items-center text-bold text-primary">
      <span class="text-h5">●</span>{{ column.label }}
    </div>

    <!-- <draggable
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
      <template #item="{}"> -->
    <div class="row column bg-white q-py-md q-px-xs">
      <q-card
        v-for="item in [1, 2, 3, 4]"
        :key="item"
        bordered
        class="cursor-move q-mb-md text-caption"
        square
        flat
        style="border: 1px solid #333; padding: 8px"
      >
        <div class="row q-gutter-sm items-center">
          <span class="col-1">S</span>
          <span class="col">田中A太</span>
        </div>

        <div class="row q-gutter-sm items-center">
          <div class="col-1">看</div>
          <div class="col">東京都新宿区</div>
        </div>
        <div class="row q-gutter-sm items-center">
          <div class="col-1">応</div>
          <div class="col">2023.2.12</div>
        </div>
      </q-card>
    </div>
    <!-- </template>
    </draggable> -->
  </div>
</template>

<script setup>
//import { useI18n } from 'vue-i18n';
import { ref, onMounted, onBeforeUnmount } from "vue";

import api from "../../../firebaseData/dashboard";
import Draggable from "vuedraggable";

import { collection, query, where, onSnapshot, getFirestore } from "firebase/firestore";

const props = defineProps<{
  column: Object,
  columns: Array,
  tags: Array,

}>()

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
        collection(db, "applicant"),
        where("groupId", "==", props.column.id),
        where("deleted", "==", false)
      );
      unsubscribe.value = onSnapshot(q, (snapshot) => {
        let items = [];
        snapshot.docChanges().forEach((change) => {
          console.log('applicant: ' + change.doc.id + ", change.type:" + change.type);
          if (change.type === "added" || change.type === "modified") {
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
          } else if (change.type === "removed") {
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
          id: group.value["id"],
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
</script>
