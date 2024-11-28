import { FC } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { searchCompanyByName } from '@/modules/database/select/search';
import { getThreadOrCommentUrlFromId, isCompanySearchMinLength } from '@/utils/urls';

import { SearchParams } from '@/types/website';

const itemsLimit = 10 as const;

export interface Props extends SearchParams {}

const SearchCompanyList: FC<Props> = ({ company }) => {
  const companiesWithComments = searchCompanyByName(company);
  const limitedCompaniesWithComments = companiesWithComments.slice(0, itemsLimit);

  const hasCompanies = companiesWithComments.length > 0;

  return (
    <>
      {hasCompanies ? (
        <>
          <p className="mb-6">Number of hits: {companiesWithComments.length}</p>

          <Table>
            <TableCaption>Search result for: {company}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Company</TableHead>
                <TableHead>Number of ads</TableHead>
                <TableHead>Ads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {limitedCompaniesWithComments.map((companyWithComments) => {
                const { company, comments } = companyWithComments;
                const { name, commentId } = company;

                return (
                  <TableRow key={commentId}>
                    <TableCell className="font-medium">
                      <Link href={getThreadOrCommentUrlFromId(commentId)} target="_blank">
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell>{comments.length}</TableCell>
                    <TableCell className="flex gap-1 flex-wrap">
                      {comments.map((comment) => {
                        const { commentId, monthName } = comment;

                        return (
                          <Badge
                            key={commentId}
                            variant="secondary"
                            className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                          >
                            <Link href={getThreadOrCommentUrlFromId(commentId)} target="_blank">
                              {monthName}
                            </Link>
                          </Badge>
                        );
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      ) : (
        <>
          {isCompanySearchMinLength(company) && (
            <p className="mb-6">No companies with name: {company} found.</p>
          )}
        </>
      )}
    </>
  );
};

export default SearchCompanyList;
