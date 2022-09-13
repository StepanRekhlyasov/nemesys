import { boot } from 'quasar/wrappers'
import FirebaseUploader from '../services/uploader' // the file from above

export default boot(({ app }) => {
  app.component('FirebaseUploader', FirebaseUploader)
})


