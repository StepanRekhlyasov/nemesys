import { defineStore } from 'pinia';

export const useAdminClientFactory = defineStore('admin-client-factory', {
  state: () => ({
    rows: [
        {
        id: 1,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）',
    },
    {
        id: 2,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）'
    },
    {
        id: 3,
        office: {
            name: 'いろは事業所',
            kind: 'ooooooooooooooooo株式会社'
        },
        distance: '100.0m',
        location: {
            area: '大阪府 大阪市中央区',
            address: '町名番地1111-1111-1111',
            building: 'ビル名'
        },
        telephone: '03-0000-0000',
        fax: '03-0000-0000',
        officeMaster: '✓（事業所）',
        clientMaster: '✓（クライアント',
        basicInfo: '✓（基本情報変更済）'
    }
    ]
  }),

  actions: {
    
  }
});