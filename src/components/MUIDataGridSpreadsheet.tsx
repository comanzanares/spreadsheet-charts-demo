import React, { useMemo, useCallback, useState } from 'react';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Button, Box, Typography, Chip, Paper } from '@mui/material';
import { Add as AddIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
import { SpreadsheetData } from '../types';
import './MUIDataGridSpreadsheet.css';

interface MUIDataGridSpreadsheetProps {
  data: SpreadsheetData[];
  onDataChange: (data: SpreadsheetData[]) => void;
}

const MUIDataGridSpreadsheet: React.FC<MUIDataGridSpreadsheetProps> = ({ 
  data, 
  onDataChange 
}) => {
  const [rows, setRows] = useState<GridRowModel[]>([]);

  // Convert data to MUI DataGrid format with unique IDs
  const gridData = useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty grid with minimum rows and columns
      const minRows = 5;
      const minCols = 5;
      const emptyData = [];
      
      for (let i = 0; i < minRows; i++) {
        const row: SpreadsheetData = {};
        for (let j = 0; j < minCols; j++) {
          row[j.toString()] = '';
        }
        emptyData.push({ id: i, ...row });
      }
      
      return emptyData;
    }
    return data.map((row, index) => ({ id: index, ...row }));
  }, [data]);

  // Generate column definitions dynamically
  const columns = useMemo<GridColDef[]>(() => {
    if (!gridData || gridData.length === 0) return [];
    
    const allKeys = new Set<string>();
    gridData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== 'id') {
          allKeys.add(key);
        }
      });
    });
    
    return Array.from(allKeys)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(key => ({
        field: key,
        headerName: `Column ${key}`,
        width: 150,
        editable: true,
        sortable: true,
        filterable: true,
        resizable: true,
        flex: 1,
        minWidth: 120
      }));
  }, [gridData]);

  // Handle row updates
  const handleRowUpdate = useCallback((newRow: GridRowModel) => {
    const updatedData = gridData.map(row => 
      row.id === newRow.id ? newRow : row
    );
    
    // Convert back to our format
    const convertedData = updatedData.map(({ id, ...row }) => row);
    onDataChange(convertedData);
    
    return newRow;
  }, [gridData, onDataChange]);

  // Add new row functionality
  const addNewRow = useCallback(() => {
    const newId = Math.max(...gridData.map(row => row.id as number), -1) + 1;
    const newRow: SpreadsheetData = {};
    
    // Add empty cells for each column
    columns.forEach(column => {
      if (column.field) {
        newRow[column.field] = '';
      }
    });
    
    const newGridRow = { id: newId, ...newRow };
    const updatedGridData = [...gridData, newGridRow];
    
    // Convert back to our format
    const convertedData = updatedGridData.map(({ id, ...row }) => row);
    onDataChange(convertedData);
  }, [gridData, columns, onDataChange]);

  // Add new column functionality
  const addNewColumn = useCallback(() => {
    const newColumnId = Math.max(...data.flatMap(row => 
      Object.keys(row).map(key => parseInt(key))
    ), -1) + 1;
    
    const newData = data.map(row => ({
      ...row,
      [newColumnId]: ''
    }));
    onDataChange(newData);
  }, [data, onDataChange]);

  // --- PASTE FUNCTIONALITY ---
  // Parse clipboard data
  const parseClipboardData = (clipboardText: string): string[][] => {
    return clipboardText
      .trim()
      .split('\n')
      .map(row => row.split('\t'));
  };

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const parsedData = parseClipboardData(clipboardText);
      if (parsedData.length === 0) return;

      // Determinar punto de inicio (no hay selección de celda, así que siempre desde la primera)
      let startRow = 0;
      let startColField = columns[0]?.field || '0';
      // Si quieres detectar la celda seleccionada, aquí deberías obtenerla del estado de selección
      const colFields = columns.map(col => col.field);
      const startColIndex = colFields.indexOf(startColField);
      const safeStartColIndex = startColIndex >= 0 ? startColIndex : 0;

      // Copiar datos
      const newData = [...data];
      parsedData.forEach((row, rowIndex) => {
        if (startRow + rowIndex >= newData.length) {
          // Agregar nueva fila si es necesario
          const newRow: SpreadsheetData = {};
          colFields.forEach(field => { newRow[field] = ''; });
          newData.push(newRow);
        }
        row.forEach((cell, colIndex) => {
          const colField = colFields[safeStartColIndex + colIndex];
          if (colField && newData[startRow + rowIndex]) {
            newData[startRow + rowIndex][colField] = cell;
          }
        });
      });
      onDataChange(newData);
    } catch (error) {
      console.error('Error al pegar datos:', error);
    }
  }, [columns, data, onDataChange]);

  // Event listener para Ctrl+V
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        handlePaste();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePaste]);
  // --- END PASTE FUNCTIONALITY ---

  return (
    <div className="mui-datagrid-spreadsheet-container">
      <Paper elevation={3} className="mui-datagrid-paper">
        <Box className="mui-datagrid-header">
          <Typography variant="h5" component="h3" className="mui-datagrid-title">
            📊 MUI DataGrid Spreadsheet
          </Typography>
          <Box className="mui-datagrid-features">
            <Chip 
              label="🔄 Real-time Editing" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label="🔍 Advanced Filtering" 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              label="📈 Material Design" 
              size="small" 
              color="success" 
              variant="outlined"
            />
            <Chip 
              label="🎨 Beautiful UI" 
              size="small" 
              color="info" 
              variant="outlined"
            />
          </Box>
        </Box>

        <Box className="mui-datagrid-controls">
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={addNewRow}
            className="control-button"
          >
            Add Row
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<AddBoxIcon />}
            onClick={addNewColumn}
            className="control-button"
          >
            Add Column
          </Button>
        </Box>
        
        <Box className="mui-datagrid-wrapper">
          <DataGrid
            rows={gridData}
            columns={columns}
            processRowUpdate={handleRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Row update error:', error);
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            density="comfortable"
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell:focus-within': {
                outline: '2px solid #1976d2',
                outlineOffset: '-2px',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        </Box>
        
        <Box className="mui-datagrid-info">
          <Typography variant="h6" component="h4" className="info-title">
            🎯 MUI DataGrid Features
          </Typography>
          <Box component="ul" className="info-list">
            <Typography component="li">
              <strong>Material Design:</strong> Beautiful, consistent interface following Material Design principles
            </Typography>
            <Typography component="li">
              <strong>Built-in Editing:</strong> Inline cell editing with validation and error handling
            </Typography>
            <Typography component="li">
              <strong>Advanced Filtering:</strong> Multiple filter types with custom filter components
            </Typography>
            <Typography component="li">
              <strong>Accessibility:</strong> Full keyboard navigation and screen reader support
            </Typography>
            <Typography component="li">
              <strong>Responsive:</strong> Adapts perfectly to different screen sizes
            </Typography>
          </Box>
        </Box>
        
        {/* Debug info */}
        <Box className="debug-info">
          <Typography variant="body2" component="p">
            <strong>Debug Info:</strong>
          </Typography>
          <Typography variant="body2" component="p">
            Row Count: {gridData.length}
          </Typography>
          <Typography variant="body2" component="p">
            Column Count: {columns.length}
          </Typography>
          <Typography variant="body2" component="p">
            Data Format: MUI DataGrid Compatible
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default MUIDataGridSpreadsheet; 