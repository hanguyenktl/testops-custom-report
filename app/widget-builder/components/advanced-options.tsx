'use client';

import { useState } from 'react';
import { TemplateConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Settings, Zap } from 'lucide-react';
import { useTemplateStore } from '@/lib/stores/template-store';

interface AdvancedOptionsProps {
  template: TemplateConfig;
  level: 1 | 2 | 3;
}

export function AdvancedOptions({ template, level }: AdvancedOptionsProps) {
  const { selectedOptions, setOption } = useTemplateStore();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleMultiSelectChange = (optionId: string, value: string, checked: boolean) => {
    const currentValues = (selectedOptions[optionId] as string[]) || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    setOption(optionId, newValues);
  };

  const level2Options = template.level2Options || [];
  const level3Options = template.level3Options || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">
          Advanced Options
        </h3>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          Level {level}
        </Badge>
      </div>

      {/* Level 2: Enhanced Configuration */}
      {level >= 2 && level2Options.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Enhanced Configuration
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                Level 2
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {level2Options.map((option) => (
              <Collapsible key={option.id}>
                <CollapsibleTrigger 
                  className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
                  onClick={() => toggleSection(option.id)}
                >
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-600">{option.description}</div>
                    )}
                  </div>
                  {expandedSections.includes(option.id) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pt-3">
                  {Array.isArray(option.options) ? (
                    <div className="space-y-2">
                      {option.options.map((optionValue) => (
                        <div key={optionValue} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${option.id}-${optionValue}`}
                            checked={(selectedOptions[option.id] as string[])?.includes(optionValue) || false}
                            onCheckedChange={(checked) => 
                              handleMultiSelectChange(option.id, optionValue, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`${option.id}-${optionValue}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {optionValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Select
                      value={selectedOptions[option.id] as string || ''}
                      onValueChange={(value) => setOption(option.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${option.label.toLowerCase()}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto_generated">Auto-generated options</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Level 3: Power User Features */}
      {level >= 3 && level3Options && level3Options.length > 0 && (
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
              ⚡ Power User Features
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                Level 3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {level3Options.map((option) => (
              <div key={option.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {option.label}
                </label>
                
                {Array.isArray(option.options) ? (
                  <Select
                    value={selectedOptions[option.id] as string || option.defaultValue || ''}
                    onValueChange={(value) => setOption(option.id, value)}
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
                    Advanced {option.type} configuration available
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-800">
                <strong>Template Modification Mode:</strong> You can now modify this template's core structure and save it as a new template for your team.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template-to-Chart-Builder Bridge */}
      {level >= 2 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-blue-900">Need More Control?</div>
                <div className="text-xs text-blue-700">
                  Switch to the advanced chart builder with your current configuration
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                Switch to Advanced Builder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Configuration Summary</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Level {level} configuration active</div>
            <div>• {Object.keys(selectedOptions).length} options configured</div>
            <div>• {level >= 2 ? 'Enhanced' : 'Basic'} filtering enabled</div>
            <div>• Smart defaults: {template.autoConfig.preFilters?.length || 0} pre-filters applied</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}