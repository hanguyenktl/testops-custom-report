import { create } from 'zustand';
import { QADataset, ChartConfiguration, DroppedField } from '@/lib/types/dataset';
import { QA_DATASETS } from '@/lib/datasets/qa-datasets';

interface ChartBuilderState {
  // Dataset selection
  availableDatasets: QADataset[];
  selectedDataset: QADataset | null;
  
  // Chart configuration
  chartConfig: ChartConfiguration;
  
  // Progressive disclosure level (1-4)
  complexityLevel: number;
  
  // UI state
  isPreviewLoading: boolean;
  previewError: string | null;
  
  // Actions
  selectDataset: (dataset: QADataset) => void;
  addFieldToDropZone: (field: DroppedField) => void;
  removeFieldFromDropZone: (fieldId: string, dropZone: string) => void;
  updateChartType: (chartType: string) => void;
  addFilter: (filter: any) => void;
  removeFilter: (filterId: string) => void;
  setComplexityLevel: (level: number) => void;
  resetConfiguration: () => void;
  
  // Preview management
  setPreviewLoading: (loading: boolean) => void;
  setPreviewError: (error: string | null) => void;
}

const initialChartConfig: ChartConfiguration = {
  selectedDataset: undefined,
  metrics: [],
  dimensions: [],
  filters: [],
  chartType: undefined,
  timeRange: { type: 'relative', value: 'last_30_days' },
  grouping: undefined
};

export const useChartBuilder = create<ChartBuilderState>((set, get) => ({
  // Initial state
  availableDatasets: QA_DATASETS,
  selectedDataset: null,
  chartConfig: initialChartConfig,
  complexityLevel: 1, // Start with basic mode
  isPreviewLoading: false,
  previewError: null,

  // Dataset selection
  selectDataset: (dataset: QADataset) => {
    set((state) => ({
      selectedDataset: dataset,
      chartConfig: {
        ...initialChartConfig,
        selectedDataset: dataset
      },
      previewError: null
    }));
  },

  // Field management
  addFieldToDropZone: (field: DroppedField) => {
    set((state) => {
      const newConfig = { ...state.chartConfig };
      
      // Remove field from other drop zones first
      newConfig.metrics = newConfig.metrics.filter(f => f.id !== field.id);
      newConfig.dimensions = newConfig.dimensions.filter(f => f.id !== field.id);
      
      // Add to the specified drop zone
      if (field.dropZone === 'metrics') {
        newConfig.metrics = [...newConfig.metrics, field];
      } else if (field.dropZone === 'dimensions') {
        newConfig.dimensions = [...newConfig.dimensions, field];
      }
      
      // Auto-infer chart type based on field combinations
      newConfig.chartType = inferChartType(newConfig);
      
      return {
        chartConfig: newConfig,
        previewError: null
      };
    });
  },

  removeFieldFromDropZone: (fieldId: string, dropZone: string) => {
    set((state) => {
      const newConfig = { ...state.chartConfig };
      
      if (dropZone === 'metrics') {
        newConfig.metrics = newConfig.metrics.filter(f => f.id !== fieldId);
      } else if (dropZone === 'dimensions') {
        newConfig.dimensions = newConfig.dimensions.filter(f => f.id !== fieldId);
      }
      
      // Update chart type after removal
      newConfig.chartType = inferChartType(newConfig);
      
      return { chartConfig: newConfig };
    });
  },

  updateChartType: (chartType: string) => {
    set((state) => ({
      chartConfig: {
        ...state.chartConfig,
        chartType: chartType as any
      }
    }));
  },

  // Filter management
  addFilter: (filter: any) => {
    set((state) => ({
      chartConfig: {
        ...state.chartConfig,
        filters: [...state.chartConfig.filters, filter]
      }
    }));
  },

  removeFilter: (filterId: string) => {
    set((state) => ({
      chartConfig: {
        ...state.chartConfig,
        filters: state.chartConfig.filters.filter(f => f.field.id !== filterId)
      }
    }));
  },

  // Progressive disclosure
  setComplexityLevel: (level: number) => {
    set({ complexityLevel: level });
  },

  // Configuration reset
  resetConfiguration: () => {
    set((state) => ({
      selectedDataset: null,
      chartConfig: initialChartConfig,
      complexityLevel: 1,
      previewError: null
    }));
  },

  // Preview state management
  setPreviewLoading: (loading: boolean) => {
    set({ isPreviewLoading: loading });
  },

  setPreviewError: (error: string | null) => {
    set({ previewError: error });
  }
}));

// Helper function to automatically infer chart type based on selected fields
function inferChartType(config: ChartConfiguration): 'line' | 'bar' | 'area' | 'pie' | 'table' | 'mixed' {
  const { metrics, dimensions } = config;
  
  if (metrics.length === 0 || dimensions.length === 0) {
    return 'table'; // Fallback for incomplete configurations
  }
  
  // Check if we have temporal dimensions (dates, time periods)
  const hasTemporal = dimensions.some(d => 
    d.originalField && 'type' in d.originalField && d.originalField.type === 'temporal'
  );
  
  if (hasTemporal) {
    // Time series charts for temporal data
    return metrics.length > 1 ? 'mixed' : 'line';
  }
  
  // For categorical dimensions
  const categoricalDimensions = dimensions.filter(d => 
    d.originalField && 'type' in d.originalField && d.originalField.type === 'categorical'
  );
  
  if (categoricalDimensions.length > 0) {
    if (metrics.length === 1 && categoricalDimensions.length === 1) {
      return 'bar';
    }
    if (metrics.length > 1) {
      return 'mixed';
    }
  }
  
  // Default fallback
  return 'bar';
}