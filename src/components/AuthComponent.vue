<template>
  <div>
    <div class="full-width col">
      <div class="full-width q-pa-lg">
        <div class="full-width text-center">
          <img
            :alt="$t('systemName') + ' Logo'"
            src="~assets/CLI_dot.png"
            style="width: 100px; height: 100px"
          >
          <div v-html="$t('systemName')" class="text-h5 q-ma-lg"></div>
          <div v-html="$t('login.subTitle')" class="q-pb-md"></div>
        </div>
        <div class="full-width">
          <q-form @submit="submitForm">
            <q-input outlined class="q-mb-md" type="email" :label="$t('login.email')" v-model="formData.email"
              dense :error="showError"
              error-message="Please enter a valid email address." />
            <q-input outlined class="q-mb-md" type="password" :label="$t('login.password')"  v-model="formData.password" dense
              :rules="[val => val!= '' || 'Password is required']" />
            <div class="row q-pt-xs">
              <q-btn type="submit" color="primary" :label="$t('login.button')"  unelevated />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from '../router'
import { defineComponent, reactive, ref, computed } from 'vue';
import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'AuthComponent',
  components: {
  },
  setup (props, context) {
    const $q = useQuasar();
    const { t, te } = useI18n({ useScope: 'global' })
    const formData = reactive({
      name: '',
      email: '',
      password: '',
      accept: false
    });

    const title = "Sign in";
    const resetPwdDialog = ref(false);
    const showError = ref(false);
    const emailValid = ref(true);

    const submitForm = () => {
      signInExistingUser(formData.email, formData.password)
    };
    const signInExistingUser = (email, password) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // $q.notify({message: 'Sign in success'})
          router.push('/')
        })
        .catch(error => {
          const errorCode = error.code;
          let errorText = "";
          console.log(t('authErrorCode.' + errorCode));

          if (te('authErrorCode.' + errorCode)) {
            errorText = t('authErrorCode.' + errorCode);
          }
          else {
            errorText = t('failed');
          }
          // ..
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: errorText,
          });
        })
    };
    return {
      formData,
      resetPwdDialog,
      showError,
      emailValid,
      submitForm,
      signInExistingUser,
      title
    }
  }
})
</script>
