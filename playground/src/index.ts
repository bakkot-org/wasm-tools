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

function update() {
  try {
    output.value = base64(parse(input.value));
  } catch (e) {
    (window as any).error = e;
    output.value = (e as Error).message;
  }
}

update();
input.addEventListener('input', debounce(update, 100e0));

(globalThis as any).parse = parse;
