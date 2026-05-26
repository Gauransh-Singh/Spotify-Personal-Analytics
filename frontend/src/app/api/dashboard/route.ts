import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const revalidate = 60; // Cache the dashboard data for 60 seconds

export async function GET() {
  try {
    const connection = await pool.getConnection();

    const [
      // 1. KPIs
      [[{ total_tracks }]], [[{ total_hours }]], [[{ total_artists }]], [[{ total_playlists }]], [[{ avg_bpm }]], [[mostPlayedArtistResult]], [[{ last_updated }]],
      // 2. Activity
      [dailyTrend], [monthlyTrend], [hourlyTrend], [recentlyPlayed],
      // 3. Profile
      [topArtists], [topTracks], [playlists],
      // 4. Intelligence
      [[audioAverages]], [comparativeAverages], [bpmHistogram], [energyDistribution], [danceabilityDistribution], [speechinessDistribution], [topDanceable], [topEnergetic],
      // 5. Mood
      [topMoodSongs], [topWorkoutSongs], [topFocusSongs], [[globalScores]],
      // 6. Scatter
      [scatterData]
    ] = await Promise.all([
      connection.query<any>('SELECT COUNT(*) as total_tracks FROM tracks'),
      connection.query<any>('SELECT SUM(t.duration_ms) / 1000 / 60 / 60 as total_hours FROM recently_played rp JOIN tracks t ON rp.track_id = t.track_id'),
      connection.query<any>('SELECT COUNT(DISTINCT artist_name) as total_artists FROM tracks'),
      connection.query<any>('SELECT COUNT(*) as total_playlists FROM playlists'),
      connection.query<any>('SELECT AVG(bpm) as avg_bpm FROM audio_features'),
      connection.query<any>('SELECT t.artist_name, COUNT(*) as count FROM recently_played rp JOIN tracks t ON rp.track_id = t.track_id GROUP BY t.artist_name ORDER BY count DESC LIMIT 1'),
      connection.query<any>('SELECT MAX(played_at) as last_updated FROM recently_played'),
      
      connection.query<any>('SELECT DATE(played_at) as date, COUNT(*) as count FROM recently_played WHERE played_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(played_at) ORDER BY date ASC'),
      connection.query<any>("SELECT DATE_FORMAT(played_at, '%Y-%m') as month, COUNT(*) as count FROM recently_played WHERE played_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) GROUP BY month ORDER BY month ASC"),
      connection.query<any>('SELECT FLOOR(HOUR(played_at) / 2) * 2 as hour, COUNT(*) as count FROM recently_played GROUP BY FLOOR(HOUR(played_at) / 2) * 2 ORDER BY hour ASC'),
      connection.query<any>('SELECT rp.id, t.song_name, t.artist_name, t.album_image, t.duration_ms, rp.played_at FROM recently_played rp JOIN tracks t ON rp.track_id = t.track_id ORDER BY rp.played_at DESC LIMIT 10'),
      
      connection.query<any>('SELECT artist_id, artist_name, artist_image, rank_position, time_range FROM top_artists ORDER BY time_range, rank_position ASC'),
      connection.query<any>('SELECT t.track_id, t.song_name, t.artist_name, t.album_image, t.duration_ms, tt.rank_position, tt.time_range, af.energy, af.bpm, af.danceability FROM top_tracks tt JOIN tracks t ON tt.track_id = t.track_id LEFT JOIN audio_features af ON t.track_id = af.track_id ORDER BY tt.time_range, tt.rank_position ASC'),
      connection.query<any>('SELECT playlist_id, playlist_name, image_url, total_tracks FROM playlists'),
      
      connection.query<any>('SELECT AVG(bpm) as bpm, AVG(energy) as energy, AVG(danceability) as danceability, AVG(loudness) as loudness FROM audio_features'),
      connection.query<any>(`SELECT tt.time_range, AVG(af.bpm) as bpm, AVG(af.energy) as energy, AVG(af.danceability) as danceability, AVG(af.loudness) as loudness FROM top_tracks tt JOIN audio_features af ON tt.track_id = af.track_id WHERE tt.time_range IN ('short_term', 'long_term') GROUP BY tt.time_range`),
      connection.query<any>(`SELECT CONCAT(FLOOR(bpm / 10) * 10, 's') as speed, COUNT(*) as count, FLOOR(bpm / 10) * 10 as sort_val FROM audio_features GROUP BY speed, sort_val ORDER BY sort_val`),
      connection.query<any>(`SELECT CASE WHEN energy < 0.4 THEN 'Low' WHEN energy >= 0.4 AND energy <= 0.7 THEN 'Medium' ELSE 'High' END as energy_level, COUNT(*) as count FROM audio_features GROUP BY energy_level`),
      connection.query<any>(`SELECT CASE WHEN danceability < 0.4 THEN 'Low' WHEN danceability >= 0.4 AND danceability <= 0.7 THEN 'Medium' ELSE 'High' END as danceability_level, COUNT(*) as count FROM audio_features GROUP BY danceability_level`),
      connection.query<any>(`SELECT CASE WHEN speechiness < 0.33 THEN 'Music / Non-Speech' WHEN speechiness >= 0.33 AND speechiness <= 0.66 THEN 'Mixed' ELSE 'Spoken Word' END as speechiness_level, COUNT(*) as count FROM audio_features GROUP BY speechiness_level`),
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, t.duration_ms, af.danceability FROM audio_features af JOIN tracks t ON af.track_id = t.track_id ORDER BY af.danceability DESC LIMIT 10'),
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, t.duration_ms, af.energy FROM audio_features af JOIN tracks t ON af.track_id = t.track_id ORDER BY af.energy DESC LIMIT 10'),
      
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, t.duration_ms, (af.energy + af.danceability) / 2 as mood_score FROM audio_features af JOIN tracks t ON af.track_id = t.track_id ORDER BY mood_score DESC LIMIT 10'),
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, t.duration_ms, (af.energy * 0.7) + ((af.bpm / 200) * 0.3) as workout_score FROM audio_features af JOIN tracks t ON af.track_id = t.track_id ORDER BY workout_score DESC LIMIT 10'),
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, t.duration_ms, ((1 - af.speechiness) * 0.6 + (1 - af.energy) * 0.4) as focus_score FROM audio_features af JOIN tracks t ON af.track_id = t.track_id ORDER BY focus_score DESC LIMIT 10'),
      connection.query<any>('SELECT AVG((energy + danceability) / 2) as mood_score, AVG((energy * 0.7) + ((bpm / 200) * 0.3)) as workout_score, AVG(((1 - speechiness) * 0.6 + (1 - energy) * 0.4)) as productivity_score FROM audio_features'),
      
      connection.query<any>('SELECT t.song_name, t.artist_name, t.album_image, af.danceability as x, af.energy as y, af.bpm as z FROM audio_features af JOIN tracks t ON af.track_id = t.track_id')
    ]);

    connection.release();

    const hourlyTrendMap = new Map(hourlyTrend.map((h: any) => [h.hour, h.count]));
    const fullHourlyTrend = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map(hour => ({
      hour,
      count: hourlyTrendMap.get(hour) || 0
    }));

    return NextResponse.json({
      kpis: {
        totalTracks: total_tracks || 0,
        totalHours: parseFloat(total_hours) || 0,
        totalArtists: total_artists || 0,
        totalPlaylists: total_playlists || 0,
        avgBpm: parseFloat(avg_bpm) || 0,
        mostPlayedArtist: mostPlayedArtistResult?.artist_name || 'N/A',
        lastUpdated: last_updated || null
      },
      activity: {
        dailyTrend,
        monthlyTrend,
        hourlyTrend: fullHourlyTrend,
        recentlyPlayed
      },
      profile: {
        topArtists,
        topTracks,
        playlists
      },
      intelligence: {
        averages: {
          bpm: parseFloat(audioAverages?.bpm) || 0,
          energy: parseFloat(audioAverages?.energy) || 0,
          danceability: parseFloat(audioAverages?.danceability) || 0,
          loudness: parseFloat(audioAverages?.loudness) || 0,
        },
        comparativeAverages,
        bpmHistogram,
        energyDistribution,
        danceabilityDistribution,
        speechinessDistribution,
        topDanceable,
        topEnergetic
      },
      mood: {
        topMoodSongs,
        topWorkoutSongs,
        topFocusSongs
      },
      insights: {
        globalScores: {
          mood: parseFloat(globalScores?.mood_score) || 0,
          workout: parseFloat(globalScores?.workout_score) || 0,
          productivity: parseFloat(globalScores?.productivity_score) || 0,
        }
      },
      scatter: scatterData
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
