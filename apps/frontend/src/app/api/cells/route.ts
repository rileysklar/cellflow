import { NextResponse } from 'next/server';
import type { Cell } from '@/services/productionService';
import { auth } from '@clerk/nextjs/server';

// Temporary mock data
const mockCells: Cell[] = [
  {
    id: 'cell1',
    value_stream_id: 'vs1',
    name: 'Assembly Cell 1',
    description: 'Initial assembly station',
    status: 'active',
    target_cycle_time: 120, // 2 minutes standard time
  },
  {
    id: 'cell2',
    value_stream_id: 'vs1',
    name: 'Assembly Cell 2',
    description: 'Secondary assembly station',
    status: 'active',
    target_cycle_time: 180, // 3 minutes standard time
  },
  {
    id: 'cell3',
    value_stream_id: 'vs2',
    name: 'Testing Cell 1',
    description: 'Quality control station',
    status: 'active',
    target_cycle_time: 300, // 5 minutes standard time
  },
];

export async function GET(request: Request) {
  console.log('GET /api/cells - Request received');
  
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    console.log('User authentication status:', { userId });

    if (!userId) {
      console.log('Unauthorized: No user ID found');
      return new Response('Unauthorized', { status: 401 });
    }

    // Get value stream ID from query params
    const { searchParams } = new URL(request.url);
    const valueStreamId = searchParams.get('valueStreamId');
    console.log('Requested value stream ID:', valueStreamId);

    if (!valueStreamId) {
      console.log('Bad request: No value stream ID provided');
      return NextResponse.json(
        { error: 'Value stream ID is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch this data from your database
    // Filter cells by value stream ID
    const cells = mockCells.filter(cell => cell.value_stream_id === valueStreamId);
    console.log('Returning filtered cells:', cells);
    
    return NextResponse.json(cells);
  } catch (error) {
    console.error('Error in cells API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cells' },
      { status: 500 }
    );
  }
} 