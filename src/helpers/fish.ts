import { FishOptions, FishReturn } from './types';

async function fishResponse(url: string, fishOptions: FishOptions): FishReturn {
  let response: Response;
  let abortTimeOut: NodeJS.Timeout | undefined;

  if (fishOptions.timeOut === undefined || fishOptions.signal !== undefined) {
    response = await fetch(url, fishOptions);
  } else {
    const controller = new AbortController();
    const { signal } = controller;

    abortTimeOut = setTimeout(() => { controller.abort(); }, fishOptions.timeOut);
    response = await fetch(url, { signal, ...fishOptions });
  }

  if (!response.ok) {
    throw new Error(`Request to ${response.url} ended with ${response.status} status`);
  }

  return { response, abortTimeOut };
}

export default {
  async buffer(url: string, fishOptions: FishOptions = {}): Promise<ArrayBuffer> {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);

    const responseBuffer = await response.arrayBuffer();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseBuffer;
  },

  async blob(url: string, fishOptions: FishOptions = {}): Promise<Blob> {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);

    const responseBlob = await response.blob();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseBlob;
  },

  async json(url: string, fishOptions: FishOptions = {}): Promise<object> {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);

    const responseJSON = await response.json() as object;
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseJSON;
  },

  async text(url: string, fishOptions: FishOptions = {}): Promise<string> {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);

    const responseText = await response.text();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseText;
  },

  async document(url: string, fishOptions: FishOptions = {}): Promise<Document> {
    // const response = await fishResponse(url, fishOptions);
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseText = await response.text();

    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    const parser = new DOMParser();

    return parser.parseFromString(responseText, 'text/html');
  },
};
