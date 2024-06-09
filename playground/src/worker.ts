import { parse, print } from '../component-built/component.js';
import type { MessageToWorker } from './utilities.js'

postMessage('loaded');

addEventListener('message', ({ data }: { data: MessageToWorker }) => {
  switch (data.kind) {
    case 'parse': {
      try {
        let bytes = parse(data.source);
        postMessage({ success: true, bytes }, [bytes.buffer]);
      } catch (e) {
        postMessage({ success: false, error: (e as Error).message });
      }
      return;
    }
    case 'print': {
      try {
        let source = print(data.bytes);
        postMessage({ success: true, messageId: data.messageId, source });
      } catch (e) {
        postMessage({ success: false, messageId: data.messageId, error: (e as Error).message });
      }
      return;
    }
    default: {
      // @ts-expect-error the above should be exhaustive
      type remaining = typeof data.kind;
      console.error('got unknown message', data);
    }
  }
});
