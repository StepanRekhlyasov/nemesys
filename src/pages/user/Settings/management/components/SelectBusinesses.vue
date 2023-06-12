<template>
  <q-select outlined dense :model-value="model" :options="businesses" option-label='name' emit-value map-options
    @update:model-value="(value: BusinessType) => { model = value; emit('onBusinessChange', value.id) }"
    :rules="[(val: BusinessType) => val?.name && val?.name?.length > 0 || '']" :loading="loading"  />
</template>

<script setup lang="ts">
import { getFirestore } from '@firebase/firestore';
import { Business } from 'src/shared/model';
import { useBusiness } from 'src/stores/business';
import { useOrganization } from 'src/stores/organization';
import { onMounted, ref } from 'vue';

type BusinessType = Business & { id: string }

interface SelectBusinessesProps{
  organizationId?: string
}

const props = defineProps<SelectBusinessesProps>()

const businesses = ref<BusinessType[]>([])
const organization = useOrganization()
const business = useBusiness()
const db = getFirestore();
const model = ref<BusinessType>()
const loading = ref(true)

const currentOrganizationId = props.organizationId ?? organization.currentOrganizationId

function toBusinessType(b: { [id: string]: Business }): BusinessType[] {
  let businessTypeArr: BusinessType[] = []
  for (let key in b) {
    let businessType = JSON.parse(JSON.stringify(b[key]))
    businessType.id = key
    businessTypeArr.push(businessType)
  }

  return businessTypeArr
}

const emit = defineEmits<{ (e: 'onBusinessChange', id: string) }>()

onMounted(async () => {
  const businessesArr = toBusinessType(await business.getBusinesses(db, currentOrganizationId))
  if (!businessesArr || !businessesArr.length) {
    return
  }
  businesses.value = businessesArr

  model.value = businesses.value[0]
  emit('onBusinessChange', model.value.id)
  loading.value = false
})

</script>


