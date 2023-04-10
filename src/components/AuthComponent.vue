<template>
  <div>

    <div class="full-width col">
      <div class="full-width q-pa-lg">
        <div class="full-width text-center">
          <img :alt="$t('systemName') + ' Logo'" src="~assets/CLI_dot.png" style="width: 100px; height: 100px" />
          <div v-html="$t('systemName')" class="text-h5 q-ma-lg"></div>
          <div v-html="$t('login.subTitle')" class="q-pb-md"></div>
        </div>
        <div class="full-width">

          <q-form @submit="submitForm">

            <q-input outlined class="q-mb-md" :label="$t('menu.admin.organizationsTable.organizationCode')"
              v-model="formData.code" dense :rules="[organizationCodeRule]" />
            <q-input outlined class="q-mb-md" type="email" :label="$t('login.email')" v-model="formData.email" dense
              :error="showError" error-message="Please enter a valid email address." />
            <q-input outlined class="q-mb-md" type="password" :label="$t('login.password')" v-model="formData.password"
              dense :rules="[(val) => val != '' || 'Password is required']" />
            <div class="row q-pt-xs">
              <q-btn type="submit" color="primary" :label="$t('login.button')" unelevated />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
  <q-inner-loading :showing="loading" color="primary" />
</template>

<script lang="ts">
//import router from '../router';
import { useRouter } from 'vue-router';
import { defineComponent, reactive, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { FirebaseError } from '@firebase/util';
import { useUserStore } from 'src/stores/user';
import { organizationCodeRule } from './handlers/rules';

export default defineComponent({
  name: 'AuthComponent',
  components: {},
  setup() {
    const $q = useQuasar();
    const { t, te } = useI18n({ useScope: 'global' });
    const formData = reactive({
      name: '',
      email: '',
      password: '',
      accept: false,
      code: '',
    });

    const title = 'Sign in';
    const resetPwdDialog = ref(false);
    const showError = ref(false);
    const emailValid = ref(true);
    const router = useRouter();
    const user = useUserStore()
    const loading = ref(false)
    const submitForm = () => {
      signInExistingUser(formData.email, formData.password);
    };

    const createErrorAlert = (message: string) => {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message,
      });
    }

    const signInExistingUser = async (email = '', password = '') => {
      const auth = getAuth();
      loading.value = true
      try {
        const creds = await signInWithEmailAndPassword(auth, email, password)

        const affiliation = await user.checkUserAffiliation(formData.code, creds.user.uid)

        if (!affiliation) {
          await auth.signOut()
          throw new Error(t('login.enterValidCode'))
        }

        router.push('/');
      } catch (error) {
        loading.value = false
        if (error instanceof FirebaseError) {

          const errorCode = error.code
          let errorText = '';
          console.log(t('authErrorCode.' + errorCode));

          if (te('authErrorCode.' + errorCode)) {
            errorText = t('authErrorCode.' + errorCode);
          } else {
            errorText = t('failed');
          }

          createErrorAlert(errorText)

          return

        }

        if (error instanceof Error) {
          createErrorAlert(error.message)
          return
        }

        createErrorAlert(t('failed'))

      }

      loading.value = false

    };
    return {
      loading,
      formData,
      resetPwdDialog,
      showError,
      emailValid,
      submitForm,
      signInExistingUser,
      title,
      organizationCodeRule,
    };
  },
});
</script>
