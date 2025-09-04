import { TemplateConfig, ScopeSelection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTemplateStore } from '@/lib/stores/template-store';

interface BasicConfigurationProps {
  template: TemplateConfig;
  level: 1 | 2 | 3;
  selectedScope?: ScopeSelection | null;
}

// Scope-aware and template-specific preset options
const getPresetOptions = (template: TemplateConfig, selectedScope?: ScopeSelection | null) => {
  // Define scope-specific presets
  const scopePresets = {
    time: {
      'Last 7 Days': {
        description: 'Recent week performance',
        icon: '📅'
      },
      'Last 30 Days': {
        description: 'Recent month trends',
        icon: '📈'
      },
      'Last 3 Months': {
        description: 'Quarterly analysis',
        icon: '📊'
      }
    },
    sprint: {
      'Current Sprint': {
        description: 'Active sprint analysis',
        icon: '⚡'
      },
      'Last Sprint': {
        description: 'Previous sprint comparison',
        icon: '🔄'
      },
      'Sprint Comparison': {
        description: 'Multi-sprint trends',
        icon: '📊'
      }
    },
    release: {
      'Current Release': {
        description: 'Active release metrics',
        icon: '🎯'
      },
      'Release Readiness': {
        description: 'Quality gate assessment',
        icon: '✅'
      },
      'Release Comparison': {
        description: 'Cross-release analysis',
        icon: '🔄'
      }
    }
  };

  // Get base presets for selected scope, or default to time-based
  const basePresets = selectedScope ? scopePresets[selectedScope.type] : scopePresets.time;

  // Add template-specific presets within the selected scope
  if (template.id === 'execution_performance' && selectedScope?.type === 'time') {
    return {
      ...basePresets,
      'Peak Hours Analysis': {
        description: 'Focus on high-usage periods',
        icon: '🕐'
      }
    };
  }
  
  if (template.id === 'operational_health' && selectedScope?.type === 'time') {
    return {
      'Real-time Monitoring': {
        description: 'Current system health status',
        icon: '📊'
      },
      'Last 24 Hours': {
        description: 'Recent infrastructure trends',
        icon: '📈'
      },
      'Peak Usage Analysis': {
        description: 'Identify resource bottlenecks',
        icon: '⚡'
      }
    };
  }

  return basePresets;
};

export function BasicConfiguration({ template, level, selectedScope }: BasicConfigurationProps) {
  const { selectedOptions, setOption, configurationLevel, setConfigurationLevel } = useTemplateStore();
  const presetOptions = getPresetOptions(template, selectedScope);

  const handleOptionChange = (optionId: string, value: string) => {
    setOption(optionId, value);
  };


  const handlePresetSelect = (preset: string) => {
    // Apply template-specific preset configuration
    template.level1Options.forEach(option => {
      if (option.type === 'filter') {
        let presetValue = '';
        
        // Template-specific preset logic
        if (template.id === 'execution_performance') {
          if (preset === 'Peak Hours Analysis' && option.id === 'test_type_filter') {
            presetValue = 'automated_only';
          } else if (option.defaultValue) {
            presetValue = option.defaultValue;
          }
        } else if (template.id === 'coverage_readiness') {
          if (preset === 'Current Release' && option.id === 'priority_filter') {
            presetValue = 'high_priority_only';
          } else if (option.defaultValue) {
            presetValue = option.defaultValue;
          }
        } else if (option.defaultValue) {
          presetValue = option.defaultValue;
        }
        
        if (presetValue) {
          setOption(option.id, presetValue);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Quick Start Presets
          </h3>
          {selectedScope && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {selectedScope.type === 'time' && '📅 Time-based'}
              {selectedScope.type === 'sprint' && '⚡ Sprint-based'} 
              {selectedScope.type === 'release' && '🎯 Release-based'}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(presetOptions).map(([preset, config]) => (
            <div
              key={preset}
              className="cursor-pointer border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              onClick={() => handlePresetSelect(preset)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-2xl">{config.icon}</div>
                <div className="font-medium text-sm text-gray-900">{preset}</div>
                <div className="text-xs text-gray-600">
                  {config.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedScope && (
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              <span>
                Presets are tailored for your selected <strong>{selectedScope.type}</strong> scope ({selectedScope.label}).
                Each preset applies relevant filters within this timeframe.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Template-Specific Essential Filters (Max 3, exclude scope-related) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Essential Filters
          <Badge variant="secondary" className="ml-2 text-xs">Level 1</Badge>
        </h3>
        
        <div className="space-y-4">
          {template.level1Options
            .filter(option => option.type !== 'scope') // Remove scope duplication
            .slice(0, 3)
            .map((option) => (
            <div key={option.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {option.label}
                {option.defaultValue && (
                  <span className="text-gray-500 text-xs ml-1">(recommended)</span>
                )}
              </label>
              
              {Array.isArray(option.options) ? (
                <Select
                  value={selectedOptions[option.id] as string || option.defaultValue || ''}
                  onValueChange={(value) => handleOptionChange(option.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${option.label.toLowerCase()}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.options.map((optionValue) => (
                      <SelectItem key={optionValue} value={optionValue}>
                        {optionValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                  {option.options === 'auto_populated_from_user_access' && 'Current Project'}
                  {option.options === 'auto_populated_from_sprints' && 'Current Sprint'}
                  {option.options === 'auto_populated_from_releases' && 'Active Release'}
                  {option.options === 'auto_populated_from_teams' && 'Current Team'}
                </div>
              )}
              
              {option.description && (
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
              )}
            </div>
          ))}
          
          {/* Show message if no non-scope filters available */}
          {template.level1Options.filter(option => option.type !== 'scope').length === 0 && (
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">✨</span>
                <span>This template uses smart defaults - no additional filtering needed for Level 1!</span>
              </div>
              <div className="text-xs mt-1 text-yellow-700">
                Use "Show More Options" below to access advanced filtering capabilities.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Defaults Applied */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">
          ✨ Smart Defaults Applied
        </h4>
        <div className="text-sm text-green-800 space-y-1">
          <div>• Chart Type: {template.chartType.replace('_', ' ')}</div>
          <div>• Dataset: {template.dataset.replace('_', ' ').replace('dataset', 'data')}</div>
          <div>• Metrics: {
            Array.isArray(template.autoConfig.metrics) 
              ? template.autoConfig.metrics.join(', ')
              : 'Performance optimized calculations'
          }</div>
          <div>• Filters: Only published test cases included</div>
        </div>
      </div>

      {/* Business Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          What this template shows you
        </h4>
        <p className="text-sm text-blue-800 italic mb-3">
          "{template.exampleQuery}"
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white text-blue-700 border-blue-300 text-xs">
            {template.businessValue}
          </Badge>
          <Badge variant="outline" className="bg-white text-blue-700 border-blue-300 text-xs">
            {template.persona.join(' & ')}
          </Badge>
        </div>
      </div>


      {/* Level Progression Indicator */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${level >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-2 h-2 rounded-full ${level >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-2 h-2 rounded-full ${level >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>
        <div className="text-center text-sm text-gray-700 font-medium">
          Configuration Level: {level}/3
        </div>
        <div className="text-center text-xs text-gray-500 mt-1">
          {level === 1 && '✨ Essential settings - Perfect for quick setup'}
          {level === 2 && '⚙️ Enhanced customization - Advanced filtering & metrics active'}
          {level === 3 && '🔧 Power user mode - Full control & custom configurations'}
        </div>
      </div>
    </div>
  );
}