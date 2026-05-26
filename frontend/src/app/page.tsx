"use client";
import { useState, useRef, useEffect } from 'react';
import { useDashboard } from '@/lib/DashboardContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { PlayCircle, Disc3, Activity, Clock, X } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function Home() {
  const { data, loading } = useDashboard();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlistData, setPlaylistData] = useState<any>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playlistData && modalRef.current) {
      setTimeout(() => {
        if (modalRef.current) modalRef.current.scrollTop = 0;
      }, 10);
    }
  }, [playlistData]);

  const openPlaylist = async (id: string) => {
    setSelectedPlaylistId(id);
    setPlaylistData(null);
    setLoadingPlaylist(true);
    try {
      const res = await fetch(`/api/playlists/${id}`);
      const d = await res.json();
      setPlaylistData(d);
    } catch(err) {
      console.error(err);
    }
    setLoadingPlaylist(false);
  };

  const closePlaylist = () => {
    setSelectedPlaylistId(null);
    setPlaylistData(null);
  };

  const formatMs = (ms: number) => {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '4rem 2rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ height: '120px', width: '80%', background: 'var(--surface)', borderRadius: '16px', animation: 'pulse 2s infinite' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div style={{ height: '400px', background: 'var(--surface)', borderRadius: '16px', animation: 'pulse 2s infinite' }}></div>
        <div style={{ height: '400px', background: 'var(--surface)', borderRadius: '16px', animation: 'pulse 2s infinite' }}></div>
      </div>
    </div>
  );
  if (!data || data.error) return <div style={{ padding: '4rem', textAlign: 'center' }}>Error loading data.</div>;

  const shortTerm = data.intelligence.comparativeAverages?.find((a:any) => a.time_range === 'short_term') || data.intelligence.averages;
  const longTerm = data.intelligence.comparativeAverages?.find((a:any) => a.time_range === 'long_term') || data.intelligence.averages;
  
  const shortEnergy = Math.round(shortTerm?.energy * 100) || 50;
  const longEnergy = Math.round(longTerm?.energy * 100) || 50;
  const shortDance = Math.round(shortTerm?.danceability * 100) || 50;
  const longDance = Math.round(longTerm?.danceability * 100) || 50;

  const lastPlayedTrack = data.activity.recentlyPlayed?.[0];
  const lastPlayedImage = lastPlayedTrack?.album_image;
  
  const radarData = [
    { subject: 'Energy', A: shortEnergy, B: longEnergy, fullMark: 100 },
    { subject: 'Danceability', A: shortDance, B: longDance, fullMark: 100 },
    { subject: 'Positivity (Mood)', A: Math.round((shortEnergy + shortDance) / 2), B: Math.round((longEnergy + longDance) / 2), fullMark: 100 },
    { subject: 'Loudness', A: Math.round(((shortTerm?.loudness + 60) / 60) * 100) || 50, B: Math.round(((longTerm?.loudness + 60) / 60) * 100) || 50, fullMark: 100 },
    { subject: 'Tempo (BPM)', A: Math.min(100, Math.round(((shortTerm?.bpm - 50) / 150) * 100)) || 50, B: Math.min(100, Math.round(((longTerm?.bpm - 50) / 150) * 100)) || 50, fullMark: 100 },
  ];

  return (
    <>
      <PageTransition>
        <div className="app-container">
        <section style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Activity size={20} />
            <span>Your Personal Frequency</span>
          </div>
          {data?.kpis?.lastUpdated && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', marginLeft: '2.2rem' }}>
              Last Synced {new Date(data.kpis.lastUpdated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px', margin: 0 }}>
              <h1 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 800, fontSize: '4rem', letterSpacing: '-0.04em' }}>
                Hey, <span className="text-gradient">Gauransh.</span>
              </h1>
              <p className="narrative-text">
                You've spent <strong>{data.kpis.totalHours.toFixed(0)} hours</strong> completely immersed in music, 
                discovering <strong>{data.kpis.totalTracks.toLocaleString()} tracks</strong> from <strong>{data.kpis.totalArtists.toLocaleString()} artists</strong>. 
                Your absolute favorite artist right now is <strong className="text-gradient">{data.kpis.mostPlayedArtist}</strong>.
              </p>
            </div>

            {lastPlayedImage && (
              <div style={{ flexShrink: 0, position: 'relative', width: 300, height: 300 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#111', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}></div>
                <img 
                  src={lastPlayedImage} 
                  alt={lastPlayedTrack?.song_name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    animation: 'spin 12s linear infinite',
                    border: '8px solid #222'
                  }} 
                />
                {/* Center hole for the vinyl record look */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 40, background: '#000', borderRadius: '50%', border: '2px solid #333', zIndex: 10 }}></div>
              </div>
            )}
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          <div className="sleek-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Disc3 size={24} color="var(--accent)" />
              <h3 style={{ margin: 0, color: 'white' }}>Taste Evolution (DNA)</h3>
            </div>
            <div style={{ flex: 1, minHeight: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 13 }} />
                  <Radar name="Last 4 Weeks" dataKey="A" stroke="#1db954" strokeWidth={3} fill="#1db954" fillOpacity={0.5} />
                  <Radar name="All Time" dataKey="B" stroke="#5b8cff" strokeWidth={2} fill="#5b8cff" fillOpacity={0.2} strokeDasharray="5 5" />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sleek-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <PlayCircle size={24} color="var(--accent)" />
              <h3 style={{ margin: 0, color: 'white' }}>Recently Played</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.activity.recentlyPlayed?.slice(0, 6).map((track: any, idx: number) => (
                <div key={idx} className="track-list-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ width: '20px', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>{idx + 1}</span>
                    <img src={track.album_image} alt={track.song_name} />
                    <div className="track-info">
                      <span className="track-name">{track.song_name}</span>
                      <span className="track-artist">{track.artist_name}</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {formatMs(track.duration_ms)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '2rem' }}>
          
          <div className="sleek-panel" style={{ height: 400 }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Daily Listening Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activity.dailyTrend}>
                <XAxis dataKey="date" stroke="#a0a0ab" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} axisLine={false} tickLine={false} />
                <YAxis stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{stroke: 'rgba(255,255,255,0.1)'}} />
                <Line type="monotone" dataKey="count" stroke="#1db954" strokeWidth={4} dot={{r: 4, fill: '#1db954', strokeWidth: 0}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div className="sleek-panel" style={{ height: 350 }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Hourly Heatmap</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.activity.hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="#a0a0ab" fontSize={12} tickFormatter={(val) => `${val}:00-${val+1}:59`} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                  <RechartsTooltip labelFormatter={(val) => `${val}:00-${Number(val)+1}:59`} contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="count" fill="#1db954" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="sleek-panel" style={{ height: 350 }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'white' }}>Monthly Trend</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.activity.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="count" fill="#5b8cff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="sleek-panel" style={{ height: 350, overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'white', position: 'sticky', top: 0, zIndex: 10 }}>Your Playlists</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                {data.profile.playlists?.map((playlist:any) => (
                  <div key={playlist.playlist_id} onClick={() => openPlaylist(playlist.playlist_id)} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={playlist.image_url || 'https://i.scdn.co/image/ab67616d0000b273b1c4b76e216ee8f58e464240'} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playlist.playlist_name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>{playlist.total_tracks} tracks</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>
      </PageTransition>

      {selectedPlaylistId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }} onClick={closePlaylist}>
          <div ref={modalRef} style={{ width: '100%', maxWidth: '800px', backgroundColor: '#121212', height: '100%', overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.1)', animation: 'slideInRight 0.3s forwards' }} onClick={e => e.stopPropagation()}>
            {loadingPlaylist ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading playlist...</div>
            ) : playlistData?.error ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ marginBottom: '1rem', color: '#ff4d4d' }}>{playlistData.error}</div>
                <button onClick={closePlaylist} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
              </div>
            ) : playlistData && playlistData.playlist ? (
              <div style={{ padding: '2rem 3rem' }}>
                <button onClick={closePlaylist} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'absolute', top: '2rem', right: '2rem' }}>
                  <X size={24} />
                </button>
                
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', marginBottom: '3rem' }}>
                  <img src={playlistData.playlist.image_url || 'https://i.scdn.co/image/ab67616d0000b273b1c4b76e216ee8f58e464240'} style={{ width: '200px', height: '200px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Playlist</div>
                    <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>{playlistData.playlist.playlist_name}</h1>
                    <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#fff' }}>{playlistData.playlist.owner_name}</strong> • {playlistData.playlist.total_tracks} songs
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', color: 'var(--text-tertiary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div style={{ width: '40px', textAlign: 'center' }}>#</div>
                  <div style={{ flex: 1 }}>Title</div>
                  <div style={{ width: '100px', textAlign: 'right' }}><Clock size={16} /></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {playlistData.tracks.map((track:any, idx:number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '8px', transition: 'background 0.2s' }} className="track-list-item">
                      <div style={{ width: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>{idx + 1}</div>
                      <img src={track.album_image} style={{ width: 40, height: 40, borderRadius: '4px', marginRight: '1rem' }} />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.song_name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{track.artist_name}</div>
                      </div>
                      <div style={{ width: '100px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{formatMs(track.duration_ms)}</div>
                    </div>
                  ))}
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
