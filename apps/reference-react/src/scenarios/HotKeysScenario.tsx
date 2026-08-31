import React, { useRef, useState } from 'react';
import HotKeys from '@semi-v2.102.0/hot-keys';

export function HotKeysScenario(): React.ReactElement {
  const localTarget = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Ready');

  return (
    <div className="hot-keys-scenario" data-testid="hot-keys-reference">
      <section className="hot-keys-scenario__card">
        <h3>Modifier combination</h3>
        <p>Strict Control + Shift + K matching.</p>
        <HotKeys
          hotKeys={[HotKeys.Keys.Control, HotKeys.Keys.Shift, HotKeys.Keys.K]}
          onHotKey={() => setStatus('Body Control+Shift+K')}
          data-parity-target="hot-keys-basic"
        />
      </section>

      <section className="hot-keys-scenario__card">
        <h3>Display labels</h3>
        <p>Content changes labels without changing the shortcut.</p>
        <HotKeys
          hotKeys={[HotKeys.Keys.Meta, HotKeys.Keys.Enter]}
          content={['⌘', 'Enter']}
          preventDefault
          onHotKey={() => setStatus('Body Meta+Enter')}
          data-parity-target="hot-keys-content"
        />
      </section>

      <section className="hot-keys-scenario__card">
        <h3>Custom render</h3>
        <p>The render node keeps the fixed root container.</p>
        <HotKeys
          hotKeys={[HotKeys.Keys.Control, HotKeys.Keys.R]}
          render={<span className="hot-keys-scenario__custom">Run command</span>}
          onClick={() => setStatus('Custom clicked')}
          data-parity-target="hot-keys-custom"
        />
      </section>

      <section className="hot-keys-scenario__card">
        <h3>Scoped target</h3>
        <div className="hot-keys-scenario__target" ref={localTarget} tabIndex={0}>
          <span>Focus or dispatch inside this panel</span>
          <HotKeys
            hotKeys={[HotKeys.Keys.Alt, HotKeys.Keys.ArrowDown]}
            content={['Alt', '↓']}
            getListenerTarget={() => localTarget.current as HTMLDivElement}
            onHotKey={() => setStatus('Local Alt+ArrowDown')}
            data-parity-target="hot-keys-local"
          />
        </div>
      </section>

      <output className="hot-keys-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
