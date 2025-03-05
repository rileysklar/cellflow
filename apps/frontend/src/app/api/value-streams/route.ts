import { NextResponse } from 'next/server';
import type { ValueStream } from '@/services/productionService';
import { auth } from '@clerk/nextjs/server';

// Temporary mock data
const mockValueStreams: ValueStream[] = [
  {
    id: 'vs1',
    site_id: 'site1',
    name: 'Assembly Line',
    description: 'Main assembly line for product A',
    target_efficiency: 90,
  },
  {
    id: 'vs2',
    site_id: 'site1',
    name: 'Testing Line',
    description: 'Quality testing line for product A',
    target_efficiency: 95,
  },
];

export async function GET() {
  console.log('GET /api/value-streams - Request received');
  
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    console.log('User authentication status:', { userId });
    
    if (!userId) {
      console.log('Unauthorized: No user ID found');
      return new Response('Unauthorized', { status: 401 });
    }

    // In a real application, you would fetch this data from your database
    // based on the user's site access permissions
    console.log('Returning mock value streams:', mockValueStreams);
    return NextResponse.json(mockValueStreams);
  } catch (error) {
    console.error('Error in value-streams API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch value streams' },
      { status: 500 }
    );
  }
} 