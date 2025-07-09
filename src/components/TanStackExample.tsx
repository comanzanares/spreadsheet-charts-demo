import React from 'react';
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from '@tanstack/react-table';
import { SpreadsheetData } from '../types';
import './TanStackExample.css';

interface TanStackExampleProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Función para convertir número a letra de columna (1 -> A, 2 -> B, etc.)
const numberToColumnLetter = (num: number): string => {
  let result = '';
  while (num > 0) {
    num--;
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

// Componente de celda editable (patrón oficial de TanStack)
const EditableCell: React.FC<{
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: any;
}> = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<SpreadsheetData>> = {
  cell: ({ getValue, row, column, table }) => (
    <EditableCell
      getValue={getValue}
      row={row}
      column={column}
      table={table}
    />
  ),
  minSize: 80,
  maxSize: 400,
  size: 120,
};

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-36 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

const TanStackExample: React.FC<TanStackExampleProps> = ({ data, onDataChange }) => {
  const rerender = React.useReducer(() => ({}), {})[1];

  // Initialize with default data if empty
  React.useEffect(() => {
    if (!data || data.length === 0) {
      const defaultData: SpreadsheetData[] = [
        { '0': 'Sample Data 1', '1': 'Value 1', '2': 'Value 2' },
        { '0': 'Sample Data 2', '1': 'Value 3', '2': 'Value 4' },
        { '0': 'Sample Data 3', '1': 'Value 5', '2': 'Value 6' },
      ];
      onDataChange(defaultData);
    }
  }, [data, onDataChange]);

  // Generate columns dynamically from our data structure
  const columns = React.useMemo<ColumnDef<SpreadsheetData>[]>(() => {
    if (!data || data.length === 0) return [];
    
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const colIds = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    return colIds.map((key, index) => {
      const columnLetter = numberToColumnLetter(parseInt(key) + 1);
      return {
        accessorKey: key,
        header: columnLetter,
        footer: props => props.column.id,
        minSize: 80,
        maxSize: 400,
        size: 120,
      };
    });
  }, [data]);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // Function to parse clipboard data from Excel
  const parseClipboardData = (clipboardText: string): string[][] => {
    return clipboardText
      .trim()
      .split('\n')
      .map(row => row.split('\t'));
  };

  // Function to handle paste from Excel
  const handlePaste = React.useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsedData = parseClipboardData(clipboardText);
      
      if (parsedData.length === 0) return;

      // Get current column IDs
      const currentColumnIds = columns.map(col => (col as any).accessorKey as string);
      
      // Create new data array
      const newData: SpreadsheetData[] = [];
      
      parsedData.forEach((row, rowIndex) => {
        const newRow: SpreadsheetData = {};
        
        row.forEach((cell, colIndex) => {
          // Use existing column ID or create new one
          const columnId = currentColumnIds[colIndex] || colIndex.toString();
          newRow[columnId] = cell;
        });
        
        newData.push(newRow);
      });

      // Update data
      onDataChange(newData);
      
      console.log('✅ Data pasted from Excel:', parsedData);
    } catch (error) {
      console.error('❌ Error pasting data:', error);
    }
  }, [columns, onDataChange]);

  // Function to add new row
  const addNewRow = React.useCallback(() => {
    const newRow: SpreadsheetData = {};
    
    // Add empty cells for each existing column
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        newRow[key] = '';
      });
    } else {
      // If no data, create at least one column
      newRow['0'] = '';
    }
    
    onDataChange([...data, newRow]);
  }, [data, onDataChange]);

  // Function to add new column
  const addNewColumn = React.useCallback(() => {
    const newColumnId = Math.max(...data.flatMap(row => 
      Object.keys(row).map(key => parseInt(key))
    ), -1) + 1;
    
    const newData = data.map(row => ({
      ...row,
      [newColumnId]: ''
    }));
    onDataChange(newData);
  }, [data, onDataChange]);

  // Add paste event listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePaste]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...data[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        });
        onDataChange(newData);
      },
    },
    debugTable: true,
  });

  return (
    <div className="tanstack-example-container">
      <div className="tanstack-header">
        <h3>📊 TanStack Table Official Example</h3>
        <div className="tanstack-features">
          <span className="feature-badge">🔄 Official Pattern</span>
          <span className="feature-badge">🔍 Built-in Filtering</span>
          <span className="feature-badge">📄 Pagination</span>
          <span className="feature-badge">✏️ Always Editable</span>
          <span className="feature-badge">📋 Paste from Excel</span>
          <span className="feature-badge">➕ Add Rows/Columns</span>
          <span className="feature-badge">🎯 Production Ready</span>
        </div>
      </div>

      <div className="p-2">
        <div className="h-2" />
        <div className="paste-info">
          <p>💡 <strong>Tip:</strong> Copy data from Excel and press <kbd>Ctrl+V</kbd> to paste it here!</p>
        </div>
        
        <div className="table-controls">
          <button onClick={addNewRow} className="control-btn add-row-btn">
            ➕ Add Row
          </button>
          <button onClick={addNewColumn} className="control-btn add-column-btn">
            ➕ Add Column
          </button>
          <button onClick={handlePaste} className="paste-btn">
            📋 Paste from Excel
          </button>
        </div>

        <div className="table-container">
          <table className="tanstack-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <th 
                        key={header.id} 
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder ? null : (
                          <div className="header-content">
                            <div className="header-text">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div className="header-filter">
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td 
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
        <div>
          <button onClick={() => rerender()}>Force Rerender</button>
        </div>
      </div>

      <div className="tanstack-info">
        <h4>🎯 TanStack Table Official Features</h4>
        <ul>
          <li><strong>Always Editable:</strong> Every cell is an input field</li>
          <li><strong>Blur to Save:</strong> Click outside to save changes</li>
          <li><strong>Built-in Filtering:</strong> Filter by column values</li>
          <li><strong>Pagination:</strong> Navigate through large datasets</li>
          <li><strong>Auto-sizing Columns:</strong> Columns adjust to content automatically</li>
          <li><strong>Paste from Excel:</strong> Copy data from Excel and paste with Ctrl+V</li>
          <li><strong>Add Rows/Columns:</strong> Dynamically add new rows and columns</li>
          <li><strong>Performance:</strong> Optimized for large datasets</li>
          <li><strong>Official Pattern:</strong> Exactly as shown in TanStack docs</li>
        </ul>
      </div>
    </div>
  );
};

export default TanStackExample; 