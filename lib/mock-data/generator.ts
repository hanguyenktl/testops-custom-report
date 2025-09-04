import { faker } from '@faker-js/faker';
import { TestExecutionRecord } from '@/lib/types';

export class QADataGenerator {
  private projects = ['Mobile App', 'Web Portal', 'API Services', 'Admin Dashboard', 'Payment System'];
  private testNames = [
    'Login Flow', 'Payment Processing', 'User Registration', 'Data Validation', 'Integration Test',
    'UI Responsiveness', 'Error Handling', 'Security Check', 'Performance Load', 'Cross Browser',
    'Mobile Compatibility', 'API Endpoint', 'Database Connection', 'File Upload', 'Search Functionality'
  ];
  private executors = ['Alice Chen', 'Bob Rodriguez', 'Carol Kim', 'David Patel', 'Emma Wilson', 'Frank Zhang'];

  generateTestExecutions(count: number = 1000): TestExecutionRecord[] {
    // Set a seed for consistent results during development
    faker.seed(12345);

    return Array.from({ length: count }, () => {
      const startTime = faker.date.recent({ days: 90 });
      
      return {
        id: faker.string.uuid(),
        test_case_id: faker.string.uuid(),
        test_case_name: `${faker.helpers.arrayElement(this.testNames)} ${faker.number.int({ min: 1, max: 999 })}`,
        start_time: startTime,
        duration: this.generateRealisticDuration(),
        status: faker.helpers.weightedArrayElement([
          { weight: 70, value: 'PASSED' },
          { weight: 20, value: 'FAILED' },
          { weight: 5, value: 'ERROR' },
          { weight: 5, value: 'SKIPPED' }
        ]),
        test_type: faker.helpers.weightedArrayElement([
          { weight: 60, value: 'automated' },
          { weight: 40, value: 'manual' }
        ]),
        executor: faker.helpers.arrayElement(this.executors),
        environment: faker.helpers.arrayElement(['QA', 'Staging', 'Production']),
        project_id: faker.helpers.arrayElement(this.projects),
        sprint_id: this.generateSprintId(startTime),
        release_id: this.generateReleaseId(startTime),
        configuration: {
          os: faker.helpers.arrayElement(['Windows 11', 'macOS Sonoma', 'Ubuntu 22.04']),
          browser: faker.helpers.arrayElement(['Chrome 120', 'Firefox 121', 'Safari 17', 'Edge 120']),
          version: faker.system.semver()
        }
      };
    });
  }

  private generateRealisticDuration(): number {
    // Realistic test durations: most 30-300 seconds, some outliers
    return faker.helpers.weightedArrayElement([
      { weight: 50, value: faker.number.int({ min: 30, max: 120 }) },    // Quick tests
      { weight: 30, value: faker.number.int({ min: 120, max: 300 }) },   // Standard tests  
      { weight: 15, value: faker.number.int({ min: 300, max: 600 }) },   // Complex tests
      { weight: 5, value: faker.number.int({ min: 600, max: 1800 }) }    // Integration tests
    ]);
  }

  private generateSprintId(date: Date): string {
    // Generate sprint based on date - assuming 2-week sprints
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const weeksSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const sprintNumber = Math.floor(weeksSinceStart / 2) + 1;
    return `Sprint ${Math.min(sprintNumber, 26)}`; // Cap at Sprint 26 for a year
  }

  private generateReleaseId(date: Date): string {
    // Generate release based on date - assuming quarterly releases
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    const year = date.getFullYear();
    const minorVersion = faker.number.int({ min: 0, max: 5 });
    return `Release ${year - 2022}.${quarter}.${minorVersion}`;
  }

  generateRequirementCoverageData(count: number = 50) {
    faker.seed(12346);

    return Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      title: `REQ-${faker.number.int({ min: 1000, max: 9999 })}: ${faker.hacker.phrase()}`,
      status: faker.helpers.arrayElement(['Active', 'In Review', 'Approved', 'Implemented']),
      priority: faker.helpers.weightedArrayElement([
        { weight: 20, value: 'Critical' },
        { weight: 30, value: 'High' },
        { weight: 40, value: 'Medium' },
        { weight: 10, value: 'Low' }
      ]),
      project_id: faker.helpers.arrayElement(this.projects),
      sprint_id: `Sprint ${faker.number.int({ min: 5, max: 8 })}`,
      release_id: `Release 2.${faker.number.int({ min: 1, max: 3 })}`,
      test_coverage: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      execution_coverage: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      pass_coverage: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      created_date: faker.date.recent({ days: 180 }),
      updated_date: faker.date.recent({ days: 30 })
    }));
  }

  generateDefectData(count: number = 100) {
    faker.seed(12347);

    return Array.from({ length: count }, () => {
      const createdDate = faker.date.recent({ days: 120 });
      const isResolved = faker.datatype.boolean({ probability: 0.7 });
      
      return {
        id: faker.string.uuid(),
        title: `BUG-${faker.number.int({ min: 1000, max: 9999 })}: ${faker.hacker.phrase()}`,
        severity: faker.helpers.weightedArrayElement([
          { weight: 15, value: 'Critical' },
          { weight: 25, value: 'High' },
          { weight: 40, value: 'Medium' },
          { weight: 20, value: 'Low' }
        ]),
        priority: faker.helpers.weightedArrayElement([
          { weight: 20, value: 'P0' },
          { weight: 30, value: 'P1' },
          { weight: 35, value: 'P2' },
          { weight: 15, value: 'P3' }
        ]),
        status: faker.helpers.arrayElement(
          isResolved 
            ? ['Resolved', 'Closed', 'Verified'] 
            : ['Open', 'In Progress', 'Testing']
        ),
        assignee: faker.helpers.arrayElement(this.executors),
        project_id: faker.helpers.arrayElement(this.projects),
        sprint_id: `Sprint ${faker.number.int({ min: 5, max: 8 })}`,
        release_id: `Release 2.${faker.number.int({ min: 1, max: 3 })}`,
        created_date: createdDate,
        resolved_date: isResolved ? faker.date.between({ from: createdDate, to: new Date() }) : null,
        resolution_time_hours: isResolved ? faker.number.int({ min: 2, max: 168 }) : null // 2 hours to 1 week
      };
    });
  }

  generateAggregatedMetrics() {
    faker.seed(12348);

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      const totalTests = faker.number.int({ min: 50, max: 200 });
      const passedTests = faker.number.int({ min: Math.floor(totalTests * 0.6), max: Math.floor(totalTests * 0.95) });
      const failedTests = totalTests - passedTests;
      
      return {
        date: date.toISOString().split('T')[0],
        total_executions: totalTests,
        passed_executions: passedTests,
        failed_executions: failedTests,
        pass_rate: +(passedTests / totalTests * 100).toFixed(2),
        avg_duration: faker.number.float({ min: 45, max: 180, fractionDigits: 1 }),
        automation_rate: faker.number.float({ min: 55, max: 75, fractionDigits: 1 }),
        unique_test_cases: faker.number.int({ min: 30, max: 80 }),
        defects_found: faker.number.int({ min: 0, max: 15 }),
        defects_resolved: faker.number.int({ min: 0, max: 12 })
      };
    });

    return last30Days;
  }
}

// Export a singleton instance
export const qaDataGenerator = new QADataGenerator();