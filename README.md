# 📊 Demo de Spreadsheet y Gráficos

Una aplicación React moderna que combina funcionalidad de spreadsheet con visualización de datos en tiempo real usando gráficos interactivos.

## ✨ Características

- **Spreadsheet Interactivo**: Edita datos directamente en una interfaz similar a Excel
- **Gráficos en Tiempo Real**: Visualiza los cambios inmediatamente en múltiples tipos de gráficos
- **Importar/Exportar Excel**: Carga y guarda archivos .xlsx
- **Múltiples Tipos de Gráficos**: Línea, barras, circular, dona y dispersión
- **Interfaz Moderna**: Diseño responsive y intuitivo
- **Datos de Ejemplo**: Carga datos de muestra para probar la funcionalidad

## 🚀 Tecnologías Utilizadas

- **React 19** con TypeScript
- **Handsontable** - Spreadsheet interactivo
- **Chart.js** con react-chartjs-2 - Gráficos
- **XLSX** - Manejo de archivos Excel
- **CSS Grid** - Layout responsive

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd spreadsheet-charts-demo
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia la aplicación:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## 🎯 Cómo Usar

### 1. Cargar Datos
- Haz clic en "Cargar Datos de Ejemplo" para ver datos de muestra
- O importa tu propio archivo Excel (.xlsx)

### 2. Editar en el Spreadsheet
- Haz clic en cualquier celda para editar
- Los cambios se reflejan automáticamente en los gráficos
- Usa las funciones de filtro y ordenamiento

### 3. Configurar Gráficos
- Selecciona el tipo de gráfico deseado
- Elige las columnas para los ejes X e Y
- El gráfico se actualiza en tiempo real

### 4. Exportar Datos
- Guarda tus datos editados como archivo Excel

## 📊 Tipos de Gráficos Disponibles

- **Línea**: Ideal para tendencias temporales
- **Barras**: Perfecto para comparaciones
- **Circular**: Para mostrar proporciones
- **Dona**: Similar al circular con mejor legibilidad
- **Dispersión**: Para correlaciones entre variables

## 🎨 Características de la Interfaz

- **Diseño Responsive**: Funciona en desktop, tablet y móvil
- **Tema Moderno**: Gradientes y sombras elegantes
- **Navegación Intuitiva**: Controles claros y accesibles
- **Feedback Visual**: Estados de carga y error

## 🔧 Estructura del Proyecto

```
src/
├── components/
│   ├── Spreadsheet.tsx    # Componente de spreadsheet
│   ├── Chart.tsx         # Componente de gráficos
│   ├── ChartControls.tsx # Controles de configuración
│   └── FileHandler.tsx   # Manejo de archivos
├── types/
│   └── index.ts          # Definiciones TypeScript
├── App.tsx               # Componente principal
└── App.css              # Estilos
```

## 🛠️ Desarrollo

### Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

### Agregar Nuevos Tipos de Gráficos

1. Actualiza el tipo `ChartType` en `src/types/index.ts`
2. Agrega el nuevo tipo en `ChartControls.tsx`
3. Implementa la lógica en `Chart.tsx`

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio. 