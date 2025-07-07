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
    id: 'reactgrid-chartjs',
    name: 'ReactGrid + Chart.js',
    description: 'Modern React spreadsheet with Chart.js integration',
    pros: [
      'Modern React-based spreadsheet component',
      'Lightweight and performant',
      'Excellent TypeScript support',
      'Built-in cell editing and selection',
      'Support for different cell types',
      'Clean and intuitive API'
    ],
    cons: [
      'Newer library with smaller community',
      'Limited advanced features compared to enterprise solutions',
      'May require more setup for complex use cases',
      'Documentation could be more comprehensive'
    ],
    version: '4.1.17',
    website: 'https://silevis.com/reactgrid/'
  }
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