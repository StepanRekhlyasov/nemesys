<template>
  <div class="text-caption text-weight-medium">
    <q-card class="q-ma-md">
      <div class="row justify-between q-pt-md q-pl-md q-pr-md">
        <div v-html="$t('settings.users.contactPersonName')" class="text-h5"></div>
      </div>
      <q-form @submit="onSubmit">
        <q-card-section>
        </q-card-section>
        <q-separator inset />
        <q-card-section class="column q-gutter-md">
          <q-input :label="$t('settings.users.fio')" v-model="formState.fio"></q-input>
          <q-input :label="$t('settings.users.email')" v-model="formState.email"></q-input>
          <q-input :label="$t('settings.users.password')" type="password" v-model="formState.password"></q-input>
          <div class="password-criteria q-pa-sm">
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat>Cancel</q-btn>
          <q-btn color="primary" type="submit">Create Account</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { getAuth } from 'firebase/auth';

  const auth = getAuth();
  console.log(auth)
  type UserFormState = {
    fio: string,
    email: string,
    password: string
  }
  const formState = reactive({
   fio: '',
   email: '',
   password: ''
  } as UserFormState)

  function onSubmit(): void {
    console.log(formState)
  }
</script>
