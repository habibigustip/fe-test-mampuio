'use client';

import { useMemo, useState, type ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: string;
  accessor?: (row: T) => string;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  searchable?: boolean;
};

export type DataTableProps<T> = {
  items: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string | number;
  pageSize?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
};

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

function getValue<T>(col: Column<T>, row: T): string {
  if (col.accessor) return col.accessor(row);
  return String((row as Record<string, unknown>)[col.key] ?? '');
}

function renderCell<T>(col: Column<T>, row: T): ReactNode {
  if (col.cell) return col.cell(row);
  return getValue(col, row);
}

export function DataTable<T>({
  items,
  columns,
  getRowId,
  pageSize,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No results',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);

  const hasSearchable = columns.some((c) => c.searchable);

  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base' }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const searchCols = columns.filter((c) => c.searchable);
    return items.filter((row) =>
      searchCols.some((c) => getValue(c, row).toLowerCase().includes(q)),
    );
  }, [items, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort(
      (a, b) => sign * collator.compare(getValue(col, a), getValue(col, b)),
    );
  }, [filtered, sort, columns, collator]);

  const total = sorted.length;
  const lastPage = pageSize ? Math.max(0, Math.ceil(total / pageSize) - 1) : 0;
  const safePage = Math.min(page, lastPage);
  const paginated = pageSize
    ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize)
    : sorted;
  const showControls = pageSize !== undefined && total > pageSize;
  const visibleStart = total === 0 ? 0 : pageSize ? safePage * pageSize + 1 : 1;
  const visibleEnd = pageSize
    ? Math.min(safePage * pageSize + pageSize, total)
    : total;
  const visibleLabel =
    total === 0
      ? '0'
      : pageSize
        ? `${visibleStart}–${visibleEnd}`
        : String(total);

  const onQueryChange = (v: string) => {
    setQuery(v);
    setPage(0);
  };

  const cycleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
    setPage(0);
  };

  return (
    <div className="space-y-4">
      {hasSearchable && (
        <input
          type="text"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-[20%] px-4 py-2 border rounded-lg focus:ring-blue-500"
        />
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => {
                const isActive = sort?.key === col.key;
                const indicator = isActive
                  ? sort.dir === 'asc'
                    ? ' ↑'
                    : ' ↓'
                  : '';
                if (col.sortable) {
                  return (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
                      <button
                        type="button"
                        onClick={() => cycleSort(col.key)}
                        className="hover:underline"
                      >
                        {col.header}
                        {indicator}
                      </button>
                    </th>
                  );
                }
                return (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-sm font-semibold"
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {total === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={getRowId(row)} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {visibleLabel} of {total}
        </p>
        {showControls && (
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              ← Prev
            </button>
            <span>
              Page {safePage + 1} of {lastPage + 1}
            </span>
            <button
              type="button"
              disabled={safePage >= lastPage}
              onClick={() => setPage(safePage + 1)}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
