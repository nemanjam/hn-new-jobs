import { NextResponse } from 'next/server';

import { getNewOldCompaniesForMonth } from '@/modules/database/select';
import logger from '@/libs/winston';

import { NewOldCompanies } from '@/types/database';
import type { ErrorResponse, MonthQueryParam } from '@/types/api';

export const dynamic = 'force-dynamic';

export const GET = async (
  _request: Request,
  { params }: MonthQueryParam
): Promise<NextResponse<NewOldCompanies | ErrorResponse>> => {
  const { month } = await params;

  try {
    const newOldCompanies = getNewOldCompaniesForMonth(month);

    return NextResponse.json(newOldCompanies);
  } catch (error) {
    const message = 'Error selecting NewOldCompanies';
    logger.error(message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
