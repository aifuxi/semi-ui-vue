// SSR tests must import the public source in a real Node environment. A DOM
// shim here would hide import-time access to browser globals.
if (typeof window !== 'undefined' || typeof document !== 'undefined') {
  throw new Error('The node test project must run without browser globals.');
}
