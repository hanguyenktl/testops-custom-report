import { NextRequest, NextResponse } from 'next/server';
import { qaDataGenerator } from '@/lib/mock-data/qa-data-generator';

export const dynamic = 'force-static';

export async function GET() {
  // Static generation - use default values
  const datasetType = 'test_execution';
  const count = 1000;
  const daysBack = 90;

  try {
    // For static export, always return all datasets with sample data
    const data = {
      test_execution: qaDataGenerator.generateTestExecutions(100, 30),
      defect_tracking: qaDataGenerator.generateDefects(50, 30),
      requirement_coverage: qaDataGenerator.generateRequirements(50)
    };

    // Add metadata
    const response = {
      data,
      metadata: {
        dataset: datasetType || 'all',
        recordCount: Array.isArray(data) ? data.length : Object.keys(data).length,
        generatedAt: new Date().toISOString(),
        parameters: { count, daysBack }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating mock data:', error);
    return NextResponse.json(
      { error: 'Failed to generate mock data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST endpoint for filtered/aggregated data (used for chart previews)
export async function POST() {
  try {
    // Static generation - use default values
    const dataset = 'test_execution';
    const metrics: any[] = [];
    const dimensions: any[] = [];
    const filters: any[] = [];
    const timeRange = 'Last 30 days';
    const chartType = 'bar';

    // Generate base data (static for export)
    const rawData = qaDataGenerator.generateTestExecutions(500, 30);

    // Apply filters (simplified for demo)
    let filteredData: any[] = rawData;
    if (filters && filters.length > 0) {
      filteredData = rawData.filter(record => {
        return filters.every((filter: any) => {
          // Simplified filter logic for demo
          return true;
        });
      });
    }

    // Generate aggregated data based on metrics and dimensions
    const aggregatedData = aggregateData(filteredData, metrics, dimensions, chartType);

    const response = {
      data: aggregatedData.data,
      metadata: {
        originalRecords: rawData.length,
        filteredRecords: filteredData.length,
        aggregatedPoints: aggregatedData.data.length,
        chartType,
        metrics,
        dimensions,
        generatedAt: new Date().toISOString(),
        loadTime: '< 1 second',
        timeRange: timeRange || 'Last 30 days'
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chart data:', error);
    return NextResponse.json(
      { error: 'Failed to process chart data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to aggregate data for charts
function aggregateData(data: any[], metrics: any[], dimensions: any[], chartType: string) {
  if (!metrics.length || !dimensions.length) {
    return { data: [] };
  }

  // Simplified aggregation logic for demo
  // In a real implementation, this would perform proper SQL-like aggregations
  
  const groupedData = new Map();
  
  data.forEach(record => {
    // Create grouping key from dimensions
    const groupKey = dimensions.map(dim => {
      switch (dim.id) {
        case 'sprint_name':
          return record.sprint_name || 'Unknown Sprint';
        case 'test_type':
          return record.test_type || 'Unknown Type';
        case 'environment':
          return record.environment || 'Unknown Environment';
        case 'project':
        case 'project_name':
          return record.project_name || 'Unknown Project';
        case 'executor':
        case 'executor_name':
          return record.executor_name || 'Unknown Executor';
        default:
          return 'Unknown';
      }
    }).join(' - ');

    if (!groupedData.has(groupKey)) {
      groupedData.set(groupKey, {
        group: groupKey,
        records: [],
        aggregations: {}
      });
    }
    
    groupedData.get(groupKey).records.push(record);
  });

  // Calculate metric aggregations
  const result = Array.from(groupedData.entries()).map(([groupKey, groupData]) => {
    const records = groupData.records;
    const point: any = { name: groupKey };

    metrics.forEach(metric => {
      switch (metric.id) {
        case 'pass_rate':
          const passed = records.filter((r: any) => r.status === 'PASSED').length;
          point[metric.name] = Math.round((passed / records.length) * 100);
          break;
        case 'avg_duration':
          const avgDuration = records.reduce((sum: number, r: any) => sum + (r.duration_seconds || 0), 0) / records.length;
          point[metric.name] = Math.round(avgDuration);
          break;
        case 'total_executions':
          point[metric.name] = records.length;
          break;
        case 'failure_rate':
          const failed = records.filter((r: any) => ['FAILED', 'ERROR'].includes(r.status)).length;
          point[metric.name] = Math.round((failed / records.length) * 100);
          break;
        case 'automation_coverage':
          const automated = records.filter((r: any) => r.test_type === 'automated').length;
          point[metric.name] = Math.round((automated / records.length) * 100);
          break;
        default:
          point[metric.name] = Math.floor(Math.random() * 100); // Fallback random data
      }
    });

    return point;
  });

  return {
    data: result.sort((a, b) => a.name.localeCompare(b.name))
  };
}