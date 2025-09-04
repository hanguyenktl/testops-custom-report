import { TemplateConfig } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TemplateGalleryProps {
  templates: TemplateConfig[];
  onSelectTemplate: (template: TemplateConfig) => void;
  selectedTemplate: TemplateConfig | null;
}

const datasetColors = {
  'test_execution_dataset': 'bg-blue-100 text-blue-800',
  'requirement_coverage_dataset': 'bg-green-100 text-green-800', 
  'defect_analysis_dataset': 'bg-yellow-100 text-yellow-800',
  'test_case_management_dataset': 'bg-purple-100 text-purple-800'
};

const datasetLabels = {
  'test_execution_dataset': 'Execution',
  'requirement_coverage_dataset': 'Coverage',
  'defect_analysis_dataset': 'Defect',
  'test_case_management_dataset': 'Test Case'
};

export function TemplateGallery({ templates, onSelectTemplate, selectedTemplate }: TemplateGalleryProps) {
  return (
    <div>
      {/* Dataset Legend */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Test Execution Dataset</span>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Requirement Coverage Dataset</span>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Defect Analysis Dataset</span>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Test Case Management Dataset</span>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 ${
              selectedTemplate?.id === template.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="relative">
              {/* Business Value Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {template.businessValue}
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-3xl">{template.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      datasetColors[template.dataset as keyof typeof datasetColors]
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 inline-block ${
                        template.dataset === 'test_execution_dataset' ? 'bg-blue-500' :
                        template.dataset === 'requirement_coverage_dataset' ? 'bg-green-500' :
                        template.dataset === 'defect_analysis_dataset' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`}></div>
                      {datasetLabels[template.dataset as keyof typeof datasetLabels]}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="text-gray-600 leading-relaxed">
                {template.description}
              </CardDescription>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-3 border-l-3 border-l-gray-300">
                <div className="text-xs font-semibold text-gray-700 mb-1">Auto-Generated Config:</div>
                <div className="text-xs text-gray-600 font-mono">
                  Chart: {template.chartType.replace('_', ' ')} | 
                  Metrics: {Array.isArray(template.autoConfig.metrics) 
                    ? template.autoConfig.metrics.join(', ') 
                    : 'Complex aggregations'
                  }
                </div>
              </div>

              {/* Scope Tags */}
              <div className="flex gap-2">
                {template.supportedScopes.map((scope) => (
                  <Badge 
                    key={scope}
                    variant="outline" 
                    className={`text-xs ${
                      template.optimalScope.includes(scope)
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {scope === 'time' ? 'Time' : scope === 'sprint' ? 'Sprint' : 'Release'}
                  </Badge>
                ))}
              </div>

              {/* Example Query */}
              <div className="bg-blue-50 rounded-lg p-3 border-l-3 border-l-blue-400">
                <div className="text-sm text-blue-800 font-medium">
                  "{template.exampleQuery}"
                </div>
              </div>

              {/* Persona */}
              <div className="text-xs text-gray-500">
                Perfect for: {template.persona.join(', ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}