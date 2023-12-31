import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useMaintainModeStore = defineStore('maintainMode', () => {
  const maintainMode = ref(false)

  const setMaintainModeEnabled = () => {
    maintainMode.value = true
  }

  const setMaintainModeDisabled = () => {
    maintainMode.value = false
  }

  return {
    maintainMode,
    setMaintainModeEnabled,
    setMaintainModeDisabled
  }
})
