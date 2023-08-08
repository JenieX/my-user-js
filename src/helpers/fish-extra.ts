// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// https://developer.mozilla.org/en-US/docs/Web/API/Response/ok

export interface FishOptions extends RequestInit {
  method?: GM.Request['method'],
  headers?: GM.Request['headers'],
  body?: Blob | FormData | string,
  onProgress?: GM.Request['onprogress'],
}

async function fishResponse(url: string, fishOptions: FishOptions = {}): Promise<Response> {
  const { method, headers, body, onProgress } = fishOptions;

  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      url,
      method: method ?? 'GET',
      headers,
      data: body,
      responseType: 'blob',
      onprogress: onProgress,
      onload({ response, statusText, status }) {
        const ok = status >= 200 && status < 300;
        if (!ok) {
          reject(new Error(`Request to ${url} ended with ${status} status`));

          return;
        }

        const properResponse = new Response(response as Blob, {
          statusText,
          status,
        });

        resolve(properResponse);
      },
      onerror({ status }) {
        reject(new Error(`Request to ${url} ended with ${status} status`));
      },
    });
  });
}

const fishX = {
  async buffer(url: string, fishOptions?: FishOptions): Promise<ArrayBuffer> {
    const response = await fishResponse(url, fishOptions);
    const responseBuffer = await response.arrayBuffer();

    return responseBuffer;
  },

  async blob(url: string, fishOptions?: FishOptions): Promise<Blob> {
    const response = await fishResponse(url, fishOptions);
    const responseBlob = await response.blob();

    return responseBlob;
  },

  async json(url: string, fishOptions?: FishOptions): Promise<object> {
    const response = await fishResponse(url, fishOptions);
    const responseJSON = await response.json() as object;

    return responseJSON;
  },

  async text(url: string, fishOptions?: FishOptions): Promise<string> {
    const response = await fishResponse(url, fishOptions);
    const responseText = await response.text();

    return responseText;
  },

  async document(url: string, fishOptions?: FishOptions): Promise<Document> {
    const response = await fishResponse(url, fishOptions);
    const responseText = await response.text();

    const parser = new DOMParser();

    return parser.parseFromString(responseText, 'text/html');
  },
};

export default fishX;
