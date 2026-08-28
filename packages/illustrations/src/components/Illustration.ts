import {
  defineComponent,
  type DefineComponent,
  type HTMLAttributes,
  type SVGAttributes,
  type VNode,
} from 'vue';

export type IllustrationProps = HTMLAttributes & SVGAttributes;
export type IllustrationSvgProps = Record<string, unknown>;
export type IllustrationSvgRenderer = (props: IllustrationSvgProps) => VNode;
export type SemiIllustrationComponent = DefineComponent<Record<string, never>>;

export function convertIllustration(
  renderSvg: IllustrationSvgRenderer,
  componentName: string,
): SemiIllustrationComponent {
  return defineComponent({
    name: componentName,
    inheritAttrs: false,
    setup(_props, { attrs }) {
      return () => renderSvg(attrs);
    },
  }) as SemiIllustrationComponent;
}
