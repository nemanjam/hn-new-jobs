import { FC } from 'react';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';

import { NAVIGATION } from '@/constants/navigation';

const { right } = NAVIGATION;

const Footer: FC = () => (
  <footer>
    <Separator />
    <div className="my-container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="flex gap-2 text-sm text-muted-foreground">
          <span>© 2024</span>
          <Link href={right.author} target="_blank" className="hover:underline">
            @nemanjam
          </Link>
          <span>All rights reserved.</span>
        </p>

        <nav>
          <Link
            href={right.github}
            target="_blank"
            className="text-sm text-muted-foreground hover:underline"
          >
            Github
          </Link>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
