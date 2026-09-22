<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import { shallowRef, computed } from 'vue';
import zh_CN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import en_GB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import en_US from '@aifuxi/semi-ui-vue/locale/source/en_US';
import ko_KR from '@aifuxi/semi-ui-vue/locale/source/ko_KR';
import ja_JP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';
import ar from '@aifuxi/semi-ui-vue/locale/source/ar';
import vi_VN from '@aifuxi/semi-ui-vue/locale/source/vi_VN';
import ru_RU from '@aifuxi/semi-ui-vue/locale/source/ru_RU';
import id_ID from '@aifuxi/semi-ui-vue/locale/source/id_ID';
import ms_MY from '@aifuxi/semi-ui-vue/locale/source/ms_MY';
import th_TH from '@aifuxi/semi-ui-vue/locale/source/th_TH';
import tr_TR from '@aifuxi/semi-ui-vue/locale/source/tr_TR';
import pt_BR from '@aifuxi/semi-ui-vue/locale/source/pt_BR';
import zh_TW from '@aifuxi/semi-ui-vue/locale/source/zh_TW';
import sv_SE from '@aifuxi/semi-ui-vue/locale/source/sv_SE';
import pl_PL from '@aifuxi/semi-ui-vue/locale/source/pl_PL';
import nl_NL from '@aifuxi/semi-ui-vue/locale/source/nl_NL';
import es from '@aifuxi/semi-ui-vue/locale/source/es';
import it from '@aifuxi/semi-ui-vue/locale/source/it';
import de from '@aifuxi/semi-ui-vue/locale/source/de';
import fr from '@aifuxi/semi-ui-vue/locale/source/fr';
import ro from '@aifuxi/semi-ui-vue/locale/source/ro';
const languages = {
  zh_CN,
  en_GB,
  en_US,
  ko_KR,
  ja_JP,
  ar,
  vi_VN,
  ru_RU,
  id_ID,
  ms_MY,
  th_TH,
  tr_TR,
  pt_BR,
  zh_TW,
  sv_SE,
  pl_PL,
  nl_NL,
  es,
  it,
  de,
  fr,
  ro,
};
const localeCode = shallowRef<keyof typeof languages>('zh_CN');
const locale = computed(() => languages[localeCode.value]);
function onLanguageChange(value: unknown) {
  if (typeof value === 'string' && value in languages)
    localeCode.value = value as keyof typeof languages;
}
</script>

<template>
  <div>
    <div style="padding-bottom: 20px">
      <Select
        inset-label="切换语言"
        style="width: 250px"
        default-value="zh_CN"
        @change="onLanguageChange"
        ><SelectOption value="zh_CN">简体中文</SelectOption
        ><SelectOption value="en_US">英语（美）</SelectOption
        ><SelectOption value="en_GB">英语（英）</SelectOption
        ><SelectOption value="ja_JP">日语</SelectOption
        ><SelectOption value="ko_KR">韩语</SelectOption
        ><SelectOption value="ar">阿拉伯语</SelectOption
        ><SelectOption value="vi_VN">越南语</SelectOption
        ><SelectOption value="ru_RU">俄罗斯语</SelectOption
        ><SelectOption value="id_ID">印尼语</SelectOption
        ><SelectOption value="ms_MY">马来语</SelectOption
        ><SelectOption value="th_TH">泰语</SelectOption
        ><SelectOption value="tr_TR">土耳其语</SelectOption
        ><SelectOption value="pt_BR">葡萄牙语（巴西）</SelectOption
        ><SelectOption value="zh_TW">繁体中文</SelectOption
        ><SelectOption value="es">西班牙语</SelectOption><SelectOption value="de">德语</SelectOption
        ><SelectOption value="it">意大利语</SelectOption><SelectOption value="fr">法语</SelectOption
        ><SelectOption value="ro">罗马尼亚语</SelectOption
        ><SelectOption value="sv_SE">瑞典语</SelectOption
        ><SelectOption value="pl_PL">波兰语</SelectOption
        ><SelectOption value="nl_NL">荷兰语</SelectOption></Select
      >
    </div>
    <LocaleProvider :locale="locale"
      ><InputNumber :key="localeCode" currency :default-value="123456.78"
    /></LocaleProvider>
  </div>
</template>
