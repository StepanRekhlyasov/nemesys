import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const prefectureList = computed(() => {
  return [
    {
      label: t('prefectures.hokkaido'),
      value: 'hokkaido',
    },
    {
      label: t('prefectures.aomori'),
      value: 'aomori',
    },
    {
      label: t('prefectures.iwate'),
      value: 'iwate',
    },
    {
      label: t('prefectures.miyagi'),
      value: 'miyagi',
    },
    {
      label: t('prefectures.akita'),
      value: 'akita',
    },
    {
      label: t('prefectures.yamagata'),
      value: 'yamagata',
    },
    {
      label: t('prefectures.fukushima'),
      value: 'fukushima',
    },
    {
      label: t('prefectures.ibaraki'),
      value: 'ibaraki',
    },
    {
      label: t('prefectures.tochigi'),
      value: 'tochigi',
    },
    {
      label: t('prefectures.gunma'),
      value: 'gunma',
    },
    {
      label: t('prefectures.saitama'),
      value: 'saitama',
    },
    {
      label: t('prefectures.chiba'),
      value: 'chiba',
    },
    {
      label: t('prefectures.tokyo'),
      value: 'tokyo',
    },
    {
      label: t('prefectures.kanagawa'),
      value: 'kanagawa',
    },
    {
      label: t('prefectures.nigata'),
      value: 'nigata',
    },
    {
      label: t('prefectures.toyama'),
      value: 'toyama',
    },
    {
      label: t('prefectures.ishikawa'),
      value: 'ishikawa',
    },
    {
      label: t('prefectures.fukui'),
      value: 'fukui',
    },
    {
      label: t('prefectures.yamanashi'),
      value: 'yamanashi',
    },
    {
      label: t('prefectures.nagano'),
      value: 'nagano',
    },
    {
      label: t('prefectures.gifu'),
      value: 'gifu',
    },
    {
      label: t('prefectures.shizuoka'),
      value: 'shizuoka',
    },
    {
      label: t('prefectures.aichi'),
      value: 'aichi',
    },
    {
      label: t('prefectures.mie'),
      value: 'mie',
    },
    {
      label: t('prefectures.shiga'),
      value: 'shiga',
    },
    {
      label: t('prefectures.kyoto'),
      value: 'kyoto',
    },
    {
      label: t('prefectures.osaka'),
      value: 'osaka',
    },
    {
      label: t('prefectures.hyogo'),
      value: 'hyogo',
    },
    {
      label: t('prefectures.nara'),
      value: 'nara',
    },
    {
      label: t('prefectures.wakayama'),
      value: 'wakayama',
    },
    {
      label: t('prefectures.tottori'),
      value: 'tottori',
    },
    {
      label: t('prefectures.shimane'),
      value: 'shimane',
    },
    {
      label: t('prefectures.okayama'),
      value: 'okayama',
    },
    {
      label: t('prefectures.hiroshima'),
      value: 'hiroshima',
    },
    {
      label: t('prefectures.yamaguchi'),
      value: 'yamaguchi',
    },
    {
      label: t('prefectures.tokushima'),
      value: 'tokushima',
    },
    {
      label: t('prefectures.kagawa'),
      value: 'kagawa',
    },
    {
      label: t('prefectures.ehime'),
      value: 'ehime',
    },
    {
      label: t('prefectures.kochi'),
      value: 'kochi',
    },
    {
      label: t('prefectures.fukuoka'),
      value: 'fukuoka',
    },
    {
      label: t('prefectures.saga'),
      value: 'saga',
    },
    {
      label: t('prefectures.nagasaki'),
      value: 'nagasaki',
    },
    {
      label: t('prefectures.kumamoto'),
      value: 'kumamoto',
    },
    {
      label: t('prefectures.oita'),
      value: 'oita',
    },
    {
      label: t('prefectures.miyazaki'),
      value: 'miyazaki',
    },
    {
      label: t('prefectures.kagoshima'),
      value: 'kagoshima',
    },
    {
      label: t('prefectures.okinawa'),
      value: 'okinawa',
    },
    
  ];
});

