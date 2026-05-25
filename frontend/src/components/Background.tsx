"use client";
import { useDashboard } from '@/lib/DashboardContext';

export default function Background() {
  const { data } = useDashboard();
  const bgImage = data?.activity?.recentlyPlayed?.[0]?.album_image || "https://i.scdn.co/image/ab67616d0000b273b1c4b76e216ee8f58e464240";

  return (
    <>
      <div className="ambient-background" style={{ backgroundImage: `url(${bgImage})` }}></div>
      <div className="animated-gradient-overlay"></div>
      <div className="ambient-overlay"></div>
    </>
  );
}
