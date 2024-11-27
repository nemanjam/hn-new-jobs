import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { LineChartMultipleData } from '@/components/charts/line-chart-multiple';

// todo: make another axios instance for react-query

const fetchLineChartData = async (): Promise<LineChartMultipleData[]> => {
  const response = await axios.get<LineChartMultipleData[]>('/api/line-chart-data');
  return response.data;
};

export const useLineChartData = () => {
  return useQuery<LineChartMultipleData[], Error>({
    queryKey: ['lineChartData'],
    queryFn: fetchLineChartData,
  });
};
