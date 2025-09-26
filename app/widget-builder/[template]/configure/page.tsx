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

export default function TemplateConfiguration() {
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

  useEffect(() => {
    const foundTemplate = TEMPLATE_CONFIGS.find(t => t.id === templateId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
      initializeTemplate(foundTemplate);
    } else {
      // Template not found, redirect to gallery
      router.push('/widget-builder');
    }
  }, [templateId, initializeTemplate, router]);

  const handleBackToGallery = () => {
    router.push('/widget-builder');
  };

  const handleSwitchToAdvanced = () => {
    // Bridge to chart builder with template context
    router.push('/chart-builder?fromTemplate=' + templateId);
  };

  const handleSaveWidget = () => {
    // Save widget to dashboard and redirect
    // This will be implemented when we connect to the dashboard system
    console.log('Saving widget with configuration:', {
      template,
      scope: scopeSelection,
      level: configurationLevel
    });
    router.push('/dashboard');
  };

  if (!template) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToGallery}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div className="flex items-center gap-3">
                <div className="text-2xl">{template.icon}</div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSwitchToAdvanced}>
                <Settings2 className="h-4 w-4 mr-2" />
                Switch to Advanced
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <StepIndicator currentStep={2} />
        </div>
      </div>

      {/* Main Configuration */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 2: Scope Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Scope
              </h2>
              <ScopeSelector 
                template={template}
                value={scopeSelection}
                onChange={setScopeSelection}
              />
            </div>

            {/* Step 3: Basic Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configure Metrics
              </h2>
              <BasicConfiguration 
                template={template}
                level={configurationLevel}
                selectedScope={scopeSelection}
              />
              
              {/* Progressive Disclosure */}
              {configurationLevel < 3 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center mb-4">
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
                  <div className="mt-3 text-center text-xs text-gray-500">
                    Level {configurationLevel} → {configurationLevel + 1} of 3 
                    {configurationLevel === 1 && ' • Enhanced filtering • Advanced metrics • Comparative analysis'}
                    {configurationLevel === 2 && ' • Custom calculations • Expert controls • Full customization'}
                  </div>
                </div>
              )}

              {/* Advanced Options (Level 2+) - Integrated with Basic Configuration */}
              {configurationLevel >= 2 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Enhanced Configuration
                    <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                      Level {configurationLevel}
                    </Badge>
                  </h2>
                  <AdvancedOptions 
                    template={template}
                    level={configurationLevel}
                  />
                </div>
              )}
            </div>

            {/* Save Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBackToGallery}>
                ← Back to Templates
              </Button>
              <Button onClick={handleSaveWidget} size="lg">
                Save to Dashboard
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Preview
              </h3>
              <TemplatePreview 
                template={template}
                scope={scopeSelection}
                level={configurationLevel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}