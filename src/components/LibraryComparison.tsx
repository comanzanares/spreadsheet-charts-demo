import React from 'react';
import './LibraryComparison.css';

interface ComparisonFeature {
  feature: string;
  handsontable: string;
  agGrid: string;
  reactTable: string;
  muiDataGrid: string;
}

const LibraryComparison: React.FC = () => {
  const comparisonFeatures: ComparisonFeature[] = [
    {
      feature: 'Editing Experience',
      handsontable: 'Excel-like inline editing with keyboard navigation',
      agGrid: 'Cell editing with focus management and validation',
      reactTable: 'Custom inline editing with full control',
      muiDataGrid: 'Material Design inline editing with validation'
    },
    {
      feature: 'Performance',
      handsontable: 'Good for medium datasets, optimized for editing',
      agGrid: 'Enterprise-grade performance, virtual scrolling for large datasets',
      reactTable: 'Lightweight, optimized for custom implementations',
      muiDataGrid: 'Good performance with Material Design optimizations'
    },
    {
      feature: 'Filtering',
      handsontable: 'Basic column filters',
      agGrid: 'Advanced filtering with multiple filter types and custom filters',
      reactTable: 'Custom filtering implementation required',
      muiDataGrid: 'Built-in filtering with Material Design components'
    },
    {
      feature: 'Sorting',
      handsontable: 'Multi-column sorting with visual indicators',
      agGrid: 'Advanced sorting with custom comparators and multi-sort',
      reactTable: 'Built-in sorting with custom indicators',
      muiDataGrid: 'Built-in sorting with Material Design styling'
    },
    {
      feature: 'Selection',
      handsontable: 'Cell and range selection with Excel-like behavior',
      agGrid: 'Row, cell, and range selection with keyboard navigation',
      reactTable: 'Custom selection implementation required',
      muiDataGrid: 'Built-in row selection with checkboxes'
    },
    {
      feature: 'Column Management',
      handsontable: 'Resize, reorder, hide/show columns',
      agGrid: 'Resize, reorder, hide/show, pin columns with advanced options',
      reactTable: 'Custom column management required',
      muiDataGrid: 'Built-in column resizing and reordering'
    },
    {
      feature: 'Styling',
      handsontable: 'Customizable themes and cell styling',
      agGrid: 'Extensive theming with CSS variables and custom cell renderers',
      reactTable: 'Complete styling control - headless design',
      muiDataGrid: 'Material Design theming with CSS variables'
    },
    {
      feature: 'Bundle Size',
      handsontable: '~500KB (with features)',
      agGrid: '~300KB (core) + additional modules',
      reactTable: '~15KB (core) + your custom code',
      muiDataGrid: '~200KB (includes Material-UI dependencies)'
    },
    {
      feature: 'Learning Curve',
      handsontable: 'Moderate - Excel-like interface',
      agGrid: 'Steeper - More configuration options',
      reactTable: 'Variable - Depends on your implementation',
      muiDataGrid: 'Moderate - Material Design patterns'
    },
    {
      feature: 'Use Case',
      handsontable: 'Spreadsheet applications, data entry',
      agGrid: 'Enterprise applications, data grids, dashboards',
      reactTable: 'Custom applications, maximum flexibility',
      muiDataGrid: 'Material Design applications, consistent UI'
    }
  ];

  return (
    <div className="library-comparison">
      <div className="comparison-header">
        <h2>🔍 Library Comparison</h2>
        <p>See the key differences between all four spreadsheet library implementations</p>
      </div>

      <div className="comparison-table-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-header">Feature</th>
              <th className="handsontable-header">
                <div className="library-header">
                  <span className="library-icon">📊</span>
                  <span className="library-name">Handsontable</span>
                  <span className="library-status implemented">✅ Implemented</span>
                </div>
              </th>
              <th className="ag-grid-header">
                <div className="library-header">
                  <span className="library-icon">🏢</span>
                  <span className="library-name">AG Grid</span>
                  <span className="library-status implemented">✅ Implemented</span>
                </div>
              </th>
              <th className="react-table-header">
                <div className="library-header">
                  <span className="library-icon">⚡</span>
                  <span className="library-name">React Table</span>
                  <span className="library-status implemented">✅ Implemented</span>
                </div>
              </th>
              <th className="mui-datagrid-header">
                <div className="library-header">
                  <span className="library-icon">🎨</span>
                  <span className="library-name">MUI DataGrid</span>
                  <span className="library-status implemented">✅ Implemented</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="feature-name">
                  <strong>{feature.feature}</strong>
                </td>
                <td className="handsontable-value">
                  {feature.handsontable}
                </td>
                <td className="ag-grid-value">
                  {feature.agGrid}
                </td>
                <td className="react-table-value">
                  {feature.reactTable}
                </td>
                <td className="mui-datagrid-value">
                  {feature.muiDataGrid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-summary">
        <div className="summary-section">
          <h3>🎯 When to Use Handsontable</h3>
          <ul>
            <li>Building spreadsheet-like applications</li>
            <li>Users expect Excel-like behavior</li>
            <li>Focus on data entry and editing</li>
            <li>Medium-sized datasets</li>
            <li>Need quick implementation</li>
          </ul>
        </div>

        <div className="summary-section">
          <h3>🎯 When to Use AG Grid</h3>
          <ul>
            <li>Building enterprise data applications</li>
            <li>Large datasets with performance requirements</li>
            <li>Need advanced filtering and sorting</li>
            <li>Complex data visualization requirements</li>
            <li>Custom cell renderers and editors</li>
          </ul>
        </div>

        <div className="summary-section">
          <h3>🎯 When to Use React Table</h3>
          <ul>
            <li>Building custom table implementations</li>
            <li>Need maximum flexibility and control</li>
            <li>Want minimal bundle size</li>
            <li>Have specific design requirements</li>
            <li>Prefer headless architecture</li>
          </ul>
        </div>

        <div className="summary-section">
          <h3>🎯 When to Use MUI DataGrid</h3>
          <ul>
            <li>Building Material Design applications</li>
            <li>Need consistent UI/UX patterns</li>
            <li>Want built-in accessibility features</li>
            <li>Prefer opinionated design system</li>
            <li>Need responsive design out of the box</li>
          </ul>
        </div>
      </div>



      <div className="library-pros-cons">
        <h3>📊 Detailed Pros & Cons</h3>
        
        <div className="pros-cons-grid">
          <div className="library-pros-cons-card">
            <div className="card-header handsontable">
              <span className="library-icon">📊</span>
              <h4>Handsontable</h4>
            </div>
            <div className="card-content">
              <div className="pros-section">
                <h5>✅ Pros</h5>
                <ul>
                  <li>Professional spreadsheet interface with Excel-like features</li>
                  <li>Real-time data editing with instant chart updates</li>
                  <li>Comprehensive API with extensive customization options</li>
                  <li>Built-in data validation and formatting</li>
                  <li>Excellent performance with large datasets</li>
                  <li>Mobile-responsive design</li>
                  <li>Rich set of built-in features (sorting, filtering, etc.)</li>
                </ul>
              </div>
              <div className="cons-section">
                <h5>❌ Cons</h5>
                <ul>
                  <li>Commercial license required for advanced features</li>
                  <li>Larger bundle size (~500KB)</li>
                  <li>Steeper learning curve for complex configurations</li>
                  <li>Limited free features in community version</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="library-pros-cons-card">
            <div className="card-header ag-grid">
              <span className="library-icon">🏢</span>
              <h4>AG Grid</h4>
            </div>
            <div className="card-content">
              <div className="pros-section">
                <h5>✅ Pros</h5>
                <ul>
                  <li>Enterprise-level performance and features</li>
                  <li>Advanced filtering and grouping capabilities</li>
                  <li>Excellent TypeScript support</li>
                  <li>Rich ecosystem of plugins and extensions</li>
                  <li>Built-in chart integration</li>
                  <li>Virtual scrolling for large datasets</li>
                  <li>Comprehensive documentation</li>
                </ul>
              </div>
              <div className="cons-section">
                <h5>❌ Cons</h5>
                <ul>
                  <li>Commercial license for advanced features</li>
                  <li>Complex setup and configuration</li>
                  <li>Large bundle size</li>
                  <li>Overkill for simple use cases</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="library-pros-cons-card">
            <div className="card-header react-table">
              <span className="library-icon">⚡</span>
              <h4>React Table</h4>
            </div>
            <div className="card-content">
              <div className="pros-section">
                <h5>✅ Pros</h5>
                <ul>
                  <li>Lightweight and flexible</li>
                  <li>Headless design for maximum customization</li>
                  <li>Excellent TypeScript support</li>
                  <li>No external dependencies</li>
                  <li>Easy to integrate with any UI library</li>
                  <li>Great for custom implementations</li>
                  <li>Minimal bundle size (~15KB)</li>
                </ul>
              </div>
              <div className="cons-section">
                <h5>❌ Cons</h5>
                <ul>
                  <li>Requires more manual setup</li>
                  <li>No built-in editing features</li>
                  <li>Limited built-in functionality</li>
                  <li>More code required for advanced features</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="library-pros-cons-card">
            <div className="card-header mui-datagrid">
              <span className="library-icon">🎨</span>
              <h4>MUI DataGrid</h4>
            </div>
            <div className="card-content">
              <div className="pros-section">
                <h5>✅ Pros</h5>
                <ul>
                  <li>Beautiful Material Design interface</li>
                  <li>Built-in editing and filtering</li>
                  <li>Excellent accessibility</li>
                  <li>Consistent with Material Design system</li>
                  <li>Good TypeScript support</li>
                  <li>Responsive design out of the box</li>
                  <li>Built-in validation and error handling</li>
                </ul>
              </div>
              <div className="cons-section">
                <h5>❌ Cons</h5>
                <ul>
                  <li>Tied to Material-UI ecosystem</li>
                  <li>Limited customization compared to headless solutions</li>
                  <li>Bundle size includes Material-UI dependencies</li>
                  <li>May not fit all design systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="comparison-note">
        <h4>💡 Pro Tip</h4>
        <p>
          All four libraries integrate seamlessly with Chart.js for data visualization. 
          Try switching between them using the tabs above to see the differences in 
          user experience and functionality!
        </p>
      </div>
    </div>
  );
};

export default LibraryComparison; 