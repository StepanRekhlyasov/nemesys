<template>
  工事中
</template>

<script setup lang="ts">
import { graphType } from '../Models';

const props = defineProps<{
  branch_id: string;
  dateRangeProps: { from: string; to: string } | undefined;
  organization_id: string;
  branch_user_list: { id: string; name: string }[];
  graph_type: graphType;
}>();
</script>
