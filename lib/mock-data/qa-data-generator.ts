import { faker } from '@faker-js/faker';

// QA Test Execution Data
export interface TestExecutionRecord {
  id: string;
  test_case_id: string;
  test_case_name: string;
  start_time: Date;
  end_time: Date;
  duration_seconds: number;
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'SKIPPED';
  test_type: 'manual' | 'automated';
  executor_name: string;
  environment: 'QA' | 'Staging' | 'Production' | 'Dev';
  project_name: string;
  sprint_name: string;
  release_id: string;
  test_suite_name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  component_name: string;
  browser?: string;
  os?: string;
  device?: string;
}

// Defect Tracking Data
export interface DefectRecord {
  defect_id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Reopened';
  defect_type: 'Functional' | 'UI/UX' | 'Performance' | 'Security' | 'Integration';
  created_date: Date;
  resolved_date?: Date;
  assignee_name: string;
  reporter_name: string;
  component_name: string;
  project_name: string;
  test_case_id?: string;
  environment: string;
}

// Requirement Coverage Data
export interface RequirementRecord {
  requirement_id: string;
  title: string;
  description: string;
  requirement_priority: 'Must Have' | 'Should Have' | 'Could Have' | 'Won\'t Have';
  feature_area: string;
  project_name: string;
  test_count: number;
  passed_test_count: number;
  failed_test_count: number;
  coverage_percentage: number;
}

export class QADataGenerator {
  private projects = [
    'Mobile Banking App', 
    'E-Commerce Web Portal', 
    'Customer API Services', 
    'Admin Dashboard', 
    'Payment Processing System'
  ];
  
  private testExecutors = [
    'Alice Chen', 'Bob Rodriguez', 'Carol Kim', 'David Patel', 'Emma Wilson',
    'Frank Zhang', 'Grace Lopez', 'Henry Brown', 'Iris Taylor', 'Jack Miller'
  ];
  
  private components = [
    'Login/Authentication', 'User Registration', 'Payment Processing', 'Search Functionality',
    'User Profile Management', 'Shopping Cart', 'Order Management', 'Notifications',
    'Reporting Dashboard', 'Data Export', 'Settings & Configuration', 'File Upload'
  ];
  
  private testSuites = [
    'Smoke Tests', 'Regression Tests', 'Integration Tests', 'User Acceptance Tests',
    'Performance Tests', 'Security Tests', 'API Tests', 'Mobile Tests', 'Cross-browser Tests'
  ];
  
  private featureAreas = [
    'Authentication & Security', 'User Management', 'Payment & Billing', 'Order Processing',
    'Search & Navigation', 'Reporting & Analytics', 'Data Management', 'Third-party Integration'
  ];

  // Generate realistic test execution data
  generateTestExecutions(count: number = 1000, daysBack: number = 90): TestExecutionRecord[] {
    const records: TestExecutionRecord[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const startTime = faker.date.recent({ days: daysBack });
      const durationSeconds = this.generateRealisticDuration();
      const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
      
      const project = faker.helpers.arrayElement(this.projects);
      const sprintNumber = faker.number.int({ min: 5, max: 10 });
      const environment = faker.helpers.weightedArrayElement([
        { weight: 50, value: 'QA' },
        { weight: 30, value: 'Staging' },
        { weight: 15, value: 'Dev' },
        { weight: 5, value: 'Production' }
      ]);
      
      // Status distribution reflecting real QA scenarios
      const status = faker.helpers.weightedArrayElement([
        { weight: 70, value: 'PASSED' },
        { weight: 20, value: 'FAILED' },
        { weight: 7, value: 'ERROR' },
        { weight: 3, value: 'SKIPPED' }
      ]);
      
      const testType = faker.helpers.weightedArrayElement([
        { weight: 65, value: 'automated' },
        { weight: 35, value: 'manual' }
      ]);

      records.push({
        id: faker.string.uuid(),
        test_case_id: `TC_${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`,
        test_case_name: this.generateTestCaseName(),
        start_time: startTime,
        end_time: endTime,
        duration_seconds: durationSeconds,
        status,
        test_type: testType,
        executor_name: faker.helpers.arrayElement(this.testExecutors),
        environment,
        project_name: project,
        sprint_name: `Sprint ${sprintNumber}`,
        release_id: `Release ${faker.number.int({ min: 2, max: 4 })}.${faker.number.int({ min: 0, max: 9 })}`,
        test_suite_name: faker.helpers.arrayElement(this.testSuites),
        priority: faker.helpers.weightedArrayElement([
          { weight: 20, value: 'Critical' },
          { weight: 30, value: 'High' },
          { weight: 40, value: 'Medium' },
          { weight: 10, value: 'Low' }
        ]),
        component_name: faker.helpers.arrayElement(this.components),
        browser: testType === 'automated' ? faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari', 'Edge']) : undefined,
        os: faker.helpers.arrayElement(['Windows 11', 'macOS Sonoma', 'Ubuntu 22.04']),
        device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet'])
      });
    }
    
    return records.sort((a, b) => b.start_time.getTime() - a.start_time.getTime());
  }

