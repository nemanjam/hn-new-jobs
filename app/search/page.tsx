import { FC } from 'react';

import Heading from '@/components/heading';
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
    <article className="flex flex-col gap-6">
      <Heading title="Search company" subTitle="Search for all job ads from a specific company." />
      <SearchCompanyInput />
      <SearchCompanyList company={company} />
    </article>
  );
};

export default SearchCompanyPage;
