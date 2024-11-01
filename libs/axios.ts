import { Agent } from 'https';

import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import axiosRetry from 'axios-retry';

import type { AxiosError, AxiosInstance, AxiosResponse, CreateAxiosDefaults } from 'axios';

// 7 seconds in reality
const timeout = 15 * 1000;

export const axiosConfig: CreateAxiosDefaults = {
  timeout,
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

export const axiosRetryInstance = rateLimit(axiosInstance, {
  maxRequests: 1, // Only one request at a time
  perMilliseconds: 5 * 1000, // 5-second delay between requests
});

/** true: retry, false: do not retry */
const retryCondition = (error: AxiosError): boolean => {
  // no logging here, called 2 times

  switch (true) {
    // retry
    case error.code === 'ETIMEDOUT':
      return true;

    // do not retry
    default:
      return false;
  }
};

axiosRetry(axiosRetryInstance, {
  retries: 3, // Retry up to 3 times
  shouldResetTimeout: true,
  retryCondition: (error: AxiosError) => {
    console.log(
      `retryCondition, error.code: ${error.code}, error.response.status: ${error.response?.status}`
    );

    return retryCondition(error);
  },
  retryDelay: axiosRetry.exponentialDelay,
});

type ResponseData = string;

let successCount = 0;
let failureCount = 0;

const onResponse = (response: AxiosResponse<ResponseData>): AxiosResponse<ResponseData> => {
  successCount++;
  console.info(
    `response success, count: ${successCount}, response:data: ${response.data.slice(0, 50)}`
  );

  return response;
};

const onResponseError = (error: AxiosError<ResponseData>): Promise<AxiosError<ResponseData>> => {
  failureCount++;
  const retryMessage = retryCondition(error) ? 'retried...' : 'FINAL';
  console.error(
    `interceptor, response error, ${retryMessage}, count: ${failureCount}, code: ${error.code}`
  );

  return Promise.reject(error);
};

axiosRetryInstance.interceptors.response.use(onResponse, onResponseError);
