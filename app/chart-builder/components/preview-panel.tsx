'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useChartBuilder } from '@/lib/stores/chart-builder';

export function PreviewPanel() {
  const { 
    chartConfig, 
    selectedDataset, 
    isPreviewLoading, 
    previewError,
    setPreviewLoading 
  } = useChartBuilder();
  
  const [mockData, setMockData] = useState<any>(null);

  // Simulate data loading when configuration changes
  useEffect(() => {
    if (chartConfig.metrics.length > 0 && chartConfig.dimensions.length > 0) {
      setPreviewLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setMockData(generateMockChartData(chartConfig));
        setPreviewLoading(false);
      }, 800);
    }
  }, [chartConfig.metrics, chartConfig.dimensions, setPreviewLoading]);

  const isConfigurationComplete = chartConfig.metrics.length > 0 && chartConfig.dimensions.length > 0;
  const canSave = isConfigurationComplete && !isPreviewLoading && !previewError;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-5 w-5 text-green-600" />
          <h2 className="font-semibold text-gray-900">Live Preview</h2>
          {isPreviewLoading && (
            <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          )}
        </div>
        
        <DataQualityIndicator 
          dataset={selectedDataset}
          isLoading={isPreviewLoading}
          error={previewError}
          dataPoints={mockData?.metadata?.rowCount}
        />
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedDataset ? (
          <EmptyState 
            icon={Database}
            title="No Dataset Selected"
            description="Select a dataset from the left panel to start building your chart"
          />
        ) : !isConfigurationComplete ? (
          <EmptyState 
            icon={BarChart3}
            title="Add Metrics and Dimensions"
            description="Drag fields from the left panel to the configuration area to see a preview"
          />
        ) : previewError ? (
          <ErrorState error={previewError} />
        ) : isPreviewLoading ? (
          <LoadingState />
        ) : (
          <ChartPreview data={mockData} config={chartConfig} />
        )}
      </div>

      {/* Save Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <SaveSection 
          canSave={canSave}
          isLoading={isPreviewLoading}
          config={chartConfig}
        />
      </div>
    </div>
  );
}

// Data quality indicator
interface DataQualityIndicatorProps {
  dataset: any;
  isLoading: boolean;
  error: string | null;
  dataPoints?: number;
}

function DataQualityIndicator({ dataset, isLoading, error, dataPoints }: DataQualityIndicatorProps) {
  if (!dataset) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {error ? (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600">Configuration Error</span>
          </>
        ) : isLoading ? (
          <>
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-yellow-600">Loading preview...</span>
          </>
        ) : dataPoints ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-600">Ready to preview</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Waiting for configuration</span>
          </>
        )}
      </div>

      {dataPoints && (
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>{dataPoints.toLocaleString()} data points</span>
          <span>Updated {dataset.lastUpdated}</span>
        </div>
      )}
    </div>
  );
}

// Empty state component
interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

// Error state component
interface ErrorStateProps {
  error: string;
}

function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-6">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="font-semibold text-red-900 mb-2">Preview Error</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Suggestions:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Check that you have both metrics and dimensions selected</li>
            <li>Ensure field combinations are valid</li>
            <li>Try a simpler chart configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Loading state component
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Generating Preview</h3>
        <p className="text-gray-600 text-sm">Processing your configuration...</p>
        
        {/* Skeleton chart */}
        <div className="mt-8 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Chart preview component
interface ChartPreviewProps {
  data: any;
  config: any;
}

function ChartPreview({ data, config }: ChartPreviewProps) {
  const chartType = config.chartType || 'bar';
  
  return (
    <div className="space-y-4">
      {/* Chart Title */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">
          {generateChartTitle(config)}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {chartType}
          </Badge>
          <span className="text-xs text-gray-500">
            {data.metadata.rowCount.toLocaleString()} records
          </span>
        </div>
      </div>

      {/* Mock Chart Visualization */}
      <div className="border rounded-lg p-4 bg-white">
        <MockChart type={chartType} data={data} />
      </div>

      {/* Chart Insights */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium text-blue-900 text-sm mb-2 flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          Quick Insights
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• {getInsight(config, data)}</li>
          <li>• Data spans {data.metadata.timeRange}</li>
          <li>• Expected load time: {data.metadata.loadTime}</li>
        </ul>
      </div>
    </div>
  );
}

// Mock chart component
interface MockChartProps {
  type: string;
  data: any;
}

function MockChart({ type, data }: MockChartProps) {
  // This would be replaced with actual chart library (Recharts, etc.)
  const chartHeight = 200;
  
  return (
    <div className="relative" style={{ height: chartHeight }}>
      <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">
            {type.charAt(0).toUpperCase() + type.slice(1)} Chart Preview
          </p>
          <p className="text-xs mt-1">
            {data.dataPoints?.length || 0} data points
          </p>
        </div>
      </div>
    </div>
  );
}

// Save section component
interface SaveSectionProps {
  canSave: boolean;
  isLoading: boolean;
  config: any;
}

function SaveSection({ canSave, isLoading, config }: SaveSectionProps) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-600">
        {canSave 
          ? "Chart is ready to save to your dashboard" 
          : "Complete your configuration to save"
        }
      </div>
      
      <Button 
        className="w-full" 
        disabled={!canSave || isLoading}
        size="sm"
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Loading...' : 'Save to Dashboard'}
      </Button>
      
      {canSave && (
        <div className="text-xs text-gray-500">
          <p>Chart will be named: <strong>{generateChartTitle(config)}</strong></p>
        </div>
      )}
    </div>
  );
}

// Utility functions
function generateMockChartData(config: any) {
  return {
    dataPoints: Array.from({ length: 50 }, (_, i) => ({
      x: `Point ${i + 1}`,
      y: Math.floor(Math.random() * 100)
    })),
    metadata: {
      rowCount: Math.floor(Math.random() * 10000) + 1000,
      timeRange: "Last 30 days",
      loadTime: "< 1 second",
      lastUpdated: "2 hours ago"
    }
  };
}

function generateChartTitle(config: any): string {
  const metrics = config.metrics.map((m: any) => m.name).join(' & ');
  const dimensions = config.dimensions.map((d: any) => d.name).join(' & ');
  
  if (metrics && dimensions) {
    return `${metrics} by ${dimensions}`;
  } else if (metrics) {
    return metrics;
  } else if (dimensions) {
    return `Data by ${dimensions}`;
  }
  
  return 'Untitled Chart';
}

function getInsight(config: any, data: any): string {
  const insights = [
    "Trending upward over the selected period",
    "Shows seasonal patterns in your data", 
    "Identifies key performance drivers",
    "Reveals optimization opportunities",
    "Highlights quality improvement trends"
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}