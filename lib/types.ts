// Core data types for QA TestOps application

export interface TestExecutionRecord {
  id: string;
  test_case_id: string;
  test_case_name: string;
  start_time: Date;
  duration: number; // seconds
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'SKIPPED';
  test_type: 'manual' | 'automated';
  executor: string;
  environment: 'QA' | 'Staging' | 'Production';
  project_id: string;
  sprint_id: string;
  release_id: string;
  configuration: {
    os: string;
    browser: string;
    version: string;
  };
}

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  type: 'prebuilt' | 'custom';
  chart_type: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  data: Record<string, unknown>;
  config: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface PrebuiltTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'performance' | 'quality' | 'coverage' | 'productivity';
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedTime: string;
  chart_type: string;
  default_config: Record<string, unknown>;
  preview_data?: Record<string, unknown>;
}

export interface QAUseCase {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'performance' | 'quality' | 'coverage' | 'productivity';
  complexity: 'simple' | 'intermediate' | 'advanced';
  estimatedTime: string;
  datasets: string[];
  defaultChart: string;
}

export interface BusinessMetric {
  id: string;
  label: string;
  description: string;
  sqlExpression: string;
  unit?: string;
  category: string;
}

export interface BusinessFilter {
  id: string;
  type: string;
  value: unknown;
  label: string;
}

export interface ChartConfiguration {
  useCase: QAUseCase;
  scope: TimeScope | SprintScope | ReleaseScope;
  metrics: BusinessMetric[];
  filters: BusinessFilter[];
  groupBy: string[];
  visualization: ChartStyle;
}

export interface TimeScope {
  type: 'time';
  value: 'last_7_days' | 'last_30_days' | 'last_3_months' | 'custom';
  label: string;
  customRange?: { start: Date; end: Date };
}

export interface SprintScope {
  type: 'sprint';
  value: string;
  label: string;
}

export interface ReleaseScope {
  type: 'release';
  value: string;
  label: string;
}

export interface ChartStyle {
  type: string;
  name: string;
  description: string;
}

export interface SupersetChartConfig {
  dataset: string;
  chart_type: string;
  metrics: SupersetMetric[];
  groupby: string[];
  adhoc_filters: SupersetFilter[];
  time_range: string;
}

export interface SupersetMetric {
  expressionType: 'SQL';
  sqlExpression: string;
  label: string;
}

export interface SupersetFilter {
  col: string;
  op: string;
  val: unknown;
}

// Template System Types
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  businessValue: string;
  persona: string[];
  dataset: string;
  datasets?: string[]; // For multi-dataset templates
  chartType: string;
  optimalScope: ('time' | 'sprint' | 'release')[];
  supportedScopes: ('time' | 'sprint' | 'release')[];
  autoConfig: TemplateAutoConfig;
  level1Options: ConfigurationOption[];
  level2Options?: ConfigurationOption[];
  level3Options?: ConfigurationOption[];
  exampleQuery: string;
  refreshRate?: string;
  complexity?: 'low' | 'medium' | 'high' | 'very_high';
  joinStrategy?: string;
}

export interface TemplateAutoConfig {
  metrics: string[] | Record<string, string>;
  groupBy?: string[];
  preFilters?: SupersetFilter[];
  dimensions?: string[];
  complexLogic?: boolean;
  joinStrategy?: string;
  refreshRate?: string;
  visualization?: Record<string, unknown>;
}

export interface ConfigurationOption {
  id: string;
  type: 'scope' | 'filter' | 'metrics' | 'grouping' | 'comparison' | 'analysis' | 'dimensions' | 'filters';
  label: string;
  options: string[] | string;
  defaultValue?: string;
  description?: string;
}

export interface ScopeSelection {
  type: 'time' | 'sprint' | 'release';
  value: string;
  label: string;
  dateRange?: { start: Date; end: Date };
}

export interface TemplateConfiguration {
  templateId: string;
  scope: ScopeSelection;
  level: 1 | 2 | 3;
  selectedOptions: Record<string, string | string[]>;
  customFilters?: BusinessFilter[];
}