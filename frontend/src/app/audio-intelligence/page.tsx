"use client";
import { useDashboard } from '@/lib/DashboardContext';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip as RechartsTooltip, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { Flame } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function AudioIntelligencePage() {
  const { data, loading } = useDashboard();

  if (loading) return null; // Handled by global context visually if needed, but PageTransition handles mounting well
  if (!data) return null;

  const getSliceColor = (label: string) => {
    if (label === 'High' || label === 'Spoken Word') return '#ff4b4b'; // Vibrant Red
    if (label === 'Medium' || label === 'Mixed') return '#1db954'; // Spotify Green
    return '#5b8cff'; // Sleek Blue
  };

  const formatTime = (ms: number) => {
    if (!ms) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <PageTransition>
      <div className="app-container" style={{ gap: '3rem' }}>
        
        <section>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Audio Intelligence</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Dive deep into the sonic characteristics of your favorite music. We map out the tempo, energy, and danceability to understand exactly what gets you moving.
          </p>
        </section>

        {/* KPI Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem', marginBottom: '4rem' }}>
          <div className="sleek-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Average BPM</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#1db954' }}>{Math.round(data.intelligence.averages.bpm)}</div>
          </div>
          <div className="sleek-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Avg Energy</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#ff4b4b' }}>{Math.round(data.intelligence.averages.energy * 100)}%</div>
          </div>
          <div className="sleek-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Avg Danceability</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#5b8cff' }}>{Math.round(data.intelligence.averages.danceability * 100)}%</div>
          </div>
          <div className="sleek-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Avg Loudness</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#a0a0ab' }}>{data.intelligence.averages.loudness.toFixed(1)} dB</div>
          </div>
        </section>

        {/* The "Vibe Matrix" */}
        <section>
          <div className="sleek-panel">
            <h3 style={{ marginBottom: '0.5rem', color: '#fff', fontSize: '1.8rem' }}>The Vibe Matrix</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
              Every dot is a song you love. X-Axis is Danceability, Y-Axis is Energy. The larger the dot, the faster the tempo (BPM). Hover to explore your sonic landscape.
            </p>
            
            <div style={{ height: 600, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="x" name="Danceability" domain={['dataMin - 0.05', 'dataMax + 0.05']} stroke="rgba(255,255,255,0.2)" tick={{fontSize: 12, fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(val) => val.toFixed(3)} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="y" name="Energy" domain={['dataMin - 0.05', 'dataMax + 0.05']} stroke="rgba(255,255,255,0.2)" tick={{fontSize: 12, fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(val) => val.toFixed(3)} axisLine={false} tickLine={false} />
                  <ZAxis type="number" dataKey="z" range={[60, 600]} name="BPM" />
                  <RechartsTooltip 
                    cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} 
                    contentStyle={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: 'rgba(20,20,20,0.95)', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', display: 'flex', gap: '1rem', minWidth: '280px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                            <img src={d.album_image} alt="album" style={{ width: 80, height: 80, borderRadius: '8px' }} />
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>{d.song_name}</p>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>{d.artist_name}</p>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                <div>Dance: {Math.round(d.x * 100)}%</div>
                                <div>Energy: {Math.round(d.y * 100)}%</div>
                                <div>BPM: {Math.round(d.z)}</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter name="Songs" data={data.scatter} stroke="rgba(255,255,255,0.1)" strokeWidth={1}>
                    {data.scatter.map((entry: any, index: number) => {
                       // Massive color spectrum based on Danceability (Hue) and Energy (Lightness)
                       const color = `hsl(${Math.round(entry.x * 360)}, 80%, ${Math.max(40, Math.round(entry.y * 70))}%)`;
                       return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.7} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 4 Distribution Charts Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginTop: '4rem', marginBottom: '4rem' }}>
          
          <div className="sleek-panel" style={{ height: 420 }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>BPM Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.intelligence.bpmHistogram}>
                <defs>
                  <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1db954" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1db954" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="speed" stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#a0a0ab" fontSize={12} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="count" stroke="#1db954" fillOpacity={1} fill="url(#colorBpm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="sleek-panel" style={{ height: 420, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Energy Distribution</h3>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.intelligence.energyDistribution} innerRadius={85} outerRadius={120} paddingAngle={5} dataKey="count" nameKey="energy_level" stroke="none">
                    {data.intelligence.energyDistribution.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={getSliceColor(entry.energy_level)} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span style={{ color: '#a0a0ab', fontSize: '0.9rem' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sleek-panel" style={{ height: 420, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Danceability Distribution</h3>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.intelligence.danceabilityDistribution} innerRadius={85} outerRadius={120} paddingAngle={5} dataKey="count" nameKey="danceability_level" stroke="none">
                    {data.intelligence.danceabilityDistribution.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={getSliceColor(entry.danceability_level)} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span style={{ color: '#a0a0ab', fontSize: '0.9rem' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="sleek-panel" style={{ height: 420, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', color: 'white' }}>Speechiness Distribution</h3>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.intelligence.speechinessDistribution} innerRadius={85} outerRadius={120} paddingAngle={5} dataKey="count" nameKey="speechiness_level" stroke="none">
                    {data.intelligence.speechinessDistribution.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={getSliceColor(entry.speechiness_level)} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span style={{ color: '#a0a0ab', fontSize: '0.9rem' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Peak Energy & Top Mood Songs */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div className="sleek-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Flame size={24} color="#ff4b4b" />
              <h3 style={{ margin: 0, color: 'white' }}>Peak Energy & Workout</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              These tracks hold your highest calculated workout scores, blending high tempo and massive energy.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.mood.topWorkoutSongs.slice(0, 5).map((track: any, idx: number) => (
                <div key={idx} className="track-list-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ color: '#ff4b4b', fontWeight: 600, width: '40px', textAlign: 'center', fontSize: '0.9rem' }}>{(track.workout_score * 100).toFixed(0)}</span>
                    <img src={track.album_image || 'https://via.placeholder.com/48'} alt="Album Art" />
                    <div className="track-info">
                      <span className="track-name">{track.song_name}</span>
                      <span className="track-artist">{track.artist_name}</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {formatTime(track.duration_ms)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sleek-panel">
            <h3 style={{ marginBottom: '1.5rem', color: '#5b8cff' }}>✨ Top Mood Songs</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Tracks with an ideal blend of positivity and energy for a bright sonic landscape.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.mood.topMoodSongs.slice(0, 5).map((track: any, idx: number) => (
                <div key={idx} className="track-list-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ color: '#5b8cff', fontWeight: 600, width: '40px', textAlign: 'center', fontSize: '0.9rem' }}>{(track.mood_score * 100).toFixed(0)}</span>
                    <img src={track.album_image || 'https://via.placeholder.com/48'} alt="Album Art" />
                    <div className="track-info">
                      <span className="track-name">{track.song_name}</span>
                      <span className="track-artist">{track.artist_name}</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {formatTime(track.duration_ms)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
