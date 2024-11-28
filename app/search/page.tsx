import { FC, Suspense } from 'react';

import SearchCompanyInput from '@/components/search-company-input';
import SearchCompanyList from '@/components/search-company-list';

import { WEBSITE } from '@/constants/website';

import { SearchParams } from '@/types/website';

export interface Props {
  searchParams?: Promise<SearchParams>;
}

const { queryParams } = WEBSITE;
const { search } = queryParams;

const SearchCompanyPage: FC<Props> = async (props) => {
  const searchParams = await props.searchParams;
  const { company = search.defaultValue } = searchParams ?? {};

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Search company
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Search for all job ads from a specific company.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <SearchCompanyInput />

        <Suspense key={company} fallback={<div>Loading...</div>}>
          <SearchCompanyList company={company} />
        </Suspense>
      </div>
    </section>
  );
};

export default SearchCompanyPage;
