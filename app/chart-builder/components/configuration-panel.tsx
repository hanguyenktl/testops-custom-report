'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Table,
  ChevronDown,
  ChevronRight,
  Filter,
  Calendar,
  Settings
} from 'lucide-react';
import { useChartBuilder } from '@/lib/stores/chart-builder';
import { useDroppable } from '@dnd-kit/core';

export function ConfigurationPanel() {
  const { 
    selectedDataset, 
    chartConfig, 
    complexityLevel, 
    setComplexityLevel 
  } = useChartBuilder();
  
  const [expandedSections, setExpandedSections] = useState({
    chartType: true,
    filters: false,
    timeRange: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!selectedDataset) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Select a Dataset</h3>
          <p className="text-gray-600 text-sm">
            Choose a dataset from the left panel to start building your chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Chart Type Selection */}
        <ChartTypeSelector 
          expanded={expandedSections.chartType}
          onToggle={() => toggleSection('chartType')}
        />

        {/* Drop Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MetricsDropZone />
          <DimensionsDropZone />
        </div>

        {/* Progressive Disclosure Sections */}
        <ComplexityLevelSelector 
          level={complexityLevel}
          onLevelChange={setComplexityLevel}
        />

        {/* Filters Section - Tier 2+ */}
        {complexityLevel >= 2 && (
          <FiltersSection 
            expanded={expandedSections.filters}
            onToggle={() => toggleSection('filters')}
          />
        )}

        {/* Time Range Section - Tier 2+ */}
        {complexityLevel >= 2 && (
          <TimeRangeSection 
            expanded={expandedSections.timeRange}
            onToggle={() => toggleSection('timeRange')}
          />
        )}

        {/* Advanced Settings - Tier 3+ */}
        {complexityLevel >= 3 && (
          <AdvancedSection 
            expanded={expandedSections.advanced}
            onToggle={() => toggleSection('advanced')}
          />
        )}
      </div>
    </div>
  );
}

// Chart type selector component
interface ChartTypeSelectorProps {
  expanded: boolean;
  onToggle: () => void;
}

function ChartTypeSelector({ expanded, onToggle }: ChartTypeSelectorProps) {
  const { chartConfig, updateChartType } = useChartBuilder();
  
  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
    { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
    { id: 'table', name: 'Table', icon: Table, description: 'Raw data view' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={onToggle}
        >
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Chart Type
            {chartConfig.chartType && (
              <Badge variant="secondary" className="ml-2">
                {chartTypes.find(t => t.id === chartConfig.chartType)?.name || chartConfig.chartType}
              </Badge>
            )}
          </CardTitle>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {chartTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = chartConfig.chartType === type.id;
              
              return (
                <button
                  key={type.id}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => updateChartType(type.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <span className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {type.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Metrics drop zone
function MetricsDropZone() {
  const { chartConfig, removeFieldFromDropZone } = useChartBuilder();
  const { isOver, setNodeRef } = useDroppable({
    id: 'metrics-dropzone',
    data: { type: 'metrics' }
  });
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-700">
          What do you want to measure?
        </CardTitle>
        <p className="text-xs text-gray-600">
          Drag metrics here (Pass Rate, Duration, etc.)
        </p>
      </CardHeader>
      <CardContent>
        <div 
          ref={setNodeRef}
          className={`min-h-[120px] border-2 border-dashed rounded-lg p-3 transition-colors ${
            isOver 
              ? 'border-blue-500 bg-blue-100/50' 
              : 'border-blue-300 bg-blue-50/30'
          }`}
        >
          {chartConfig.metrics.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-blue-600">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs">Drop metrics here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {chartConfig.metrics.map((field) => (
                <div 
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex-1">
                    <div className="font-medium text-xs">{field.name}</div>
                    <div className="text-xs text-gray-500">{field.datasetId}</div>
                  </div>
                  <button
                    onClick={() => removeFieldFromDropZone(field.id, 'metrics')}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Dimensions drop zone
function DimensionsDropZone() {
  const { chartConfig, removeFieldFromDropZone } = useChartBuilder();
  const { isOver, setNodeRef } = useDroppable({
    id: 'dimensions-dropzone',
    data: { type: 'dimensions' }
  });
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-green-700">
          How do you want to group it?
        </CardTitle>
        <p className="text-xs text-gray-600">
          Drag dimensions here (Sprint, Team, etc.)
        </p>
      </CardHeader>
      <CardContent>
        <div 
          ref={setNodeRef}
          className={`min-h-[120px] border-2 border-dashed rounded-lg p-3 transition-colors ${
            isOver 
              ? 'border-green-500 bg-green-100/50' 
              : 'border-green-300 bg-green-50/30'
          }`}
        >
          {chartConfig.dimensions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-green-600">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs">Drop dimensions here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {chartConfig.dimensions.map((field) => (
                <div 
                  key={field.id}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex-1">
                    <div className="font-medium text-xs">{field.name}</div>
                    <div className="text-xs text-gray-500">{field.datasetId}</div>
                  </div>
                  <button
                    onClick={() => removeFieldFromDropZone(field.id, 'dimensions')}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Complexity level selector
interface ComplexityLevelSelectorProps {
  level: number;
  onLevelChange: (level: number) => void;
}

function ComplexityLevelSelector({ level, onLevelChange }: ComplexityLevelSelectorProps) {
  const levels = [
    { id: 1, name: 'Basic', description: 'Simple metrics and grouping' },
    { id: 2, name: 'Intermediate', description: 'Add filters and time ranges' },
    { id: 3, name: 'Advanced', description: 'Custom calculations and styling' },
    { id: 4, name: 'Expert', description: 'Raw SQL and performance tuning' }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Configuration Complexity</CardTitle>
        <p className="text-xs text-gray-600">
          Choose your comfort level - you can always upgrade later
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              className={`flex-1 p-2 rounded text-xs transition-all ${
                level >= lvl.id
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onLevelChange(lvl.id)}
            >
              <div className="font-medium">{lvl.name}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Filters section (Tier 2+)
interface FiltersSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

function FiltersSection({ expanded, onToggle }: FiltersSectionProps) {
  const { chartConfig } = useChartBuilder();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={onToggle}
        >
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {chartConfig.filters.length > 0 && (
              <Badge variant="secondary">{chartConfig.filters.length}</Badge>
            )}
          </CardTitle>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              Add filters to narrow down your data
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-3 w-3 mr-1" />
              Add Filter
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Time range section (Tier 2+)
interface TimeRangeSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

function TimeRangeSection({ expanded, onToggle }: TimeRangeSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={onToggle}
        >
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Time Range
          </CardTitle>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Custom range'].map((range) => (
                <button
                  key={range}
                  className="p-2 text-xs rounded border hover:border-blue-300 hover:bg-blue-50"
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Advanced section (Tier 3+)
interface AdvancedSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

function AdvancedSection({ expanded, onToggle }: AdvancedSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={onToggle}
        >
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </CardTitle>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-gray-600">
              Custom calculations, styling, and performance optimization
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-1" />
                Add Calculated Field
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Chart Styling
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}