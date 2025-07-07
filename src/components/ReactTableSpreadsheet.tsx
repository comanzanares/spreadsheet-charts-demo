import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  Row,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { SpreadsheetData } from '../types';
import './ReactTableSpreadsheet.css';

interface ReactTableSpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

interface CellSelection {
  startRow: number;
  startCol: string;
  endRow: number;
  endCol: string;
}

const ReactTableSpreadsheet: React.FC<ReactTableSpreadsheetProps> = ({ 
  data, 
  onDataChange 
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  // Estados para selección múltiple
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const columnHelper = createColumnHelper<SpreadsheetData>();

  // Función para verificar si una celda está seleccionada
  const isCellSelected = useCallback((rowIndex: number, columnId: string, colIds: string[]): boolean => {
    if (!selection) return false;
    
    const { startRow, endRow, startCol, endCol } = selection;
    const startColIndex = colIds.indexOf(startCol);
    const endColIndex = colIds.indexOf(endCol);
    const currentColIndex = colIds.indexOf(columnId);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColIndex = Math.min(startColIndex, endColIndex);
    const maxColIndex = Math.max(startColIndex, endColIndex);
    
    return rowIndex >= minRow && rowIndex <= maxRow && 
           currentColIndex >= minColIndex && currentColIndex <= maxColIndex;
  }, [selection]);

  // Manejadores de eventos para selección
  const handleCellMouseDown = useCallback((rowIndex: number, columnId: string, event: React.MouseEvent) => {
    if (event.button !== 0) return; // Solo clic izquierdo
    
    setIsSelecting(true);
    setSelection({
      startRow: rowIndex,
      startCol: columnId,
      endRow: rowIndex,
      endCol: columnId
    });
    setEditingCell(null);
  }, []);

  const handleCellMouseEnter = useCallback((rowIndex: number, columnId: string) => {
    if (isSelecting && selection) {
      setSelection({
        ...selection,
        endRow: rowIndex,
        endCol: columnId
      });
    }
  }, [isSelecting, selection]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Event listener global para mouse up
  React.useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Generate column definitions dinámicamente
  const columns = useMemo<ColumnDef<SpreadsheetData, any>[]>(() => {
    if (!data || data.length === 0) return [];
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const colIds = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    return colIds.map(key => 
      columnHelper.accessor(key, {
        id: key,
        header: `Column ${key}`,
        cell: ({ row, column, getValue }) => {
          const value = getValue();
          const isEditing = editingCell?.rowIndex === row.index && editingCell?.columnId === column.id;
          const isSelected = isCellSelected(row.index, column.id, colIds);
          
          return (
            <div 
              className={`cell ${isEditing ? 'editing' : ''} ${isSelected ? 'selected' : ''}`}
              onMouseDown={(e) => handleCellMouseDown(row.index, column.id, e)}
              onMouseEnter={() => handleCellMouseEnter(row.index, column.id)}
              onClick={() => {
                if (!isSelecting) {
                  setEditingCell({ rowIndex: row.index, columnId: column.id });
                  setEditValue(value?.toString() || '');
                }
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    // Update data
                    const newData = [...data];
                    if (newData[row.index]) {
                      newData[row.index] = { ...newData[row.index], [column.id]: editValue };
                      onDataChange(newData);
                    }
                    setEditingCell(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Update data
                      const newData = [...data];
                      if (newData[row.index]) {
                        newData[row.index] = { ...newData[row.index], [column.id]: editValue };
                        onDataChange(newData);
                      }
                      setEditingCell(null);
                    } else if (e.key === 'Escape') {
                      setEditingCell(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span>{value?.toString() || ''}</span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      })
    );
  }, [data, editingCell, editValue, columnHelper, onDataChange, isCellSelected, handleCellMouseDown, handleCellMouseEnter, isSelecting]);

  // Función para obtener el rango de celdas seleccionadas
  const getSelectedCells = useCallback((): Array<{ rowIndex: number; columnId: string }> => {
    if (!selection) return [];
    
    const { startRow, endRow, startCol, endCol } = selection;
    // Obtener colIds de los datos
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const colIds = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    const startColIndex = colIds.indexOf(startCol);
    const endColIndex = colIds.indexOf(endCol);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minColIndex = Math.min(startColIndex, endColIndex);
    const maxColIndex = Math.max(startColIndex, endColIndex);
    
    const selectedCells: Array<{ rowIndex: number; columnId: string }> = [];
    
    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const columnId = colIds[colIndex];
        if (columnId && rowIndex < data.length) {
          selectedCells.push({ rowIndex, columnId });
        }
      }
    }
    
    return selectedCells;
  }, [selection, data]);

  // Función para borrar celdas seleccionadas
  const clearSelectedCells = useCallback(() => {
    if (!selection) return;
    
    const selectedCells = getSelectedCells();
    if (selectedCells.length === 0) return;
    
    const newData = [...data];
    selectedCells.forEach(({ rowIndex, columnId }) => {
      if (newData[rowIndex]) {
        newData[rowIndex] = { ...newData[rowIndex], [columnId]: '' };
      }
    });
    onDataChange(newData);
  }, [selection, getSelectedCells, data, onDataChange]);

  // Event listener para teclas Delete y Backspace
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo procesar si hay celdas seleccionadas y no se está editando
      if (selection && !editingCell && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        clearSelectedCells();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selection, editingCell, clearSelectedCells]);



  // --- PASTE FUNCTIONALITY ---
  // Parse clipboard data
  const parseClipboardData = (clipboardText: string): string[][] => {
    return clipboardText
      .trim()
      .split('\n')
      .map(row => row.split('\t'));
  };

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsedData = parseClipboardData(clipboardText);
      if (parsedData.length === 0) return;

      // Determinar punto de inicio
      let startRow = 0;
      let startColId = columns[0]?.id || '0';
      if (editingCell) {
        startRow = editingCell.rowIndex;
        startColId = editingCell.columnId;
      }
      const colIds = columns.map(col => col.id!);
      const startColIndex = colIds.indexOf(startColId);
      const safeStartColIndex = startColIndex >= 0 ? startColIndex : 0;

      // Copiar datos
      const newData = [...data];
      parsedData.forEach((row, rowIndex) => {
        if (startRow + rowIndex >= newData.length) {
          // Agregar nueva fila si es necesario
          const newRow: SpreadsheetData = {};
          colIds.forEach(id => { newRow[id] = ''; });
          newData.push(newRow);
        }
        row.forEach((cell, colIndex) => {
          const colId = colIds[safeStartColIndex + colIndex];
          if (colId && newData[startRow + rowIndex]) {
            newData[startRow + rowIndex][colId] = cell;
          }
        });
      });
      onDataChange(newData);
    } catch (error) {
      console.error('Error al pegar datos:', error);
    }
  }, [columns, data, editingCell, onDataChange]);

  // Event listener para Ctrl+V
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        handlePaste();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePaste]);
  // --- END PASTE FUNCTIONALITY ---

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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="react-table-spreadsheet-container">
      <div className="react-table-header">
        <h3>📊 React Table Spreadsheet</h3>
        <div className="react-table-features">
          <span className="feature-badge">🔄 Real-time Editing</span>
          <span className="feature-badge">🔍 Sorting & Filtering</span>
          <span className="feature-badge">📈 Lightweight</span>
          <span className="feature-badge">🎨 Customizable</span>
          <span className="feature-badge">🗑️ Delete Selection</span>
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
        <button 
          className="control-btn clear-selection-btn"
          onClick={clearSelectedCells}
          disabled={!selection}
        >
          🗑️ Clear Selection
        </button>
      </div>
      
      <div className="react-table-wrapper">
        <table className="react-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="table-row">
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
          <li><strong>Lightweight:</strong> Minimal bundle size with maximum flexibility</li>
          <li><strong>Headless Design:</strong> Complete control over styling and behavior</li>
          <li><strong>TypeScript Support:</strong> Excellent type safety and IntelliSense</li>
          <li><strong>Customizable:</strong> Build exactly what you need</li>
          <li><strong>Performance:</strong> Optimized for large datasets</li>
          <li><strong>Multi-Cell Selection:</strong> Click and drag to select multiple cells like Excel</li>
          <li><strong>Delete Selection:</strong> Press Delete/Backspace or use the button to clear selected cells</li>
        </ul>
      </div>
      
      {/* Debug info */}
      <div className="debug-info">
        <p><strong>Debug Info:</strong></p>
        <p>Row Count: {data.length}</p>
        <p>Column Count: {columns.length}</p>
        <p>Editing Cell: {editingCell ? `${editingCell.rowIndex}, ${editingCell.columnId}` : 'None'}</p>
        <p>Selection: {selection ? `${selection.startRow},${selection.startCol} to ${selection.endRow},${selection.endCol}` : 'None'}</p>
        <p>Selected Cells: {getSelectedCells().length}</p>
        <p>Sorting: {sorting.length > 0 ? sorting.map(s => `${s.id} ${s.desc ? 'desc' : 'asc'}`).join(', ') : 'None'}</p>
      </div>
    </div>
  );
};

export default ReactTableSpreadsheet; 