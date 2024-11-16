import { FC } from 'react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { NewOldCompanies } from '@/types/database';

interface Props {
  newOldCompanies: NewOldCompanies;
}

const NewOldCompaniesCard: FC<Props> = ({ newOldCompanies }) => {
  const {
    newCompanies,
    oldCompanies,
    firstTimeCompanies,
    totalCompaniesCount,
    forMonth,
    comparedToMonth,
  } = newOldCompanies;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Month Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-x-2">
            <span className="text-sm font-medium text-muted-foreground">For month</span>
            <Link
              href={forMonth.threadId}
              target="_blank"
              className="text-lg font-semibold hover:underline"
            >
              {forMonth.name}
            </Link>
          </div>
          <div className="space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Compared to month</span>
            <Link
              href={comparedToMonth.threadId}
              target="_blank"
              className="text-lg font-semibold hover:underline"
            >
              {comparedToMonth.name}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <StatItem label="First time companies" value={firstTimeCompanies.length} />
          <StatItem label="New companies" value={newCompanies.length} />
          <StatItem label="Old companies" value={oldCompanies.length} />
          <StatItem label="Total companies" value={totalCompaniesCount} />
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
