import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { SpreadsheetData } from '../types';
import './FileHandler.css';

interface FileHandlerProps {
  onDataImport: (data: SpreadsheetData[]) => void;
  data: SpreadsheetData[];
}

const FileHandler: React.FC<FileHandlerProps> = ({ onDataImport, data }) => {
  const [importStatus, setImportStatus] = useState<string>('');

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('Importing file...');

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      handleCSVImport(file);
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      handleExcelImport(file);
    } else if (fileExtension === 'json') {
      handleJSONImport(file);
    } else {
      setImportStatus('Unsupported file format');
      setTimeout(() => setImportStatus(''), 3000);
    }
  };

  const handleCSVImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        
        // Parse CSV more robustly
        const parseCSV = (text: string) => {
          const lines = text.split(/\r?\n/).filter(line => line.trim());
          if (lines.length === 0) return [];
          
          const result: any[][] = [];
          
          for (const line of lines) {
            const row: any[] = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                row.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            
            // Add the last field
            row.push(current.trim());
            result.push(row);
          }
          
          return result;
        };
        
        const parsedData = parseCSV(csvText);
        const convertedData: SpreadsheetData[] = parsedData.map(row => {
          const rowData: SpreadsheetData = {};
          row.forEach((cell, index) => {
            rowData[index] = cell;
          });
          return rowData;
        });
        
        onDataImport(convertedData);
        setImportStatus('CSV file imported successfully');
        setTimeout(() => setImportStatus(''), 3000);
      } catch (error) {
        console.error('Error importing CSV:', error);
        setImportStatus('Error importing CSV file');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleExcelImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convert to SpreadsheetData format
        const convertedData: SpreadsheetData[] = jsonData.map((row: any) => {
          const rowData: SpreadsheetData = {};
          row.forEach((cell: any, index: number) => {
            rowData[index] = cell;
          });
          return rowData;
        });

        onDataImport(convertedData);
        setImportStatus('Excel file imported successfully');
        setTimeout(() => setImportStatus(''), 3000);
      } catch (error) {
        console.error('Error importing Excel:', error);
        setImportStatus('Error importing Excel file');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleJSONImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        onDataImport(jsonData);
        setImportStatus('JSON file imported successfully');
        setTimeout(() => setImportStatus(''), 3000);
      } catch (error) {
        console.error('Error importing JSON:', error);
        setImportStatus('Error importing JSON file');
        setTimeout(() => setImportStatus(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = (format: 'xlsx' | 'csv' | 'json') => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      if (format === 'xlsx') {
        // Convert data to spreadsheet format
        const worksheetData = data.map(row => {
          const rowArray: any[] = [];
          Object.keys(row).forEach(key => {
            rowArray[parseInt(key)] = row[key];
          });
          return rowArray;
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        // Export file
        XLSX.writeFile(workbook, 'spreadsheet-data.xlsx');
      } else if (format === 'csv') {
        // Export as CSV
        const csvContent = data.map(row => {
          const rowArray: any[] = [];
          Object.keys(row).forEach(key => {
            rowArray[parseInt(key)] = row[key];
          });
          return rowArray.map(cell => `"${cell || ''}"`).join(',');
        }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spreadsheet-data.csv';
        link.click();
      } else if (format === 'json') {
        // Export as JSON
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'spreadsheet-data.json';
        link.click();
      }
    } catch (error) {
      console.error('Error exporting file:', error);
      alert('Error exporting file');
    }
  };

  const handleSampleData = () => {
    const sampleData: SpreadsheetData[] = [
      { 0: 'Month', 1: 'Sales', 2: 'Expenses', 3: 'Profit' },
      { 0: 'January', 1: 1000, 2: 600, 3: 400 },
      { 0: 'February', 1: 1200, 2: 700, 3: 500 },
      { 0: 'March', 1: 1100, 2: 650, 3: 450 },
      { 0: 'April', 1: 1400, 2: 800, 3: 600 },
      { 0: 'May', 1: 1300, 2: 750, 3: 550 },
      { 0: 'June', 1: 1600, 2: 900, 3: 700 },
    ];
    onDataImport(sampleData);
  };

  return (
    <div className="file-handler">
      <h3>📁 File Management</h3>
      
      {importStatus && (
        <div className={`import-status ${importStatus.includes('Error') ? 'error' : 'success'}`}>
          {importStatus}
        </div>
      )}
      
      <div className="file-controls">
        <div className="control-group">
          <label htmlFor="fileImport">📤 Import File:</label>
          <input
            type="file"
            id="fileImport"
            accept=".xlsx,.xls,.csv,.json"
            onChange={handleFileImport}
          />
          <small>Supported formats: Excel (.xlsx, .xls), CSV, JSON</small>
        </div>

        <div className="control-group">
          <label>📥 Export as:</label>
          <div className="export-buttons">
            <button onClick={() => handleExport('xlsx')} className="export-btn excel">
              📊 Excel
            </button>
            <button onClick={() => handleExport('csv')} className="export-btn csv">
              📄 CSV
            </button>
            <button onClick={() => handleExport('json')} className="export-btn json">
              🔧 JSON
            </button>
          </div>
        </div>

        <div className="control-group">
          <button onClick={handleSampleData} className="sample-btn">
            📋 Load Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileHandler; 