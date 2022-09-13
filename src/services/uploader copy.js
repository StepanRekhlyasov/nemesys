// MyUploader.js
import { createUploaderComponent } from 'quasar'
import { computed } from 'vue'

// export a Vue component
export default createUploaderComponent({
  // defining the QUploader plugin here

  name: 'FirebaseUploader', // your component's name

  props: {
    // ...your custom props
  },

  emits: [
    // ...your custom events name list
  ],

  injectPlugin ({ props, emit, helpers }) {
    // can call any other composables here
    // as this function will run in the component's setup()

    // [ REQUIRED! ]
    // We're working on uploading files
    const isUploading = computed(() => {
       return true
    })

    // [ optional ]
    // Shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    const isBusy = computed(() => {
       return true
    })

    // [ REQUIRED! ]
    // Abort and clean up any process
    // that is in progress
    function abort () {
      console.log('abortttttttttttt')
    }

    // [ REQUIRED! ]
    // Start the uploading process
    function upload () {
      console.log('uploadingggggggggggggggggggg')
    }

    return {
      isUploading,
      isBusy,

      abort,
      upload
    }
  }
})
