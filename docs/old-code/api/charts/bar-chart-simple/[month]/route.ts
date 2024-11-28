import { NextResponse } from 'next/server';

import { BarChartSimpleData } from '@/components/charts/bar-chart-simple';

import { getNewOldCompaniesForMonth } from '@/modules/database/select';
import { getBarChartSimpleData } from '@/modules/transform/bar-chart';
import logger from '@/libs/winston';

import type { ErrorResponse, MonthQueryParam } from '@/types/api';

export const dynamic = 'force-dynamic';

export const GET = async (
  _request: Request,
  { params }: MonthQueryParam
): Promise<NextResponse<BarChartSimpleData | ErrorResponse>> => {
  const { month } = await params;

  try {
    const newOldCompanies = getNewOldCompaniesForMonth(month);
    const barChartSimpleData = getBarChartSimpleData(newOldCompanies.allCompanies);

    return NextResponse.json(barChartSimpleData);
  } catch (error) {
    const message = 'Error selecting BarChartSimpleData';
    logger.error(message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
