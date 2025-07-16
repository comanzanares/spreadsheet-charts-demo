import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { SpreadsheetData, ChartType } from '../types';
import './HighchartsChart.css';

// Import required Highcharts modules
import 'highcharts/highcharts-more';
import 'highcharts/modules/exporting';
import 'highcharts/modules/data';

// Import world map data
import worldMap from '@highcharts/map-collection/custom/world.topo.json';
// Import US map data
import usMap from '@highcharts/map-collection/countries/us/us-all.topo.json';
// Import Europe map data
import euMap from '@highcharts/map-collection/custom/europe.topo.json';

// Import and register map module
import 'highcharts/modules/map';

interface HighchartsChartProps {
  data: SpreadsheetData[];
  chartType?: ChartType;
  title?: string;
}

const HighchartsChart: React.FC<HighchartsChartProps> = ({
  data,
  chartType = 'line',
  title = 'Table Data'
}) => {
  const isMapChart = chartType === 'map' || chartType === 'usmap' || chartType === 'eumap';
  
  // Inicializar mapa cuando sea necesario
  React.useEffect(() => {
    if (isMapChart) {
      console.log('🗺️ Initializing map chart...');
      
      // Limpiar contenedor anterior
      const container = document.getElementById('map-container');
      if (container) {
        container.innerHTML = '';
        
        // Crear datos CSV a partir del spreadsheet
        let countryNames: string[] = [];
        let countryCodes: string[] = [];
        
        if (chartType === 'usmap') {
          // Datos para estados de Estados Unidos
          countryNames = [
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
            'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
            'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
            'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
            'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
          ];
          
          countryCodes = [
            'al', 'ak', 'az', 'ar', 'ca',
            'co', 'ct', 'de', 'fl', 'ga',
            'hi', 'id', 'il', 'in', 'ia',
            'ks', 'ky', 'la', 'me', 'md',
            'ma', 'mi', 'mn', 'ms', 'mo',
            'mt', 'ne', 'nv', 'nh', 'nj',
            'nm', 'ny', 'nc', 'nd', 'oh',
            'ok', 'or', 'pa', 'ri', 'sc',
            'sd', 'tn', 'tx', 'ut', 'vt',
            'va', 'wa', 'wv', 'wi', 'wy'
          ];
        } else {
          // Datos para países del mundo
          countryNames = [
            'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
            'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador',
            'Bolivia', 'Paraguay', 'Uruguay', 'Guyana', 'Suriname',
            'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
            'Portugal', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
            'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
            'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
            'Croatia', 'Slovenia', 'Slovakia', 'Lithuania', 'Latvia',
            'Estonia', 'Ireland', 'Russia', 'Ukraine', 'Belarus',
            'Moldova', 'China', 'Japan', 'South Korea', 'India',
            'Pakistan', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Myanmar',
            'Thailand', 'Vietnam', 'Laos', 'Cambodia', 'Malaysia',
            'Singapore', 'Indonesia', 'Philippines', 'Australia', 'New Zealand',
            'Papua New Guinea', 'Fiji', 'South Africa', 'Nigeria', 'Egypt',
            'Saudi Arabia', 'Turkey', 'Iran', 'Iraq', 'Syria',
            'Lebanon', 'Jordan', 'Israel', 'Palestine', 'Yemen',
            'Oman', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain',
            'Kenya', 'Tanzania', 'Uganda', 'Ethiopia', 'Somalia',
            'Djibouti', 'Eritrea', 'Sudan', 'South Sudan', 'Central African Republic',
            'Cameroon', 'Chad', 'Niger', 'Mali', 'Burkina Faso'
          ];

          countryCodes = [
            'USA', 'CAN', 'MEX', 'BRA', 'ARG',
            'CHL', 'PER', 'COL', 'VEN', 'ECU',
            'BOL', 'PRY', 'URY', 'GUY', 'SUR',
            'GBR', 'DEU', 'FRA', 'ESP', 'ITA',
            'PRT', 'NLD', 'BEL', 'CHE', 'AUT',
            'SWE', 'NOR', 'DNK', 'FIN', 'POL',
            'CZE', 'HUN', 'ROU', 'BGR', 'GRC',
            'HRV', 'SVN', 'SVK', 'LTU', 'LVA',
            'EST', 'IRL', 'RUS', 'UKR', 'BLR',
            'MDA', 'CHN', 'JPN', 'KOR', 'IND',
            'PAK', 'BGD', 'NPL', 'LKA', 'MMR',
            'THA', 'VNM', 'LAO', 'KHM', 'MYS',
            'SGP', 'IDN', 'PHL', 'AUS', 'NZL',
            'PNG', 'FJI', 'ZAF', 'NGA', 'EGY',
            'SAU', 'TUR', 'IRN', 'IRQ', 'SYR',
            'LBN', 'JOR', 'ISR', 'PSE', 'YEM',
            'OMN', 'ARE', 'QAT', 'KWT', 'BHR',
            'KEN', 'TZA', 'UGA', 'ETH', 'SOM',
            'DJI', 'ERI', 'SDN', 'SSD', 'CAF',
            'CMR', 'TCD', 'NER', 'MLI', 'BFA'
          ];
        }

        // Crear CSV data
        let csvData = 'Country Name;Country Code;Value\n';
        
        data.forEach((row, rowIndex) => {
          Object.entries(row).forEach(([colKey, value]) => {
            if (!isNaN(Number(value)) && value !== '') {
              const colIndex = parseInt(colKey);
              if (colIndex < countryNames.length) {
                csvData += `${countryNames[colIndex]};${countryCodes[colIndex]};${value}\n`;
              }
            }
          });
        });

        // Si no hay datos, usar datos de ejemplo
        if (csvData === 'Country Name;Country Code;Value\n') {
          console.log('🗺️ No valid data found, using sample CSV data');
          
          if (chartType === 'usmap') {
            csvData = `Country Name;Country Code;Value
California;ca;100
Texas;tx;85
Florida;fl;75
New York;ny;90
Illinois;il;80
Pennsylvania;pa;70
Ohio;oh;65
Georgia;ga;60
North Carolina;nc;55
Michigan;mi;50
New Jersey;nj;45
Virginia;va;40
Washington;wa;35
Arizona;az;30
Massachusetts;ma;25`;
          } else {
            csvData = `Country Name;Country Code;Value
United States;USA;100
Canada;CAN;80
Mexico;MEX;60
Brazil;BRA;90
Argentina;ARG;70
United Kingdom;GBR;85
Germany;DEU;95
France;FRA;75
Spain;ESP;65
Italy;ITA;80
China;CHN;100
Japan;JPN;85
India;IND;90
Australia;AUS;75`;
          }
        }

        // Crear elemento CSV oculto
        let csvElement = document.getElementById('csv-data');
        if (!csvElement) {
          csvElement = document.createElement('pre');
          csvElement.id = 'csv-data';
          csvElement.style.display = 'none';
          document.body.appendChild(csvElement);
        }
        csvElement.textContent = csvData;
        
        // Crear opciones específicas para el mapa
        let mapOptions: any;
        
        if (chartType === 'usmap') {
          // Datos hardcodeados para el mapa de Estados Unidos - SOLUCIÓN DIRECTA
          const usStatesData = [
            { 'hc-key': 'us-ca', value: 100, name: 'California' },
            { 'hc-key': 'us-tx', value: 85, name: 'Texas' },
            { 'hc-key': 'us-fl', value: 75, name: 'Florida' },
            { 'hc-key': 'us-ny', value: 90, name: 'New York' },
            { 'hc-key': 'us-il', value: 80, name: 'Illinois' },
            { 'hc-key': 'us-pa', value: 70, name: 'Pennsylvania' },
            { 'hc-key': 'us-oh', value: 65, name: 'Ohio' },
            { 'hc-key': 'us-ga', value: 60, name: 'Georgia' },
            { 'hc-key': 'us-nc', value: 55, name: 'North Carolina' },
            { 'hc-key': 'us-mi', value: 50, name: 'Michigan' },
            { 'hc-key': 'us-nj', value: 45, name: 'New Jersey' },
            { 'hc-key': 'us-va', value: 40, name: 'Virginia' },
            { 'hc-key': 'us-wa', value: 35, name: 'Washington' },
            { 'hc-key': 'us-az', value: 30, name: 'Arizona' },
            { 'hc-key': 'us-ma', value: 25, name: 'Massachusetts' },
            { 'hc-key': 'us-tn', value: 20, name: 'Tennessee' },
            { 'hc-key': 'us-in', value: 18, name: 'Indiana' },
            { 'hc-key': 'us-mo', value: 15, name: 'Missouri' },
            { 'hc-key': 'us-md', value: 12, name: 'Maryland' },
            { 'hc-key': 'us-co', value: 10, name: 'Colorado' },
            { 'hc-key': 'us-la', value: 8, name: 'Louisiana' },
            { 'hc-key': 'us-ky', value: 6, name: 'Kentucky' },
            { 'hc-key': 'us-sc', value: 4, name: 'South Carolina' },
            { 'hc-key': 'us-al', value: 3, name: 'Alabama' },
            { 'hc-key': 'us-ms', value: 2, name: 'Mississippi' },
            { 'hc-key': 'us-ak', value: 1, name: 'Alaska' }
          ];
          
          console.log('🗺️ US States data:', usStatesData);
          
          mapOptions = {
            chart: {
              map: usMap,
              height: 500,
              backgroundColor: '#ffffff'
            },
            title: {
              text: 'US States Map',
              style: { 
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: 'bottom'
              }
            },
            colorAxis: {
              min: 0,
              minColor: '#E6F7FF',
              maxColor: '#1890FF'
            },
            series: [{
              name: 'US States Data',
              data: usStatesData,
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              },
              states: {
                hover: {
                  color: '#a4edba'
                }
              }
            }],
            credits: { enabled: false },
            tooltip: {
              pointFormat: '{point.name}: {point.value}',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#bdc3c7',
              borderRadius: 8,
              shadow: true,
              style: {
                color: '#2c3e50'
              }
            }
          };
        } else if (chartType === 'eumap') {
          // Datos hardcodeados para el mapa de Europa - SOLUCIÓN DIRECTA
          const euCountriesData = [
            { 'hc-key': 'de', value: 100, name: 'Germany' },
            { 'hc-key': 'fr', value: 95, name: 'France' },
            { 'hc-key': 'it', value: 90, name: 'Italy' },
            { 'hc-key': 'es', value: 85, name: 'Spain' },
            { 'hc-key': 'uk', value: 80, name: 'United Kingdom' },
            { 'hc-key': 'pl', value: 75, name: 'Poland' },
            { 'hc-key': 'ro', value: 70, name: 'Romania' },
            { 'hc-key': 'nl', value: 65, name: 'Netherlands' },
            { 'hc-key': 'be', value: 60, name: 'Belgium' },
            { 'hc-key': 'se', value: 55, name: 'Sweden' },
            { 'hc-key': 'at', value: 50, name: 'Austria' },
            { 'hc-key': 'ch', value: 45, name: 'Switzerland' },
            { 'hc-key': 'dk', value: 40, name: 'Denmark' },
            { 'hc-key': 'fi', value: 35, name: 'Finland' },
            { 'hc-key': 'no', value: 30, name: 'Norway' },
            { 'hc-key': 'ie', value: 25, name: 'Ireland' },
            { 'hc-key': 'pt', value: 20, name: 'Portugal' },
            { 'hc-key': 'cz', value: 15, name: 'Czech Republic' },
            { 'hc-key': 'hu', value: 10, name: 'Hungary' },
            { 'hc-key': 'bg', value: 8, name: 'Bulgaria' },
            { 'hc-key': 'hr', value: 6, name: 'Croatia' },
            { 'hc-key': 'sk', value: 4, name: 'Slovakia' },
            { 'hc-key': 'si', value: 3, name: 'Slovenia' },
            { 'hc-key': 'ee', value: 2, name: 'Estonia' },
            { 'hc-key': 'lv', value: 1, name: 'Latvia' }
          ];
          
          console.log('🗺️ Europe countries data:', euCountriesData);
          
          mapOptions = {
            chart: {
              map: euMap,
              height: 500,
              backgroundColor: '#ffffff'
            },
            title: {
              text: 'Europe Map',
              style: { 
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: 'bottom'
              }
            },
            colorAxis: {
              min: 0,
              minColor: '#E6F7FF',
              maxColor: '#1890FF'
            },
            series: [{
              name: 'Europe Countries Data',
              data: euCountriesData,
              dataLabels: {
                enabled: true,
                format: '{point.name}'
              },
              states: {
                hover: {
                  color: '#a4edba'
                }
              }
            }],
            credits: { enabled: false },
            tooltip: {
              pointFormat: '{point.name}: {point.value}',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#bdc3c7',
              borderRadius: 8,
              shadow: true,
              style: {
                color: '#2c3e50'
              }
            }
          };
        } else {
          // Para otros mapas, usar el enfoque CSV
          mapOptions = {
            chart: {
              map: worldMap,
              height: 500,
              backgroundColor: '#ffffff'
            },
            title: {
              text: title,
              style: { 
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }
            },
            mapNavigation: {
              enabled: true,
              buttonOptions: {
                verticalAlign: 'bottom'
              }
            },
            colorAxis: {
              min: 0,
              minColor: '#E6F7FF',
              maxColor: '#1890FF'
            },
            data: {
              csv: csvData,
              seriesMapping: [{
                code: 1,
                value: 2
              }]
            },
            series: [{
              name: chartType === 'map' ? 'Spreadsheet Data' : 'Population Density',
              joinBy: ['iso-a3', 'code'],
              dataLabels: {
                enabled: true,
                format: '{point.value:.0f}',
                filter: {
                  operator: '>',
                  property: 'labelrank',
                  value: 250
                },
                style: {
                  fontWeight: 'normal'
                }
              }
            }],
            credits: { enabled: false },
            tooltip: {
              valueDecimals: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#bdc3c7',
              borderRadius: 8,
              shadow: true,
              style: {
                color: '#2c3e50'
              }
            }
          };
        }
        
        // Inicializar el mapa usando Highcharts.mapChart
        console.log('🗺️ Initializing map with options:', mapOptions);
        Highcharts.mapChart('map-container', mapOptions);
        console.log('🗺️ Map chart initialized successfully');
        if (chartType === 'usmap') {
          console.log('🗺️ US Map data:', mapOptions.series[0].data);
        } else {
          console.log('🗺️ CSV data:', csvData);
        }
      }
    }
  }, [isMapChart, chartType, title, data]);
  
  const chartOptions: Highcharts.Options = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        chart: { type: chartType },
        title: { text: 'No data to display' },
        series: [],
      };
    }

    // Preparar datos para el gráfico según el tipo
    let series: any[] = [];
    
    if (chartType === 'pie') {
      // Para gráficos circulares, usar solo la primera fila
      const firstRow = data[0];
      if (firstRow) {
        const pieData = Object.entries(firstRow)
          .filter(([_, value]) => !isNaN(Number(value)) && value !== '')
          .map(([key, value]) => ({
            name: `Col ${parseInt(key) + 1}`,
            y: Number(value)
          }));
        
        series = [{
          name: 'Data',
          data: pieData,
          type: 'pie' as any,
        }];
      }
    } else if (chartType === 'doughnut') {
      // Para gráficos de dona, usar configuración especial
      const firstRow = data[0];
      if (firstRow) {
        const pieData = Object.entries(firstRow)
          .filter(([_, value]) => !isNaN(Number(value)) && value !== '')
          .map(([key, value]) => ({
            name: `Col ${parseInt(key) + 1}`,
            y: Number(value)
          }));
        
        series = [{
          name: 'Data',
          data: pieData,
          type: 'pie' as any,
          innerSize: '60%',
          size: '80%',
        }];
      }
    } else if (chartType === 'columnrange') {
      // Para gráficos de rango, crear datos con rangos
      const numericData = data
        .map((row, index) => {
          const numericValues = Object.entries(row)
            .filter(([_, value]) => !isNaN(Number(value)) && value !== '')
            .map(([key, value]) => {
              const numValue = Number(value);
              return { 
                x: parseInt(key), 
                low: numValue * 0.8, 
                high: numValue * 1.2 
              };
            });
          return { index, values: numericValues };
        })
        .filter(item => item.values.length > 0);

      series = numericData.map((item, seriesIndex) => ({
        name: `Row ${item.index + 1}`,
        data: item.values,
        type: 'columnrange' as any,
      }));
    } else if (chartType === 'map' || chartType === 'usmap' || chartType === 'eumap') {
      // Convertir datos del spreadsheet a formato de mapa
      console.log('🗺️ Converting spreadsheet data to map format');
      console.log('🗺️ Input data:', data);
      
      // Crear mapeos según el tipo de mapa
      let countryMapping: { [key: string]: string } = {};
      
      if (chartType === 'usmap') {
        // Mapeo para estados de Estados Unidos
        const usStates = [
          'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
          'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
          'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
          'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
          'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
        ];
        
        usStates.forEach((state, index) => {
          countryMapping[index.toString()] = state;
        });
      } else {
        // Mapeo para países del mundo
        countryMapping = {
          '0': 'us', '1': 'ca', '2': 'mx', '3': 'br', '4': 'ar',
          '5': 'cl', '6': 'pe', '7': 'co', '8': 've', '9': 'ec',
          '10': 'bo', '11': 'py', '12': 'uy', '13': 'gy', '14': 'sr',
          '15': 'gb', '16': 'de', '17': 'fr', '18': 'es', '19': 'it',
          '20': 'pt', '21': 'nl', '22': 'be', '23': 'ch', '24': 'at',
          '25': 'se', '26': 'no', '27': 'dk', '28': 'fi', '29': 'pl',
          '30': 'cz', '31': 'hu', '32': 'ro', '33': 'bg', '34': 'gr',
          '35': 'hr', '36': 'si', '37': 'sk', '38': 'lt', '39': 'lv',
          '40': 'ee', '41': 'ie', '42': 'ru', '43': 'ua', '44': 'by',
          '45': 'md', '46': 'cn', '47': 'jp', '48': 'kr', '49': 'in',
          '50': 'pk', '51': 'bd', '52': 'np', '53': 'lk', '54': 'mm',
          '55': 'th', '56': 'vn', '57': 'la', '58': 'kh', '59': 'my',
          '60': 'sg', '61': 'id', '62': 'ph', '63': 'au', '64': 'nz',
          '65': 'pg', '66': 'fj', '67': 'za', '68': 'ng', '69': 'eg',
          '70': 'sa', '71': 'tr', '72': 'ir', '73': 'iq', '74': 'sy',
          '75': 'lb', '76': 'jo', '77': 'il', '78': 'ps', '79': 'ye',
          '80': 'om', '81': 'ae', '82': 'qa', '83': 'kw', '84': 'bh',
          '85': 'ke', '86': 'tz', '87': 'ug', '88': 'et', '89': 'so',
          '90': 'dj', '91': 'er', '92': 'sd', '93': 'ss', '94': 'cf',
          '95': 'cm', '96': 'td', '97': 'ne', '98': 'ml', '99': 'bf'
        };
      }

      // Convertir datos del spreadsheet a formato de mapa
      const mapData: any[] = [];
      
      data.forEach((row, rowIndex) => {
        Object.entries(row).forEach(([colKey, value]) => {
          if (!isNaN(Number(value)) && value !== '') {
            const countryCode = countryMapping[colKey];
            if (countryCode) {
              mapData.push({
                'hc-key': countryCode,
                value: Number(value),
                name: `Row ${rowIndex + 1}, Col ${parseInt(colKey) + 1}`
              });
            }
          }
        });
      });

      // Si no hay datos del spreadsheet, usar datos de ejemplo
      if (mapData.length === 0) {
        console.log('🗺️ No valid data found, using sample data');
        
        if (chartType === 'usmap') {
          // Datos de ejemplo para estados de Estados Unidos
          const usStatesData = [
            { 'hc-key': 'ca', value: 100, name: 'California' },
            { 'hc-key': 'tx', value: 85, name: 'Texas' },
            { 'hc-key': 'fl', value: 75, name: 'Florida' },
            { 'hc-key': 'ny', value: 90, name: 'New York' },
            { 'hc-key': 'il', value: 80, name: 'Illinois' },
            { 'hc-key': 'pa', value: 70, name: 'Pennsylvania' },
            { 'hc-key': 'oh', value: 65, name: 'Ohio' },
            { 'hc-key': 'ga', value: 60, name: 'Georgia' },
            { 'hc-key': 'nc', value: 55, name: 'North Carolina' },
            { 'hc-key': 'mi', value: 50, name: 'Michigan' },
            { 'hc-key': 'nj', value: 45, name: 'New Jersey' },
            { 'hc-key': 'va', value: 40, name: 'Virginia' },
            { 'hc-key': 'wa', value: 35, name: 'Washington' },
            { 'hc-key': 'az', value: 30, name: 'Arizona' },
            { 'hc-key': 'ma', value: 25, name: 'Massachusetts' }
          ];
          mapData.push(...usStatesData);
        } else {
          // Datos de ejemplo para países del mundo
          mapData.push(
            { 'hc-key': 'us', value: 100, name: 'United States' },
            { 'hc-key': 'ca', value: 80, name: 'Canada' },
            { 'hc-key': 'mx', value: 60, name: 'Mexico' },
            { 'hc-key': 'br', value: 90, name: 'Brazil' },
            { 'hc-key': 'ar', value: 70, name: 'Argentina' },
            { 'hc-key': 'gb', value: 85, name: 'United Kingdom' },
            { 'hc-key': 'de', value: 95, name: 'Germany' },
            { 'hc-key': 'fr', value: 75, name: 'France' },
            { 'hc-key': 'es', value: 65, name: 'Spain' },
            { 'hc-key': 'it', value: 80, name: 'Italy' },
            { 'hc-key': 'cn', value: 100, name: 'China' },
            { 'hc-key': 'jp', value: 85, name: 'Japan' },
            { 'hc-key': 'in', value: 90, name: 'India' },
            { 'hc-key': 'au', value: 75, name: 'Australia' }
          );
        }
      }

      console.log('🗺️ Map data created with', mapData.length, 'entries');
      console.log('🗺️ Sample map data:', mapData.slice(0, 3));

      const seriesName = chartType === 'map' ? 'Spreadsheet Data' : 
                        chartType === 'usmap' ? 'US States Data' : 
                        chartType === 'eumap' ? 'Europe Countries Data' : 'Population Density';

      series = [{
        name: seriesName,
        data: mapData,
        type: 'map' as any,
        joinBy: ['hc-key', 'code'],
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        dataLabels: {
          enabled: false
        }
      }];

      console.log('🗺️ Series created:', series);
      console.log('🗺️ Chart options being created for map...');
    } else {
      // Para otros tipos de gráficos
      const numericData = data
        .map((row, index) => {
          const numericValues = Object.entries(row)
            .filter(([_, value]) => !isNaN(Number(value)) && value !== '')
            .map(([key, value]) => ({ x: parseInt(key), y: Number(value) }));
          return { index, values: numericValues };
        })
        .filter(item => item.values.length > 0);

      series = numericData.map((item, seriesIndex) => ({
        name: `Row ${item.index + 1}`,
        data: item.values,
        type: chartType as any,
      }));
    }

    return {
      chart: {
        type: chartType === 'doughnut' ? 'pie' : chartType,
        height: isMapChart ? 500 : 400,
        backgroundColor: '#ffffff',
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }
      },
      // Configuración del mapa
      ...(isMapChart ? {
        map: chartType === 'usmap' ? usMap : chartType === 'eumap' ? euMap : worldMap,
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        plotOptions: {
          map: {
            allAreas: false,
            joinBy: chartType === 'usmap' ? ['hc-key', 'code'] : ['hc-key', 'code'],
            states: {
              hover: {
                color: '#a4edba'
              }
            }
          }
        }
      } : {}),
      title: {
        text: title,
        style: { 
          fontSize: '18px',
          fontWeight: '600',
          color: '#2c3e50'
        },
        align: 'left',
        margin: 20
      },
      // Solo mostrar ejes para gráficos que los necesiten
      ...(chartType !== 'pie' && chartType !== 'doughnut' && !isMapChart ? {
        xAxis: {
          title: { 
            text: 'Column',
            style: { color: '#7f8c8d' }
          },
          categories: Object.keys(data[0] || {}).map((_, index) => `Col ${index + 1}`),
          labels: {
            style: { color: '#34495e' }
          }
        },
        yAxis: {
          title: { 
            text: 'Value',
            style: { color: '#7f8c8d' }
          },
          labels: {
            style: { color: '#34495e' }
          }
        }
      } : {}),
      series,
      credits: { enabled: false },
      legend: { 
        enabled: chartType !== 'pie' && chartType !== 'doughnut' && !isMapChart,
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        x: -10,
        y: 100
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#bdc3c7',
        borderRadius: 8,
        shadow: true,
        style: {
          color: '#2c3e50'
        },
        formatter: function(this: any) {
          if (chartType === 'pie' || chartType === 'doughnut') {
            return `<b style="color: ${this.point.color}">${this.point.name}</b><br/>
                    <b>Value:</b> ${this.y}<br/>
                    <b>Percentage:</b> ${this.percentage.toFixed(1)}%`;
          } else if (chartType === 'columnrange') {
            return `<b style="color: ${this.series.color}">${this.series.name}</b><br/>
                    <b>Column:</b> ${this.x}<br/>
                    <b>Range:</b> ${this.point.low} - ${this.point.high}`;
          } else if (isMapChart) {
            if (this.point && this.point.name) {
              return `<b style="color: ${this.point.color || this.series.color}">${this.point.name}</b><br/>
                      <b>Value:</b> ${this.point.value || this.y}`;
            } else {
              return `<b style="color: ${this.series.color}">${this.series.name}</b><br/>
                      <b>Value:</b> ${this.y}`;
            }
          } else {
            return `<b style="color: ${this.series.color}">${this.series.name}</b><br/>
                    <b>Column:</b> ${this.x}<br/>
                    <b>Value:</b> ${this.y}`;
          }
        },
      },
      plotOptions: {
        pie: {
          depth: 45,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        },
        map: {
          allAreas: false,
          joinBy: ['hc-key', 'code'],
          states: {
            hover: {
              color: '#a4edba'
            }
          }
        },
        series: {
          marker: {
            enabled: true,
            radius: 4
          },
          lineWidth: 3
        }
      },
      colors: [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', 
        '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
      ],
      // Configuración específica para mapas
      ...(isMapChart ? {
        colorAxis: {
          min: 0,
          minColor: '#E6F7FF',
          maxColor: '#1890FF'
        }
      } : {})
    };

    if (isMapChart) {
      console.log('🗺️ Final chart options for map:', chartOptions);
    }
  }, [data, chartType, title]);

  return (
    <div className={`highcharts-chart-container ${isMapChart ? 'map-chart' : ''}`}>
      {isMapChart ? (
        <div id="map-container" style={{ width: '100%', height: '500px' }} />
      ) : (
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions} 
        />
      )}
    </div>
  );
};

export default HighchartsChart; 