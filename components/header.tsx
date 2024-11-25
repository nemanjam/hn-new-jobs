'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

import { cn } from '@/utils/styles';
import { METADATA } from '@/constants/metadata';
import { NAVIGATION } from '@/constants/navigation';

const { title } = METADATA;
const { left, right } = NAVIGATION;

const Header: FC = () => {
  const segment = useSelectedLayoutSegment();
  const pathSegment = !segment ? '/' : `/${segment}/`;

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        {/* left nav */}
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="size-6" />
            <span className="inline-block font-bold">{title}</span>
          </Link>
          <nav className="flex gap-6">
            {left.map((navItem, index) => (
              <Link
                key={index}
                href={navItem.href}
                className={cn('flex items-center text-sm font-medium text-muted-foreground', {
                  'font-bold text-foreground underline': pathSegment === navItem.href,
                })}
              >
                {navItem.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* right nav  */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={right.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="size-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
