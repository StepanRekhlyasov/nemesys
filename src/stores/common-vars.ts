import { defineStore } from 'pinia';

export const useCommonVars = defineStore('common-vars', {
  state: () => ({
    primary_theme: '#085374',
    purple_theme: '#4D0E4D',
    isAdminLayout: false,
  }),

  actions: {
    
  }
});