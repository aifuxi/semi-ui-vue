import type { SemiGlobalConfig } from './types';

class SemiGlobal {
  config: SemiGlobalConfig = {};
}

export const semiGlobal = new SemiGlobal();

export default semiGlobal;
