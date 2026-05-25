"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music, Activity, BarChart2 } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Top Music', href: '/top-music', icon: Music },
    { name: 'Intelligence', href: '/audio-intelligence', icon: BarChart2 },
    { name: 'Smart Insights', href: '/smart-insights', icon: Activity },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '80px',
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 4rem',
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.05em' }}>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#1db954">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z" />
        </svg>
        <span style={{ color: '#fff' }}>Spotify</span>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '20px',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500, transition: '0.2s'
            }}>
              <item.icon size={18} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
