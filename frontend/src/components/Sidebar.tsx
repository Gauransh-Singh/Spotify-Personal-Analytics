"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Music, Activity, BarChart2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Top Music', href: '/top-music', icon: Music },
    { name: 'Audio Intelligence', href: '/audio-intelligence', icon: BarChart2 },
    { name: 'Smart Insights', href: '/smart-insights', icon: Activity },
  ];

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#000000',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      zIndex: 100,
    }}>
      <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1.2rem', paddingLeft: '1rem' }}>
        Personal Analytics
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: '0.2s'
            }}>
              <item.icon size={20} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
