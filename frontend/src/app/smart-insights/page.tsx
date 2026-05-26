"use client";
import { useDashboard } from '@/lib/DashboardContext';
import PageTransition from '@/components/PageTransition';
import { Activity, Zap, Brain, Target, Music, User, Clock, Flame } from 'lucide-react';

export default function SmartInsightsPage() {
  const { data, loading } = useDashboard();

  if (loading) return null;
  if (!data) return null;

  // Compute dynamic insights
  const preferredEnergy = data.intelligence.energyDistribution.reduce((prev: any, current: any) => (prev.count > current.count) ? prev : current).energy_level;
  
  const peakHourData = data.activity.hourlyTrend.reduce((prev: any, current: any) => (prev.count > current.count) ? prev : current);
  let peakHour = peakHourData.hour;
  const ampm = peakHour >= 12 ? 'PM' : 'AM';
  peakHour = peakHour % 12;
  peakHour = peakHour ? peakHour : 12;
  const peakTimeStr = `${peakHour} ${ampm}`;

  const formatTime = (ms: number) => {
    if (!ms) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTrackList = (tracks: any[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {tracks.slice(0, 5).map((track: any, idx: number) => (
        <div key={idx} className="track-list-item" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{idx + 1}</span>
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
  );

  return (
    <PageTransition>
      <div className="app-container" style={{ gap: '3rem' }}>
        <section>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Smart Insights</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
            Turning your raw data into actionable intelligence. Discover what drives your mood, focus, and productivity.
          </p>
        </section>

        {/* Global Scores - Top Row (Strict Horizontal) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          <div className="sleek-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b' }}>
              <Zap size={36} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Workout Score</div>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>{(data.insights.globalScores.workout * 100).toFixed(0)}</div>
            </div>
          </div>

          <div className="sleek-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(91, 140, 255, 0.1)', color: '#5b8cff' }}>
              <Brain size={36} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mood Score</div>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>{(data.insights.globalScores.mood * 100).toFixed(0)}</div>
            </div>
          </div>

          <div className="sleek-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '50%', backgroundColor: 'rgba(29, 185, 84, 0.1)', color: '#1db954' }}>
              <Target size={36} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Productivity Score</div>
              <div style={{ fontSize: '3rem', fontWeight: 800 }}>{(data.insights.globalScores.productivity * 100).toFixed(0)}</div>
            </div>
          </div>
        </section>

        {/* Dynamic Insight Cards - Second Row (Strict Horizontal) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div className="sleek-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Activity size={28} color="#ff4b4b" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>You prefer {preferredEnergy.toLowerCase()}-energy music</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Based on your listening history, this is your sonic sweet spot.</p>
          </div>

          <div className="sleek-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Music size={28} color="#1db954" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Your average BPM is {Math.round(data.intelligence.averages.bpm)}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Your music naturally flows at this tempo.</p>
          </div>

          <div className="sleek-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <User size={28} color="#5b8cff" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Top artist is {data.profile.topArtists.find((a: any) => a.time_range === 'long_term')?.artist_name || data.kpis.mostPlayedArtist}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>They absolutely dominate your all-time charts.</p>
          </div>

          <div className="sleek-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Clock size={28} color="#a0a0ab" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Peak listening time is {peakTimeStr}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>This is when you are most active musically.</p>
          </div>
        </section>

        {/* Lists - Bottom Grid (Strict 2x2) */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
          <div className="sleek-panel">
            <h3 style={{ marginBottom: '1.5rem', color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Zap size={22} /> Best Workout Songs</h3>
            {renderTrackList(data.mood.topWorkoutSongs)}
          </div>

          <div className="sleek-panel">
            <h3 style={{ marginBottom: '1.5rem', color: '#1db954', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Target size={22} /> Best Focus Songs</h3>
            {renderTrackList(data.mood.topFocusSongs)}
          </div>

          <div className="sleek-panel">
            <h3 style={{ marginBottom: '1.5rem', color: '#ff4b4b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Flame size={22} /> Most Energetic Songs</h3>
            {renderTrackList(data.intelligence.topEnergetic)}
          </div>

          <div className="sleek-panel">
            <h3 style={{ marginBottom: '1.5rem', color: '#5b8cff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity size={22} /> Most Danceable Songs</h3>
            {renderTrackList(data.intelligence.topDanceable)}
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
