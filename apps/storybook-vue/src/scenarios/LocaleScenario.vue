<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import jaJP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';

const japanese = shallowRef(false);
const activeLocale = computed(() => (japanese.value ? jaJP : enGB));

function timePickerBegin(localeData: unknown): string {
  return (localeData as { begin: string }).begin;
}

function paginationJumpTo(localeData: unknown): string {
  return (localeData as { jumpTo: string }).jumpTo;
}
</script>

<template>
  <div class="locale-scenario" data-testid="locale-vue">
    <section class="locale-scenario__card">
      <h3>English provider</h3>
      <LocaleProvider :locale="enGB">
        <LocaleConsumer v-slot="slotProps" component-name="TimePicker">
          <output data-parity-target="locale-en-gb" class="locale-scenario__value">
            {{
              `${slotProps.localeCode} · ${slotProps.currency} · ${timePickerBegin(slotProps.localeData)} · ${slotProps.dateFnsLocale.code}`
            }}
          </output>
        </LocaleConsumer>
      </LocaleProvider>
    </section>

    <section class="locale-scenario__card">
      <h3>Japanese provider</h3>
      <LocaleProvider :locale="jaJP">
        <LocaleConsumer v-slot="slotProps" component-name="Pagination">
          <output data-parity-target="locale-ja-jp" class="locale-scenario__value">
            {{
              `${slotProps.localeCode} · ${slotProps.currency} · ${paginationJumpTo(slotProps.localeData)} · ${slotProps.dateFnsLocale.code}`
            }}
          </output>
        </LocaleConsumer>
      </LocaleProvider>
    </section>

    <section class="locale-scenario__card locale-scenario__card--wide">
      <h3>Reactive locale</h3>
      <LocaleProvider :locale="activeLocale">
        <LocaleConsumer v-slot="slotProps" component-name="TimePicker">
          <output data-parity-target="locale-switch" class="locale-scenario__value">
            {{ `${slotProps.localeCode} · ${timePickerBegin(slotProps.localeData)}` }}
          </output>
        </LocaleConsumer>
      </LocaleProvider>
      <button type="button" @click="japanese = !japanese">
        Use {{ japanese ? 'English' : 'Japanese' }} locale
      </button>
    </section>
  </div>
</template>
