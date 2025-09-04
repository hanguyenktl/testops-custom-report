import { useState } from 'react';
import { TemplateConfig, ScopeSelection } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Calendar, Zap } from 'lucide-react';

interface ScopeSelectorProps {
  template: TemplateConfig;
  value: ScopeSelection | null;
  onChange: (scope: ScopeSelection) => void;
}

const scopeOptions = {
  time: [
    { value: 'last_7_days', label: 'Last 7 days' },
    { value: 'last_30_days', label: 'Last 30 days' },
    { value: 'last_3_months', label: 'Last 3 months' },
    { value: 'custom', label: 'Custom range' }
  ],
  sprint: [
    { value: 'current_sprint', label: 'Current Sprint' },
    { value: 'last_sprint', label: 'Last Sprint' },
    { value: 'sprint_7', label: 'Sprint 7' },
    { value: 'sprint_6', label: 'Sprint 6' }
  ],
  release: [
    { value: 'current_release', label: 'Current Release' },
    { value: 'release_2_1', label: 'Release 2.1' },
    { value: 'release_2_0', label: 'Release 2.0' },
    { value: 'last_release', label: 'Last Release' }
  ]
};

const scopeIcons = {
  time: CalendarDays,
  sprint: Zap,
  release: Calendar
};

const scopeDescriptions = {
  time: 'Analyze trends over time periods for operational insights',
  sprint: 'Focus on iteration-specific metrics for sprint reviews',
  release: 'Assess readiness and quality for release planning'
};

export function ScopeSelector({ template, value, onChange }: ScopeSelectorProps) {
  const [selectedScopeType, setSelectedScopeType] = useState<'time' | 'sprint' | 'release'>(
    value?.type || template.optimalScope[0]
  );

  const handleScopeTypeChange = (scopeType: 'time' | 'sprint' | 'release') => {
    setSelectedScopeType(scopeType);
    
    // Set default value for the new scope type
    const defaultOption = scopeOptions[scopeType][0];
    const newScope: ScopeSelection = {
      type: scopeType,
      value: defaultOption.value,
      label: defaultOption.label
    };
    onChange(newScope);
  };

  const handleScopeValueChange = (value: string) => {
    const selectedOption = scopeOptions[selectedScopeType].find(opt => opt.value === value);
    if (selectedOption) {
      const newScope: ScopeSelection = {
        type: selectedScopeType,
        value: selectedOption.value,
        label: selectedOption.label
      };
      onChange(newScope);
    }
  };

  return (
    <div className="space-y-4">
      {/* Scope Type Selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Analysis Scope</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {template.supportedScopes.map((scopeType) => {
            const Icon = scopeIcons[scopeType];
            const isOptimal = template.optimalScope.includes(scopeType);
            const isSelected = selectedScopeType === scopeType;
            
            return (
              <div
                key={scopeType}
                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => handleScopeTypeChange(scopeType)}
              >
                {isOptimal && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5"
                  >
                    Optimal
                  </Badge>
                )}
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <Icon className="h-6 w-6 text-gray-600" />
                  <div className="font-medium capitalize text-gray-900">{scopeType}</div>
                  <div className="text-xs text-gray-600 leading-tight">
                    {scopeDescriptions[scopeType]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scope Value Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Select {selectedScopeType === 'time' ? 'Time Period' : 
                   selectedScopeType === 'sprint' ? 'Sprint' : 'Release'}
        </h4>
        <Select 
          value={value?.value || scopeOptions[selectedScopeType][0].value}
          onValueChange={handleScopeValueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${selectedScopeType}...`} />
          </SelectTrigger>
          <SelectContent>
            {scopeOptions[selectedScopeType].map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Scope Context */}
      {value && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <span className="font-medium">Selected:</span>
              <span>{value.label}</span>
            </div>
            {template.optimalScope.includes(value.type) && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Recommended
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}