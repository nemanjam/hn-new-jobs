import { FC } from 'react';

import PlausibleProvider from 'next-plausible';

import { SERVER_CONFIG } from '@/config/server';

const { plausibleDomain, plausibleServerUrl } = SERVER_CONFIG;

// ! must use native html <head />, fails with import Head from 'next/head';

const BaseHead: FC = () => (
  // eslint-disable-next-line @next/next/no-head-element
  <head>
    <PlausibleProvider
      // this site url, runtime only
      domain={plausibleDomain}
      selfHosted
      // server url, without /js/script.js, both here and in next.config.mjs
      // build time, Docker build-args, Github Actions
      customDomain={plausibleServerUrl}
      // true for debugging
      trackLocalhost={true}
    />
  </head>
);

export default BaseHead;
