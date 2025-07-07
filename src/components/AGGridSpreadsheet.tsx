import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './AGGridSpreadsheet.css';
import { SpreadsheetData } from '../types';

interface AGGridSpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

const AGGridSpreadsheet: React.FC<AGGridSpreadsheetProps> = ({ data, onDataChange }) => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [isGridReady, setIsGridReady] = useState(false);

  // Convert data to AG Grid format
  const rowData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty grid with minimum rows and columns
      const minRows = 5;
      const minCols = 5;
      const emptyData = [];
      
      for (let i = 0; i < minRows; i++) {
        const row: SpreadsheetData = {};
        for (let j = 0; j < minCols; j++) {
          row[j.toString()] = '';
        }
        emptyData.push(row);
      }
      
      return emptyData;
    }
    return data;
  }, [data]);

  // Generate column definitions dynamically
  const columnDefs = useMemo<ColDef[]>(() => {
    if (!rowData || rowData.length === 0) return [];
    
    const allKeys = new Set<string>();
    rowData.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => ({
        field: key,
        headerName: `Column ${key}`,
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 100,
        flex: 1
      }));
  }, [rowData]);

  // Function to parse clipboard data
  const parseClipboardData = useCallback((clipboardText: string): string[][] => {
    return clipboardText
      .trim()
      .split('\n')
      .map(row => row.split('\t'));
  }, []);

  // Function to handle paste operation
  const handlePaste = useCallback(async () => {
    if (!gridApi) return;

    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsedData = parseClipboardData(clipboardText);
      
      if (parsedData.length === 0) return;

      // Get current selection
      const selectedRanges = gridApi.getCellRanges();
      if (!selectedRanges || selectedRanges.length === 0) {
        // If no selection, start from top-left
        const startRow = 0;
        const startCol = 0;
        
        // Update data starting from the selected position
        const newData = [...rowData];
        
        parsedData.forEach((row, rowIndex) => {
          if (startRow + rowIndex >= newData.length) {
            // Add new row if needed
            const newRow: SpreadsheetData = {};
            columnDefs.forEach((col, colIndex) => {
              // @ts-ignore
              newRow[col.field] = '';
            });
            newData.push(newRow);
          }
          
          row.forEach((cell, colIndex) => {
            const colDef = columnDefs[startCol + colIndex];
            const colField = colDef ? colDef.field : undefined;
            const targetRow = newData[startRow + rowIndex];
            if (typeof colField === 'string' && targetRow && typeof targetRow === 'object') {
              // @ts-ignore
              (targetRow as Record<string, any>)[colField as string] = cell;
            }
          });
        });
        
        onDataChange(newData);
      } else {
        // Use the first selected range
        const range = selectedRanges[0];
        const startRow = range.startRow?.rowIndex || 0;
        const startColId = range.startColumn?.getColId() || '0';
        const startColIndex = columnDefs.findIndex(col => col.field === startColId);
        const safeStartColIndex = startColIndex >= 0 ? startColIndex : 0;
        
        // Update data starting from the selected position
        const newData = [...rowData];
        
        parsedData.forEach((row, rowIndex) => {
          if (startRow + rowIndex >= newData.length) {
            // Add new row if needed
            const newRow: SpreadsheetData = {};
            columnDefs.forEach((col, colIndex) => {
              // @ts-ignore
              newRow[col.field] = '';
            });
            newData.push(newRow);
          }
          
          row.forEach((cell, colIndex) => {
            const colDef = columnDefs[safeStartColIndex + colIndex];
            const colField = colDef ? colDef.field : undefined;
            const targetRow = newData[startRow + rowIndex];
            if (typeof colField === 'string' && targetRow && typeof targetRow === 'object') {
              // @ts-ignore
              (targetRow as Record<string, any>)[colField as string] = cell;
            }
          });
        });
        
        onDataChange(newData);
      }
    } catch (error) {
      console.error('Error pasting data:', error);
    }
  }, [gridApi, rowData, columnDefs, parseClipboardData, onDataChange]);

  // Add keyboard event listener for paste
  useEffect(() => {
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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log('AG Grid Ready Event:', params);
    setGridApi(params.api);
    setIsGridReady(true);
    // Size columns to fit after grid is ready
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
  }, []);

  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    console.log('Cell value changed:', event);
    // Convert AG Grid data back to our format
    if (gridApi) {
      const newData = gridApi.getRenderedNodes().map(node => node.data);
      onDataChange(newData);
    }
  }, [gridApi, onDataChange]);

  // Update grid when data changes externally
  useEffect(() => {
    if (gridApi && isGridReady && data.length > 0) {
      // Size columns to fit when data changes
      setTimeout(() => {
        gridApi.sizeColumnsToFit();
      }, 100);
    }
  }, [data, gridApi, isGridReady]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    minWidth: 100
  }), []);

  // Add new row functionality
  const addNewRow = useCallback(() => {
    const newRow: SpreadsheetData = {};
    // Add empty cells for each column
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        newRow[key] = '';
      });
    } else {
      // If no data, create a row with at least one column
      newRow['0'] = '';
    }
    onDataChange([...data, newRow]);
  }, [data, onDataChange]);

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
    <div className="ag-grid-spreadsheet-container">
      <div className="ag-grid-header">
        <div className="ag-grid-header-left">
          <h3>📊 AG Grid Spreadsheet</h3>
          <div className="ag-grid-features">
            <span className="feature-badge">🔄 Real-time Editing</span>
            <span className="feature-badge">🔍 Advanced Filtering</span>
            <span className="feature-badge">📈 Sorting & Grouping</span>
            <span className="feature-badge">📱 Responsive</span>
            <span className="feature-badge">📋 Paste Data (Ctrl+V)</span>
          </div>
        </div>
        <div className="ag-grid-controls">
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
            className="control-btn paste-btn"
            onClick={handlePaste}
            title="Paste data from clipboard (Ctrl+V)"
          >
            📋 Paste Data
          </button>
        </div>
      </div>
      
      <div className="ag-grid-wrapper">
        <div 
          className="ag-theme-alpine"
          style={{ height: '500px', width: '100%' }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            animateRows={true}
            enableRangeSelection={true}
            enableFillHandle={true}
            suppressRowClickSelection={true}
            suppressCellFocus={false}
            suppressRowDeselection={true}
            rowSelection="multiple"
            pagination={false}
          />
        </div>
      </div>
      
      <div className="ag-grid-info">
        <h4>🎯 AG Grid Features</h4>
        <ul>
          <li><strong>Enterprise Performance:</strong> Optimized for large datasets</li>
          <li><strong>Advanced Filtering:</strong> Built-in filter components</li>
          <li><strong>Column Management:</strong> Resize, reorder, and hide columns</li>
          <li><strong>Selection:</strong> Row and cell selection with keyboard navigation</li>
          <li><strong>Customization:</strong> Extensive theming and styling options</li>
          <li><strong>Paste Support:</strong> Paste tabular data from Excel or other sources (Ctrl+V)</li>
        </ul>
      </div>
      
      {/* Debug info */}
      <div style={{ padding: '10px', background: '#f0f0f0', marginTop: '10px' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Row Data Count: {rowData.length}</p>
        <p>Column Defs Count: {columnDefs.length}</p>
        <p>Grid API: {gridApi ? 'Ready' : 'Not Ready'}</p>
        <p>Grid Ready: {isGridReady ? 'Yes' : 'No'}</p>
        <p>Grid Ref: {gridRef.current ? 'Exists' : 'Null'}</p>
        <p>Component Rendered: Yes</p>
        <p>Paste Functionality: ✅ Active (Ctrl+V)</p>
      </div>
    </div>
  );
};

export default AGGridSpreadsheet; 