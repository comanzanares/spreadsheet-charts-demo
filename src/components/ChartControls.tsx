import React from 'react';
import { ChartType, SpreadsheetData, ColorScheme } from '../types';
import ColorSelector from './ColorSelector';

interface ChartControlsProps {
  data: SpreadsheetData[];
  chartType: ChartType;
  selectedColumns: {
    x: string;
    y: string;
  };
  chartColors: { [key: string]: ColorScheme };
  onChartTypeChange: (type: ChartType) => void;
  onColumnChange: (axis: 'x' | 'y', column: string) => void;
  onColorChange: (column: string, colors: ColorScheme) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  data,
  chartType,
  selectedColumns,
  chartColors,
  onChartTypeChange,
  onColumnChange,
  onColorChange,
}) => {
  const getAvailableColumns = (): string[] => {
    if (!data || data.length === 0) return [];
    
    // Get all unique keys from all rows
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    
    // Sort keys numerically
    return Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
  };

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Line' },
    { value: 'bar', label: 'Bar' },
    { value: 'pie', label: 'Pie' },
    { value: 'doughnut', label: 'Doughnut' },
    { value: 'scatter', label: 'Scatter' },
  ];

  const availableColumns = getAvailableColumns();

  return (
    <div className="chart-controls">
      <h3>Chart Configuration</h3>
      
      <div className="control-group">
        <label htmlFor="chartType">Chart Type:</label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
        >
          {chartTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="xColumn">X Column:</label>
        <select
          id="xColumn"
          value={selectedColumns.x}
          onChange={(e) => onColumnChange('x', e.target.value)}
        >
          <option value="">Select column</option>
          {availableColumns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="yColumn">Y Column:</label>
        <select
          id="yColumn"
          value={selectedColumns.y}
          onChange={(e) => onColumnChange('y', e.target.value)}
        >
          <option value="">Select column</option>
          {availableColumns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>

      <ColorSelector
        data={data}
        selectedColumn={selectedColumns.y}
        currentColors={chartColors[selectedColumns.y] || {
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
        }}
        onColorChange={onColorChange}
      />
    </div>
  );
};

export default ChartControls; 