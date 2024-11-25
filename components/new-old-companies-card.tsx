'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { NewOldCompanies } from '@/types/database';

interface Props {
  allNewOldCompanies: NewOldCompanies[];
  setIndex: (index: number) => void;
}

export const initialIndex = 0 as const;

export const getIndex = (allNewOldCompanies: NewOldCompanies[], monthName: string): number => {
  const index = allNewOldCompanies.findIndex(
    (newOldCompanies) => newOldCompanies.forMonth.name === monthName
  );

  return index !== -1 ? index : initialIndex;
};

export const getSelectMonthNames = (allNewOldCompanies: NewOldCompanies[]) =>
  allNewOldCompanies.map((newOldCompanies) => newOldCompanies.forMonth.name);
// .slice(0, 12); // limit if needed for performance

const NewOldCompaniesCard: FC<Props> = ({ allNewOldCompanies, setIndex }) => {
  const selectMonthNames = getSelectMonthNames(allNewOldCompanies);

  const initialMonthName = selectMonthNames[initialIndex];
  const [monthName, setMonthName] = useState<string>(initialMonthName);

  const index = getIndex(allNewOldCompanies, monthName);
  const newOldCompanies = allNewOldCompanies[index];

  useEffect(() => {
    if (setIndex) setIndex(index);
  }, [setIndex, index]);

  const {
    firstTimeCompanies,
    newCompanies,
    oldCompanies,
    allCompanies,
    forMonth,
    comparedToMonth,
  } = newOldCompanies;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Month Statistics</CardTitle>

        <Select value={monthName} onValueChange={(value) => setMonthName(value)}>
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
      <CardContent className="grid gap-6">
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
