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
          <p className="text-sm text-muted-foreground">
            Query: {company}, number of hits: {companiesWithComments.length}
          </p>

          <Table className="block md:table">
            <TableHeader className="block md:table-header-group">
              <TableRow className="block md:table-row">
                <TableHead className="w-[100px] pl-0">Company</TableHead>
                <TableHead>Number of ads</TableHead>
                <TableHead className="pr-0">Ads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="block md:table-row-group">
              {limitedCompaniesWithComments.map((companyWithComments) => {
                const { company, comments } = companyWithComments;
                const { name, commentId } = company;

                return (
                  <TableRow key={commentId} className="block md:table-row">
                    <TableCell className="font-medium block md:table-cell px-0 md:pr-4 pb-3 md:pb-4">
                      <Link href={getThreadOrCommentUrlFromId(commentId)} target="_blank">
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell className="block md:table-cell px-0 py-3 md:p-4">
                      {comments.length}
                    </TableCell>
                    <TableCell className="flex gap-1 flex-wrap px-0 md:pl-4 pt-3 md:pt-4">
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
