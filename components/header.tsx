'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { useWindowSize } from '@uidotdev/usehooks';
import { BriefcaseBusiness, Menu, X } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

import { cn, tailwindConfig } from '@/utils/styles';
import { METADATA } from '@/constants/metadata';
import { NAVIGATION } from '@/constants/navigation';

const { title } = METADATA;
const { left, right } = NAVIGATION;

const lgBreakpoint = parseInt(tailwindConfig?.theme?.screens?.lg);

const Header: FC = () => {
  const segment = useSelectedLayoutSegment();
  const pathSegment = !segment ? '/' : `/${segment}/`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathSegment]);

  useEffect(() => {
    if (width && width > lgBreakpoint) setIsMenuOpen(false);
  }, [width]);

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <BriefcaseBusiness className="size-6" />
            <span className="inline-block font-bold">{title}</span>
          </Link>

          {/* desktop menu */}
          <nav className="hidden sm:flex items-center gap-6">
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

        {/* desktop menu */}
        <div className="hidden sm:flex items-center gap-2">
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
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden shrink-0"
          onClick={() => setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* mobile menu */}
      <nav
        className={cn('flex sm:hidden flex-col items-start gap-4 p-4 pt-0', {
          hidden: !isMenuOpen,
        })}
      >
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
    </header>
  );
};

export default Header;
