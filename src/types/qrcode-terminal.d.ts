// qrcode-terminal ships no official types and is CJS. Minimal ambient shim.
declare module 'qrcode-terminal' {
  interface GenerateOptions {
    small?: boolean;
  }
  function generate(
    input: string,
    options?: GenerateOptions,
    callback?: (output: string) => void,
  ): void;
  const qrcode: { generate: typeof generate };
  export default qrcode;
}
