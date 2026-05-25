"use client";
import { useDashboard } from '@/lib/DashboardContext';
import { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { Clock, Trophy, Disc3, Mic2 } from 'lucide-react';

export default function TopMusicPage() {
  const { data, loading } = useDashboard();
  const [timeRange, setTimeRange] = useState('short_term');

  if (loading) return null; // Global skeleton handles this
  if (!data) return null;

  // Filter based on selected tab
  const filteredArtists = data.profile.topArtists.filter((a: any) => a.time_range === timeRange);
  const filteredTracks = data.profile.topTracks.filter((t: any) => t.time_range === timeRange);
  
  // Hero Elements (Rank #1)
  const heroArtist = filteredArtists[0];
  const heroTrack = filteredTracks[0];

  // Remaining Elements (Ranks #2 - #10)
  const otherArtists = filteredArtists.slice(1, 10);
  const otherTracks = filteredTracks.slice(1, 10);

  // Duration Analysis
  const avgDurationMs = filteredTracks.length ? filteredTracks.reduce((acc:any, t:any) => acc + (t.duration_ms || 0), 0) / filteredTracks.length : 0;
  const longestTrack = [...filteredTracks].sort((a:any, b:any) => (b.duration_ms || 0) - (a.duration_ms || 0))[0];
  const shortestTrack = [...filteredTracks].sort((a:any, b:any) => (a.duration_ms || 0) - (b.duration_ms || 0))[0];

  const formatMs = (ms: number) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <PageTransition>
      <div className="app-container" style={{ gap: '4rem' }}>
        
        {/* Header & Pill Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Top Music</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Your heavy rotation and all-time favorites.</p>
          </div>
          
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
            {[
              { id: 'short_term', label: 'Last 4 Weeks' },
              { id: 'medium_term', label: '6 Months' },
              { id: 'long_term', label: 'All Time' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                style={{
                  background: timeRange === tab.id ? 'var(--accent)' : 'transparent',
                  color: timeRange === tab.id ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  fontWeight: timeRange === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: timeRange === tab.id ? '0 4px 12px rgba(29, 185, 84, 0.3)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SPOTLIGHT HERO SECTION */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* Hero Artist */}
          {heroArtist && (
            <div style={{ width: '552px', maxWidth: '100%', height: '400px', position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroArtist.artist_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  <Trophy size={14} /> #1 Artist
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.1, wordBreak: 'break-word' }}>{heroArtist.artist_name}</h2>
              </div>
            </div>
          )}

          {/* Hero Track */}
          {heroTrack && (
            <div style={{ width: '552px', maxWidth: '100%', height: '400px', position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroTrack.album_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(10px) brightness(0.6)', transform: 'scale(1.1)' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: '2rem', minWidth: 0 }}>
                <img src={heroTrack.album_image} alt={heroTrack.song_name} style={{ width: 140, height: 140, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                    <Disc3 size={14} /> #1 Track
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#fff', lineHeight: 1.2, marginBottom: '0.25rem', overflowWrap: 'break-word', wordBreak: 'break-word', hyphens: 'auto' }}>{heroTrack.song_name}</h2>
                  <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                     <Mic2 size={16} style={{ flexShrink: 0 }} /> {heroTrack.artist_name}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    {heroTrack.energy >= 0.7 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255, 75, 75, 0.3)' }}>
                        🔥 High Energy
                      </span>
                    )}
                    {heroTrack.bpm > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(91, 140, 255, 0.2)', color: '#5b8cff', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(91, 140, 255, 0.3)' }}>
                        ⚡ {Math.round(heroTrack.bpm)} BPM
                      </span>
                    )}
                    {heroTrack.danceability >= 0.7 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(29, 185, 84, 0.2)', color: '#1db954', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(29, 185, 84, 0.3)' }}>
                        💃 Danceable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginTop: '2rem' }}>
          
          {/* Visual Artist Grid */}
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Artists in Rotation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '2rem' }}>
              {otherArtists.map((artist: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={artist.artist_image} alt={artist.artist_name} className="hover-scale-artist" style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} />
                    <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#1a1a1f', color: 'var(--text-secondary)', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, border: '2px solid rgba(255,255,255,0.1)' }}>
                      {artist.rank_position}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{artist.artist_name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* Billboard Tracks List */}
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Trending Tracks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {otherTracks.map((track: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }} className="hover-bg">
                    <span style={{ width: '20px', textAlign: 'right', color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 600 }}>{track.rank_position}</span>
                    <img src={track.album_image} alt={track.song_name} style={{ width: 48, height: 48, borderRadius: '4px' }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{track.song_name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{track.artist_name}</div>
                    </div>
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                      {formatMs(track.duration_ms)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Duration Analysis - Full Width */}
        <div className="sleek-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={32} color="#ffb84d" />
              <div>
                 <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>Duration Analysis</h3>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Song Length</div>
              </div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#ffb84d', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>{formatMs(avgDurationMs)}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {shortestTrack && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortest Track</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <img src={shortestTrack.album_image} alt="shortest" style={{ width: 48, height: 48, borderRadius: '6px' }} />
                  <div style={{ overflow: 'hidden', textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '150px' }}>{shortestTrack.song_name}</div>
                    <div style={{ color: '#ff4d4d', fontWeight: 600, fontSize: '0.95rem' }}>{formatMs(shortestTrack.duration_ms)}</div>
                  </div>
                </div>
              </div>
            )}

            {longestTrack && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Longest Track</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ overflow: 'hidden', textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '150px' }}>{longestTrack.song_name}</div>
                    <div style={{ color: '#1db954', fontWeight: 600, fontSize: '0.95rem' }}>{formatMs(longestTrack.duration_ms)}</div>
                  </div>
                  <img src={longestTrack.album_image} alt="longest" style={{ width: 48, height: 48, borderRadius: '6px' }} />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </PageTransition>
  );
}
