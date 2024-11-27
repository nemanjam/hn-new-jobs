import { NextResponse } from 'next/server';

import { BarChartSimpleData } from '@/components/charts/bar-chart-simple';

import { getNewOldCompaniesForAllMonths } from '@/modules/database/select';
import { getBarChartSimpleData } from '@/modules/transform/bar-chart';
import { getIndex } from '@/modules/transform/month';
import logger from '@/libs/winston';

import type { BarChartRouteParam, ErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export const GET = async (
  request: Request,
  { params }: BarChartRouteParam
): Promise<NextResponse<BarChartSimpleData | ErrorResponse>> => {
  const { month } = await params;

  try {
    const allNewOldCompanies = getNewOldCompaniesForAllMonths();
    const index = getIndex(allNewOldCompanies, month);
    const newOldCompanies = allNewOldCompanies[index];

    const barChartSimpleData = getBarChartSimpleData(newOldCompanies.allCompanies);

    return NextResponse.json(barChartSimpleData);
  } catch (error) {
    const message = 'Error selecting BarChartSimpleData';
    logger.error(message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
