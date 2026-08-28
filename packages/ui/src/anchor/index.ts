import AnchorBase from './Anchor.vue';
import AnchorLink from './AnchorLink.vue';

export type AnchorCompoundComponent = typeof AnchorBase & {
  Link: typeof AnchorLink;
};

export const Anchor = Object.assign(AnchorBase, { Link: AnchorLink }) as AnchorCompoundComponent;

export { AnchorLink };
export { anchorContextKey } from './anchor-context';
export { ANCHOR_POSITIONS, ANCHOR_RAIL_THEMES, ANCHOR_SIZES } from './types';
export type {
  AnchorEmits,
  AnchorLinkProps,
  AnchorLinkSlots,
  AnchorPosition,
  AnchorProps,
  AnchorRailTheme,
  AnchorShowTooltip,
  AnchorSize,
  AnchorSlots,
} from './types';

export default Anchor;
