import React, { useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  RowData,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { SpreadsheetData } from '../types';
import './ReactTableSpreadsheet.css';

interface ReactTableSpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

// Extender la interfaz de TableMeta para incluir updateData
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

// Componente de celda editable (patrón oficial de TanStack adaptado)
const EditableCell: React.FC<{
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: any;
}> = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue();
  // Mantener y actualizar el estado de la celda normalmente
  const [value, setValue] = React.useState(initialValue);

  // Cuando el input pierde el foco, llamar a nuestra función updateData del meta de la tabla
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  // Si el initialValue cambia externamente, sincronizarlo con nuestro estado
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
      style={{
        width: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: '4px',
      }}
    />
  );
};

const ReactTableSpreadsheet: React.FC<ReactTableSpreadsheetProps> = ({ 
  data, 
  onDataChange 
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columnHelper = createColumnHelper<SpreadsheetData>();

  // Default column que hace todas las celdas editables (patrón oficial de TanStack)
  const defaultColumn: Partial<ColumnDef<SpreadsheetData>> = {
    cell: ({ getValue, row, column, table }) => (
      <EditableCell
        getValue={getValue}
        row={row}
        column={column}
        table={table}
      />
    ),
  };

  // Generate column definitions dinámicamente
  const columns = useMemo<ColumnDef<SpreadsheetData, any>[]>(() => {
    if (!data || data.length === 0) return [];
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const colIds = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    return colIds.map((key, index) => {
      const columnLetter = numberToColumnLetter(parseInt(key) + 1);
      return columnHelper.accessor(key, {
        id: key,
        header: columnLetter,
        enableSorting: true,
        enableColumnFilter: true,
      });
    });
  }, [data, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    // Proporcionar la función updateData al meta de la tabla
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        const newData = data.map((row: SpreadsheetData, index: number) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: value,
            };
          }
          return row;
        });
        onDataChange(newData);
      },
    },
  });

  // Add new row functionality
  const addNewRow = useCallback(() => {
    const newRow: SpreadsheetData = {};
    // Add empty cells for each column
    columns.forEach(column => {
      if (column.id) {
        newRow[column.id] = '';
      }
    });
    onDataChange([...data, newRow]);
  }, [data, columns, onDataChange]);

  // Add new column functionality
  const addNewColumn = useCallback(() => {
    const newColumnId = Math.max(...data.flatMap(row => 
      Object.keys(row).map(key => parseInt(key))
    ), -1) + 1;
    
    const newData = data.map(row => ({
      ...row,
      [newColumnId]: ''
    }));
    onDataChange(newData);
  }, [data, onDataChange]);

  return (
    <div className="react-table-spreadsheet-container">
      <div className="react-table-header">
        <h3>📊 React Table Spreadsheet</h3>
        <div className="react-table-features">
          <span className="feature-badge">🔄 Real-time Editing</span>
          <span className="feature-badge">🔍 Sorting & Filtering</span>
          <span className="feature-badge">📈 Lightweight</span>
          <span className="feature-badge">🎨 Customizable</span>
          <span className="feature-badge">✏️ Always Editable</span>
        </div>
      </div>

      <div className="react-table-controls">
        <button 
          className="control-btn add-row-btn"
          onClick={addNewRow}
        >
          ➕ Add Row
        </button>
        <button 
          className="control-btn add-column-btn"
          onClick={addNewColumn}
        >
          ➕ Add Column
        </button>
      </div>
      
      <div className="react-table-wrapper">
        <table className="react-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <th className="row-header table-header">
                  <div className="corner-cell">#</div>
                </th>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className="table-header"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="header-content">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <div className="sort-indicator">
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id} className="table-row">
                <td className="row-header table-cell">
                  <div className="row-number">
                    {rowIndex + 1}
                  </div>
                </td>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="react-table-info">
        <h4>🎯 React Table Features</h4>
        <ul>
          <li><strong>Always Editable:</strong> Click any cell to edit immediately</li>
          <li><strong>Blur to Save:</strong> Click outside to save changes</li>
          <li><strong>Sorting:</strong> Click column headers to sort</li>
          <li><strong>Performance:</strong> Optimized for large datasets</li>
          <li><strong>Simple:</strong> No complex state management needed</li>
          <li><strong>Official Pattern:</strong> Uses TanStack Table's recommended approach</li>
        </ul>
      </div>
      
      {/* Debug info */}
      <div className="debug-info">
        <p><strong>Debug Info:</strong></p>
        <p>Row Count: {data.length}</p>
        <p>Column Count: {columns.length}</p>
        <p>Sorting: {sorting.length > 0 ? sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`).join(', ') : 'None'}</p>
      </div>
    </div>
  );
};

export default ReactTableSpreadsheet; 