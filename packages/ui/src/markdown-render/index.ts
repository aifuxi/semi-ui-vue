import MarkdownRenderBase from './MarkdownRender.vue';
import { markdownRenderDefaultComponents } from './components';
import type { MarkdownRenderComponent } from './types';

export const MarkdownRender = Object.assign(MarkdownRenderBase, {
  defaultComponents: markdownRenderDefaultComponents,
}) as unknown as MarkdownRenderComponent;

export { markdownRenderDefaultComponents } from './components';
export type {
  MarkdownRenderComponent,
  MarkdownRenderComponents,
  MarkdownRenderFormat,
  MarkdownRenderPluginList,
  MarkdownRenderProps,
  MarkdownRenderState,
} from './types';

export default MarkdownRender;
