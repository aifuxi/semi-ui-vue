import React, { useCallback, useMemo, useState } from 'react';
import { LOTTIE_ANIMATION_DATA_BLUE, LOTTIE_ANIMATION_DATA_ORANGE } from '@workspace/test-infra';
import Lottie, { type LottieAnimationItem } from '@semi-v2.102.0/lottie';

function stopAtFirstFrame(animation: LottieAnimationItem | null): void {
  animation?.goToAndStop(0, true);
}

function ExternalLottie(): React.ReactElement {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const setExternalContainer = useCallback((element: HTMLDivElement | null) => {
    setContainer(element);
  }, []);
  const params = useMemo(
    () => ({
      animationData: LOTTIE_ANIMATION_DATA_BLUE,
      autoplay: false,
      container: container as Element,
      loop: false,
    }),
    [container],
  );

  return (
    <>
      <div
        ref={setExternalContainer}
        className="lottie-scenario__external"
        data-parity-target="lottie-external"
      />
      {container ? <Lottie params={params} getAnimationInstance={stopAtFirstFrame} /> : null}
    </>
  );
}

export function LottieScenario(): React.ReactElement {
  const [orange, setOrange] = useState(false);
  const variantParams = useMemo(
    () => ({
      animationData: orange ? LOTTIE_ANIMATION_DATA_ORANGE : LOTTIE_ANIMATION_DATA_BLUE,
      autoplay: false,
      loop: false,
    }),
    [orange],
  );

  return (
    <div className="lottie-scenario" data-testid="lottie-reference">
      <section className="lottie-scenario__card">
        <h3>Internal SVG container</h3>
        <p>Fixed local animation data with autoplay and loop disabled.</p>
        <Lottie
          params={{
            animationData: LOTTIE_ANIMATION_DATA_BLUE,
            autoplay: false,
            loop: false,
          }}
          width="120px"
          height="120px"
          getAnimationInstance={stopAtFirstFrame}
          data-parity-target="lottie-basic"
          aria-label="Blue Lottie square"
        />
      </section>

      <section className="lottie-scenario__card">
        <h3>Reactive params</h3>
        <p>Replacing animationData destroys and reloads the animation instance.</p>
        <Lottie
          params={variantParams}
          width="120px"
          height="120px"
          getAnimationInstance={stopAtFirstFrame}
          data-parity-target="lottie-variant"
        />
        <button type="button" onClick={() => setOrange((value) => !value)}>
          Use {orange ? 'blue' : 'orange'} data
        </button>
        <output className="lottie-scenario__status">Variant {orange ? 'orange' : 'blue'}</output>
      </section>

      <section className="lottie-scenario__card lottie-scenario__card--wide">
        <h3>Caller-owned container</h3>
        <p>The component renders no internal root when params.container is provided.</p>
        <ExternalLottie />
      </section>
    </div>
  );
}
