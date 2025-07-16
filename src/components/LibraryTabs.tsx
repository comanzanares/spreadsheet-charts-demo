import React from 'react';
import './LibraryTabs.css';

export interface LibraryInfo {
  id: string;
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  version: string;
  website: string;
}

interface LibraryTabsProps {
  selectedLibrary: string;
  onLibraryChange: (libraryId: string) => void;
}

const libraries: LibraryInfo[] = [
  {
    id: 'react-table-highcharts',
    name: 'React Table + Highcharts',
    description: 'Lightweight table with professional Highcharts integration',
    pros: [
      'Professional chart library with extensive customization',
      'Lightweight table implementation',
      'Real-time chart updates from table data',
      'Multiple chart types available',
      'Excellent performance with large datasets',
      'Beautiful and responsive charts',
      'Comprehensive chart options and themes'
    ],
    cons: [
      'Highcharts requires commercial license for commercial use',
      'Larger bundle size due to Highcharts',
      'More complex chart configuration',
      'Requires manual table implementation'
    ],
    version: 'Latest',
    website: 'https://www.highcharts.com/'
  },
  {
    id: 'comparison',
    name: '📊 Library Comparison',
    description: 'Compare all four spreadsheet libraries side by side',
    pros: [],
    cons: [],
    version: 'Latest',
    website: '#'
  },
  {
    id: 'handsontable-chartjs',
    name: 'Handsontable + Chart.js',
    description: 'Professional spreadsheet with Chart.js integration',
    pros: [
      'Professional spreadsheet interface with Excel-like features',
      'Real-time data editing with instant chart updates',
      'Comprehensive API with extensive customization options',
      'Built-in data validation and formatting',
      'Excellent performance with large datasets',
      'Mobile-responsive design',
      'Rich set of built-in features (sorting, filtering, etc.)'
    ],
    cons: [
      'Commercial license required for advanced features',
      'Larger bundle size (~500KB)',
      'Steeper learning curve for complex configurations',
      'Limited free features in community version'
    ],
    version: '15.3.0',
    website: 'https://handsontable.com/'
  },
  {
    id: 'ag-grid-chartjs',
    name: 'AG Grid + Chart.js',
    description: 'Enterprise-grade grid with Chart.js charts',
    pros: [
      'Enterprise-level performance and features',
      'Advanced filtering and grouping capabilities',
      'Excellent TypeScript support',
      'Rich ecosystem of plugins and extensions',
      'Built-in chart integration',
      'Virtual scrolling for large datasets',
      'Comprehensive documentation'
    ],
    cons: [
      'Commercial license for advanced features',
      'Complex setup and configuration',
      'Large bundle size',
      'Overkill for simple use cases'
    ],
    version: '34.0.0',
    website: 'https://ag-grid.com/'
  },
  {
    id: 'react-table-chartjs',
    name: 'React Table + Chart.js',
    description: 'Lightweight table with Chart.js integration',
    pros: [
      'Lightweight and flexible',
      'Headless design for maximum customization',
      'Excellent TypeScript support',
      'No external dependencies',
      'Easy to integrate with any UI library',
      'Great for custom implementations'
    ],
    cons: [
      'Requires more manual setup',
      'No built-in editing features',
      'Limited built-in functionality',
      'More code required for advanced features'
    ],
    version: 'Latest',
    website: 'https://react-table.tanstack.com/'
  },
  {
    id: 'mui-datagrid-chartjs',
    name: 'MUI DataGrid + Chart.js',
    description: 'Material-UI grid with Chart.js charts',
    pros: [
      'Beautiful Material Design interface',
      'Built-in editing and filtering',
      'Excellent accessibility',
      'Consistent with Material Design system',
      'Good TypeScript support',
      'Responsive design out of the box'
    ],
    cons: [
      'Tied to Material-UI ecosystem',
      'Limited customization compared to headless solutions',
      'Bundle size includes Material-UI dependencies',
      'May not fit all design systems'
    ],
    version: 'Latest',
    website: 'https://mui.com/x/react-data-grid/'
  },
  {
    id: 'tanstack-example',
    name: 'TanStack Official Example',
    description: 'Exact implementation of TanStack Table official example',
    pros: [
      '100% official TanStack Table pattern',
      'Always editable cells with blur to save',
      'Built-in filtering and pagination',
      'Production-ready implementation',
      'Excellent performance optimization',
      'Clean and simple code structure'
    ],
    cons: [
      'No custom navigation (Enter/Tab)',
      'No selection features',
      'Basic styling (can be customized)',
      'Limited to official example features'
    ],
    version: 'Latest',
    website: 'https://react-table.tanstack.com/'
  },

];

const LibraryTabs: React.FC<LibraryTabsProps> = ({ selectedLibrary, onLibraryChange }) => {
  const selectedLibraryInfo = libraries.find(lib => lib.id === selectedLibrary);

  return (
    <div className="library-tabs">
      <div className="tabs-header">
        <h2>📚 Library Comparison</h2>
        <div className="tabs-container">
          {libraries.map((library) => (
            <button
              key={library.id}
              className={`tab-button ${selectedLibrary === library.id ? 'active' : ''}`}
              onClick={() => onLibraryChange(library.id)}
            >
              {library.name}
            </button>
          ))}
        </div>
      </div>

      {selectedLibraryInfo && (
        <div className="library-info">
          <div className="library-header">
            <h3>{selectedLibraryInfo.name}</h3>
            <div className="library-meta">
              <span className="version">v{selectedLibraryInfo.version}</span>
              <a 
                href={selectedLibraryInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="website-link"
              >
                🌐 Website
              </a>
            </div>
          </div>
          
          <p className="library-description">{selectedLibraryInfo.description}</p>
          
          {selectedLibraryInfo.pros.length > 0 && selectedLibraryInfo.cons.length > 0 && (
            <div className="pros-cons">
              <div className="pros">
                <h4>✅ Pros</h4>
                <ul>
                  {selectedLibraryInfo.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              
              <div className="cons">
                <h4>❌ Cons</h4>
                <ul>
                  {selectedLibraryInfo.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryTabs; 