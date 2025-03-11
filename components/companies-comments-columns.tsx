'use client';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { humanFormat } from '@/libs/datetime';
import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { DbCompany } from '@/types/database';

export interface CompanyTable {
  company: Pick<DbCompany, 'name' | 'commentId' | 'createdAtOriginal'>;
  commentsCount: number;
  comments: Pick<DbCompany, 'monthName' | 'commentId' | 'createdAtOriginal'>[];
}

export const columns: ColumnDef<CompanyTable>[] = [
  {
    id: 'companyName',
    accessorFn: (row: CompanyTable) => row.company.name,
    filterFn: 'includesString',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Company
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name, commentId, createdAtOriginal } = row.original.company;

      return (
        <Link
          href={getThreadOrCommentUrlFromId(commentId)}
          title={humanFormat(createdAtOriginal)}
          target="_blank"
        >
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'commentsCount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Count
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => <>{row.getValue('commentsCount')}</>,
  },
  {
    accessorKey: 'comments',
    header: 'Monthly History',
    cell: ({ row }) => {
      const comments = row.getValue('comments') as CompanyTable['comments'];

      return (
        <ScrollArea className="w-full">
          <div className="flex flex-wrap gap-2">
            {comments.map((comment) => {
              const { commentId, monthName, createdAtOriginal } = comment;

              return (
                <Link
                  key={commentId}
                  href={getThreadOrCommentUrlFromId(commentId)}
                  title={humanFormat(createdAtOriginal)}
                  target="_blank"
                >
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  >
                    {monthName}
                  </Badge>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    },
  },
];
