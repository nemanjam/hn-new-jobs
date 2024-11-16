'use client';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { DbCompany } from '@/types/database';

export interface CompanyTable {
  company: Pick<DbCompany, 'name' | 'commentId'>;
  commentsCount: number;
  comments: Pick<DbCompany, 'monthName' | 'commentId'>[];
}

export const columns: ColumnDef<CompanyTable>[] = [
  {
    accessorKey: 'company',
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
      const company = row.getValue('company') as CompanyTable['company'];
      const { name, commentId } = company;

      return (
        <Link href={getThreadOrCommentUrlFromId(commentId)} target="_blank">
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
          Comments
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.getValue('commentsCount')}</Badge>
      </div>
    ),
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
              const { commentId, monthName } = comment;

              return (
                <Badge
                  key={commentId}
                  variant="secondary"
                  className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                >
                  <Link
                    key={commentId}
                    href={getThreadOrCommentUrlFromId(commentId)}
                    target="_blank"
                  >
                    {monthName}
                  </Link>
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    },
  },
];
