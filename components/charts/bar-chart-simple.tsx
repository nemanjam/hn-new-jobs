'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

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

import { getScrollPositionKey } from '@/utils/urls';
import { ROUTES } from '@/constants/navigation';

import { BarChartSimpleDataItem } from '@/types/charts';
import { DbMonth } from '@/types/database';

export interface BarChartSimpleData {
  monthName: string;
  items: BarChartSimpleDataItem[];
}

interface Props {
  chartData: BarChartSimpleData;
  month: string;
  allMonths: DbMonth[];
}

const chartConfig = {
  count: {
    label: 'Number of ads',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

// important to have key per page
const scrollPositionKey = getScrollPositionKey('month');

const BarChartSimple: FC<Props> = ({ chartData, allMonths, month }) => {
  const { replace } = useRouter();

  const handleSelect = (value: string) => {
    // important to set key onSelect event
    sessionStorage.setItem(scrollPositionKey, window.scrollY.toString());
    replace(`${ROUTES.month}${value}`);
  };

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(scrollPositionKey);
    if (!savedPosition) return;

    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem(scrollPositionKey);
  }, []);

  const selectMonthNames = allMonths.map((month) => month.name);

  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row justify-between items-center gap-4">
        <div>
          <CardTitle>Companies by ads</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>

        <Select value={month} onValueChange={handleSelect}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last month" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectMonthNames.map((monthName) => (
              <SelectItem key={monthName} value={monthName} className="rounded-lg">
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] max-w-lg">
          <BarChart
            accessibilityLayer
            data={chartData.items}
            {...{
              overflow: 'visible',
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="range" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChartSimple;
