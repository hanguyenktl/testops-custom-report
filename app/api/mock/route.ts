import { NextRequest } from 'next/server';
import { qaDataGenerator } from '@/lib/mock-data/generator';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const count = parseInt(searchParams.get('count') || '100');

  try {
    let data;

    switch (type) {
      case 'executions':
        data = qaDataGenerator.generateTestExecutions(count);
        break;
      case 'requirements':
        data = qaDataGenerator.generateRequirementCoverageData(count);
        break;
      case 'defects':
        data = qaDataGenerator.generateDefectData(count);
        break;
      case 'metrics':
        data = qaDataGenerator.generateAggregatedMetrics();
        break;
      default:
        return Response.json(
          { error: 'Unknown data type. Available types: executions, requirements, defects, metrics' },
          { status: 400 }
        );
    }

    return Response.json({
      data,
      metadata: {
        count: data.length,
        type,
        generated_at: new Date().toISOString(),
        // Simulate realistic response times
        response_time_ms: Math.floor(Math.random() * 500) + 100
      }
    });

  } catch (error) {
    console.error('Error generating mock data:', error);
    return Response.json(
      { error: 'Failed to generate mock data' },
      { status: 500 }
    );
  }
}