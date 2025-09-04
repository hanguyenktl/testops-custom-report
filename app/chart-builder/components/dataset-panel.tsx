'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  BarChart3,
  Calendar,
  Users,
  Filter,
  Hash,
  Percent,
  Clock,
  Target,
  GripVertical
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useChartBuilder } from '@/lib/stores/chart-builder';
import { QADataset, QAMetric, QADimension, DroppedField } from '@/lib/types/dataset';
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core';

export function DatasetPanel() {
  const { availableDatasets, selectedDataset, selectDataset } = useChartBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    metrics: true,
    dimensions: true,
    filters: false
  });

  const filteredDatasets = availableDatasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.businessDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4 text-green-600" />;
      case 'count': return <Hash className="h-4 w-4 text-blue-600" />;
      case 'duration': return <Clock className="h-4 w-4 text-orange-600" />;
      case 'ratio': return <BarChart3 className="h-4 w-4 text-purple-600" />;
      default: return <Hash className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDimensionIcon = (category: string) => {
    switch (category) {
      case 'time': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'team': return <Users className="h-4 w-4 text-green-600" />;
      case 'scope': return <Target className="h-4 w-4 text-purple-600" />;
      case 'environment': return <Database className="h-4 w-4 text-orange-600" />;
      default: return <Filter className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Datasets</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Dataset Selection */}
      <div className="flex-1 overflow-y-auto">
        {!selectedDataset ? (
          <DatasetSelection 
            datasets={filteredDatasets} 
            onSelect={selectDataset}
          />
        ) : (
          <FieldExplorer 
            dataset={selectedDataset}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            getMetricIcon={getMetricIcon}
            getDimensionIcon={getDimensionIcon}
          />
        )}
      </div>

      {/* Dataset Info Footer */}
      {selectedDataset && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {selectedDataset.recordCount} • Updated {selectedDataset.lastUpdated}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => selectDataset(null as any)}
              className="text-xs"
            >
              Switch Dataset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Dataset selection component
interface DatasetSelectionProps {
  datasets: QADataset[];
  onSelect: (dataset: QADataset) => void;
}

function DatasetSelection({ datasets, onSelect }: DatasetSelectionProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="text-sm text-gray-600 mb-4">
        Choose a dataset to start building your chart
      </div>
      
      {datasets.map((dataset) => (
        <Card 
          key={dataset.id}
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
          onClick={() => onSelect(dataset)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <div className="text-xl flex-shrink-0">{dataset.icon}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm leading-tight">{dataset.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {dataset.category}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <CardDescription className="text-xs mb-2 leading-relaxed">
              {dataset.businessDescription}
            </CardDescription>
            <div className="text-xs text-gray-500">
              {dataset.recordCount}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Field explorer component
interface FieldExplorerProps {
  dataset: QADataset;
  expandedSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
  getMetricIcon: (type: string) => JSX.Element;
  getDimensionIcon: (category: string) => JSX.Element;
}

function FieldExplorer({ 
  dataset, 
  expandedSections, 
  onToggleSection,
  getMetricIcon,
  getDimensionIcon 
}: FieldExplorerProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Dataset Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{dataset.icon}</span>
          <h3 className="font-semibold text-sm text-gray-900">{dataset.name}</h3>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {dataset.businessDescription}
        </p>
      </div>

      {/* Metrics Section */}
      <div className="border rounded-lg">
        <button
          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => onToggleSection('metrics')}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Metrics</span>
            <Badge variant="secondary" className="text-xs">
              {dataset.fields.metrics.length}
            </Badge>
          </div>
          {expandedSections.metrics ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </button>
        
        {expandedSections.metrics && (
          <div className="border-t">
            <div className="p-2 text-xs text-gray-500 bg-gray-50">
              Drag to "What do you want to measure?" area
            </div>
            <div className="p-2 space-y-1">
              {dataset.fields.metrics.map((metric) => (
                <DraggableMetric key={metric.id} metric={metric} getIcon={getMetricIcon} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dimensions Section */}
      <div className="border rounded-lg">
        <button
          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50"
          onClick={() => onToggleSection('dimensions')}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">Dimensions</span>
            <Badge variant="secondary" className="text-xs">
              {dataset.fields.dimensions.length}
            </Badge>
          </div>
          {expandedSections.dimensions ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </button>
        
        {expandedSections.dimensions && (
          <div className="border-t">
            <div className="p-2 text-xs text-gray-500 bg-gray-50">
              Drag to "How do you want to group it?" area
            </div>
            <div className="p-2 space-y-1">
              {dataset.fields.dimensions.map((dimension) => (
                <DraggableDimension key={dimension.id} dimension={dimension} getIcon={getDimensionIcon} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable metric component
interface DraggableMetricProps {
  metric: QAMetric;
  getIcon: (type: string) => JSX.Element;
}

function DraggableMetric({ metric, getIcon }: DraggableMetricProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `metric-${metric.id}`,
    data: {
      type: 'metric',
      metric: metric
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-2 rounded border bg-white hover:bg-blue-50 hover:border-blue-300 cursor-move transition-colors group ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-3 w-3 text-gray-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
        {getIcon(metric.type)}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs text-gray-900 group-hover:text-blue-700">
            {metric.name}
          </div>
          <div className="text-xs text-gray-500 mt-1 leading-tight">
            {metric.businessDescription}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {metric.category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// Draggable dimension component
interface DraggableDimensionProps {
  dimension: QADimension;
  getIcon: (category: string) => JSX.Element;
}

function DraggableDimension({ dimension, getIcon }: DraggableDimensionProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dimension-${dimension.id}`,
    data: {
      type: 'dimension',
      dimension: dimension
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-2 rounded border bg-white hover:bg-green-50 hover:border-green-300 cursor-move transition-colors group ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-3 w-3 text-gray-400 group-hover:text-green-500 mt-0.5 flex-shrink-0" />
        {getIcon(dimension.category)}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs text-gray-900 group-hover:text-green-700">
            {dimension.name}
          </div>
          <div className="text-xs text-gray-500 mt-1 leading-tight">
            {dimension.businessDescription}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {dimension.category}
            </Badge>
            {dimension.type && (
              <Badge variant="outline" className="text-xs">
                {dimension.type}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}