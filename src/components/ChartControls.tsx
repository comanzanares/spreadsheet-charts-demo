import React from 'react';
import { ChartType } from '../types';
import './ChartControls.css';

interface ChartControlsProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const chartTypes = [
  { value: 'line', label: '📈 Line', description: 'Standard line chart' },
  { value: 'spline', label: '📈 Spline', description: 'Smooth curved lines' },
  { value: 'area', label: '📊 Area', description: 'Area under the line' },
  { value: 'areaspline', label: '📊 Area Spline', description: 'Area with smooth lines' },
  { value: 'column', label: '📊 Columns', description: 'Vertical bars' },
  { value: 'bar', label: '📊 Bars', description: 'Horizontal bars' },
  { value: 'scatter', label: '🔵 Scatter', description: 'Data points' },
  { value: 'pie', label: '🥧 Pie', description: 'Circular chart' },
  { value: 'doughnut', label: '🍩 Doughnut', description: 'Doughnut chart' },
  { value: 'columnrange', label: '📊 Range', description: 'Columns with range' },
  { value: 'map', label: '🗺️ World Map', description: 'Interactive world map with GDP data' },
  { value: 'usmap', label: '🗺️ US States Map', description: 'Interactive map of US states with color-coded data' },
  { value: 'eumap', label: '🗺️ Europe Map', description: 'Interactive map of European countries with color-coded data' },
];

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
}) => {
  return (
    <div className="chart-controls">
      <div className="control-group">
        <label htmlFor="chart-type-select" className="control-label">
          📊 Chart Type
        </label>
        <select
          id="chart-type-select"
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
          className="chart-type-select"
        >
          {chartTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart-type-info">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <strong>Current type:</strong> {chartTypes.find(t => t.value === chartType)?.label}
          <br />
          <small>{chartTypes.find(t => t.value === chartType)?.description}</small>
        </div>
      </div>
    </div>
  );
};

export default ChartControls; 