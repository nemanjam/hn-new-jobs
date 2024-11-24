'use client';

import { FC, useEffect, useState } from 'react';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns, CompanyTable } from '@/components/companies-comments-columns';

import { DbMonth } from '@/types/database';

export interface CompanyTableDataWithMonth {
  month: Pick<DbMonth, 'name' | 'threadId'>;
  data: CompanyTable[];
}

export interface Props {
  tablesData: CompanyTableDataWithMonth[];
  setIndex: (index: number) => void;
}

export const initialIndex = 0 as const;

export const getIndex = (tablesData: CompanyTableDataWithMonth[], monthName: string): number => {
  const index = tablesData.findIndex((tableData) => tableData.month.name === monthName);

  return index !== -1 ? index : initialIndex;
};

export const getSelectMonthNames = (tablesData: CompanyTableDataWithMonth[]) =>
  tablesData.map((tableData) => tableData.month.name);

const initialSort: SortingState = [{ id: 'commentsCount', desc: true }] as const;

const CompaniesCommentsTable: FC<Props> = ({ tablesData, setIndex }) => {
  const selectMonthNames = getSelectMonthNames(tablesData);

  const initialMonthName = selectMonthNames[initialIndex];
  const [monthName, setMonthName] = useState<string>(initialMonthName);

  const index = getIndex(tablesData, monthName);

  useEffect(() => {
    if (setIndex) setIndex(index);
  }, [setIndex, index]);

  const tableData = tablesData[index];

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

        <Select value={monthName} onValueChange={(value) => setMonthName(value)}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
            <SelectValue placeholder="Last month" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {selectMonthNames.map((monthName) => (
              <SelectItem key={monthName} value={monthName} className="rounded-lg">
                {monthName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
