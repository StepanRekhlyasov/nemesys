import { boot } from 'quasar/wrappers';
import pinia from 'src/stores';

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.use(pinia);
});
