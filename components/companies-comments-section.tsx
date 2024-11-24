'use client';

import { FC, useState } from 'react';

import BarChartSimple, { BarChartSimpleData } from '@/components/charts/bar-chart-simple';
import CompaniesCommentsTable, {
  CompanyTableDataWithMonth,
  initialIndex,
} from '@/components/companies-comments-table';

// ! can't import allNewOldCompanies in client component, must pass as props

interface Props {
  tablesData: CompanyTableDataWithMonth[];
  barChartSimpleData: BarChartSimpleData[];
}

const CompaniesCommentsSection: FC<Props> = ({ tablesData, barChartSimpleData }) => {
  const [index, setIndex] = useState<number>(initialIndex);

  return (
    <>
      <div className="mx-auto">
        <BarChartSimple chartData={barChartSimpleData[index]} />
      </div>
      <CompaniesCommentsTable setIndex={setIndex} tablesData={tablesData} />
    </>
  );
};

export default CompaniesCommentsSection;
