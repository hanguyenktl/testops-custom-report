'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Layout, 
  Users, 
  Eye, 
  EyeOff, 
  Settings,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { QAUseCase } from '@/lib/types';

interface SaveToDashboardProps {
  useCase: QAUseCase;
  config: any;
  onComplete: () => void;
  onBack: () => void;
}

// Mock dashboard options
const DASHBOARDS = [
  { id: 'main', name: 'Main QA Dashboard', description: 'Primary dashboard for QA metrics', widgets: 8 },
  { id: 'team', name: 'Team Performance', description: 'Team-specific metrics and KPIs', widgets: 6 },
  { id: 'release', name: 'Release Readiness', description: 'Release planning and coverage', widgets: 4 },
  { id: 'executive', name: 'Executive Summary', description: 'High-level insights for leadership', widgets: 3 },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'All team members can view' },
  { value: 'team', label: 'Team Only', description: 'Only QA team members' },
  { value: 'private', label: 'Private', description: 'Only you can view' },
];

const REFRESH_INTERVALS = [
  { value: '5m', label: '5 minutes', description: 'Real-time updates' },
  { value: '15m', label: '15 minutes', description: 'Frequent updates' },
  { value: '1h', label: '1 hour', description: 'Standard refresh' },
  { value: '4h', label: '4 hours', description: 'Less frequent' },
  { value: 'manual', label: 'Manual only', description: 'Update on demand' },
];

export function SaveToDashboard({ useCase, config, onComplete, onBack }: SaveToDashboardProps) {
  const [step, setStep] = useState<'configure' | 'saving' | 'success'>('configure');
  const [widgetName, setWidgetName] = useState(`${useCase.title} - ${new Date().toLocaleDateString()}`);
  const [description, setDescription] = useState('');
  const [selectedDashboard, setSelectedDashboard] = useState('main');
  const [visibility, setVisibility] = useState('public');
  const [refreshInterval, setRefreshInterval] = useState('15m');
  const [enableAlerts, setEnableAlerts] = useState(true);

  const handleSave = async () => {
    setStep('saving');
    
    // Simulate save process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep('success');
  };

  if (step === 'saving') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Creating Your Widget</h2>
        <p className="text-gray-600 mb-2">Setting up data connections...</p>
        <p className="text-sm text-gray-500">This usually takes a few seconds</p>
      </div>
    );
  }

  if (step === 'success') {
    const selectedDash = DASHBOARDS.find(d => d.id === selectedDashboard);
    
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">Widget Created Successfully!</h2>
        <p className="text-gray-600 mb-8">
          &quot;<strong>{widgetName}</strong>&quot; has been added to your <strong>{selectedDash?.name}</strong> dashboard.
        </p>
        
        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Refresh Rate</div>
                <div className="text-xs text-gray-600">{REFRESH_INTERVALS.find(r => r.value === refreshInterval)?.label}</div>
              </div>
              <div>
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Visibility</div>
                <div className="text-xs text-gray-600">{VISIBILITY_OPTIONS.find(v => v.value === visibility)?.label}</div>
              </div>
              <div>
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Alerts</div>
                <div className="text-xs text-gray-600">{enableAlerts ? 'Enabled' : 'Disabled'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.open('/dashboard', '_blank')}>
            View Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button onClick={onComplete}>
            Create Another Widget
            <Zap className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="text-3xl">{useCase.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">Save to Dashboard</h2>
            <p className="text-gray-600">Configure widget settings and choose dashboard placement</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Widget Details
              </CardTitle>
              <CardDescription>
                Name and describe your widget for easy identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="widget-name">Widget Name *</Label>
                <Input 
                  id="widget-name"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder="Enter a descriptive name for your widget"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="widget-description">Description (Optional)</Label>
                <Textarea 
                  id="widget-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add context about what this widget shows and why it's useful"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Placement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-green-600" />
                Dashboard Placement
              </CardTitle>
              <CardDescription>
                Choose which dashboard will display this widget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DASHBOARDS.map((dashboard) => (
                  <button
                    key={dashboard.id}
                    onClick={() => setSelectedDashboard(dashboard.id)}
                    className={`p-4 text-left border rounded-lg transition-all ${
                      selectedDashboard === dashboard.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{dashboard.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{dashboard.description}</div>
                    <div className="text-xs text-gray-500 mt-2">{dashboard.widgets} widgets</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access & Behavior Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Access & Behavior
              </CardTitle>
              <CardDescription>
                Control who can see this widget and how it updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-600">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="refresh">Data Refresh Rate</Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REFRESH_INTERVALS.map((interval) => (
                      <SelectItem key={interval.value} value={interval.value}>
                        <div>
                          <div className="font-medium">{interval.label}</div>
                          <div className="text-xs text-gray-600">{interval.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="alerts" className="text-sm font-medium">Enable Smart Alerts</Label>
                  <p className="text-xs text-gray-600 mt-1">Get notified when metrics exceed thresholds</p>
                </div>
                <button
                  onClick={() => setEnableAlerts(!enableAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Widget Preview
              </CardTitle>
              <CardDescription>
                How your widget will appear
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Widget Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{widgetName || 'Untitled Widget'}</h4>
                    {description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
                    )}
                  </div>
                  {visibility === 'private' && <EyeOff className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                </div>
                
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{useCase.icon}</div>
                    <div className="text-xs text-gray-600">Chart Preview</div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Updated: Live</span>
                  <Badge variant="outline" className="text-xs">
                    {refreshInterval === 'manual' ? 'Manual' : `${refreshInterval} refresh`}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Configuration Summary */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Configuration Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dashboard:</span>
                    <span className="font-medium">{DASHBOARDS.find(d => d.id === selectedDashboard)?.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Use Case:</span>
                    <span className="font-medium">{useCase.title}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scope:</span>
                    <span className="font-medium">{config?.scope?.label || 'Default'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complexity:</span>
                    <Badge variant="outline" className="text-xs">
                      {config?.level || 'basic'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Preview
        </Button>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleSave}
            disabled={!widgetName.trim()}
            className="min-w-[140px]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Widget
          </Button>
        </div>
      </div>
    </div>
  );
}