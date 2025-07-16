import React, { useState, useEffect } from 'react';
import './App.css';
import Spreadsheet from './components/Spreadsheet';
import AGGridSpreadsheet from './components/AGGridSpreadsheet';
import ReactTableSpreadsheet from './components/ReactTableSpreadsheet';
import MUIDataGridSpreadsheet from './components/MUIDataGridSpreadsheet';
import TanStackExample from './components/TanStackExample';
import ReactTableHighchartsSpreadsheet from './components/ReactTableHighchartsSpreadsheet';
import HighchartsChart from './components/HighchartsChart';
import ChartControls from './components/ChartControls';
import Chart from './components/Chart';
import FileHandler from './components/FileHandler';
import JsonViewer from './components/JsonViewer';
import LibraryTabs from './components/LibraryTabs';
import LibraryComparison from './components/LibraryComparison';
import PlaceholderImplementation from './components/PlaceholderImplementation';
import { SpreadsheetData, ChartType, ColorScheme } from './types';

// Base structure for spreadsheet and charts testing
// TODO: Implement integration with specific libraries

export default function App() {
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedColumns, setSelectedColumns] = useState<{ x: string; y: string }>({
    x: '',
    y: '',
  });
  const [chartColors, setChartColors] = useState<{ [key: string]: ColorScheme }>({});
  const [selectedLibrary, setSelectedLibrary] = useState<string>('react-table-highcharts');
  const [highchartsChartType, setHighchartsChartType] = useState<ChartType>('line');

  // Function to get all available columns
  const getAvailableColumns = (): string[] => {
    if (!spreadsheetData || spreadsheetData.length === 0) return [];
    
    const allKeys = new Set<string>();
    spreadsheetData.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Clean selected columns if they don't exist in the data
  useEffect(() => {
    const availableColumns = getAvailableColumns();
    
    if (selectedColumns.x && !availableColumns.includes(selectedColumns.x)) {
      setSelectedColumns(prev => ({ ...prev, x: '' }));
    }
    
    if (selectedColumns.y && !availableColumns.includes(selectedColumns.y)) {
      setSelectedColumns(prev => ({ ...prev, y: '' }));
    }
  }, [spreadsheetData, selectedColumns.x, selectedColumns.y]);

  const handleDataChange = (data: SpreadsheetData[]) => {
    console.log('🔍 App handleDataChange called - data length:', data.length);
    console.log('🔍 App handleDataChange - data sample:', data.slice(0, 2));
    
    // Asegurar que siempre haya al menos una fila y una columna
    let validatedData = [...data];
    
    // Si no hay datos, crear una fila vacía con una columna
    if (validatedData.length === 0) {
      console.log('🔍 App - No data, creating default row');
      validatedData = [{ '0': '' }];
    }
    
    // Si hay filas pero alguna no tiene columnas, agregar al menos una columna
    validatedData = validatedData.map(row => {
      if (Object.keys(row).length === 0) {
        console.log('🔍 App - Empty row found, adding default column');
        return { '0': '' };
      }
      return row;
    });
    
    console.log('🔍 App - Final validated data length:', validatedData.length);
    setSpreadsheetData(validatedData);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handleColumnChange = (axis: 'x' | 'y', column: string) => {
    setSelectedColumns(prev => ({
      ...prev,
      [axis]: column,
    }));
  };

  const handleColorChange = (column: string, colors: ColorScheme) => {
    setChartColors(prev => ({
      ...prev,
      [column]: colors,
    }));
  };

  const handleLibraryChange = (libraryId: string) => {
    setSelectedLibrary(libraryId);
  };

  const renderMainContent = () => {
    if (selectedLibrary === 'comparison') {
      return (
        <div className="comparison-section">
          <LibraryComparison />
        </div>
      );
    } else if (selectedLibrary === 'handsontable-chartjs') {
      return (
        <>
          {/* Main content area - Spreadsheet and Chart */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <Spreadsheet 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <Chart
                data={spreadsheetData}
                chartType={chartType}
                selectedColumns={selectedColumns}
                chartColors={chartColors}
                onChartTypeChange={handleChartTypeChange}
                onColumnChange={handleColumnChange}
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );
    } else if (selectedLibrary === 'ag-grid-chartjs') {
      return (
        <>
          {/* Main content area - AG Grid Spreadsheet and Chart */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <AGGridSpreadsheet 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <Chart
                data={spreadsheetData}
                chartType={chartType}
                selectedColumns={selectedColumns}
                chartColors={chartColors}
                onChartTypeChange={handleChartTypeChange}
                onColumnChange={handleColumnChange}
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );
    } else if (selectedLibrary === 'react-table-chartjs') {
      return (
        <>
          {/* Main content area - React Table Spreadsheet and Chart */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <ReactTableSpreadsheet 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <Chart
                data={spreadsheetData}
                chartType={chartType}
                selectedColumns={selectedColumns}
                chartColors={chartColors}
                onChartTypeChange={handleChartTypeChange}
                onColumnChange={handleColumnChange}
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );
    } else if (selectedLibrary === 'mui-datagrid-chartjs') {
      return (
        <>
          {/* Main content area - MUI DataGrid Spreadsheet and Chart */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <MUIDataGridSpreadsheet 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <Chart
                data={spreadsheetData}
                chartType={chartType}
                selectedColumns={selectedColumns}
                chartColors={chartColors}
                onChartTypeChange={handleChartTypeChange}
                onColumnChange={handleColumnChange}
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );

    } else if (selectedLibrary === 'tanstack-example') {
      return (
        <>
          {/* Main content area - TanStack Official Example */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <TanStackExample 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <Chart
                data={spreadsheetData}
                chartType={chartType}
                selectedColumns={selectedColumns}
                chartColors={chartColors}
                onChartTypeChange={handleChartTypeChange}
                onColumnChange={handleColumnChange}
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );

    } else if (selectedLibrary === 'react-table-highcharts') {
      return (
        <>
          {/* Main content area - React Table + Highcharts */}
          <div className="main-content">
            <div className="spreadsheet-section">
              <ReactTableHighchartsSpreadsheet 
                data={spreadsheetData} 
                onDataChange={handleDataChange} 
              />
            </div>
            
            <div className="chart-section">
              <ChartControls
                chartType={highchartsChartType}
                onChartTypeChange={setHighchartsChartType}
              />
              <HighchartsChart
                data={spreadsheetData}
                chartType={highchartsChartType}
                title="React Table + Highcharts Chart"
              />
            </div>
          </div>

          {/* Sidebar with controls and tools */}
          <div className="sidebar">
            <FileHandler 
              onDataImport={handleDataChange} 
              data={spreadsheetData} 
            />
            
            <JsonViewer data={spreadsheetData} />
          </div>
        </>
      );

    } else {
      // Show placeholder for other libraries
      const libraryNames: { [key: string]: string } = {};
      
      return (
        <PlaceholderImplementation 
          libraryName={libraryNames[selectedLibrary] || 'Selected Library'}
          libraryId={selectedLibrary}
        />
      );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📊 Spreadsheet & Charts Demo</h1>
        <p>Edit data in the spreadsheet and see changes reflected in real-time charts</p>
      </header>
      
      <div className="library-tabs-container">
        <LibraryTabs 
          selectedLibrary={selectedLibrary}
          onLibraryChange={handleLibraryChange}
        />
      </div>
      
      <main className="app-main">
        {renderMainContent()}
      </main>
    </div>
  );
}
