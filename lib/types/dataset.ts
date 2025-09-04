export interface QAMetric {
  id: string;
  name: string;                    // Business-friendly name: "Pass Rate %"
  businessDescription: string;     // "Percentage of tests that passed"
  technicalName: string;          // Database column: "pass_rate_percentage"
  sqlExpression: string;          // "SUM(passed_tests) * 100.0 / SUM(total_tests)"
  type: 'percentage' | 'count' | 'duration' | 'ratio' | 'decimal';
  format: string;                 // Display format: "0.1%" | "0,0" | "HH:mm:ss"
  category: 'quality' | 'performance' | 'coverage' | 'productivity';
}

export interface QADimension {
  id: string;
  name: string;                    // Business name: "Sprint"
  businessDescription: string;     // "Development sprint period"
  technicalName: string;          // Database column: "sprint_name"
  type: 'categorical' | 'temporal' | 'ordinal';
  values?: string[];              // For categorical: ['Sprint 1', 'Sprint 2']
  category: 'time' | 'scope' | 'team' | 'environment' | 'classification';
}

export interface QAFilter {
  id: string;
  name: string;
  businessDescription: string;
  technicalName: string;
  type: 'select' | 'multiselect' | 'daterange' | 'text' | 'numeric';
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

export interface QADataset {
  id: string;
  name: string;                   // "Test Execution Results"
  businessDescription: string;    // "Individual test run outcomes with timing and status"
  icon: string;                  // "🧪"
  recordCount: string;           // "50K+ executions"
  lastUpdated: string;           // "2 hours ago"
  category: 'execution' | 'defects' | 'requirements' | 'coverage';
  fields: {
    metrics: QAMetric[];
    dimensions: QADimension[];
    filters: QAFilter[];
  };
  relationships?: {
    relatedDatasets: string[];   // IDs of related datasets
    joinKeys: Record<string, string>; // dataset_id -> join_column
  };
}

// Drag and drop configuration types
export interface DroppedField {
  id: string;
  name: string;
  type: 'metric' | 'dimension';
  datasetId: string;
  originalField: QAMetric | QADimension;
  dropZone: 'metrics' | 'dimensions' | 'filters' | 'grouping';
}

export interface ChartConfiguration {
  selectedDataset?: QADataset;
  metrics: DroppedField[];
  dimensions: DroppedField[];
  filters: Array<{
    field: QAFilter;
    operator: string;
    value: any;
  }>;
  chartType?: 'line' | 'bar' | 'area' | 'pie' | 'table' | 'mixed';
  timeRange?: {
    type: 'relative' | 'absolute';
    value: string;
  };
  grouping?: {
    level: 'daily' | 'weekly' | 'monthly' | 'sprint';
    additionalDimensions: DroppedField[];
  };
}

// Business-to-Superset translation types
export interface SupersetConfig {
  dataset: string;
  chart_type: string;
  metrics: Array<{
    expressionType: 'SQL' | 'SIMPLE';
    sqlExpression?: string;
    column?: string;
    aggregate?: string;
    label: string;
  }>;
  groupby: string[];
  adhoc_filters: Array<{
    clause: 'WHERE' | 'HAVING';
    subject: string;
    operator: string;
    comparator: any;
    expressionType: 'SIMPLE' | 'SQL';
  }>;
  time_range?: string;
  limit?: number;
  order_desc?: boolean;
}