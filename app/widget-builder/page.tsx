'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TemplateGallery } from './components/template-gallery';
import { StepIndicator } from './components/step-indicator';
import { TEMPLATE_CONFIGS } from '@/lib/templates/template-configs';
import { TemplateConfig } from '@/lib/types';

export default function WidgetBuilder() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTemplateSelect = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    // Navigate to template configuration
    router.push(`/widget-builder/${template.id}/configure`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <StepIndicator currentStep={1} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create Custom Analytics Widget
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from optimized templates designed around your testing workflow. 
            Each template is powered by our strategic datasets and supports flexible scope selection.
          </p>
        </div>

        <TemplateGallery 
          templates={TEMPLATE_CONFIGS}
          onSelectTemplate={handleTemplateSelect}
          selectedTemplate={selectedTemplate}
        />

        <div className="flex justify-center mt-8">
          <Button 
            size="lg"
            disabled={!selectedTemplate}
            onClick={() => selectedTemplate && handleTemplateSelect(selectedTemplate)}
          >
            Continue to Scope Selection →
          </Button>
        </div>
      </div>
    </div>
  );
}