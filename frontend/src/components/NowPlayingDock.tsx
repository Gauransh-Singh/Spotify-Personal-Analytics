"use client";
import { useDashboard } from '@/lib/DashboardContext';

export default function NowPlayingDock() {
  const { data } = useDashboard();
  if (!data?.activity?.recentlyPlayed?.length) return null;

  const track = data.activity.recentlyPlayed[0];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '90px',
      background: 'rgba(20, 20, 20, 0.85)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      zIndex: 1000,
      boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <img src={track.album_image} alt={track.song_name} style={{ width: 64, height: 64, borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
        <div>
          <div style={{ fontSize: '0.75rem', color: '#1db954', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Now Playing</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{track.song_name}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{track.artist_name}</div>
        </div>
        
        {/* Fake playback controls for aesthetic */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2rem', color: 'rgba(255,255,255,0.7)' }}>
           <div style={{ width: '14px', height: '14px', borderTop: '2px solid', borderLeft: '2px solid', transform: 'rotate(-45deg)' }}></div>
           <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid #000', marginLeft: '4px' }}></div>
           </div>
           <div style={{ width: '14px', height: '14px', borderTop: '2px solid', borderRight: '2px solid', transform: 'rotate(45deg)' }}></div>
        </div>
      </div>
    </div>
  );
}
