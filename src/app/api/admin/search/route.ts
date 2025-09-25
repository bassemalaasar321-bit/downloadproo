import { NextResponse } from 'next/server';
import { searchGames } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    const results = searchGames({
      search: query,
      limit: 50
    });
    
    return NextResponse.json(results.games);
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}