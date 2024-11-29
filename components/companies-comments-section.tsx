import { FC } from 'react';

import BarChartSimple, { BarChartSimpleData } from '@/components/charts/bar-chart-simple';
import CompaniesCommentsTable, {
  CompanyTableDataWithMonth,
} from '@/components/companies-comments-table';

import { DbMonth } from '@/types/database';

interface Props {
  tableData: CompanyTableDataWithMonth;
  barChartSimpleData: BarChartSimpleData;
  month: string;
  allMonths: DbMonth[];
}

const CompaniesCommentsSection: FC<Props> = ({
  tableData,
  barChartSimpleData,
  month,
  allMonths,
}) => {
  return (
    <>
      <BarChartSimple chartData={barChartSimpleData} allMonths={allMonths} month={month} />
      <CompaniesCommentsTable tableData={tableData} />
    </>
  );
};

export default CompaniesCommentsSection;
