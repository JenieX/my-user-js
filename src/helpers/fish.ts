import { FishOptions, FishReturn } from './types';

async function fishResponse(url: string, fishOptions: FishOptions): FishReturn {
  const { through, ...requestOptions } = fishOptions;

  let response: Response;
  let abortTimeOut: NodeJS.Timeout | undefined;

  switch (through) {
    case 'GM': {
      alert('The option "through: GM" is not supported in this module');
      throw new Error();
    }

    default: {
      if (requestOptions.timeOut === undefined || requestOptions.signal !== undefined) {
        response = await fetch(url, requestOptions);
      } else {
        const controller = new AbortController();
        const { signal } = controller;

        abortTimeOut = setTimeout(() => { controller.abort(); }, requestOptions.timeOut);
        response = await fetch(url, { signal, ...requestOptions });
      }

      if (!response.ok) {
        throw new Error(`Request to ${response.url} ended with ${response.status} status`);
      }

      break;
    }
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
