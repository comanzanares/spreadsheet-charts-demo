import React from 'react';
import './PlaceholderImplementation.css';

interface PlaceholderImplementationProps {
  libraryName: string;
  libraryId: string;
}

const PlaceholderImplementation: React.FC<PlaceholderImplementationProps> = ({ 
  libraryName, 
  libraryId 
}) => {
  const getImplementationSteps = (libraryId: string) => {
    switch (libraryId) {
      case 'ag-grid-chartjs':
        return [
          'Install AG Grid: npm install ag-grid-react ag-grid-community',
          'Import AG Grid components and styles',
          'Replace Handsontable with AG Grid in Spreadsheet component',
          'Configure AG Grid with editing capabilities',
          'Integrate with existing Chart.js implementation',
          'Add AG Grid specific features like filtering and sorting'
        ];
      case 'react-table-chartjs':
        return [
          'Install React Table: npm install @tanstack/react-table',
          'Create a custom table component with React Table',
          'Add inline editing functionality',
          'Integrate with existing Chart.js implementation',
          'Implement data synchronization between table and charts',
          'Add custom styling and interactions'
        ];
      case 'mui-datagrid-chartjs':
        return [
          'Install MUI DataGrid: npm install @mui/x-data-grid @mui/material @emotion/react @emotion/styled',
          'Import MUI DataGrid components and theme',
          'Replace current spreadsheet with MUI DataGrid',
          'Configure editing and filtering capabilities',
          'Integrate with existing Chart.js implementation',
          'Apply Material Design styling'
        ];
      default:
        return [
          'Install required dependencies',
          'Create spreadsheet component with selected library',
          'Integrate with Chart.js for visualization',
          'Implement data synchronization',
          'Add custom styling and interactions'
        ];
    }
  };

  const getLibraryWebsite = (libraryId: string) => {
    switch (libraryId) {
      case 'ag-grid-chartjs':
        return 'https://ag-grid.com/';
      case 'react-table-chartjs':
        return 'https://react-table.tanstack.com/';
      case 'mui-datagrid-chartjs':
        return 'https://mui.com/x/react-data-grid/';
      default:
        return '#';
    }
  };

  const steps = getImplementationSteps(libraryId);
  const website = getLibraryWebsite(libraryId);

  return (
    <div className="placeholder-implementation">
      <div className="placeholder-header">
        <h2>🚧 Implementation Coming Soon</h2>
        <p>
          The <strong>{libraryName}</strong> integration is not yet implemented.
        </p>
      </div>

      <div className="placeholder-content">
        <div className="implementation-info">
          <h3>📋 Implementation Plan</h3>
          <p>
            This library will be integrated following these steps:
          </p>
          
          <ol className="implementation-steps">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          <div className="implementation-actions">
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="docs-link"
            >
              📖 View Documentation
            </a>
            
            <div className="current-status">
              <span className="status-badge pending">⏳ Pending Implementation</span>
            </div>
          </div>
        </div>

        <div className="demo-note">
          <h4>💡 Demo Note</h4>
          <p>
            Currently, this demo uses <strong>Handsontable + Chart.js</strong> as the 
            reference implementation. You can see how the integration works by 
            switching back to that tab.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderImplementation; 