import { Agent } from 'https';

import axios from 'axios';

import type { AxiosError, AxiosInstance, AxiosProgressEvent, CreateAxiosDefaults } from 'axios';

// 7 seconds in reality
const timeout = 15 * 1000;

export const axiosConfig: CreateAxiosDefaults = {
  timeout,
  // important to terminate connection and prevent timeout exception
  httpsAgent: new Agent({
    keepAlive: true,
    timeout,
    scheduling: 'fifo',
  }),
  maxRate: [100, 1024],
};

/** Must use singleton. */
export default class MyAxiosInstance {
  private static instance: AxiosInstance;

  public static getInstance(): AxiosInstance {
    if (!MyAxiosInstance.instance) MyAxiosInstance.instance = axios.create(axiosConfig);

    return MyAxiosInstance.instance;
  }
}

export const axiosInstance = MyAxiosInstance.getInstance();

export const handleAxiosError = (error: AxiosError): Error | void => {
  const { request, response } = error;

  switch (true) {
    case !!response: {
      const { status, statusText, data } = response;
      const errorData = { status, statusText, data };
      const message = `Axios response error. Status: ${status}, Message: ${statusText}, Data: ${data}`;

      console.error(message, errorData);
      throw new Error(message);
    }

    // case error.code === 'ECONNABORTED': {
    case error.code === 'ETIMEDOUT': {
      const message = 'Request timed out';
      console.error(message);
      break;
    }

    case !!request: {
      // don't log request, big useless object
      const message = `Axios no response error. Request: ${request}`;
      console.error(message);
      break;
    }

    default: {
      const message = `Axios request error. ${error.message}`;
      console.error(message);
      break;
    }
  }
};

// ------------------------
curl 'https://news.ycombinator.com/item?id=41709301&p=1' \
  --max-time 15000 \
  --keepalive-time 15000 \
  --limit-rate 1024B \
  -H "Connection: keep-alive"


  const axiosBrowserConfig: CreateAxiosDefaults = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      Priority: 'u=0, i',
      TE: 'trailers',
    },
    decompress: true,
  };