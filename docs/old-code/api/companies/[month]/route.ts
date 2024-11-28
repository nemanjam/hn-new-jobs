import { NextResponse } from 'next/server';

import { CompanyTableDataWithMonth } from '@/components/companies-comments-table';

import { getNewOldCompaniesForMonth } from '@/modules/database/select';
import { getCompanyTableData } from '@/modules/transform/companies';
import logger from '@/libs/winston';

import type { ErrorResponse, MonthQueryParam } from '@/types/api';

export const dynamic = 'force-dynamic';

// todo: add table pagination

export const GET = async (
  _request: Request,
  { params }: MonthQueryParam
): Promise<NextResponse<CompanyTableDataWithMonth | ErrorResponse>> => {
  const { month } = await params;

  try {
    const newOldCompanies = getNewOldCompaniesForMonth(month);
    const companyTableData = getCompanyTableData(newOldCompanies.allCompanies);

    return NextResponse.json(companyTableData);
  } catch (error) {
    const message = 'Error selecting CompanyTableDataWithMonth';
    logger.error(message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
