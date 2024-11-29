'use client';

import { FC, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getScrollPositionKey, getThreadOrCommentUrlFromId } from '@/utils/urls';
import { ROUTES } from '@/constants/navigation';

import { DbMonth, NewOldCompanies } from '@/types/database';

interface Props {
  newOldCompanies: NewOldCompanies;
  month: string;
  allMonths: DbMonth[];
}

const { home } = ROUTES;

const scrollPositionKey = getScrollPositionKey('root');

const NewOldCompaniesCard: FC<Props> = ({ newOldCompanies, allMonths, month }) => {
  const { replace } = useRouter();

  const selectMonthNames = allMonths.map((month) => month.name);

  const {
    firstTimeCompanies,
    newCompanies,
    oldCompanies,
    allCompanies,
    forMonth,
    comparedToMonth,
  } = newOldCompanies;

  const handleSelect = (value: string) => {
    sessionStorage.setItem(scrollPositionKey, window.scrollY.toString());
    replace(`${home}${value}`);
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(scrollPositionKey);
    if (!savedPosition) return;

    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem(scrollPositionKey);
  }, []);

  return (
    <Card className="lg:w-1/2">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Month Statistics</CardTitle>

        <Select value={month} onValueChange={handleSelect}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last month" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectMonthNames.map((monthName) => (
              <SelectItem key={monthName} value={monthName} className="rounded-lg">
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-x-2">
            <span className="text-sm font-medium text-muted-foreground">For month</span>
            <Link
              href={getThreadOrCommentUrlFromId(forMonth.threadId)}
              target="_blank"
              className="text-lg font-semibold hover:underline"
            >
              {forMonth.name}
            </Link>
          </div>
          <div className="space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Compared to month</span>
            <Link
              href={getThreadOrCommentUrlFromId(comparedToMonth.threadId)}
              target="_blank"
              className="text-lg font-semibold hover:underline"
            >
              {comparedToMonth.name}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatItem label="First time companies" value={firstTimeCompanies.length} />
          <StatItem label="New companies" value={newCompanies.length} />
          <StatItem label="Old companies" value={oldCompanies.length} />
          <StatItem label="Total companies" value={allCompanies.length} />
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: number;
}

const StatItem: FC<StatItemProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-muted-foreground">{label}</span>
    <span className="text-2xl font-bold">{value}</span>
  </div>
);

export default NewOldCompaniesCard;
