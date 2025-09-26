import TemplateConfigurationClient from './client-component';

export async function generateStaticParams() {
  return [
    { template: 'execution_performance' },
    { template: 'quality_trends' },
    { template: 'coverage_readiness' },
    { template: 'defect_intelligence' },
    { template: 'testcase_productivity' },
    { template: 'cross_entity_analysis' },
    { template: 'operational_health' },
    { template: 'configuration_matrix' }
  ];
}

export default function TemplateConfiguration() {
  return <TemplateConfigurationClient />;
}