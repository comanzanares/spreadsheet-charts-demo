export interface SpreadsheetData {
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'scatter';

export interface SpreadsheetState {
  data: SpreadsheetData[];
  headers: string[];
}

export interface ColorScheme {
  backgroundColor: string;
  borderColor: string;
}

export interface ChartColors {
  [columnKey: string]: ColorScheme;
} 