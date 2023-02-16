export { }

import { Meta } from 'src/shared/model/Menu.molel';
import 'vue-router'

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface RouteMeta extends Meta { }
}