  // Generate realistic defect data
  generateDefects(count: number = 500, daysBack: number = 90): DefectRecord[] {
    const records: DefectRecord[] = [];
    
    for (let i = 0; i < count; i++) {
      const createdDate = faker.date.recent({ days: daysBack });
      const status = faker.helpers.weightedArrayElement([
        { weight: 25, value: 'Open' },
        { weight: 20, value: 'In Progress' },
        { weight: 40, value: 'Resolved' },
        { weight: 12, value: 'Closed' },
        { weight: 3, value: 'Reopened' }
      ]);
      
      const resolvedDate = ['Resolved', 'Closed'].includes(status) 
        ? faker.date.between({ from: createdDate, to: new Date() })
        : undefined;

      records.push({
        defect_id: `BUG_${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`,
        title: this.generateDefectTitle(),
        description: faker.lorem.sentences(2),
        severity: faker.helpers.weightedArrayElement([
          { weight: 10, value: 'Critical' },
          { weight: 25, value: 'High' },
          { weight: 50, value: 'Medium' },
          { weight: 15, value: 'Low' }
        ]),
        priority: faker.helpers.weightedArrayElement([
          { weight: 15, value: 'Critical' },
          { weight: 30, value: 'High' },
          { weight: 45, value: 'Medium' },
          { weight: 10, value: 'Low' }
        ]),
        status,
        defect_type: faker.helpers.arrayElement(['Functional', 'UI/UX', 'Performance', 'Security', 'Integration']),
        created_date: createdDate,
        resolved_date: resolvedDate,
        assignee_name: faker.helpers.arrayElement(this.testExecutors),
        reporter_name: faker.helpers.arrayElement(this.testExecutors),
        component_name: faker.helpers.arrayElement(this.components),
        project_name: faker.helpers.arrayElement(this.projects),
        test_case_id: faker.datatype.boolean() ? `TC_${faker.string.alphanumeric({ length: 8 }).toUpperCase()}` : undefined,
        environment: faker.helpers.arrayElement(['QA', 'Staging', 'Production', 'Dev'])
      });
    }
    
    return records.sort((a, b) => b.created_date.getTime() - a.created_date.getTime());
  }

  // Generate requirement coverage data
  generateRequirements(count: number = 300): RequirementRecord[] {
    const records: RequirementRecord[] = [];
    
    for (let i = 0; i < count; i++) {
      const testCount = faker.number.int({ min: 0, max: 15 });
      const passedCount = faker.number.int({ min: 0, max: testCount });
      const failedCount = testCount - passedCount;
      const coveragePercentage = testCount > 0 ? Math.round((passedCount / testCount) * 100) : 0;

      records.push({
        requirement_id: `REQ_${faker.string.alphanumeric({ length: 6 }).toUpperCase()}`,
        title: this.generateRequirementTitle(),
        description: faker.lorem.sentences(1),
        requirement_priority: faker.helpers.weightedArrayElement([
          { weight: 40, value: 'Must Have' },
          { weight: 30, value: 'Should Have' },
          { weight: 20, value: 'Could Have' },
          { weight: 10, value: 'Won\'t Have' }
        ]),
        feature_area: faker.helpers.arrayElement(this.featureAreas),
        project_name: faker.helpers.arrayElement(this.projects),
        test_count: testCount,
        passed_test_count: passedCount,
        failed_test_count: failedCount,
        coverage_percentage: coveragePercentage
      });
    }
    
    return records;
  }

  // Helper methods for generating realistic names
  private generateRealisticDuration(): number {
    // Realistic test durations with proper distribution
    return faker.helpers.weightedArrayElement([
      { weight: 30, value: faker.number.int({ min: 15, max: 60 }) },      // Quick tests
      { weight: 40, value: faker.number.int({ min: 60, max: 300 }) },     // Standard tests
      { weight: 20, value: faker.number.int({ min: 300, max: 900 }) },    // Complex tests
      { weight: 8, value: faker.number.int({ min: 900, max: 1800 }) },    // Long integration tests
      { weight: 2, value: faker.number.int({ min: 1800, max: 3600 }) }    // Very long tests
    ]);
  }

  private generateTestCaseName(): string {
    const actions = ['Verify', 'Test', 'Validate', 'Check', 'Confirm', 'Ensure'];
    const objects = [
      'user login functionality', 'payment processing flow', 'data validation rules',
      'search results accuracy', 'user profile updates', 'password reset process',
      'shopping cart operations', 'order confirmation emails', 'API response times',
      'file upload limits', 'user permissions', 'notification delivery'
    ];
    
    return `${faker.helpers.arrayElement(actions)} ${faker.helpers.arrayElement(objects)}`;
  }

  private generateDefectTitle(): string {
    const defectTypes = [
      'Login page not responding on mobile devices',
      'Payment form validation error with special characters',
      'Search results showing incorrect data ordering',
      'User profile image upload failing for large files',
      'Notification emails not being delivered',
      'Shopping cart total calculation incorrect',
      'API timeout error on data export',
      'Password reset link expires too quickly',
      'Dashboard charts not loading in Safari',
      'Mobile app crashes on Android devices'
    ];
    
    return faker.helpers.arrayElement(defectTypes);
  }

  private generateRequirementTitle(): string {
    const requirements = [
      'User must be able to log in with email and password',
      'System should process payments within 3 seconds',
      'Search functionality must return relevant results',
      'Users should receive email notifications for orders',
      'Dashboard must display real-time analytics',
      'Mobile app should work offline with cached data',
      'API should handle 1000 concurrent requests',
      'User data must be encrypted at rest and in transit',
      'System should backup data every 6 hours',
      'Reports must be exportable to PDF and Excel formats'
    ];
    
    return faker.helpers.arrayElement(requirements);
  }
}

// Singleton instance for consistent data generation
export const qaDataGenerator = new QADataGenerator();