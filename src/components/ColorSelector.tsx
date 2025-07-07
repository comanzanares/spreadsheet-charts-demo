import React from 'react';
import { ColorScheme, SpreadsheetData } from '../types';

interface ColorSelectorProps {
  data: SpreadsheetData[];
  selectedColumn: string;
  currentColors: ColorScheme;
  onColorChange: (column: string, colors: ColorScheme) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  data,
  selectedColumn,
  currentColors,
  onColorChange,
}) => {
  const getAvailableColumns = (): string[] => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0] || {});
  };

  const availableColumns = getAvailableColumns();

  const handleBackgroundColorChange = (color: string) => {
    onColorChange(selectedColumn, {
      ...currentColors,
      backgroundColor: color,
    });
  };

  const handleBorderColorChange = (color: string) => {
    onColorChange(selectedColumn, {
      ...currentColors,
      borderColor: color,
    });
  };

  const presetColors = [
    { bg: '#FF6384', border: '#FF6384' }, // Red
    { bg: '#36A2EB', border: '#36A2EB' }, // Blue
    { bg: '#FFCE56', border: '#FFCE56' }, // Yellow
    { bg: '#4BC0C0', border: '#4BC0C0' }, // Teal
    { bg: '#9966FF', border: '#9966FF' }, // Purple
    { bg: '#FF9F40', border: '#FF9F40' }, // Orange
    { bg: '#FF6384', border: '#FF6384' }, // Pink
    { bg: '#C9CBCF', border: '#C9CBCF' }, // Gray
  ];

  if (!selectedColumn) {
    return (
      <div className="color-selector">
        <h4>Color Selector</h4>
        <p className="no-selection">Select a column to customize its colors</p>
      </div>
    );
  }

  return (
    <div className="color-selector">
      <h4>Colors for: {selectedColumn}</h4>
      
      <div className="color-controls">
        <div className="color-group">
          <label htmlFor="bgColor">Background Color:</label>
          <div className="color-input-group">
            <input
              type="color"
              id="bgColor"
              value={currentColors.backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="color-picker"
            />
            <input
              type="text"
              value={currentColors.backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="color-text"
              placeholder="#FF6384"
            />
          </div>
        </div>

        <div className="color-group">
          <label htmlFor="borderColor">Border Color:</label>
          <div className="color-input-group">
            <input
              type="color"
              id="borderColor"
              value={currentColors.borderColor}
              onChange={(e) => handleBorderColorChange(e.target.value)}
              className="color-picker"
            />
            <input
              type="text"
              value={currentColors.borderColor}
              onChange={(e) => handleBorderColorChange(e.target.value)}
              className="color-text"
              placeholder="#FF6384"
            />
          </div>
        </div>
      </div>

      <div className="preset-colors">
        <label>Preset Colors:</label>
        <div className="color-presets">
          {presetColors.map((preset, index) => (
            <button
              key={index}
              className="preset-color-btn"
              style={{
                backgroundColor: preset.bg,
                border: `2px solid ${preset.border}`,
              }}
              onClick={() => onColorChange(selectedColumn, {
                backgroundColor: preset.bg,
                borderColor: preset.border,
              })}
              title={`Preset ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="color-preview">
        <label>Preview:</label>
        <div 
          className="preview-box"
          style={{
            backgroundColor: currentColors.backgroundColor,
            border: `3px solid ${currentColors.borderColor}`,
          }}
        >
          <span style={{ color: currentColors.borderColor }}>
            {selectedColumn}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColorSelector; 