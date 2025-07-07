import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Scatter } from 'react-chartjs-2';
import { ChartData, ChartType, SpreadsheetData, ChartColors } from '../types';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: SpreadsheetData[];
  chartType: ChartType;
  selectedColumns: {
    x: string;
    y: string;
  };
  chartColors: ChartColors;
  onChartTypeChange: (type: ChartType) => void;
  onColumnChange: (axis: 'x' | 'y', column: string) => void;
}

const Chart: React.FC<ChartProps> = ({ 
  data, 
  chartType, 
  selectedColumns, 
  chartColors,
  onChartTypeChange,
  onColumnChange
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

  const processDataForChart = (): ChartData => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'No data',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      };
    }

    // Check if selected columns exist in the data
    if (!selectedColumns.x || !selectedColumns.y) {
      return {
        labels: [],
        datasets: [{
          label: 'Select X and Y columns',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }]
      };
    }

    // Check if columns exist in at least one row
    const columnExists = data.some(row => 
      row.hasOwnProperty(selectedColumns.x) && row.hasOwnProperty(selectedColumns.y)
    );

    if (!columnExists) {
      return {
        labels: [],
        datasets: [{
          label: 'Columns not found in data',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }]
      };
    }

    const labels: string[] = [];
    const values: number[] = [];

    data.forEach((row, index) => {
      if (index === 0) return; // Skip header row
      
      // Get values using column keys directly
      const xValue = row[selectedColumns.x];
      const yValue = row[selectedColumns.y];

      // Only add data if both values exist and are not null/undefined
      if (xValue !== undefined && xValue !== null && yValue !== undefined && yValue !== null) {
        const xString = String(xValue).trim();
        const yString = String(yValue).trim();
        
        // Only add if values are not empty
        if (xString !== '' && yString !== '') {
          labels.push(xString);
          const numValue = typeof yValue === 'number' ? yValue : parseFloat(yString);
          values.push(isNaN(numValue) ? 0 : numValue);
        }
      }
    });

    // Get custom colors or use defaults
    const defaultColors = {
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
      borderColor: 'rgba(75, 192, 192, 1)',
    };

    const columnColors = chartColors[selectedColumns.y] || defaultColors;

    return {
      labels,
      datasets: [{
        label: selectedColumns.y,
        data: values,
        backgroundColor: chartType === 'line' 
          ? columnColors.backgroundColor.replace('1)', '0.2)') 
          : columnColors.backgroundColor,
        borderColor: columnColors.borderColor,
        borderWidth: 2,
        ...(chartType === 'line' && { fill: true, tension: 0.1 }),
      }]
    };
  };

  const chartData = processDataForChart();

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: `${chartType.toUpperCase()} Chart - ${selectedColumns.x} vs ${selectedColumns.y}`,
          },
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
          y: {
            beginAtZero: true,
          },
        } : undefined,
      },
    };

    switch (chartType) {
      case 'line':
        return <Line {...commonProps} />;
      case 'bar':
        return <Bar {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'doughnut':
        return <Doughnut {...commonProps} />;
      case 'scatter':
        return <Scatter {...commonProps} />;
      default:
        return <Line {...commonProps} />;
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>📈 Data Visualization</h3>
        <div className="chart-controls-header">
          <div className="control-group-inline">
            <label htmlFor="chartType">Type:</label>
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

          <div className="control-group-inline">
            <label htmlFor="xColumn">X:</label>
            <select
              id="xColumn"
              value={selectedColumns.x}
              onChange={(e) => onColumnChange('x', e.target.value)}
            >
              <option value="">Select</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group-inline">
            <label htmlFor="yColumn">Y:</label>
            <select
              id="yColumn"
              value={selectedColumns.y}
              onChange={(e) => onColumnChange('y', e.target.value)}
            >
              <option value="">Select</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="chart-wrapper">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chart; 