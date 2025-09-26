'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { StepIndicator } from '../../components/step-indicator';
import { ScopeSelector } from '../../components/scope-selector';
import { BasicConfiguration } from '../../components/basic-configuration';
import { AdvancedOptions } from '../../components/advanced-options';
import { TemplatePreview } from '../../components/template-preview';
import { TEMPLATE_CONFIGS } from '@/lib/templates/template-configs';
import { TemplateConfig, ScopeSelection } from '@/lib/types';
import { useTemplateStore } from '@/lib/stores/template-store';

export default function TemplateConfigurationClient() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.template as string;
  
  const {
    selectedTemplate,
    scopeSelection,
    configurationLevel,
    initializeTemplate,
    setScopeSelection,
    setConfigurationLevel
  } = useTemplateStore();
  const [template, setTemplate] = useState<TemplateConfig | null>(null);

  // Initialize template when component mounts or templateId changes
  useEffect(() => {
    const foundTemplate = TEMPLATE_CONFIGS.find(t => t.id === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
      initializeTemplate(foundTemplate);
    }
  }, [templateId, initializeTemplate]);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template configuration...</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    router.push('/widget-builder');
  };

  const handleScopeChange = (scope: ScopeSelection) => {
    setScopeSelection(scope);
  };

  const isReadyForNextStep = selectedTemplate && scopeSelection;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {template.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Configure your analysis parameters
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {template.businessValue}
              </Badge>
              <Badge variant="outline">
                Level {configurationLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scope Selection */}
            <ScopeSelector 
              template={template}
              value={scopeSelection}
              onChange={handleScopeChange}
            />

            {/* Basic Configuration */}
            {isReadyForNextStep && (
              <BasicConfiguration 
                template={template}
                level={configurationLevel}
                selectedScope={scopeSelection}
              />
            )}

            {/* Progressive Disclosure - Enhanced Configuration */}
            {isReadyForNextStep && configurationLevel < 3 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Ready for more control?
                    </div>
                    <div className="text-xs text-gray-600">
                      {configurationLevel === 1 && 'Unlock enhanced filtering and advanced metrics'}
                      {configurationLevel === 2 && 'Access power user features and custom configurations'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setConfigurationLevel(Math.min(configurationLevel + 1, 3) as 1 | 2 | 3)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-dashed border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                  >
                    <span>🎛️</span>
                    <span>
                      {configurationLevel === 1 && 'Show Enhanced Options (Level 2)'}
                      {configurationLevel === 2 && 'Show Power User Options (Level 3)'}
                    </span>
                    <span>→</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Advanced Options */}
            {isReadyForNextStep && configurationLevel > 1 && (
              <AdvancedOptions 
                template={template}
                level={configurationLevel}
              />
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                disabled={!isReadyForNextStep}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Generate Analysis
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <TemplatePreview 
              template={template}
              scope={scopeSelection}
              level={configurationLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}