<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { defineProps, ref, watch } from 'vue';
  import draggable from 'vuedraggable'

  import { CertificateForm, Industry } from 'src/shared/model/Industry.model';
  import { QInput } from 'quasar';
  const { t } = useI18n({ useScope: 'global' });

  const props =  defineProps<{
      activeIndustry: Industry | null
  }>()

  const emit = defineEmits<{
      (e: 'newCertificateForm', data: string),
      (e: 'deleteCertificateForm', id: string),
      (e: 'updateCertificateForm'),
      (e: 'sortCertificateForm', event: {
          newIndex: number,
          oldIndex: number
      })
  }>()

  const newCertificateForm = ref('')
  const inputVal = ref<QInput>()

  const titleExists = (val: string, exception = '') => {
      if (props.activeIndustry) {
          const titles = [
              ...Object.values(props.activeIndustry.uniqueItems.typeSpecificItems || {}).map(item => item.title),
              ...Object.values(props.activeIndustry.uniqueItems.facilityForms || {}).map(item => item.title),
              ...Object.values(props.activeIndustry.uniqueItems.occupationForms || {}).map(item => item.title),
              ...Object.values(props.activeIndustry.uniqueItems.certificateForms || {}).map(item => item.title)
          ].filter(title => title !== exception)
          return !titles.includes(val)
      }

      return false
  }

  const newCertificateFormHandle = () => {
      if(inputVal.value && inputVal.value.validate()) {
          emit('newCertificateForm', newCertificateForm.value)
          newCertificateForm.value = ''
          setTimeout(()=>{
            inputVal.value?.resetValidation()
          }, 1)
      }
  }

  const deleteCertificateForm = (id: string) => {
      emit('deleteCertificateForm', id)
  }

  const updateCertificateForm = (val: string, initVal: string) => {
      if(val !== initVal) {
          emit('updateCertificateForm')
      }
  }

  const updateItemsOrder = (event: {
      newIndex: number,
      oldIndex: number
  }) => {

      const { newIndex, oldIndex } = event;

      emit('sortCertificateForm', { newIndex, oldIndex })
  }
  const sortedList = ref<[string, CertificateForm][]>()
  watch(()=>props.activeIndustry, ()=>{
    if(props.activeIndustry){
      sortedList.value = Object.entries(props.activeIndustry.uniqueItems.certificateForms)
      sortedList.value.sort((a, b)=>{
        if(b?.[1].order && a?.[1].order){
          return a?.[1].order - b?.[1].order
        }
        return 0
      })
    }
  }, {deep: true, immediate: true})
  </script>

  <template>
      <div v-if="activeIndustry">
          <div v-if="Object.keys(activeIndustry.uniqueItems.certificateForms).length">

              <draggable :list="sortedList" :itemKey="({index})=>index" handle=".cursor_grab" @end="updateItemsOrder">
                  <template #item="{ element, index }">
                      <div class="row items-center q-mt-md" :key="element[1].order">
                          <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md cursor_grab"/>

                          <div class="q-mr-md">{{ t('KPI.certificate') + ` ${index + 1}` }}</div>

                          <div>
                              <q-input class="q-mr-md" outlined readonly dense v-model="element[1].title"/>

                              <q-popup-edit
                                  :validate="(val) => (val !== null && val !== '' && /^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(val) && titleExists(val, element[1].title))"
                                  v-model="element[1].title"
                                  :cover="false"
                                  :offset="[0, 10]"
                                  v-slot="scope"
                                  @save="updateCertificateForm">

                                  <q-input
                                      color="accent"
                                      v-model="scope.value"
                                      dense autofocus
                                      @keyup.enter="scope.set"
                                      :rules="[
                                          val => scope.validate(val) || 'Validation error'
                                      ]">
                                      <template v-slot:append>
                                          <q-icon name="edit" size="sm" color="accent" class="cursor-pointer" @click.stop.prevent="scope.set"/>
                                      </template>
                                  </q-input>
                              </q-popup-edit>
                          </div>

                          <q-btn @click="deleteCertificateForm(element[0] as string)" icon="mdi-delete-outline" round flat>
                          </q-btn>
                      </div>
                  </template>
              </draggable>
          </div>

          <div class="row items-center q-mt-md">
              <q-icon name="mdi-menu" size="1.2rem" class="q-mr-md"/>

              <div class="q-mr-md">{{ t('KPI.certificate') + ` ${Object.keys(activeIndustry.uniqueItems.certificateForms).length + 1}` }}</div>

              <q-input
                  class="q-mr-md" outlined dense
                  v-model="newCertificateForm"
                  ref="inputVal"
                  :rules="[
                       (val) => (val && val.length > 0) || '',
                       (val) => (/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(val)) || 'Invalid input. Keys should start with a letter, $ or _, and should not contain spaces or special characters.',
                       (val) => titleExists(val) || 'Title already exists'
                  ]"
                  color="accent" hide-bottom-space/>

              <div class="q-mr-md">
                  <q-btn color="accent" icon="mdi-plus" :label="t('industry.addLine')" size="sm" @click="newCertificateFormHandle"/>
              </div>
          </div>
      </div>
  </template>

  <style lang="scss" scoped>
  .cursor_grab {
      cursor: grab;
  }
  </style>
