import { QADataset } from '@/lib/types/dataset';

export const QA_DATASETS: QADataset[] = [
  {
    id: 'test_execution',
    name: 'Test Execution Results',
    businessDescription: 'Individual test run outcomes with timing, status, and execution details',
    icon: '🧪',
    recordCount: '50,000+ executions',
    lastUpdated: '2 hours ago',
    category: 'execution',
    fields: {
      metrics: [
        {
          id: 'pass_rate',
          name: 'Pass Rate %',
          businessDescription: 'Percentage of tests that passed successfully',
          technicalName: 'pass_rate_percentage',
          sqlExpression: 'SUM(CASE WHEN status = \'PASSED\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)',
          type: 'percentage',
          format: '0.1%',
          category: 'quality'
        },
        {
          id: 'avg_duration',
          name: 'Average Test Duration',
          businessDescription: 'Mean time to complete test execution',
          technicalName: 'avg_duration_seconds',
          sqlExpression: 'AVG(duration_seconds)',
          type: 'duration',
          format: 'HH:mm:ss',
          category: 'performance'
        },
        {
          id: 'total_executions',
          name: 'Total Test Runs',
          businessDescription: 'Count of all test executions in the time period',
          technicalName: 'execution_count',
          sqlExpression: 'COUNT(*)',
          type: 'count',
          format: '0,0',
          category: 'productivity'
        },
        {
          id: 'failure_rate',
          name: 'Failure Rate %',
          businessDescription: 'Percentage of tests that failed or had errors',
          technicalName: 'failure_rate_percentage',
          sqlExpression: 'SUM(CASE WHEN status IN (\'FAILED\', \'ERROR\') THEN 1 ELSE 0 END) * 100.0 / COUNT(*)',
          type: 'percentage',
          format: '0.1%',
          category: 'quality'
        },
        {
          id: 'automation_coverage',
          name: 'Automation Coverage %',
          businessDescription: 'Percentage of tests that are automated vs manual',
          technicalName: 'automation_percentage',
          sqlExpression: 'SUM(CASE WHEN test_type = \'automated\' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)',
          type: 'percentage',
          format: '0.1%',
          category: 'coverage'
        },
        {
          id: 'tests_per_hour',
          name: 'Test Throughput (per hour)',
          businessDescription: 'Average number of tests executed per hour',
          technicalName: 'tests_per_hour',
          sqlExpression: 'COUNT(*) / (EXTRACT(EPOCH FROM (MAX(start_time) - MIN(start_time))) / 3600)',
          type: 'ratio',
          format: '0.0',
          category: 'performance'
        }
      ],
      dimensions: [
        {
          id: 'sprint_name',
          name: 'Sprint',
          businessDescription: 'Development sprint or iteration period',
          technicalName: 'sprint_name',
          type: 'categorical',
          values: ['Sprint 7', 'Sprint 8', 'Sprint 9', 'Sprint 10'],
          category: 'time'
        },
        {
          id: 'test_type',
          name: 'Test Type',
          businessDescription: 'Manual vs automated test execution method',
          technicalName: 'test_type',
          type: 'categorical',
          values: ['Manual', 'Automated'],
          category: 'classification'
        },
        {
          id: 'environment',
          name: 'Test Environment',
          businessDescription: 'Environment where tests were executed',
          technicalName: 'environment',
          type: 'categorical',
          values: ['QA', 'Staging', 'Production', 'Dev'],
          category: 'environment'
        },
        {
          id: 'executor',
          name: 'Test Executor',
          businessDescription: 'Person or system that ran the tests',
          technicalName: 'executor_name',
          type: 'categorical',
          category: 'team'
        },
        {
          id: 'test_suite',
          name: 'Test Suite',
          businessDescription: 'Grouped collection of related tests',
          technicalName: 'test_suite_name',
          type: 'categorical',
          category: 'scope'
        },
        {
          id: 'execution_date',
          name: 'Execution Date',
          businessDescription: 'When the test was executed',
          technicalName: 'execution_date',
          type: 'temporal',
          category: 'time'
        },
        {
          id: 'project',
          name: 'Project',
          businessDescription: 'Software project or application being tested',
          technicalName: 'project_name',
          type: 'categorical',
          values: ['Mobile App', 'Web Portal', 'API Services', 'Admin Dashboard'],
          category: 'scope'
        }
      ],
      filters: [
        {
          id: 'date_range',
          name: 'Date Range',
          businessDescription: 'Filter by when tests were executed',
          technicalName: 'execution_date',
          type: 'daterange',
          defaultValue: { type: 'relative', value: 'last_30_days' }
        },
        {
          id: 'status_filter',
          name: 'Test Status',
          businessDescription: 'Filter by test outcome',
          technicalName: 'status',
          type: 'multiselect',
          options: [
            { value: 'PASSED', label: '✅ Passed' },
            { value: 'FAILED', label: '❌ Failed' },
            { value: 'ERROR', label: '⚠️ Error' },
            { value: 'SKIPPED', label: '⏭️ Skipped' }
          ]
        },
        {
          id: 'duration_filter',
          name: 'Test Duration',
          businessDescription: 'Filter by how long tests took to run',
          technicalName: 'duration_seconds',
          type: 'numeric',
          defaultValue: { min: 0, max: 1800 }
        }
      ]
    },
    relationships: {
      relatedDatasets: ['defect_tracking', 'requirement_coverage'],
      joinKeys: {
        'defect_tracking': 'test_case_id',
        'requirement_coverage': 'test_case_id'
      }
    }
  },
  {
    id: 'defect_tracking',
    name: 'Bug & Defect Data',
    businessDescription: 'Issues and bugs found during testing with resolution tracking',
    icon: '🐛',
    recordCount: '10,000+ issues',
    lastUpdated: '1 hour ago',
    category: 'defects',
    fields: {
      metrics: [
        {
          id: 'defect_density',
          name: 'Defect Density',
          businessDescription: 'Number of defects per 100 test cases',
          technicalName: 'defects_per_100_tests',
          sqlExpression: 'COUNT(DISTINCT defect_id) * 100.0 / COUNT(DISTINCT test_case_id)',
          type: 'ratio',
          format: '0.00',
          category: 'quality'
        },
        {
          id: 'resolution_time',
          name: 'Average Resolution Time',
          businessDescription: 'Mean time from bug report to resolution',
          technicalName: 'avg_resolution_hours',
          sqlExpression: 'AVG(EXTRACT(EPOCH FROM (resolved_date - created_date)) / 3600)',
          type: 'duration',
          format: '0.0" hours"',
          category: 'performance'
        },
        {
          id: 'open_defects',
          name: 'Open Defects',
          businessDescription: 'Count of unresolved bugs and issues',
          technicalName: 'open_defect_count',
          sqlExpression: 'COUNT(CASE WHEN status != \'RESOLVED\' THEN 1 END)',
          type: 'count',
          format: '0,0',
          category: 'quality'
        },
        {
          id: 'critical_defects',
          name: 'Critical Issues',
          businessDescription: 'High-priority bugs that block testing or release',
          technicalName: 'critical_defect_count',
          sqlExpression: 'COUNT(CASE WHEN priority IN (\'Critical\', \'High\') THEN 1 END)',
          type: 'count',
          format: '0,0',
          category: 'quality'
        }
      ],
      dimensions: [
        {
          id: 'severity',
          name: 'Bug Severity',
          businessDescription: 'Impact level of the defect',
          technicalName: 'severity',
          type: 'ordinal',
          values: ['Critical', 'High', 'Medium', 'Low'],
          category: 'classification'
        },
        {
          id: 'component',
          name: 'Component',
          businessDescription: 'Application component where bug was found',
          technicalName: 'component_name',
          type: 'categorical',
          category: 'scope'
        },
        {
          id: 'assignee',
          name: 'Assigned Developer',
          businessDescription: 'Person responsible for fixing the bug',
          technicalName: 'assignee_name',
          type: 'categorical',
          category: 'team'
        },
        {
          id: 'defect_type',
          name: 'Defect Type',
          businessDescription: 'Category of the issue found',
          technicalName: 'defect_type',
          type: 'categorical',
          values: ['Functional', 'UI/UX', 'Performance', 'Security', 'Integration'],
          category: 'classification'
        }
      ],
      filters: [
        {
          id: 'priority_filter',
          name: 'Priority Level',
          businessDescription: 'Filter by bug priority',
          technicalName: 'priority',
          type: 'multiselect',
          options: [
            { value: 'Critical', label: '🔴 Critical' },
            { value: 'High', label: '🟠 High' },
            { value: 'Medium', label: '🟡 Medium' },
            { value: 'Low', label: '🟢 Low' }
          ]
        }
      ]
    }
  },
  {
    id: 'requirement_coverage',
    name: 'Requirement Coverage',
    businessDescription: 'Test coverage analysis mapped to business requirements and user stories',
    icon: '📋',
    recordCount: '5,000+ requirements',
    lastUpdated: '4 hours ago',
    category: 'coverage',
    fields: {
      metrics: [
        {
          id: 'coverage_percentage',
          name: 'Coverage %',
          businessDescription: 'Percentage of requirements that have test cases',
          technicalName: 'coverage_percentage',
          sqlExpression: 'COUNT(CASE WHEN test_count > 0 THEN 1 END) * 100.0 / COUNT(*)',
          type: 'percentage',
          format: '0.1%',
          category: 'coverage'
        },
        {
          id: 'untested_requirements',
          name: 'Untested Requirements',
          businessDescription: 'Count of requirements without any test coverage',
          technicalName: 'untested_count',
          sqlExpression: 'COUNT(CASE WHEN test_count = 0 THEN 1 END)',
          type: 'count',
          format: '0,0',
          category: 'coverage'
        }
      ],
      dimensions: [
        {
          id: 'requirement_priority',
          name: 'Requirement Priority',
          businessDescription: 'Business priority of the requirement',
          technicalName: 'requirement_priority',
          type: 'ordinal',
          values: ['Must Have', 'Should Have', 'Could Have', 'Won\'t Have'],
          category: 'classification'
        },
        {
          id: 'feature_area',
          name: 'Feature Area',
          businessDescription: 'Functional area of the application',
          technicalName: 'feature_area',
          type: 'categorical',
          category: 'scope'
        }
      ],
      filters: []
    }
  }
];