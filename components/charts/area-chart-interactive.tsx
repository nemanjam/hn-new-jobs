'use client';

import * as React from 'react';
import { FC } from 'react';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const chartConfig = {
  firstTimeCompaniesCount: {
    label: 'First time companies',
    color: 'hsl(var(--chart-1))',
  },
  newCompaniesCount: {
    label: 'New companies',
    color: 'hsl(var(--chart-2))',
  },
  oldCompaniesCount: {
    label: 'Old companies',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export interface AreaChartInteractiveData {
  monthName: string;
  firstTimeCompaniesCount: number;
  newCompaniesCount: number;
  oldCompaniesCount: number;
}

interface Props {
  chartData: AreaChartInteractiveData[];
}

const filterChartData = (chartData: AreaChartInteractiveData[], timeRange: string) => {
  const referenceDate = new Date();
  let startDate: Date;

  switch (timeRange) {
    case '12m':
      // Subtract 12 months from the reference date
      startDate = new Date(referenceDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case '3y':
      // Subtract 3 years from the reference date
      startDate = new Date(referenceDate);
      startDate.setFullYear(startDate.getFullYear() - 3);
      break;
    case 'all':
      // Earliest possible date to include all data
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

const AreaChartInteractive: FC<Props> = ({ chartData }) => {
  const [timeRange, setTimeRange] = React.useState('12m');

  const filteredData = filterChartData(chartData, timeRange);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Hackernews - Who is hiring</CardTitle>
          <CardDescription>Showing ratio between new and repeated job ads.</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Last 12 months
            </SelectItem>
            <SelectItem value="3y" className="rounded-lg">
              Last 3 years
            </SelectItem>
            <SelectItem value="all" className="rounded-lg">
              All time
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillFirstTimeCompaniesCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-firstTimeCompaniesCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-firstTimeCompaniesCount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNewCompaniesCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCompaniesCount)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-newCompaniesCount)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOldCompaniesCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-oldCompaniesCount)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-oldCompaniesCount)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
            <ChartTooltip
              cursor={false}
              content={
                // tooltip items have upside down order from graph
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
            {/* bottom */}
            <Area
              dataKey="oldCompaniesCount"
              type="natural"
              fill="url(#fillOldCompaniesCount)"
              stroke="var(--color-oldCompaniesCount)"
              stackId="a"
            />
            <Area
              dataKey="newCompaniesCount"
              type="natural"
              fill="url(#fillNewCompaniesCount)"
              stroke="var(--color-newCompaniesCount)"
              stackId="a"
            />
            {/* top */}
            <Area
              dataKey="firstTimeCompaniesCount"
              type="natural"
              fill="url(#fillFirstTimeCompaniesCount)"
              stroke="var(--color-firstTimeCompaniesCount)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaChartInteractive;
