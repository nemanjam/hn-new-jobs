'use client';

import { ChangeEvent, FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';

import { WEBSITE } from '@/constants/website';

const { waitDebounceSearchInput, companySearchParam } = WEBSITE;

const SearchCompanyInput: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateParam = (name: string, value: string): void => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    // must not limit it here, to clear url state
    updateParam(companySearchParam, value);
  };

  const debouncedHandleSearch = useDebouncedCallback(handleSearch, waitDebounceSearchInput);

  const initialQuery = searchParams.get(companySearchParam)?.toString();

  return (
    <div>
      <Input
        onChange={debouncedHandleSearch}
        defaultValue={initialQuery}
        className="max-w-sm"
        placeholder="Company name"
        type="search"
      />
    </div>
  );
};

export default SearchCompanyInput;
