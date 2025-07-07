import React, { useState } from 'react';
import { SpreadsheetData } from '../types';

interface JsonViewerProps {
  data: SpreadsheetData[];
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'formatted' | 'table'>('formatted');

  const formatJson = (obj: any, indent: number = 2): string => {
    return JSON.stringify(obj, null, indent);
  };

  const convertToTableData = () => {
    if (!data || data.length === 0) return [];
    
    // Get all unique keys
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    
    const sortedKeys = Array.from(allKeys).sort((a, b) => parseInt(a) - parseInt(b));
    
    return data.map((row, index) => {
      const tableRow: any = { row: index };
      sortedKeys.forEach(key => {
        tableRow[key] = row[key] || '';
      });
      return tableRow;
    });
  };

  const renderRawJson = () => (
    <pre className="json-raw">
      {formatJson(data)}
    </pre>
  );

  const renderFormattedJson = () => (
    <div className="json-formatted">
      {data.map((row, index) => (
        <div key={index} className="json-row">
          <span className="json-row-number">{index}:</span>
          <span className="json-row-content">
            {formatJson(row, 2)}
          </span>
        </div>
      ))}
    </div>
  );

  const renderTableJson = () => {
    const tableData = convertToTableData();
    const keys = Object.keys(tableData[0] || {}).filter(key => key !== 'row');
    
    return (
      <div className="json-table-container">
        <table className="json-table">
          <thead>
            <tr>
              <th>Row</th>
              {keys.map(key => (
                <th key={key}>Col {key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="row-number">{row.row}</td>
                {keys.map(key => (
                  <td key={key} className="cell-value">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getDataStats = () => {
    if (!data || data.length === 0) return null;
    
    const totalRows = data.length;
    const allKeys = new Set<string>();
    data.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const totalColumns = allKeys.size;
    
    const dataTypes: { [key: string]: string } = {};
    allKeys.forEach(key => {
      const values = data.map(row => row[key]).filter(val => val !== undefined);
      if (values.length > 0) {
        const sampleValue = values[0];
        if (typeof sampleValue === 'number') {
          dataTypes[key] = 'number';
        } else if (typeof sampleValue === 'string') {
          dataTypes[key] = 'string';
        } else {
          dataTypes[key] = typeof sampleValue;
        }
      }
    });

    return { totalRows, totalColumns, dataTypes };
  };

  const stats = getDataStats();

  return (
    <div className="json-viewer">
      <div className="json-viewer-header">
        <h3>📄 JSON Viewer</h3>
        <div className="json-controls">
          <div className="view-mode-selector">
            <label>View:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'raw' | 'formatted' | 'table')}
            >
              <option value="formatted">Formatted</option>
              <option value="raw">Raw JSON</option>
              <option value="table">Table</option>
            </select>
          </div>
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '📦 Collapse' : '📂 Expand'}
          </button>
        </div>
      </div>

      {stats && (
        <div className="data-stats">
          <div className="stat-item">
            <span className="stat-label">Rows:</span>
            <span className="stat-value">{stats.totalRows}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Columns:</span>
            <span className="stat-value">{stats.totalColumns}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Size:</span>
            <span className="stat-value">
              {JSON.stringify(data).length} bytes
            </span>
          </div>
        </div>
      )}

      <div className={`json-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {data.length === 0 ? (
          <div className="no-data">
            <p>📝 No data to display</p>
            <p>Load sample data or import a file to see the JSON</p>
          </div>
        ) : (
          <>
            {viewMode === 'raw' && renderRawJson()}
            {viewMode === 'formatted' && renderFormattedJson()}
            {viewMode === 'table' && renderTableJson()}
          </>
        )}
      </div>

      {data.length > 0 && (
        <div className="json-actions">
          <button
            className="copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(formatJson(data));
              // You could add a success notification here
            }}
          >
            📋 Copy JSON
          </button>
          <button
            className="download-btn"
            onClick={() => {
              const blob = new Blob([formatJson(data)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'spreadsheet-data.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            💾 Download JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default JsonViewer; 