import qrcode from 'qrcode-terminal';

// Promisified wrapper around qrcode-terminal's callback API. `small: true` keeps
// the code compact enough for most terminals.
export function renderQr(text: string): Promise<string> {
  return new Promise((resolve) => {
    qrcode.generate(text, { small: true }, (output: string) => resolve(output));
  });
}
