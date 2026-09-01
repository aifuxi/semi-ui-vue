// Keep the pinned Chat state machines behind the private integration boundary.
// @ts-expect-error -- vendor TypeScript is compiled only through this private package.
export { default as ChatFoundation } from '../../../vendor/semi-design/packages/semi-foundation/chat/foundation';
// @ts-expect-error -- vendor TypeScript is compiled only through this private package.
export { default as ChatInputBoxFoundation } from '../../../vendor/semi-design/packages/semi-foundation/chat/inputboxFoundation';
// @ts-expect-error -- vendor TypeScript is compiled only through this private package.
export { default as ChatBoxActionFoundation } from '../../../vendor/semi-design/packages/semi-foundation/chat/chatBoxActionFoundation';
// @ts-expect-error -- public declarations expose a local facade instead of vendor paths.
export {
  cssClasses as chatCssClasses,
  strings as chatStrings,
} from '../../../vendor/semi-design/packages/semi-foundation/chat/constants';
