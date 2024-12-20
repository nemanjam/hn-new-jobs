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

// ! number of ads in the previous 12 months

const chartConfig = {
  count: {
    label: 'Number of ads',
    color: 'var(--chart-1)', // color for label
  },
  // colors mapped to BarChartSimpleDataItem.range
  '1': {
    color: 'var(--bar-chart-1)',
  },
  '2-3': {
    color: 'var(--bar-chart-2)',
  },
  '4-5': {
    color: 'var(--bar-chart-3)',
  },
  '6-7': {
    color: 'var(--bar-chart-4)',
  },
  '8-12': {
    color: 'var(--bar-chart-5)',
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

  const selectMonthNames = allMonths.map((month) => month.name).slice(0, -1);

  return (
    <Card className="self-start">
      <CardHeader className="flex flex-col xs:flex-row justify-between gap-4">
        <div className="space-y-2">
          <CardTitle>Companies by ads</CardTitle>
          <CardDescription>in the previous 12 months</CardDescription>
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
        <ChartContainer
          config={chartConfig}
          // has aspect-video inside that prevents shrink
          className="h-[350px] max-w-lg aspect-auto"
        >
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
      <CardFooter className="max-w-lg flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Share of companies by ad frequency
        </div>
        <div className="leading-tight text-muted-foreground">
          Companies from the selected month grouped by the number of job ads that they posted during
          the previous 12 months.
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChartSimple;
