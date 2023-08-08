<template>
  <PageHader>
      {{ t('menu.admin.dataOutputDisplay') }}
  </PageHader>
      <div class="bold-text q-mt-lg q-ml-sm">
          <q-avatar square size="10px" color="purple" class="q-mr-sm" />
          <span ></span> SMS {{
              t('menu.admin.dataOutputDisplay') }}
      </div>

      <div class="box1 row">
                <div class="col-3 text-right q-ml-xl">
                    <q-input outlined dense v-model="postingFromSms" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingFromSms">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <div class="col-1 text-center self-center q-pt-sm ">～</div>
                <div class="col-3">
                  <div>
                    <q-input outlined dense v-model="postingTosms" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingTosms">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
          </div>
          <div class="row text-right q-mt-sm q-ml-md">
              <div class="col-3 q-ml-xs">
                  <q-btn color="purple" text-color="white" @click="downloadCSVForSms('sms', {postingFromSms,postingTosms})">{{
                      t('common.csvOutput') }}</q-btn>
              </div>
          </div>
          <div class="bold-text q-mt-lg q-ml-sm">
          <q-avatar square size="10px" color="purple" class="q-mr-sm" />
          <span ></span> FAX {{
              t('menu.admin.dataOutputDisplay') }}
      </div>
      <div class="box1 row">
                <div class="col-3 text-right q-ml-xl">
                    <q-input outlined dense v-model="postingFromFax" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingFromFax">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <div class="col-1 text-center self-center q-pt-sm ">～</div>
                <div class="col-3">
                  <div>
                    <q-input outlined dense v-model="postingToFax" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingToFax">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
          </div>
          <div class="row text-right q-mt-sm q-ml-md">
              <div class="col-3 q-ml-xs">
                  <q-btn color="purple" text-color="white" @click="downloadCSVForFax('fax', {postingFromFax,postingToFax})">{{
                      t('common.csvOutput') }}</q-btn>
              </div>
          </div>
          <div class="bold-text q-mt-lg q-ml-sm">
          <q-avatar square size="10px" color="purple" class="q-mr-sm" />
          <span ></span> BO {{
              t('menu.admin.dataOutputDisplay') }}
      </div>
      <div class="box1 row">
                <div class="col-3 text-right q-ml-xl">
                    <q-input outlined dense v-model="postingFromBo" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingFromBo">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                </div>
                <div class="col-1 text-center self-center q-pt-sm ">～</div>
                <div class="col-3">
                  <div>
                    <q-input outlined dense v-model="postingToBo" mask="date" clearable
                      clear-icon="close">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="postingToBo">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup :label="$t('common.close')" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
          </div>
          <div class="row text-right q-mt-sm q-ml-md">
              <div class="col-3 q-ml-xs">
                  <q-btn color="purple" text-color="white" @click="downloadCSVForBo('BO', {postingFromBo,postingToBo})">{{
                      t('common.csvOutput') }}</q-btn>
              </div>
          </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Alert } from 'src/shared/utils/Alert.utils';
import { useI18n } from 'vue-i18n';
import PageHader from 'src/components/PageHeader.vue';
import { useDataOutput } from 'src/stores/dataOutput'
const { t } = useI18n({ useScope: 'global' });
const triggerURL = process.env.downloadCSVUrl;
const dataOutput = useDataOutput();
const postingFromSms = ref('')
const postingTosms = ref('')
const postingFromFax = ref('')
const postingToFax = ref('')
const postingFromBo = ref('')
const postingToBo = ref('')
const downloadCSVForSms = async (collectionName: string, date: { postingFromSms: string; postingTosms: string; } | null) => {
  let fetchURL = `${triggerURL}?collection=${collectionName}`
  if (typeof date === 'object' && (!date?.postingFromSms || !date.postingFromSms)) {
      Alert.warning();
      return;
  }
  fetchURL = `${fetchURL}&from=${date.postingFromSms}&to=${date.postingTosms}`
  await dataOutput.downloadCSV(fetchURL, collectionName)
  onResetSms();
}
const downloadCSVForFax = async (collectionName: string, date: { postingFromFax: string; postingToFax: string; } | null) => {
  let fetchURL = `${triggerURL}?collection=${collectionName}`
  if (typeof date === 'object' && (!date?.postingFromFax || !date.postingToFax)) {
      Alert.warning();
      return;
  }
  fetchURL = `${fetchURL}&from=${date.postingFromFax}&to=${date.postingToFax}`
  await dataOutput.downloadCSV(fetchURL, collectionName)
  onResetFax();
}
const downloadCSVForBo = async (collectionName: string, date: { postingFromBo: string; postingToBo: string; } | null) => {
  let fetchURL = `${triggerURL}?collection=${collectionName}`
  if (typeof date === 'object' && (!date?.postingFromBo || !date.postingToBo)) {
      Alert.warning();
      return;
  }
  fetchURL = `${fetchURL}&from=${date.postingFromBo}&to=${date.postingToBo}`
  await dataOutput.downloadCSV(fetchURL, collectionName)
  onResetBo();
}
const onResetSms = () => {
   postingFromSms.value = ''
 postingTosms.value = ''
  };
  const onResetFax = () => {
 postingFromFax.value = ''
 postingToFax.value = ''
  };
  const onResetBo = () => {
 postingFromBo.value = ''
 postingToBo.value = ''
  };


</script>
<style lang="scss">
.bold-text {
  font-weight: bold;
}

.box1 {
  margin-left: 10vw;
}

.custom-color {
  color: purple
}
</style>
