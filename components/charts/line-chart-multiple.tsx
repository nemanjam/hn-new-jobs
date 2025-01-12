'use client';

import { FC, useState } from 'react';

import { useWindowSize } from '@uidotdev/usehooks';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { convertMonthNameToDate } from '@/libs/datetime';
import { tailwindConfig } from '@/utils/styles';

import { LineChartMultipleData } from '@/types/charts';
import { ValueUnion } from '@/types/utils';

interface Props {
  chartData: LineChartMultipleData[];
}

const mdBreakpoint = parseInt(tailwindConfig?.theme?.screens?.md);

const chartConfig = {
  firstTimeCompaniesCount: {
    label: (
      <>
        <span className="hidden sm:inline-block">First time companies</span>
        <span className="inline-block sm:hidden">First time</span>
      </>
    ),
    color: 'var(--chart-1)',
  },
  newCompaniesCount: {
    label: (
      <>
        <span className="hidden sm:inline-block">New companies</span>
        <span className="inline-block sm:hidden">New</span>
      </>
    ),
    color: 'var(--chart-2)',
  },
  oldCompaniesCount: {
    label: (
      <>
        <span className="hidden sm:inline-block">Old companies</span>
        <span className="inline-block sm:hidden">Old</span>
      </>
    ),
    color: 'var(--chart-3)',
  },
  allCompaniesCount: {
    label: (
      <>
        <span className="hidden sm:inline-block">Total companies</span>
        <span className="inline-block sm:hidden">Total</span>
      </>
    ),
    // only label has word Total
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

const xAxisUnitOptions = {
  _12m: '12 months',
  _3y: '3 years',
  all: 'all time',
} as const;

type XAxisUnitOptionsType = ValueUnion<typeof xAxisUnitOptions>;

const yAxisUnitOptions = {
  absolute: 'absolute',
  percentage: 'percentage',
} as const;

type YAxisUnitOptionsType = ValueUnion<typeof yAxisUnitOptions>;

const filterChartData = (chartData: LineChartMultipleData[], timeRange: string) => {
  const referenceDate = new Date();
  let startDate: Date;

  switch (timeRange) {
    case xAxisUnitOptions._12m:
      startDate = new Date(referenceDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case xAxisUnitOptions._3y:
      startDate = new Date(referenceDate);
      startDate.setFullYear(startDate.getFullYear() - 3);
      break;
    case xAxisUnitOptions.all:
      startDate = new Date(0);
      break;
    default:
      throw new Error(`Invalid timeRange: ${timeRange}`);
  }

  return chartData.filter((month) => {
    const date = convertMonthNameToDate(month.monthName);
    return date >= startDate;
  });
};

const getPercentage = (current: number, total: number) => Math.round((current / total) * 100);

const setUnit = (chartData: LineChartMultipleData[], yAxisUnit: string) => {
  return chartData.map((month) => {
    const {
      firstTimeCompaniesCount,
      newCompaniesCount: newCompaniesCountOriginal,
      oldCompaniesCount,
      allCompaniesCount,
    } = month;

    // include first time companies in new companies only for graph
    const newCompaniesCount = newCompaniesCountOriginal + firstTimeCompaniesCount;

    let resultMonth = { ...month, newCompaniesCount };

    if (yAxisUnit === 'percentage') {
      resultMonth = {
        ...month,
        firstTimeCompaniesCount: getPercentage(firstTimeCompaniesCount, allCompaniesCount),
        newCompaniesCount: getPercentage(newCompaniesCount, allCompaniesCount),
        oldCompaniesCount: getPercentage(oldCompaniesCount, allCompaniesCount),
        allCompaniesCount: 100,
      };
    }

    return resultMonth;
  });
};

const getFirstTimeCompaniesTrendingPercent = (chartData: LineChartMultipleData[]): number => {
  const chartDataLength = chartData.length;
  if (!(chartDataLength > 1)) return 0;

  const lastMonth = chartData[chartDataLength - 1];
  const secondLastMonth = chartData[chartDataLength - 2];

  const percent = Math.round(
    ((lastMonth.firstTimeCompaniesCount - secondLastMonth.firstTimeCompaniesCount) /
      secondLastMonth.firstTimeCompaniesCount) *
      100
  );

  return percent;
};

const LineChartMultiple: FC<Props> = ({ chartData }) => {
  const [xAxisUnit, setXAxisUnit] = useState<XAxisUnitOptionsType>(xAxisUnitOptions.all);
  const [yAxisUnit, setYAxisUnit] = useState<YAxisUnitOptionsType>(yAxisUnitOptions.absolute);

  const { width } = useWindowSize();
  const isAboveMd = width && width > mdBreakpoint;

  const firstTimeCompaniesTrendingPercent = getFirstTimeCompaniesTrendingPercent(chartData);

  const transformedData = setUnit(chartData, yAxisUnit);
  const filteredData = filterChartData(transformedData, xAxisUnit);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between gap-2 border-b py-5">
        <div className="flex-1 space-y-2">
          <CardTitle>Who is hiring</CardTitle>
          <CardDescription>Ratio between new and repeated job ads.</CardDescription>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={yAxisUnit}
            onValueChange={(value) => setYAxisUnit(value as YAxisUnitOptionsType)}
          >
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
              <SelectValue placeholder="Absolute" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="absolute" className="rounded-lg">
                Absolute
              </SelectItem>
              <SelectItem value="percentage" className="rounded-lg">
                Percentage
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={xAxisUnit}
            onValueChange={(value) => setXAxisUnit(value as XAxisUnitOptionsType)}
          >
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12 months" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="3 years" className="rounded-lg">
                Last 3 years
              </SelectItem>
              <SelectItem value="all time" className="rounded-lg">
                All time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = convertMonthNameToDate(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                });
              }}
            />
            {isAboveMd && (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={3}
                tickFormatter={(value) =>
                  yAxisUnit === yAxisUnitOptions.percentage ? `${value}%` : value
                }
              />
            )}

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return convertMonthNameToDate(value).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    });
                  }}
                  indicator="dot"
                  className="w-[200px]"
                />
              }
            />
            {/* this is left-right order in legend, order in tooltip - top-down, order in graph depends on values */}
            <Line
              dataKey="firstTimeCompaniesCount"
              type="monotone"
              stroke="var(--color-firstTimeCompaniesCount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="newCompaniesCount"
              type="monotone"
              stroke="var(--color-newCompaniesCount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="oldCompaniesCount"
              type="monotone"
              stroke="var(--color-oldCompaniesCount)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="allCompaniesCount"
              type="monotone"
              stroke="var(--color-allCompaniesCount)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {firstTimeCompaniesTrendingPercent > 0 ? (
                <>
                  First time companies trending up by {firstTimeCompaniesTrendingPercent}% this
                  month
                  <TrendingUp className="size-4" />
                </>
              ) : (
                <>
                  First time companies trending down by {firstTimeCompaniesTrendingPercent}% this
                  month
                  <TrendingDown className="size-4" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing companies for
              {xAxisUnit !== xAxisUnitOptions.all ? ` the last ${xAxisUnit}` : ` ${xAxisUnit}`}.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LineChartMultiple;
