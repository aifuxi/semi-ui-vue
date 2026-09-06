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
  { value: 'zh_CN', label: 'Chinese' },
  { value: 'en_GB', label: 'English' },
  { value: 'ja_JP', label: 'Japanese' },
  { value: 'ko_KR', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'vi_VN', label: 'Vietnamese' },
  { value: 'ru_RU', label: 'Russian' },
  { value: 'id_ID', label: 'Indonesian' },
  { value: 'ms_MY', label: 'Malay' },
  { value: 'th_TH', label: 'Thai' },
  { value: 'tr_TR', label: 'Turkish' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'fr', label: 'French' },
  { value: 'ro', label: 'Romanian' },
  { value: 'sv_SE', label: 'Swedish' },
  { value: 'pl_PL', label: 'Polish' },
  { value: 'nl_NL', label: 'Dutch' },
  { value: 'az', label: 'Azerbaijani' },
  { value: 'bn_IN', label: 'Bengali' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'ca', label: 'Catalan' },
  { value: 'cs_CZ', label: 'Czech' },
  { value: 'ceb_PH', label: 'Cebuano' },
  { value: 'da', label: 'Danish' },
  { value: 'el_GR', label: 'Greek' },
  { value: 'es_419', label: 'Spanish (Latin America)' },
  { value: 'et', label: 'Estonian' },
  { value: 'fa_IR', label: 'Persian' },
  { value: 'fil_PH', label: 'Filipino' },
  { value: 'fi_FI', label: 'Finnish' },
  { value: 'fr_CA', label: 'French (Canada)' },
  { value: 'ga', label: 'Irish' },
  { value: 'he_IL', label: 'Hebrew' },
  { value: 'hi_IN', label: 'Hindi' },
  { value: 'hr', label: 'Croatian' },
  { value: 'hu_HU', label: 'Hungarian' },
  { value: 'is', label: 'Icelandic' },
  { value: 'jv_ID', label: 'Javanese' },
  { value: 'kk', label: 'Kazakh' },
  { value: 'km_KH', label: 'Khmer' },
  { value: 'lt', label: 'Lithuanian' },
  { value: 'lv', label: 'Latvian' },
  { value: 'my_MM', label: 'Burmese' },
  { value: 'nb', label: 'Norwegian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'sk', label: 'Slovak' },
  { value: 'sl', label: 'Slovenian' },
  { value: 'sq', label: 'Albanian' },
  { value: 'sw', label: 'Swahili' },
  { value: 'uk_UA', label: 'Ukrainian' },
  { value: 'ur', label: 'Urdu' },
  { value: 'uz', label: 'Uzbek' },
];
const localeCode = shallowRef<keyof typeof languages>('en_GB');
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
      ><template #prefix>Switch Language</template></Select
    >
  </div>
  <LocaleProvider :locale="locale"
    ><ConfigProvider :locale="locale" :direction="localeCode === 'ar' ? 'rtl' : 'ltr'">
      <ComponentsInputs :key="`inputs-${localeCode}`" /><ComponentsDisplay
        :key="`display-${localeCode}`"
      /><ComponentsNavigation :key="`navigation-${localeCode}`" /> </ConfigProvider
  ></LocaleProvider>
</template>
