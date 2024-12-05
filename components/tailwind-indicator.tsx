import { FC } from 'react';

import { SERVER_CONFIG } from '@/config/server';

const { nodeEnv } = SERVER_CONFIG;

const TailwindIndicator: FC = () => {
  if (nodeEnv === 'production') return null;

  return (
    <div className="fixed top-24 right-4 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block xs:hidden">2xs</div>
      <div className="hidden xs:block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
};

export default TailwindIndicator;
