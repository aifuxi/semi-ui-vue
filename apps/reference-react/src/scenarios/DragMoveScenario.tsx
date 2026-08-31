import React, { useCallback, useRef, useState } from 'react';
import DragMove from '@semi-v2.102.0/drag-move';

export function DragMoveScenario(): React.ReactElement {
  const basicContainer = useRef<HTMLDivElement>(null);
  const handlerContainer = useRef<HTMLDivElement>(null);
  const handler = useRef<HTMLButtonElement>(null);
  const relativeContainer = useRef<HTMLDivElement>(null);
  const inputContainer = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Ready');

  const customMove = useCallback((element: HTMLElement, top: number, left: number) => {
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.dataset.customPosition = `${left},${top}`;
    setStatus(`Custom ${left},${top}`);
  }, []);

  return (
    <div className="drag-move-scenario" data-testid="drag-move-reference">
      <section className="drag-move-scenario__card">
        <h3>Constrained absolute</h3>
        <div className="drag-move-scenario__stage" ref={basicContainer}>
          <DragMove
            constrainer={() => basicContainer.current}
            onMouseUp={() => setStatus('Basic moved')}
          >
            <div className="drag-move-scenario__block" data-parity-target="drag-move-basic">
              Drag me
            </div>
          </DragMove>
        </div>
      </section>

      <section className="drag-move-scenario__card">
        <h3>Dedicated handler</h3>
        <div className="drag-move-scenario__stage" ref={handlerContainer}>
          <DragMove
            constrainer={() => handlerContainer.current}
            handler={() => handler.current}
            onMouseUp={() => setStatus('Handler moved')}
          >
            <div
              className="drag-move-scenario__block drag-move-scenario__block--handler"
              data-parity-target="drag-move-handler"
            >
              <button ref={handler} type="button" className="drag-move-scenario__handle">
                Move
              </button>
              <span>Body</span>
            </div>
          </DragMove>
        </div>
      </section>

      <section className="drag-move-scenario__card">
        <h3>Relative layout</h3>
        <div
          className="drag-move-scenario__stage drag-move-scenario__stage--relative"
          ref={relativeContainer}
        >
          <DragMove positionStrategy="relative" constrainer={() => relativeContainer.current}>
            <button
              type="button"
              className="drag-move-scenario__relative"
              data-parity-target="drag-move-relative"
            >
              Relative
            </button>
          </DragMove>
        </div>
      </section>

      <section className="drag-move-scenario__card">
        <h3>Input guard + custom move</h3>
        <div className="drag-move-scenario__stage" ref={inputContainer}>
          <DragMove constrainer={() => inputContainer.current}>
            <label
              className="drag-move-scenario__input-block"
              data-parity-target="drag-move-input-blocked"
            >
              Blocked
              <input aria-label="Blocked drag input" defaultValue="edit" />
            </label>
          </DragMove>
          <DragMove
            allowInputDrag
            constrainer={() => inputContainer.current}
            customMove={customMove}
          >
            <label
              className="drag-move-scenario__input-block drag-move-scenario__input-block--allowed"
              data-parity-target="drag-move-input-allowed"
            >
              Allowed
              <input aria-label="Allowed drag input" defaultValue="drag" />
            </label>
          </DragMove>
        </div>
      </section>

      <output className="drag-move-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
