<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';

const basicContainer = useTemplateRef<HTMLDivElement>('basicContainer');
const handlerContainer = useTemplateRef<HTMLDivElement>('handlerContainer');
const handler = useTemplateRef<HTMLButtonElement>('handler');
const relativeContainer = useTemplateRef<HTMLDivElement>('relativeContainer');
const inputContainer = useTemplateRef<HTMLDivElement>('inputContainer');
const status = shallowRef('Ready');

function customMove(element: HTMLElement, top: number, left: number): void {
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
  element.dataset.customPosition = `${left},${top}`;
  status.value = `Custom ${left},${top}`;
}
</script>

<template>
  <div class="drag-move-scenario" data-testid="drag-move-vue">
    <section class="drag-move-scenario__card">
      <h3>Constrained absolute</h3>
      <div ref="basicContainer" class="drag-move-scenario__stage">
        <DragMove :constrainer="() => basicContainer" @mouse-up="status = 'Basic moved'">
          <div class="drag-move-scenario__block" data-parity-target="drag-move-basic">Drag me</div>
        </DragMove>
      </div>
    </section>

    <section class="drag-move-scenario__card">
      <h3>Dedicated handler</h3>
      <div ref="handlerContainer" class="drag-move-scenario__stage">
        <DragMove
          :constrainer="() => handlerContainer"
          :handler="() => handler"
          @mouse-up="status = 'Handler moved'"
        >
          <div
            class="drag-move-scenario__block drag-move-scenario__block--handler"
            data-parity-target="drag-move-handler"
          >
            <button ref="handler" type="button" class="drag-move-scenario__handle">Move</button>
            <span>Body</span>
          </div>
        </DragMove>
      </div>
    </section>

    <section class="drag-move-scenario__card">
      <h3>Relative layout</h3>
      <div
        ref="relativeContainer"
        class="drag-move-scenario__stage drag-move-scenario__stage--relative"
      >
        <DragMove position-strategy="relative" :constrainer="() => relativeContainer">
          <button
            type="button"
            class="drag-move-scenario__relative"
            data-parity-target="drag-move-relative"
          >
            Relative
          </button>
        </DragMove>
      </div>
    </section>

    <section class="drag-move-scenario__card">
      <h3>Input guard + custom move</h3>
      <div ref="inputContainer" class="drag-move-scenario__stage">
        <DragMove :constrainer="() => inputContainer">
          <label
            class="drag-move-scenario__input-block"
            data-parity-target="drag-move-input-blocked"
          >
            Blocked
            <input aria-label="Blocked drag input" value="edit" />
          </label>
        </DragMove>
        <DragMove allow-input-drag :constrainer="() => inputContainer" :custom-move="customMove">
          <label
            class="drag-move-scenario__input-block drag-move-scenario__input-block--allowed"
            data-parity-target="drag-move-input-allowed"
          >
            Allowed
            <input aria-label="Allowed drag input" value="drag" />
          </label>
        </DragMove>
      </div>
    </section>

    <output class="drag-move-scenario__status" aria-live="polite">{{ status }}</output>
  </div>
</template>
