import { boot } from 'quasar/wrappers'
// import firebase from 'firebase'
import { initializeApp, getCurrentUser } from 'firebase/app';
import { getAuth } from "firebase/auth";

import { config } from "../helpers/firebaseConfig";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  initializeApp(config);
  const auth = getAuth();
  router.beforeEach((to, from, next) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(function (user) {
        unsubscribe();
        if (!user && to.path != "/auth/login") {
          next("/auth/login");
        } else if (user) {
          // if (!user.emailVerified && to.path != "/auth/verifyEmail" && to.path != "/auth/completeAccount") {
          //   next("/auth/verifyEmail");
          // } else
          if (to.path == '/auth/login' || to.path == "/auth/verifyEmail" || to.path == "/auth/completeAccount") {
            next("/");
          } else {
            next()
          }
        } else {
          next();
        }
        resolve(user);
      }, reject)
    });
  })
})

