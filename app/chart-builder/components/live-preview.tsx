'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';
import { QAUseCase } from '@/lib/types';

interface ChartConfiguration {
  useCase: QAUseCase;
  scope: {
    type: 'time' | 'sprint' | 'release';
    value: string;
    label: string;
  };
  filters: unknown[];
  groupBy: string;
  visualization: {
    type: string;
    name: string;
    description: string;
  };
  level: 'basic' | 'intermediate' | 'advanced';
}

interface LivePreviewProps {
  config: ChartConfiguration;
  onNext: () => void;
  onBack: () => void;
}

// Mock data generator based on use case and configuration
const generateMockData = (config: ChartConfiguration) => {
  const { useCase, scope, groupBy, visualization } = config;
  
  // Generate appropriate mock data based on use case
  switch (useCase.id) {
    case 'test-execution-performance':
      return generatePerformanceData(groupBy);
    case 'quality-trends-analysis':
      return generateQualityData(groupBy);
    case 'team-productivity-insights':
      return generateProductivityData(groupBy);
    default:
      return generateDefaultData(groupBy);
  }
};

const generatePerformanceData = (groupBy: string) => {
  if (groupBy === 'Daily') {
    return [
      { name: 'Mon', avgDuration: 120, testCount: 45, passRate: 89 },
      { name: 'Tue', avgDuration: 135, testCount: 52, passRate: 91 },
      { name: 'Wed', avgDuration: 108, testCount: 48, passRate: 87 },
      { name: 'Thu', avgDuration: 142, testCount: 41, passRate: 85 },
      { name: 'Fri', avgDuration: 95, testCount: 55, passRate: 93 },
      { name: 'Sat', avgDuration: 110, testCount: 38, passRate: 90 },
      { name: 'Sun', avgDuration: 125, testCount: 42, passRate: 88 },
    ];
  }
  if (groupBy === 'By Team Member') {
    return [
      { name: 'Alice', avgDuration: 98, testCount: 65, passRate: 94 },
      { name: 'Bob', avgDuration: 125, testCount: 52, passRate: 87 },
      { name: 'Carol', avgDuration: 110, testCount: 58, passRate: 91 },
      { name: 'David', avgDuration: 142, testCount: 43, passRate: 83 },
      { name: 'Emma', avgDuration: 88, testCount: 71, passRate: 96 },
    ];
  }
  return generateDefaultData(groupBy);
};

const generateQualityData = (groupBy: string) => {
  if (groupBy === 'Daily') {
    return [
      { name: 'Mon', passRate: 89, totalTests: 45, passedTests: 40 },
      { name: 'Tue', passRate: 91, totalTests: 52, passedTests: 47 },
      { name: 'Wed', passRate: 87, totalTests: 48, passedTests: 42 },
      { name: 'Thu', passRate: 85, totalTests: 41, passedTests: 35 },
      { name: 'Fri', passRate: 93, totalTests: 55, passedTests: 51 },
      { name: 'Sat', passRate: 90, totalTests: 38, passedTests: 34 },
      { name: 'Sun', passRate: 88, totalTests: 42, passedTests: 37 },
    ];
  }
  return generateDefaultData(groupBy);
};

const generateProductivityData = (groupBy: string) => {
  if (groupBy === 'By Team Member') {
    return [
      { name: 'Alice', testsExecuted: 65, avgDuration: 98, efficiency: 94 },
      { name: 'Bob', testsExecuted: 52, avgDuration: 125, efficiency: 87 },
      { name: 'Carol', testsExecuted: 58, avgDuration: 110, efficiency: 91 },
      { name: 'David', testsExecuted: 43, avgDuration: 142, efficiency: 83 },
      { name: 'Emma', testsExecuted: 71, avgDuration: 88, efficiency: 96 },
    ];
  }
  return generateDefaultData(groupBy);
};

const generateDefaultData = (groupBy: string) => {
  return [
    { name: 'Item 1', value: 120, count: 45 },
    { name: 'Item 2', value: 135, count: 52 },
    { name: 'Item 3', value: 108, count: 48 },
    { name: 'Item 4', value: 142, count: 41 },
    { name: 'Item 5', value: 95, count: 55 },
  ];
};

