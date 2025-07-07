import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders spreadsheet and charts demo', () => {
  render(<App />);
  const titleElement = screen.getByText(/Spreadsheet and Charts Demo/i);
  expect(titleElement).toBeInTheDocument();
});
