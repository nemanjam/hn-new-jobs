import { axiosRateLimitInstance } from '@/libs/axios';
import { createNumberOfSecondsSincePreviousCall, getAppNow } from '@/libs/datetime';
import { cacheHttp } from '@/libs/keyv';
import logger from '@/libs/winston';
import { SERVER_CONFIG } from '@/config/server';

const { cacheHttpTtlMinutes } = SERVER_CONFIG;

const secondsAgo = createNumberOfSecondsSincePreviousCall();

export const fetchApi = async <T>(url: string): Promise<T> => {
  // no try catch, use interceptor

  // check cache
  const cachedContent = await cacheHttp.get<T>(url);
  if (cachedContent) {
    logger.info(`Cache hit, url: ${url}`);
    return cachedContent;
  }

  logger.info(`Cache miss, url: ${url}`);

  // fetch
  // query params must be in url for cache key
  const response = await axiosRateLimitInstance.get<T>(url);
  const apiResponse = response.data;

  logger.info(
    `axiosRateLimitInstance call, ${getAppNow()}, ${secondsAgo()} seconds after previous`
  );

  // cache
  await cacheHttp.set(url, apiResponse, cacheHttpTtlMinutes * 60 * 1000); // pass as arg

  return apiResponse;
};
