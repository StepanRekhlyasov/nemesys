import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import { User as FirebaseUser } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

import { config } from '../helpers/firebaseConfig';
import { getUserPermissions } from 'src/shared/utils/User.utils';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  initializeApp(config);
  const auth = getAuth();
  router.beforeEach((to, from, next) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(function (
        user: FirebaseUser | null
      ) {
        unsubscribe();
        if (!user && to.path != '/auth/login') {
          next('/auth/login');
        } else if (user) {
          const permissions = getUserPermissions();
          if (to.meta.permissions) {
            const routePermission = to.meta.permissions
            if (!routePermission.some(permission => permissions.includes(permission))) {
              next('/')
            }
          }
          // if (!user.emailVerified && to.path != "/auth/verifyEmail" && to.path != "/auth/completeAccount") {
          //   next("/auth/verifyEmail");
          // } else
          if (
            to.path == '/auth/login' ||
            to.path == '/auth/verifyEmail' ||
            to.path == '/auth/completeAccount'
          ) {
            next('/');
          } else {
            next();
          }
        } else {
          next();
        }
        //resolve(user);
      },
      reject);
    });
  });
});
