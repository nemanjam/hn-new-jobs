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
