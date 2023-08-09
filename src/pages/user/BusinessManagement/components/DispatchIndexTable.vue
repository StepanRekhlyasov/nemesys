<template>
  <q-table
    :rows="rows"
    :columns="(columnsDispatchIndexTable as QTableProps['columns'])"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QTable, QTableProps } from 'quasar';
import {
  columnsDispatchIndexTable,
  argsList,
} from '../consts/DispatchIndexTable';
import { useClient } from 'src/stores/client';
import { useBackOrder } from 'src/stores/backOrder';
import { DispatchIndexTable } from '../types/index';
import { evaluator } from '../utils/index';
import { Client } from 'src/shared/model';
const { clients } = useClient();
const { constDaysByClientId } = useBackOrder();
const rows = ref<DispatchIndexTable[]>([]);

const getClientIdToData = async (client: Client) => {
  if (!client.client_name || !client.id) return;
  const dataList = await Promise.all(
    argsList.map(async (args) => {
      return await constDaysByClientId(client.id as string, args[0], args[1]);
    })
  );

  const row = {
    clientName: client.client_name,
    telOne: dataList[0],
    telTwo: dataList[1],
    telThree: dataList[2],
    telFour: dataList[3],
    telFive: dataList[4],
    faxOne: dataList[5],
    faxTwo: dataList[6],
    faxThree: dataList[7],
    faxFour: dataList[8],
    faxFive: dataList[9],
  };
  return row;
};

const loadRows = async () => {
  const rowsPre = (
    await Promise.all(
      clients.map(async (client) => {
        return await getClientIdToData(client);
      })
    )
  ).filter((row) => row !== undefined) as DispatchIndexTable[];
  rows.value = evaluator(rowsPre);
};

onMounted(() => {
  loadRows();
});
</script>
