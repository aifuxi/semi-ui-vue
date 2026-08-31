import React, { useState } from 'react';
import LocaleConsumer from '@semi-v2.102.0/locale-consumer';
import LocaleProvider from '@semi-v2.102.0/locale-provider';
import enGB from '@semi-v2.102.0/locale-en-gb';
import jaJP from '@semi-v2.102.0/locale-ja-jp';

interface TimePickerLocale {
  begin: string;
}

interface PaginationLocale {
  jumpTo: string;
}

export function LocaleScenario(): React.ReactElement {
  const [japanese, setJapanese] = useState(false);
  const activeLocale = japanese ? jaJP : enGB;

  return (
    <div className="locale-scenario" data-testid="locale-reference">
      <section className="locale-scenario__card">
        <h3>English provider</h3>
        <LocaleProvider locale={enGB}>
          <LocaleConsumer<TimePickerLocale> componentName="TimePicker">
            {(localeData, localeCode, dateFnsLocale, currency) => (
              <output data-parity-target="locale-en-gb" className="locale-scenario__value">
                {`${localeCode} · ${currency} · ${localeData.begin} · ${dateFnsLocale.code}`}
              </output>
            )}
          </LocaleConsumer>
        </LocaleProvider>
      </section>

      <section className="locale-scenario__card">
        <h3>Japanese provider</h3>
        <LocaleProvider locale={jaJP}>
          <LocaleConsumer<PaginationLocale> componentName="Pagination">
            {(localeData, localeCode, dateFnsLocale, currency) => (
              <output data-parity-target="locale-ja-jp" className="locale-scenario__value">
                {`${localeCode} · ${currency} · ${localeData.jumpTo} · ${dateFnsLocale.code}`}
              </output>
            )}
          </LocaleConsumer>
        </LocaleProvider>
      </section>

      <section className="locale-scenario__card locale-scenario__card--wide">
        <h3>Reactive locale</h3>
        <LocaleProvider locale={activeLocale}>
          <LocaleConsumer<TimePickerLocale> componentName="TimePicker">
            {(localeData, localeCode) => (
              <output data-parity-target="locale-switch" className="locale-scenario__value">
                {`${localeCode} · ${localeData.begin}`}
              </output>
            )}
          </LocaleConsumer>
        </LocaleProvider>
        <button type="button" onClick={() => setJapanese((value) => !value)}>
          Use {japanese ? 'English' : 'Japanese'} locale
        </button>
      </section>
    </div>
  );
}
