import { TemplateConfig, ScopeSelection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface TemplatePreviewProps {
  template: TemplateConfig;
  scope: ScopeSelection | null;
  level: 1 | 2 | 3;
}

// Mock data generators for different template types
const generateMockData = (template: TemplateConfig, scope: ScopeSelection | null) => {
  const baseData = [];
  const dataPoints = scope?.type === 'time' ? 30 : scope?.type === 'sprint' ? 14 : 10;
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (dataPoints - i));
    
    switch (template.id) {
      case 'execution_performance':
        baseData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          manual: Math.floor(Math.random() * 300) + 100,
          automated: Math.floor(Math.random() * 100) + 20,
          passRate: Math.floor(Math.random() * 20) + 75
        });
        break;
        
      case 'quality_trends':
        baseData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          passed: Math.floor(Math.random() * 80) + 60,
          failed: Math.floor(Math.random() * 15) + 5,
          error: Math.floor(Math.random() * 5) + 1,
          passRate: Math.floor(Math.random() * 15) + 80
        });
        break;
        
      case 'coverage_readiness':
        baseData.push({
          name: `Component ${i + 1}`,
          coverage: Math.floor(Math.random() * 30) + 65,
          tested: Math.floor(Math.random() * 20) + 70,
          passing: Math.floor(Math.random() * 25) + 60
        });
        break;
        
      case 'defect_intelligence':
        baseData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          created: Math.floor(Math.random() * 10) + 2,
          resolved: Math.floor(Math.random() * 8) + 1,
          critical: Math.floor(Math.random() * 3) + 0
        });
        break;
        
      default:
        baseData.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.floor(Math.random() * 100) + 50,
          trend: Math.floor(Math.random() * 20) + 70
        });
    }
  }
  
  return baseData;
};

const renderChart = (template: TemplateConfig, data: any[]) => {
  switch (template.chartType) {
    case 'mixed_timeseries':
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="manual" stroke="#8884d8" name="Manual Tests" />
            <Line type="monotone" dataKey="automated" stroke="#82ca9d" name="Automated Tests" />
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'stacked_bar_with_line':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="passed" fill="#10b981" name="Passed" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
            <Bar dataKey="error" fill="#f59e0b" name="Error" />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'progress_bars_with_breakdown':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={12} />
            <YAxis dataKey="name" type="category" fontSize={12} />
            <Tooltip />
            <Bar dataKey="coverage" fill="#3b82f6" name="Coverage %" />
          </BarChart>
        </ResponsiveContainer>
      );
      
    default:
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      );
  }
};

export function TemplatePreview({ template, scope, level }: TemplatePreviewProps) {
  const mockData = generateMockData(template, scope);
  
  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Live Preview</h3>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Level {level}
        </Badge>
      </div>

      {/* Chart Preview */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="text-lg">{template.icon}</div>
            {template.name}
          </CardTitle>
          {scope && (
            <div className="text-xs text-gray-600">
              Scope: {scope.label}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {renderChart(template, mockData)}
        </CardContent>
      </Card>

      {/* Data Quality Indicators */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Data Quality</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Data Freshness</span>
              </div>
              <span className="text-green-600 font-medium">Live</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Records</span>
              </div>
              <span className="text-gray-600">{Math.floor(Math.random() * 5000) + 1000}+</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Expected Load Time</span>
              </div>
              <span className="text-green-600">&lt; 2 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            What you'll see in this widget
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• {template.businessValue} analysis</div>
            <div>• {scope?.label || 'Selected scope'} timeframe</div>
            <div>• Level {level} configuration depth</div>
            <div>• {Array.isArray(template.autoConfig.metrics) 
              ? `${template.autoConfig.metrics.length} key metrics` 
              : 'Advanced calculated metrics'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Estimate */}
      <div className="text-xs text-gray-500 text-center">
        Estimated widget refresh: {template.refreshRate || '5 minutes'} • 
        Complexity: {template.complexity || 'medium'} • 
        Cache TTL: {template.chartType.includes('matrix') ? '1 hour' : '5 minutes'}
      </div>
    </div>
  );
}