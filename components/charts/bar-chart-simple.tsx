'use client';

import { FC } from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type RangeType = '1' | '2-3' | '4-5' | '6-7' | '8-12';

export interface BarChartSimpleDataItem {
  range: RangeType;
  count: number;
}

// currently only available for last month
export interface BarChartSimpleData {
  monthName: string;
  items: BarChartSimpleDataItem[];
}

interface Props {
  chartData: BarChartSimpleData;
}

const chartConfig = {
  count: {
    label: 'Number of ads',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const BarChartSimple: FC<Props> = ({ chartData }) => {
  return (
    <ChartContainer config={chartConfig} className="h-[350px] max-w-lg">
      <BarChart accessibilityLayer data={chartData.items}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="range" tickLine={false} tickMargin={10} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} tickCount={3} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default BarChartSimple;
