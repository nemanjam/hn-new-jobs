import { Agent } from 'https';

import axios from 'axios';

import type { AxiosError, AxiosInstance } from 'axios';

// 7 seconds in reality
const timeout = 15 * 1000;

export const axiosConfig = {
  timeout,
  // important to terminate connection and prevent timeout exception
  httpsAgent: new Agent({
    keepAlive: true,
    timeout,
    scheduling: 'fifo',
  }),
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

export const handleAxiosError = (error: AxiosError): Error => {
  const { request, response } = error;
  let message;
  let errorData: any;

  if (response) {
    const { status, statusText, data } = response;
    errorData = { status, statusText, data };
    message = `Axios response error. Status: ${status}, Message: ${statusText}, Data: ${data}`;
  } else if (request) {
    // don't log request, big useless object
    message = `Axios no response error. Request: ${request}`;
  } else {
    message = `Axios request error. ${error.message}`;
  }

  // console.error('Stringified error: ', JSON.stringify(error, null, 2));
  console.error(message, errorData);
  return new Error(message);
};
