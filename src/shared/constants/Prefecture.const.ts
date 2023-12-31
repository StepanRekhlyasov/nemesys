import { computed } from 'vue';
import { i18n } from 'boot/i18n'

const { t } = i18n.global

export const prefectureLocaleKey = {
  '北海道': 'hokkaido',
  '青森県': 'aomori',
  '岩手県': 'iwate',
  '宮城県': 'miyagi',
  '秋田県': 'akita',
  '山形県': 'yamagata',
  '福島県': 'fukushima',
  '茨城県': 'ibaraki',
  '栃木県': 'tochigi',
  '群馬県': 'gunma',
  '埼玉県': 'saitama',
  '千葉県': 'chiba',
  '東京都': 'tokyo',
  '神奈川県': 'kanagawa',
  '新潟県': 'niigata',
  '富山県': 'toyama',
  '石川県': 'ishikawa',
  '福井県': 'fukui',
  '山梨県': 'yamanashi',
  '長野県': 'nagano',
  '岐阜県': 'gifu',
  '静岡県': 'shizuoka',
  '愛知県': 'aichi',
  '三重県': 'mie',
  '滋賀県': 'shiga',
  '京都府': 'kyoto',
  '大阪府': 'osaka',
  '兵庫県': 'hyogo',
  '奈良県': 'nara',
  '和歌山県': 'wakayama',
  '鳥取県': 'tottori',
  '島根県': 'shimane',
  '岡山県': 'okayama',
  '広島県': 'hiroshima',
  '山口県': 'yamaguchi',
  '徳島県': 'tokushima',
  '香川県': 'kagawa',
  '愛媛県': 'ehime',
  '高知県': 'kochi',
  '福岡県': 'fukuoka',
  '佐賀県': 'saga',
  '長崎県': 'nagasaki',
  '熊本県': 'kumamoto',
  '大分県': 'oita',
  '宮崎県': 'miyazaki',
  '鹿児島県': 'kagoshima',
  '沖縄県': 'okinawa'
}

export const prefectureList = computed(() => {
  return [
    {
      label: t('prefectures.hokkaido'),
      value: '北海道',
    },
    {
      label: t('prefectures.aomori'),
      value: '青森県',
    },
    {
      label: t('prefectures.iwate'),
      value: '岩手県',
    },
    {
      label: t('prefectures.miyagi'),
      value: '宮城県',
    },
    {
      label: t('prefectures.akita'),
      value: '秋田県',
    },
    {
      label: t('prefectures.yamagata'),
      value: '山形県',
    },
    {
      label: t('prefectures.fukushima'),
      value: '福島県',
    },
    {
      label: t('prefectures.ibaraki'),
      value: '茨城県',
    },
    {
      label: t('prefectures.tochigi'),
      value: '栃木県',
    },
    {
      label: t('prefectures.gunma'),
      value: '群馬県',
    },
    {
      label: t('prefectures.saitama'),
      value: '埼玉県',
    },
    {
      label: t('prefectures.chiba'),
      value: '千葉県',
    },
    {
      label: t('prefectures.tokyo'),
      value: '東京都',
    },
    {
      label: t('prefectures.kanagawa'),
      value: '神奈川県',
    },
    {
      label: t('prefectures.nigata'),
      value: '新潟県',
    },
    {
      label: t('prefectures.toyama'),
      value: '富山県',
    },
    {
      label: t('prefectures.ishikawa'),
      value: '石川県',
    },
    {
      label: t('prefectures.fukui'),
      value: '福井県',
    },
    {
      label: t('prefectures.yamanashi'),
      value: '山梨県',
    },
    {
      label: t('prefectures.nagano'),
      value: '長野県',
    },
    {
      label: t('prefectures.gifu'),
      value: '岐阜県',
    },
    {
      label: t('prefectures.shizuoka'),
      value: '静岡県',
    },
    {
      label: t('prefectures.aichi'),
      value: '愛知県',
    },
    {
      label: t('prefectures.mie'),
      value: '三重県',
    },
    {
      label: t('prefectures.shiga'),
      value: '滋賀県',
    },
    {
      label: t('prefectures.kyoto'),
      value: '京都府',
    },
    {
      label: t('prefectures.osaka'),
      value: '大阪府',
    },
    {
      label: t('prefectures.hyogo'),
      value: '兵庫県',
    },
    {
      label: t('prefectures.nara'),
      value: '奈良県',
    },
    {
      label: t('prefectures.wakayama'),
      value: '和歌山県',
    },
    {
      label: t('prefectures.tottori'),
      value: '鳥取県',
    },
    {
      label: t('prefectures.shimane'),
      value: '島根県',
    },
    {
      label: t('prefectures.okayama'),
      value: '岡山県',
    },
    {
      label: t('prefectures.hiroshima'),
      value: '広島県',
    },
    {
      label: t('prefectures.yamaguchi'),
      value: '山口県',
    },
    {
      label: t('prefectures.tokushima'),
      value: '徳島県',
    },
    {
      label: t('prefectures.kagawa'),
      value: '香川県',
    },
    {
      label: t('prefectures.ehime'),
      value: '愛媛県',
    },
    {
      label: t('prefectures.kochi'),
      value: '高知県',
    },
    {
      label: t('prefectures.fukuoka'),
      value: '福岡県',
    },
    {
      label: t('prefectures.saga'),
      value: '佐賀県',
    },
    {
      label: t('prefectures.nagasaki'),
      value: '長崎県',
    },
    {
      label: t('prefectures.kumamoto'),
      value: '熊本県',
    },
    {
      label: t('prefectures.oita'),
      value: '大分県',
    },
    {
      label: t('prefectures.miyazaki'),
      value: '宮崎県',
    },
    {
      label: t('prefectures.kagoshima'),
      value: '鹿児島県',
    },
    {
      label: t('prefectures.okinawa'),
      value: '沖縄県',
    },
  ];
});