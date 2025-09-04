'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Filter, 
  BarChart3, 
  Settings,
  Eye,
  Clock,
  Users,
  Zap
} from 'lucide-react';
import { QAUseCase } from '@/lib/types';

interface ConfigurationWizardProps {
  useCase: QAUseCase;
  onNext: (config: ChartConfiguration) => void;
  onBack: () => void;
}

interface ChartConfiguration {
  useCase: QAUseCase;
  scope: TimeScope;
  filters: ConfigFilter[];
  groupBy: string;
  visualization: ChartStyle;
  level: 'basic' | 'intermediate' | 'advanced';
}

interface TimeScope {
  type: 'time' | 'sprint' | 'release';
  value: string;
  label: string;
}

interface ConfigFilter {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface ChartStyle {
  type: string;
  name: string;
  description: string;
}

// Mock configuration options based on use case
const getConfigOptions = (useCase: QAUseCase) => {
  const baseScopes = [
    { type: 'time' as const, value: 'last_7_days', label: 'Last 7 days' },
    { type: 'time' as const, value: 'last_30_days', label: 'Last 30 days' },
    { type: 'time' as const, value: 'last_3_months', label: 'Last 3 months' },
    { type: 'sprint' as const, value: 'sprint_7', label: 'Sprint 7 (Current)' },
    { type: 'sprint' as const, value: 'sprint_6', label: 'Sprint 6' },
    { type: 'release' as const, value: 'release_2_1', label: 'Release 2.1 (Current)' },
  ];

  const commonFilters = [
    { id: 'test_type', type: 'multiselect', options: ['Manual', 'Automated', 'Both'], label: 'Test Type' },
    { id: 'environment', type: 'multiselect', options: ['QA', 'Staging', 'Production'], label: 'Environment' },
    { id: 'project', type: 'multiselect', options: ['Mobile App', 'Web Portal', 'API Services'], label: 'Project' },
  ];

  const groupByOptions = useCase.category === 'performance' 
    ? ['Daily', 'Weekly', 'By Test Type', 'By Team Member', 'By Project']
    : useCase.category === 'productivity'
    ? ['By Team Member', 'By Project', 'By Test Type', 'Daily', 'Weekly']
    : ['Daily', 'Weekly', 'By Priority', 'By Status', 'By Project'];

  const visualizations = [
    { type: 'line', name: 'Line Chart', description: 'Show trends over time' },
    { type: 'bar', name: 'Bar Chart', description: 'Compare categories' },
    { type: 'area', name: 'Area Chart', description: 'Show volume and trends' },
    { type: 'mixed', name: 'Mixed Chart', description: 'Combine multiple metrics' },
  ];

  return { scopes: baseScopes, filters: commonFilters, groupByOptions, visualizations };
};

export function ConfigurationWizard({ useCase, onNext, onBack }: ConfigurationWizardProps) {
  const [configLevel, setConfigLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [showIntermediate, setShowIntermediate] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Configuration state
  const [scope, setScope] = useState<TimeScope>({ type: 'time', value: 'last_30_days', label: 'Last 30 days' });
  const [filters, setFilters] = useState<ConfigFilter[]>([]);
  const [groupBy, setGroupBy] = useState('Daily');
  const [visualization, setVisualization] = useState<ChartStyle>({ type: useCase.defaultChart, name: 'Auto-selected', description: 'Best for your use case' });

  const configOptions = getConfigOptions(useCase);

  const handleNext = () => {
    const config: ChartConfiguration = {
      useCase,
      scope,
      filters,
      groupBy,
      visualization,
      level: configLevel
    };
    onNext(config);
  };

  const handleShowMore = () => {
    setShowIntermediate(true);
    setConfigLevel('intermediate');
  };

  const handleShowAdvanced = () => {
    setShowAdvanced(true);
    setConfigLevel('advanced');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-3xl">{useCase.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{useCase.title}</h2>
            <p className="text-gray-600">{useCase.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="mb-4">
          {useCase.complexity} • {useCase.estimatedTime}
        </Badge>
      </div>

      {/* Configuration Tabs */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level 1: Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Quick Setup
                <Badge variant="secondary" className="ml-2">Essential</Badge>
              </CardTitle>
              <CardDescription>
                Get started quickly with smart defaults for 90% of use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Scope */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Time Period
                </label>
                <Select value={scope.value} onValueChange={(value) => {
                  const selectedScope = configOptions.scopes.find(s => s.value === value);
                  if (selectedScope) setScope(selectedScope);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {configOptions.scopes.map((scopeOption) => (
                      <SelectItem key={scopeOption.value} value={scopeOption.value}>
                        {scopeOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Group By */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Group Data By
                </label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    {configOptions.groupByOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualization Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {configOptions.visualizations.map((viz) => (
                    <button
                      key={viz.type}
                      onClick={() => setVisualization(viz)}
                      className={`p-3 text-left border rounded-lg transition-all ${
                        visualization.type === viz.type 
                          ? 'border-blue-500 bg-blue-50 text-blue-900' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{viz.name}</div>
                      <div className="text-xs text-gray-600">{viz.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level 2: Intermediate Options */}
          <Collapsible open={showIntermediate} onOpenChange={setShowIntermediate}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">Show More Options</h3>
                        <p className="text-sm text-gray-600">Advanced filtering and customization</p>
                      </div>
                    </div>
                    {showIntermediate ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    Advanced Filtering
                    <Badge variant="outline" className="ml-2">Intermediate</Badge>
                  </CardTitle>
                  <CardDescription>
                    Fine-tune your analysis with specific filters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configOptions.filters.map((filter) => (
                    <div key={filter.id}>
                      <label className="block text-sm font-medium mb-2">{filter.label}</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options.map((option) => (
                            <SelectItem key={option} value={option.toLowerCase()}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Level 3: Advanced Options */}
          {showIntermediate && (
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-red-600" />
                        <div>
                          <h3 className="font-semibold">Advanced Settings</h3>
                          <p className="text-sm text-gray-600">Expert-level customization</p>
                        </div>
                      </div>
                      {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-red-600" />
                      Expert Configuration
                      <Badge variant="outline" className="ml-2 border-red-200 text-red-700">Advanced</Badge>
                    </CardTitle>
                    <CardDescription>
                      Full control over chart behavior and calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Custom Calculations</h4>
                      <p className="text-sm text-gray-600 mb-3">Create custom metrics using business logic</p>
                      <Button variant="outline" size="sm" disabled>
                        Formula Builder (Coming Soon)
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Alert Thresholds</h4>
                      <p className="text-sm text-gray-600 mb-3">Define rules for highlighting issues</p>
                      <Button variant="outline" size="sm" disabled>
                        Set Alerts (Coming Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Right: Live Preview Placeholder */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See your chart update as you configure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Chart preview</p>
                  <p className="text-xs text-gray-500 mt-1">Updates in real-time</p>
                </div>
              </div>
              
              {/* Configuration Summary */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Scope:</span>
                  <span className="font-medium">{scope.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Group By:</span>
                  <span className="font-medium">{groupBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Chart Type:</span>
                  <span className="font-medium">{visualization.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Complexity:</span>
                  <Badge variant="outline" className="text-xs">
                    {configLevel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Use Cases
        </Button>
        
        <div className="flex gap-3">
          {!showIntermediate && (
            <Button variant="outline" onClick={handleShowMore}>
              Show More Options
            </Button>
          )}
          <Button onClick={handleNext}>
            Continue to Preview
            <Clock className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}