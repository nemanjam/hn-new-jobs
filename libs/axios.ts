import { Agent } from 'https';

import axios from 'axios';
import rateLimit from 'axios-rate-limit';

import logger from '@/libs/winston';
import { Singleton } from '@/utils/singleton';
import { ALGOLIA } from '@/constants/algolia';

import type { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios';

export type ResponseData = string;

const { timeout, delayBetweenRequests } = ALGOLIA.axios;

export const axiosConfig: CreateAxiosDefaults = {
  timeout,
  httpsAgent: new Agent({
    timeout,
    keepAlive: true,
    scheduling: 'fifo',
  }),
};

/** Must use singleton. */
class MyAxiosInstance {
  private static createAxiosInstance(): AxiosInstance {
    return axios.create(axiosConfig);
  }

  public static getAxiosInstance(): AxiosInstance {
    return Singleton.getInstance<AxiosInstance>('MyAxiosInstance', () =>
      MyAxiosInstance.createAxiosInstance()
    );
  }
}

/** Without retries. */
export const axiosInstance = MyAxiosInstance.getAxiosInstance();

/** Main rate limit instance to use. */
export const axiosRateLimitInstance = rateLimit(axiosInstance, {
  maxRequests: 1, // Only one request at a time
  perMilliseconds: delayBetweenRequests,
});

const onResponseError = (error: AxiosError<ResponseData>): void => {
  logger.error(`interceptor, error, code: ${error.code}`);

  // http fail silently
  // return Promise.reject(error);
};

axiosRateLimitInstance.interceptors.response.use(null, onResponseError);