// Chart component selector
const renderChart = (config: ChartConfiguration, data: any[]) => {
  const { visualization, useCase } = config;
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  switch (visualization.type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={getMainMetric(useCase)} 
              stroke={colors[0]} 
              strokeWidth={2} 
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={getMainMetric(useCase)} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'area':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey={getMainMetric(useCase)} 
              stroke={colors[0]} 
              fill={colors[0]}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
      
    case 'mixed':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="testCount" fill={colors[1]} opacity={0.6} />
            <Line 
              type="monotone" 
              dataKey={getMainMetric(useCase)} 
              stroke={colors[0]} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      );
      
    default:
      return renderChart({ ...config, visualization: { ...visualization, type: 'bar' } }, data);
  }
};

const getMainMetric = (useCase: QAUseCase) => {
  switch (useCase.id) {
    case 'test-execution-performance':
      return 'avgDuration';
    case 'quality-trends-analysis':
      return 'passRate';
    case 'team-productivity-insights':
      return 'testsExecuted';
    default:
      return 'value';
  }
};

export function LivePreview({ config, onNext, onBack }: LivePreviewProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataQuality, setDataQuality] = useState({
    rowCount: 0,
    completeness: 0,
    lastUpdated: new Date(),
    estimatedLoadTime: 0
  });

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timeout = setTimeout(() => {
      const mockData = generateMockData(config);
      setData(mockData);
      setDataQuality({
        rowCount: mockData.length * 15, // Simulate more underlying data
        completeness: 95,
        lastUpdated: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
        estimatedLoadTime: Math.random() * 2000 + 500 // 0.5-2.5 seconds
      });
      setLoading(false);
    }, Math.random() * 1000 + 500);

    return () => clearTimeout(timeout);
  }, [config]);

  const getMetricTitle = () => {
    switch (config.useCase.id) {
      case 'test-execution-performance':
        return 'Average Duration (seconds)';
      case 'quality-trends-analysis':
        return 'Pass Rate (%)';
      case 'team-productivity-insights':
        return 'Tests Executed';
      default:
        return 'Value';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Preview & Customize</h2>
        <p className="text-gray-600">
          Review your chart and make final adjustments before adding to dashboard
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Chart Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-xl">{config.useCase.icon}</div>
                    {config.useCase.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {getMetricTitle()} • {config.scope.label} • {config.groupBy}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{config.visualization.name}</Badge>
                  <Button variant="ghost" size="sm" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Loading your data...</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Analyzing {dataQuality.rowCount} records
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-80">
                  {renderChart(config, data)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Insights Panel */}
          {!loading && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {data.reduce((sum, item) => sum + (item[getMainMetric(config.useCase)] || 0), 0) / data.length || 0}
                    </div>
                    <div className="text-sm text-green-600">Average Value</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {Math.max(...data.map(item => item[getMainMetric(config.useCase)] || 0))}
                    </div>
                    <div className="text-sm text-blue-600">Peak Value</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {data.length}
                    </div>
                    <div className="text-sm text-purple-600">Data Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Configuration Summary & Data Quality */}
        <div className="space-y-4">
          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Use Case:</span>
                  <span className="font-medium text-right">{config.useCase.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time Scope:</span>
                  <span className="font-medium">{config.scope.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Group By:</span>
                  <span className="font-medium">{config.groupBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Chart Type:</span>
                  <span className="font-medium">{config.visualization.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Complexity:</span>
                  <Badge variant="outline" className="text-xs">
                    {config.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Data Completeness</span>
                </div>
                <span className="font-medium">{dataQuality.completeness}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Records Analyzed</span>
                </div>
                <span className="font-medium">{dataQuality.rowCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Last Updated</span>
                </div>
                <span className="font-medium text-xs">
                  {Math.floor((Date.now() - dataQuality.lastUpdated.getTime()) / 60000)}m ago
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Load Time</span>
                </div>
                <span className="font-medium">
                  {(dataQuality.estimatedLoadTime / 1000).toFixed(1)}s
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full" size="sm" disabled>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full" size="sm" disabled>
                  <Activity className="h-4 w-4 mr-2" />
                  Schedule Updates
                </Button>
                <Button variant="outline" className="w-full" size="sm" disabled>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Set Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Configuration
        </Button>
        
        <Button onClick={onNext} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Add to Dashboard
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}