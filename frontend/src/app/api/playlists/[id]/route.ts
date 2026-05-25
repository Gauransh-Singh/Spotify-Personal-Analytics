import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const playlistId = (await params).id;
  
  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Fetch the playlist details
    const [[playlistDetails]] = await connection.query<any>(
      'SELECT playlist_id, playlist_name, owner_name, total_tracks, image_url FROM playlists WHERE playlist_id = ?',
      [playlistId]
    );

    if (!playlistDetails) {
      connection.release();
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    // Fetch the tracks for this playlist
    const [tracks] = await connection.query<any>(`
      SELECT t.track_id, t.song_name, t.artist_name, t.album_name, t.album_image, t.duration_ms, pt.added_at 
      FROM playlist_tracks pt 
      JOIN tracks t ON pt.track_id = t.track_id 
      WHERE pt.playlist_id = ? 
      ORDER BY pt.added_at ASC
    `, [playlistId]);

    connection.release();

    return NextResponse.json({
      playlist: playlistDetails,
      tracks: tracks
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch playlist tracks' }, { status: 500 });
  }
}
