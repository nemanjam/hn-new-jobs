export interface SearchParams {
  company: string;
}

// filter on client
export interface MonthQueryParam {
  params: Promise<{
    month: string;
  }>;
}
