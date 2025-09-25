import { NextResponse } from 'next/server';
import { githubDb } from '@/lib/githubDb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);
    
    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }
    
    const game = await githubDb.getGameById(gameId);
    
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);
    const updates = await request.json();
    
    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }
    
    // TODO: Implement updateGame in githubDb
    return NextResponse.json({ error: 'Update not implemented yet' }, { status: 501 });
    
    if (!updatedGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gameId = parseInt(id);
    
    if (isNaN(gameId)) {
      return NextResponse.json({ error: 'Invalid game ID' }, { status: 400 });
    }
    
    // TODO: Implement deleteGame in githubDb
    return NextResponse.json({ error: 'Delete not implemented yet' }, { status: 501 });
    
    if (!deleted) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}