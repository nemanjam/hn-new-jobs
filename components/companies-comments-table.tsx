'use client';

import { FC, useState } from 'react';
import Link from 'next/link';

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns, CompanyTable } from '@/components/companies-comments-columns';

import { getThreadOrCommentUrlFromId } from '@/utils/urls';

import { DbMonth } from '@/types/database';

export interface CompanyTableDataWithMonth {
  month: Pick<DbMonth, 'name' | 'threadId'>;
  data: CompanyTable[];
}

export interface Props {
  tableData: CompanyTableDataWithMonth;
}

const initialSort: SortingState = [{ id: 'commentsCount', desc: true }] as const;

const CompaniesCommentsTable: FC<Props> = ({ tableData }) => {
  const { data, month } = tableData;

  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex justify-between items-center p-4">
        <Input
          placeholder="Filter companies..."
          value={(table.getColumn('companyName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('companyName')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <Link
          href={getThreadOrCommentUrlFromId(month.threadId)}
          target="_blank"
          className="hover:underline"
        >
          {month.name}
        </Link>
      </div>
      <Table className="block md:table">
        <TableHeader className="block md:table-header-group">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="block md:table-row">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="block md:table-row-group">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="block md:table-row"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className="align-top block md:table-cell py-3 first:pt-4 last:pb-4 md:py-4"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="p-4 border-t">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};

export default CompaniesCommentsTable;
