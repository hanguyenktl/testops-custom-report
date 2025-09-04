'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Zap,
  BarChart3,
  Users,
  Shield,
  Clock,
  Target
} from 'lucide-react';
import { DashboardWidget, PrebuiltTemplate } from '@/lib/types';

// Prebuilt widget templates based on QA requirements
const PREBUILT_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: 'test-execution-performance',
    title: 'Test Execution Performance',
    description: 'Analyze test duration trends and identify bottlenecks',
    icon: '⚡',
    category: 'performance',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'line',
    default_config: {
      metrics: ['avg_duration', 'test_count'],
      scope: 'last_30_days',
      groupBy: 'daily'
    }
  },
  {
    id: 'quality-trends-analysis',
    title: 'Quality Trends & Pass Rates',
    description: 'Track test success rates and quality patterns over time',
    icon: '📈',
    category: 'quality',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'area',
    default_config: {
      metrics: ['pass_rate', 'total_tests'],
      scope: 'current_sprint',
      groupBy: 'daily'
    }
  },
  {
    id: 'team-productivity-insights',
    title: 'Team Productivity Insights',
    description: 'Compare individual team member performance and velocity',
    icon: '👥',
    category: 'productivity',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'bar',
    default_config: {
      metrics: ['tests_executed', 'avg_duration'],
      scope: 'current_sprint',
      groupBy: 'team_member'
    }
  },
  {
    id: 'defect-discovery-rate',
    title: 'Bug Discovery & Resolution',
    description: 'Track defects found vs resolved with priority breakdown',
    icon: '🐛',
    category: 'quality',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'mixed',
    default_config: {
      metrics: ['bugs_found', 'bugs_resolved'],
      scope: 'last_30_days',
      groupBy: 'weekly'
    }
  },
  {
    id: 'automation-coverage',
    title: 'Automation Coverage',
    description: 'Monitor manual vs automated test distribution and trends',
    icon: '🤖',
    category: 'coverage',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'donut',
    default_config: {
      metrics: ['automation_percentage', 'total_tests'],
      scope: 'current_sprint',
      groupBy: 'test_type'
    }
  },
  {
    id: 'environment-stability',
    title: 'Environment Stability',
    description: 'Compare test results across different environments',
    icon: '🏗️',
    category: 'performance',
    complexity: 'simple',
    estimatedTime: '< 30 seconds',
    chart_type: 'bar',
    default_config: {
      metrics: ['pass_rate', 'avg_duration'],
      scope: 'last_7_days',
      groupBy: 'environment'
    }
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'performance':
      return <Zap className="h-5 w-5 text-yellow-600" />;
    case 'quality':
      return <Shield className="h-5 w-5 text-green-600" />;
    case 'productivity':
      return <Users className="h-5 w-5 text-blue-600" />;
    case 'coverage':
      return <Target className="h-5 w-5 text-purple-600" />;
    default:
      return <BarChart3 className="h-5 w-5 text-gray-600" />;
  }
};

const getComplexityColor = (complexity: string) => {
  switch (complexity) {
    case 'simple':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface AddWidgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widget: DashboardWidget) => void;
}

export function AddWidgetModal({ open, onOpenChange, onAddWidget }: AddWidgetModalProps) {
  const router = useRouter();

  const handleSelectPrebuilt = (template: PrebuiltTemplate) => {
    // Create a new widget from the template
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      title: template.title,
      description: template.description,
      type: 'prebuilt',
      chart_type: template.chart_type,
      size: 'medium',
      position: { x: 0, y: 0, w: 6, h: 4 }, // Will be positioned automatically
      data: template.preview_data || {},
      config: template.default_config,
      created_at: new Date(),
      updated_at: new Date(),
    };

    onAddWidget(newWidget);
    onOpenChange(false);
  };

  const handleCreateCustom = () => {
    onOpenChange(false);
    router.push('/chart-builder');
  };

  const handleQuickTemplates = () => {
    onOpenChange(false);
    router.push('/widget-builder');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Widget to Dashboard</DialogTitle>
        </DialogHeader>

        {/* Dual Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Quick Templates Path */}
          <Card 
            className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-500 hover:-translate-y-1 border-2 flex flex-col"
            onClick={handleQuickTemplates}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">⚡</div>
              <CardTitle className="text-xl">Quick Templates</CardTitle>
              <CardDescription className="text-sm">
                Get started in 60 seconds with business-focused templates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                  <div className="font-medium">Perfect for 90% of users</div>
                  <div className="text-xs mt-1">Template → Scope → Configure → Save</div>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1 flex-1">
                  <div>• 8 business-focused templates</div>
                  <div>• Progressive disclosure (Level 1-3)</div>
                  <div>• Smart defaults and scope recommendations</div>
                  <div>• Instant success with minimal configuration</div>
                </div>
                
                <Button className="w-full mt-auto" size="lg">
                  Browse Templates →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Builder Path */}
          <Card 
            className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-purple-500 hover:-translate-y-1 border-2 flex flex-col"
            onClick={handleCreateCustom}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">🔧</div>
              <CardTitle className="text-xl">Custom Builder</CardTitle>
              <CardDescription className="text-sm">
                Full control with dataset-first drag-and-drop interface
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center flex-1 flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
                  <div className="font-medium">For power users</div>
                  <div className="text-xs mt-1">Dataset → Explore → Build → Configure</div>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1 flex-1">
                  <div>• Explore all available datasets</div>
                  <div>• Drag-and-drop field configuration</div>
                  <div>• Advanced filtering and grouping</div>
                  <div>• Full Superset power with business UI</div>
                </div>
                
                <Button variant="outline" className="w-full mt-auto" size="lg">
                  Start Building →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legacy Quick Add Templates */}
        <div className="border-t pt-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Or add a pre-built widget instantly</h3>
            <p className="text-sm text-gray-600">
              Click to add these popular widgets directly to your dashboard (no configuration needed).
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREBUILT_TEMPLATES.slice(0, 6).map((template) => (
              <Card
                key={template.id}
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-blue-400 hover:scale-105 flex flex-col"
                onClick={() => handleSelectPrebuilt(template)}
              >
                <CardContent className="p-4 text-center flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <div className="text-2xl mb-3">{template.icon}</div>
                    <div className="font-medium text-sm mb-2">{template.title}</div>
                    <div className="text-xs text-gray-600 mb-4 line-clamp-2 flex-1">
                      {template.description}
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-auto">
                      Add Widget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}