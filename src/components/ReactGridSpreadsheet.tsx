import React, { useMemo, useCallback, useState } from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell } from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.css';
import './ReactGridSpreadsheet.css';
import { SpreadsheetData } from '../types';

interface ReactGridSpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

const ReactGridSpreadsheet: React.FC<ReactGridSpreadsheetProps> = ({ data, onDataChange }) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  // Convert data from objects to ReactGrid format
  const convertedData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty grid with minimum rows and columns
      const minRows = 5;
      const minCols = 5;
      
      const defaultColumns: Column[] = Array.from({ length: minCols }, (_, index) => ({
        columnId: index.toString(),
        width: 150,
        resizable: true
      }));
      
      const defaultRows: Row[] = Array.from({ length: minRows }, (_, rowIndex) => ({
        rowId: rowIndex.toString(),
        height: 40,
        cells: Array.from({ length: minCols }, (_, colIndex) => ({
          type: 'text' as const,
          text: '',
          nonEditable: false
        }))
      }));
      
      setColumns(defaultColumns);
      setRows(defaultRows);
      
      return { columns: defaultColumns, rows: defaultRows };
    }
    
    // Get all unique column keys
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const sortedKeys = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Create columns
    const newColumns: Column[] = sortedKeys.map(key => ({
      columnId: key,
      width: 150,
      resizable: true
    }));
    
    // Create rows
    const newRows: Row[] = data.map((row, rowIndex) => ({
      rowId: rowIndex.toString(),
      height: 40,
      cells: sortedKeys.map(key => {
        const value = row[key] || '';
        return {
          type: 'text' as const,
          text: value.toString(),
          nonEditable: false
        };
      })
    }));
    
    setColumns(newColumns);
    setRows(newRows);
    
    return { columns: newColumns, rows: newRows };
  }, [data]);

  // Add new row functionality
  const addNewRow = useCallback(() => {
    const newRowId = rows.length;
    const newRow: Row = {
      rowId: newRowId.toString(),
      height: 40,
      cells: columns.map(col => ({
        type: 'text' as const,
        text: '',
        nonEditable: false
      }))
    };
    
    const newRows = [...rows, newRow];
    setRows(newRows);
    
    // Convert back to SpreadsheetData format
    const newData = newRows.map(row => {
      const rowObj: SpreadsheetData = {};
      row.cells.forEach((cell, index) => {
        const columnId = columns[index]?.columnId;
        if (columnId) {
          rowObj[columnId] = (cell as TextCell).text;
        }
      });
      return rowObj;
    });
    
    onDataChange(newData);
  }, [rows, columns, onDataChange]);

  // Add new column functionality
  const addNewColumn = useCallback(() => {
    // @ts-ignore
    const newColumnId = Math.max(...columns.map(col => parseInt(col.columnId)), -1) + 1;
    const newColumn: Column = {
      columnId: newColumnId.toString(),
      width: 150,
      resizable: true
    };
    
    const newColumns = [...columns, newColumn];
    setColumns(newColumns);
    
    // Add empty cells to all rows for the new column
    const newRows = rows.map(row => ({
      ...row,
      cells: [...row.cells, {
        type: 'text' as const,
        text: '',
        nonEditable: false
      }]
    }));
    setRows(newRows);
    
    // Convert back to SpreadsheetData format
    const newData = newRows.map(row => {
      const rowObj: SpreadsheetData = {};
      row.cells.forEach((cell, index) => {
        const columnId = newColumns[index]?.columnId;
        if (columnId) {
          rowObj[columnId] = (cell as TextCell).text;
        }
      });
      return rowObj;
    });
    
    onDataChange(newData);
  }, [columns, rows, onDataChange]);

  // Handle cell changes
  const handleCellChange = useCallback((changes: CellChange[]) => {
    const newRows = [...rows];
    
    changes.forEach(change => {
      const { rowId, columnId, newCell } = change;
      const rowIndex = newRows.findIndex(row => row.rowId === rowId.toString());
      const colIndex = columns.findIndex(col => col.columnId === columnId);
      
      if (rowIndex !== -1 && colIndex !== -1) {
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          cells: newRows[rowIndex].cells.map((cell, index) => 
            index === colIndex ? newCell : cell
          )
        };
      }
    });
    
    setRows(newRows);
    
    // Convert back to SpreadsheetData format
    const newData = newRows.map(row => {
      const rowObj: SpreadsheetData = {};
      row.cells.forEach((cell, index) => {
        const columnId = columns[index]?.columnId;
        if (columnId) {
          rowObj[columnId] = (cell as TextCell).text;
        }
      });
      return rowObj;
    });
    
    onDataChange(newData);
  }, [rows, columns, onDataChange]);

  return (
    <div className="reactgrid-spreadsheet-container">
      <div className="spreadsheet-header">
        <h3>📊 ReactGrid Spreadsheet</h3>
        <div className="spreadsheet-controls">
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
      </div>
      <div className="spreadsheet-wrapper">
        <ReactGrid
          rows={convertedData.rows}
          columns={convertedData.columns}
          onCellsChanged={handleCellChange}
          enableFillHandle={true}
          enableRangeSelection={true}
          enableRowSelection={true}
          enableColumnSelection={true}
          stickyTopRows={1}
          stickyLeftColumns={1}
        />
      </div>
    </div>
  );
};

export default ReactGridSpreadsheet; 