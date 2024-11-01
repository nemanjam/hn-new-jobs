import { Agent } from 'https';

import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import axiosRetry from 'axios-retry';
import { JSDOM } from 'jsdom';

import { SCRAPER } from '@/constants/scraper';

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
  retries: 5, // Retry up to 3 times
  shouldResetTimeout: true,
  retryDelay: axiosRetry.exponentialDelay,
  // retryCondition: (error: AxiosError) => {
  //   console.log(
  //     `retryCondition, error.code: ${error.code}, error.response.status: ${error.response?.status}`
  //   );

  //   return retryCondition(error);
  // },
  onRetry: (retryCount: number, error: AxiosError) => {
    console.error(`onRetry, count: ${retryCount}, code: ${error.code}`);
  },
  onMaxRetryTimesExceeded: (error: AxiosError, retryCount: number) => {
    console.error(`onMaxRetryTimesExceeded, count: ${retryCount}, code: ${error.code}`);
  },
  // ! use this for retry condition
  validateResponse: (response: AxiosResponse<ResponseData>): boolean => {
    console.info(`validateResponse, response:data: ${response.data.slice(0, 50)}`);

    const htmlContent = response.data;
    const doc: Document = new JSDOM(htmlContent).window.document;

    const { threadPostFirstTrSelector } = SCRAPER.threads;
    const threadFirstTrNodes = doc.querySelectorAll<HTMLTableRowElement>(threadPostFirstTrSelector);

    const isSuccess = threadFirstTrNodes.length > 0;
    return isSuccess;
  },
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

// axiosRetryInstance.interceptors.response.use(onResponse, onResponseError);
