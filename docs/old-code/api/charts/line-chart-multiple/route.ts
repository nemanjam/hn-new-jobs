import { NextResponse } from 'next/server';

import { LineChartMultipleData } from '@/components/charts/line-chart-multiple';

import { getNewOldCompaniesForAllMonths } from '@/modules/database/select';
import { getLineChartMultipleData } from '@/modules/transform/line-chart';
import logger from '@/libs/winston';

import type { ErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

// entire range always
export const GET = (): NextResponse<LineChartMultipleData[] | ErrorResponse> => {
  try {
    const allNewOldCompanies = getNewOldCompaniesForAllMonths();
    const lineChartMultipleData = getLineChartMultipleData(allNewOldCompanies);

    return NextResponse.json(lineChartMultipleData);
  } catch (error) {
    const message = 'Error selecting LineChartMultipleData';
    logger.error(message, error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
};
