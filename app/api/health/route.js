import { NextResponse } from 'next/server';
import { checkChatHealthStatus } from '@/utils/errorHandler';

/**
 * Health Check API for Chat Services
 * 
 * GET /api/health
 * Returns health status of MongoDB, Supabase, and overall system
 */

export async function GET() {
  try {
    const healthStatus = await checkChatHealthStatus();
    
    const statusCode = healthStatus.overall === 'healthy' ? 200 : 
                      healthStatus.overall === 'degraded' ? 206 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: 'unhealthy',
      error: error.message,
      services: {
        mongodb: { status: 'unknown' },
        supabase: { status: 'unknown' }
      }
    }, { status: 503 });
  }
}