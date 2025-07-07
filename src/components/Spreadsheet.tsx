import React, { useMemo, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { SpreadsheetData } from '../types';

// Register all Handsontable modules
registerAllModules();

interface SpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ data, onDataChange }) => {
  // Convert data from objects to arrays for Handsontable
  const convertedData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty grid with minimum rows and columns
      const minRows = 5;
      const minCols = 5;
      const emptyData = [];
      
      for (let i = 0; i < minRows; i++) {
        const row = new Array(minCols).fill('');
        emptyData.push(row);
      }
      
      return emptyData;
    }
    
    return data.map(row => {
      const rowArray: any[] = [];
      Object.keys(row).forEach(key => {
        const index = parseInt(key);
        rowArray[index] = row[key];
      });
      return rowArray;
    });
  }, [data]);

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

  const hotTableComponent = useMemo(() => {
    return (
      <HotTable
        data={convertedData}
        colHeaders={true}
        rowHeaders={true}
        height="auto"
        width="100%"
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        autoWrapRow={true}
        autoWrapCol={true}
        minSpareRows={5}
        minSpareCols={2}
        contextMenu={true}
        filters={true}
        dropdownMenu={true}
        columnSorting={true}
        afterChange={(changes, source) => {
          if (changes && source !== 'loadData') {
            const newData = [...convertedData];
            changes.forEach(([row, prop, oldValue, newValue]) => {
              if (newData[row] && typeof prop === 'number') {
                newData[row][prop] = newValue;
              }
            });
            
            // Convert back to object format
            const convertedBack = newData.map(row => {
              const rowObj: SpreadsheetData = {};
              row.forEach((cell, index) => {
                rowObj[index] = cell;
              });
              return rowObj;
            });
            
            onDataChange(convertedBack);
          }
        }}
        settings={{
          licenseKey: 'non-commercial-and-evaluation'
        }}
      />
    );
  }, [convertedData, onDataChange]);

  return (
    <div className="spreadsheet-container">
      <div className="spreadsheet-header">
        <h3>📊 Data Spreadsheet</h3>
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
        {hotTableComponent}
      </div>
    </div>
  );
};

export default Spreadsheet; 