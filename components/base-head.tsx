import { FC } from 'react';
import Head from 'next/head';

import PlausibleProvider from 'next-plausible';

import { SERVER_CONFIG } from '@/config/server';

const { plausibleDomain, plausibleServerUrl } = SERVER_CONFIG;

const BaseHead: FC = () => (
  <Head>
    <PlausibleProvider
      // this site url, runtime only
      domain={plausibleDomain}
      selfHosted
      // server url, without /js/script.js, both here and in next.config.mjs
      // build time, Docker build-args, Github Actions
      customDomain={plausibleServerUrl}
      // true for debugging
      // trackLocalhost={true}
    />
  </Head>
);

export default BaseHead;
