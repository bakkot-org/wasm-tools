import { parse } from '../component-built/component.js';

function debounce(f: (...args: unknown[]) => void, ms: number) {
  let timeout: number | null;
  return function (this: unknown, ...args: unknown[]) {
    let fresh = timeout == null;
    if (!fresh) clearTimeout(timeout!);
    timeout = setTimeout(() => {
      timeout = null;
      if (!fresh) f.apply(this, args);
    }, ms);
    if (fresh) f.apply(this, args);
  };
}

// TODO replace this function once https://github.com/tc39/proposal-arraybuffer-base64 ships
function base64(bytes: Uint8Array) {
  // @ts-expect-error it's fine
  return btoa(String.fromCharCode.apply(null, bytes));
}

let input: HTMLTextAreaElement = document.querySelector('#input')!;
let output: HTMLTextAreaElement = document.querySelector('#output')!;
let downloadButton: HTMLButtonElement = document.querySelector('#download')!;

let lastBytes: Uint8Array;
function update() {
  try {
    lastBytes = parse(input.value);
    output.value = base64(lastBytes);
    downloadButton.disabled = false;
  } catch (e) {
    (window as any).error = e;
    output.value = (e as Error).message;
    downloadButton.disabled = true;
    return;
  }
}

update();
input.addEventListener('input', debounce(update, 100));

downloadButton.addEventListener('click', () => {
  let blob = new Blob([lastBytes], { type: 'application/wasm' });
  let link = document.createElement('a');
  let url = URL.createObjectURL(blob);
  link.href = url;
  link.download = 'wasm-tools-parse-output.wasm';
  link.click();
  URL.revokeObjectURL(url);
});

(globalThis as any).parse = parse;
