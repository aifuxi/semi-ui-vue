<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import '@aifuxi/semi-theme-default/locale.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import ComponentsInputs from './ComponentsInputs.vue';
import ComponentsDisplay from './ComponentsDisplay.vue';
import ComponentsNavigation from './ComponentsNavigation.vue';
import zh_CN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import en_US from '@aifuxi/semi-ui-vue/locale/source/en_US';
import en_GB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import ja_JP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';
import ko_KR from '@aifuxi/semi-ui-vue/locale/source/ko_KR';
import ar from '@aifuxi/semi-ui-vue/locale/source/ar';
import vi_VN from '@aifuxi/semi-ui-vue/locale/source/vi_VN';
import ru_RU from '@aifuxi/semi-ui-vue/locale/source/ru_RU';
import id_ID from '@aifuxi/semi-ui-vue/locale/source/id_ID';
import ms_MY from '@aifuxi/semi-ui-vue/locale/source/ms_MY';
import th_TH from '@aifuxi/semi-ui-vue/locale/source/th_TH';
import tr_TR from '@aifuxi/semi-ui-vue/locale/source/tr_TR';
import pt_BR from '@aifuxi/semi-ui-vue/locale/source/pt_BR';
import zh_TW from '@aifuxi/semi-ui-vue/locale/source/zh_TW';
import es from '@aifuxi/semi-ui-vue/locale/source/es';
import de from '@aifuxi/semi-ui-vue/locale/source/de';
import it from '@aifuxi/semi-ui-vue/locale/source/it';
import fr from '@aifuxi/semi-ui-vue/locale/source/fr';
import ro from '@aifuxi/semi-ui-vue/locale/source/ro';
import sv_SE from '@aifuxi/semi-ui-vue/locale/source/sv_SE';
import pl_PL from '@aifuxi/semi-ui-vue/locale/source/pl_PL';
import nl_NL from '@aifuxi/semi-ui-vue/locale/source/nl_NL';
import az from '@aifuxi/semi-ui-vue/locale/source/az';
import bn_IN from '@aifuxi/semi-ui-vue/locale/source/bn_IN';
import bg from '@aifuxi/semi-ui-vue/locale/source/bg';
import ca from '@aifuxi/semi-ui-vue/locale/source/ca';
import cs_CZ from '@aifuxi/semi-ui-vue/locale/source/cs_CZ';
import ceb_PH from '@aifuxi/semi-ui-vue/locale/source/ceb_PH';
import da from '@aifuxi/semi-ui-vue/locale/source/da';
import el_GR from '@aifuxi/semi-ui-vue/locale/source/el_GR';
import es_419 from '@aifuxi/semi-ui-vue/locale/source/es_419';
import et from '@aifuxi/semi-ui-vue/locale/source/et';
import fa_IR from '@aifuxi/semi-ui-vue/locale/source/fa_IR';
import fil_PH from '@aifuxi/semi-ui-vue/locale/source/fil_PH';
import fi_FI from '@aifuxi/semi-ui-vue/locale/source/fi_FI';
import fr_CA from '@aifuxi/semi-ui-vue/locale/source/fr_CA';
import ga from '@aifuxi/semi-ui-vue/locale/source/ga';
import he_IL from '@aifuxi/semi-ui-vue/locale/source/he_IL';
import hi_IN from '@aifuxi/semi-ui-vue/locale/source/hi_IN';
import hr from '@aifuxi/semi-ui-vue/locale/source/hr';
import hu_HU from '@aifuxi/semi-ui-vue/locale/source/hu_HU';
import is from '@aifuxi/semi-ui-vue/locale/source/is';
import jv_ID from '@aifuxi/semi-ui-vue/locale/source/jv_ID';
import kk from '@aifuxi/semi-ui-vue/locale/source/kk';
import km_KH from '@aifuxi/semi-ui-vue/locale/source/km_KH';
import lt from '@aifuxi/semi-ui-vue/locale/source/lt';
import lv from '@aifuxi/semi-ui-vue/locale/source/lv';
import my_MM from '@aifuxi/semi-ui-vue/locale/source/my_MM';
import nb from '@aifuxi/semi-ui-vue/locale/source/nb';
import pt from '@aifuxi/semi-ui-vue/locale/source/pt';
import sk from '@aifuxi/semi-ui-vue/locale/source/sk';
import sl from '@aifuxi/semi-ui-vue/locale/source/sl';
import sq from '@aifuxi/semi-ui-vue/locale/source/sq';
import sw from '@aifuxi/semi-ui-vue/locale/source/sw';
import uk_UA from '@aifuxi/semi-ui-vue/locale/source/uk_UA';
import ur from '@aifuxi/semi-ui-vue/locale/source/ur';
import uz from '@aifuxi/semi-ui-vue/locale/source/uz';
const languages = {
  zh_CN,
  en_US,
  en_GB,
  ja_JP,
  ko_KR,
  ar,
  vi_VN,
  ru_RU,
  id_ID,
  ms_MY,
  th_TH,
  tr_TR,
  pt_BR,
  zh_TW,
  es,
  de,
  it,
  fr,
  ro,
  sv_SE,
  pl_PL,
  nl_NL,
  az,
  bn_IN,
  bg,
  ca,
  cs_CZ,
  ceb_PH,
  da,
  el_GR,
  es_419,
  et,
  fa_IR,
  fil_PH,
  fi_FI,
  fr_CA,
  ga,
  he_IL,
  hi_IN,
  hr,
  hu_HU,
  is,
  jv_ID,
  kk,
  km_KH,
  lt,
  lv,
  my_MM,
  nb,
  pt,
  sk,
  sl,
  sq,
  sw,
  uk_UA,
  ur,
  uz,
};
const options = [
  { value: 'zh_CN', label: '简体中文' },
  { value: 'en_US', label: '英语（美）' },
  { value: 'en_GB', label: '英语（英）' },
  { value: 'ja_JP', label: '日语' },
  { value: 'ko_KR', label: '韩语' },
  { value: 'ar', label: '阿拉伯语' },
  { value: 'vi_VN', label: '越南语' },
  { value: 'ru_RU', label: '俄罗斯语' },
  { value: 'id_ID', label: '印尼语' },
  { value: 'ms_MY', label: '马来语' },
  { value: 'th_TH', label: '泰语' },
  { value: 'tr_TR', label: '土耳其语' },
  { value: 'pt_BR', label: '葡萄牙语（巴西）' },
  { value: 'zh_TW', label: '繁体中文' },
  { value: 'es', label: '西班牙语' },
  { value: 'de', label: '德语' },
  { value: 'it', label: '意大利语' },
  { value: 'fr', label: '法语' },
  { value: 'ro', label: '罗马尼亚语' },
  { value: 'sv_SE', label: '瑞典语' },
  { value: 'pl_PL', label: '波兰语' },
  { value: 'nl_NL', label: '荷兰语' },
  { value: 'az', label: '阿塞拜疆语' },
  { value: 'bn_IN', label: '孟加拉语' },
  { value: 'bg', label: '保加利亚语' },
  { value: 'ca', label: '加泰罗尼亚语' },
  { value: 'cs_CZ', label: '捷克语' },
  { value: 'ceb_PH', label: '宿务语' },
  { value: 'da', label: '丹麦语' },
  { value: 'el_GR', label: '希腊语' },
  { value: 'es_419', label: '西班牙语（拉美）' },
  { value: 'et', label: '爱沙尼亚语' },
  { value: 'fa_IR', label: '波斯语' },
  { value: 'fil_PH', label: '菲律宾语' },
  { value: 'fi_FI', label: '芬兰语' },
  { value: 'fr_CA', label: '法语（加）' },
  { value: 'ga', label: '爱尔兰语' },
  { value: 'he_IL', label: '希伯来语' },
  { value: 'hi_IN', label: '印地语' },
  { value: 'hr', label: '克罗地亚语' },
  { value: 'hu_HU', label: '匈牙利语' },
  { value: 'is', label: '冰岛语' },
  { value: 'jv_ID', label: '爪哇语' },
  { value: 'kk', label: '哈萨克语' },
  { value: 'km_KH', label: '高棉语' },
  { value: 'lt', label: '立陶宛语' },
  { value: 'lv', label: '拉脱维亚语' },
  { value: 'my_MM', label: '缅甸语' },
  { value: 'nb', label: '挪威语' },
  { value: 'pt', label: '葡萄牙语' },
  { value: 'sk', label: '斯洛伐克语' },
  { value: 'sl', label: '斯洛文尼亚语' },
  { value: 'sq', label: '阿尔巴尼亚语' },
  { value: 'sw', label: '斯瓦希里语' },
  { value: 'uk_UA', label: '乌克兰语' },
  { value: 'ur', label: '乌尔都语' },
  { value: 'uz', label: '乌兹别克语' },
];
const localeCode = shallowRef<keyof typeof languages>('zh_CN');
const locale = computed(() => languages[localeCode.value]);
function changeLanguage(value: unknown) {
  if (typeof value === 'string' && value in languages)
    localeCode.value = value as keyof typeof languages;
}
</script>
<template>
  <div :style="{ borderBottom: '1px solid var(--semi-color-border)', paddingBottom: '20px' }">
    <Select
      :value="localeCode"
      :option-list="options"
      :style="{ width: '250px' }"
      @change="changeLanguage"
      ><template #prefix>切换语言</template></Select
    >
  </div>
  <LocaleProvider :locale="locale"
    ><ConfigProvider :locale="locale" :direction="localeCode === 'ar' ? 'rtl' : 'ltr'">
      <ComponentsInputs :key="`inputs-${localeCode}`" /><ComponentsDisplay
        :key="`display-${localeCode}`"
      /><ComponentsNavigation :key="`navigation-${localeCode}`" /> </ConfigProvider
  ></LocaleProvider>
</template>
