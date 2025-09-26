import { NextRequest } from 'next/server';
import { qaDataGenerator } from '@/lib/mock-data/generator';

export const dynamic = 'force-static';

export async function GET() {
  // Static generation - use default values
  const type = 'executions';
  const count = 100;

  try {
    // For static export, always return executions data
    const data = qaDataGenerator.generateTestExecutions(count);

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