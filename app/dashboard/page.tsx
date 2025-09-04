'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart3, TrendingUp, Users, Bug } from 'lucide-react';
import { DashboardWidget } from '@/lib/types';
import { AddWidgetModal } from './components/add-widget-modal';

// Mock existing dashboard widgets
const mockWidgets: DashboardWidget[] = [
  {
    id: '1',
    title: 'Test Execution Trends',
    description: 'Daily test execution volume and pass rates',
    type: 'prebuilt',
    chart_type: 'line',
    size: 'large',
    position: { x: 0, y: 0, w: 8, h: 4 },
    data: {},
    config: {},
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-20'),
  },
  {
    id: '2', 
    title: 'Sprint 7 Quality Overview',
    description: 'Current sprint test results and quality metrics',
    type: 'prebuilt',
    chart_type: 'bar',
    size: 'medium',
    position: { x: 8, y: 0, w: 4, h: 4 },
    data: {},
    config: {},
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Team Performance',
    description: 'Individual team member productivity metrics',
    type: 'custom',
    chart_type: 'bubble',
    size: 'medium',
    position: { x: 0, y: 4, w: 6, h: 3 },
    data: {},
    config: {},
    created_at: new Date('2024-01-12'),
    updated_at: new Date('2024-01-19'),
  },
  {
    id: '4',
    title: 'Bug Discovery Rate',
    description: 'Defects found vs resolved over time',
    type: 'prebuilt',
    chart_type: 'area',
    size: 'medium',
    position: { x: 6, y: 4, w: 6, h: 3 },
    data: {},
    config: {},
    created_at: new Date('2024-01-08'),
    updated_at: new Date('2024-01-22'),
  },
];

const getWidgetIcon = (chartType: string) => {
  switch (chartType) {
    case 'line':
      return <TrendingUp className="h-8 w-8 text-blue-600" />;
    case 'bar':
      return <BarChart3 className="h-8 w-8 text-green-600" />;
    case 'bubble':
      return <Users className="h-8 w-8 text-purple-600" />;
    case 'area':
      return <Bug className="h-8 w-8 text-red-600" />;
    default:
      return <BarChart3 className="h-8 w-8 text-gray-600" />;
  }
};

export default function ProjectDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(mockWidgets);
  const [showAddWidget, setShowAddWidget] = useState(false);

  const addWidget = (widget: DashboardWidget) => {
    setWidgets(prev => [...prev, widget]);
    setShowAddWidget(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Mobile App Project</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Sprint 7 • Release 2.1 • Last updated: 5 minutes ago
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="flex gap-2 sm:gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  98 tests passing
                </Badge>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  2 tests failing
                </Badge>
              </div>
              
              <Button onClick={() => setShowAddWidget(true)} size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {widgets.map((widget) => (
            <Card 
              key={widget.id} 
              className={`${
                widget.size === 'large' ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' :
                widget.size === 'medium' ? 'sm:col-span-1 lg:col-span-2 xl:col-span-2' :
                'sm:col-span-1'
              } hover:shadow-md transition-shadow duration-200`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {getWidgetIcon(widget.chart_type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate">{widget.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1 line-clamp-2">
                        {widget.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start">
                    <Badge 
                      variant={widget.type === 'prebuilt' ? 'secondary' : 'outline'}
                      className="text-xs flex-shrink-0"
                    >
                      {widget.type === 'prebuilt' ? 'Template' : 'Custom'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Placeholder chart area */}
                <div className={`${
                  widget.size === 'large' ? 'h-48 sm:h-64' :
                  widget.size === 'medium' ? 'h-40 sm:h-48' :
                  'h-32'
                } bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
                  <div className="text-center px-4">
                    <div className="mb-2">
                      {getWidgetIcon(widget.chart_type)}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      {widget.chart_type.charAt(0).toUpperCase() + widget.chart_type.slice(1)} Chart
                    </p>
                    <p className="text-xs text-gray-500">
                      Mock data visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Widget Placeholder */}
          <Card 
            className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => setShowAddWidget(true)}
          >
            <CardContent className="h-40 sm:h-48 flex items-center justify-center p-4">
              <div className="text-center">
                <Plus className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Add New Widget</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Choose from templates or create custom
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Widget Modal */}
      <AddWidgetModal 
        open={showAddWidget}
        onOpenChange={setShowAddWidget}
        onAddWidget={addWidget}
      />
    </div>
  );
}