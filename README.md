# 🎵 Spotify Personal Analytics Dashboard

A full-stack, fully automated personal music analytics platform designed to track, store, and analyze my Spotify listening history. By integrating the Spotify Web API with advanced audio intelligence (Melodata API), this project uncovers the hidden patterns behind my music taste — from real-time listening habits to deep musical theory analysis.

**Live Demo:** [spotify-personal-analytics.vercel.app](https://spotify-personal-analytics.vercel.app)

---

## 🎯 The Motivation
**How does my music taste evolve over time, and what does the underlying audio data reveal about my listening habits?**
Unlike Spotify Wrapped, which only provides a static yearly summary, this dashboard offers a dynamic, 365-day-a-year look into my musical behavior, automatically tracking every single track I listen to.

## 📊 Key Dashboard Capabilities

### 1. Real-Time "Personal Frequency"
Tracks the exact number of hours completely immersed in music, providing a live count of unique tracks, artists discovered, and an instantly updating "Absolute Favorite Artist."

### 2. Audio Intelligence & Mood Analysis
Leverages the Melodata API to extract underlying track features, charting:
- **Tempo (BPM):** Tracking the speed and pacing of my listening.
- **Energy & Danceability:** Identifying periods of high-activity vs relaxation.
- **Positivity (Valence):** Analyzing the emotional mood of the music.
- **Musical Key:** Tracking the most frequent musical keys and scales I gravitate towards.

### 3. Dynamic Taste Evolution (Radar Chart)
A custom comparative radar chart that evaluates my "All-Time" listening taste against my "Last 4 Weeks", visualizing how my musical mood is shifting over time.

---

## 🛠️ Tech Stack
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 14, React, Recharts | Server-side rendering, responsive charts, modern interactive dashboard. |
| **Styling** | Vanilla CSS | Custom glassmorphism, responsive grid layouts, animations. |
| **Backend ETL** | Python (Pandas, Spotipy, Requests) | Fetching Spotify history, parsing API JSON, handling API rate limits. |
| **Database** | MySQL (Aiven Cloud) | Relational data storage, robust `JOIN` queries, `ON DUPLICATE KEY` handling. |
| **Automation** | GitHub Actions | Scheduled cron jobs executing the Python ETL pipeline every 2 hours natively in the cloud. |

---

## 📁 Project Structure
```text
spotify-personal-analytics/
├── config/
│   └── .env                   # Ignored secure environment variables
├── database/
│   └── connection.py          # SQLAlchemy engine configuration
├── etl/
│   ├── extract.py             # Spotify API polling & insertion
│   ├── load.py                # Core database insertion logic
│   └── load_audio_features.py # Melodata API audio intelligence polling
├── frontend/
│   ├── src/app/
│   │   ├── api/               # Next.js backend API routes
│   │   ├── layout.tsx         # Root app layout & viewport configs
│   │   └── page.tsx           # Main dashboard UI
│   ├── src/components/        # Navbar, Sidebar, Charts, Backgrounds
│   └── src/lib/
│       └── db.ts              # Aiven MySQL connection pool
├── .github/workflows/
│   └── spotify-etl.yml        # GitHub Actions Cron Job (runs every 2 hrs)
├── run_pipeline.py            # Master script coordinating the ETL process
└── requirements.txt           # Python backend dependencies
```

---

## 🔄 The ETL Pipeline — Phases

### Phase 1 — Data Extraction (Spotify API)
- Connects to the Spotify Web API using the `spotipy` library via OAuth2.
- Extracts the 50 most recently played tracks, alongside Top Tracks, Top Artists, and user Playlists.
- Flattens the nested JSON responses into structured Pandas DataFrames.

### Phase 2 — Core Data Loading (Aiven MySQL)
- Connects to a cloud-hosted Aiven MySQL database using `SQLAlchemy`.
- Executes robust `INSERT IGNORE` and `ON DUPLICATE KEY UPDATE` SQL commands to ensure the database remains perfectly synchronized without ever creating duplicate rows.

### Phase 3 — Audio Intelligence Enrichment
- Queries the database for all tracks `WHERE af.track_id IS NULL` (tracks that have not yet been analyzed).
- Hits the Melodata API using the track's ISRC code to fetch advanced audio features (BPM, Energy, Positivity, Key).
- Merges these features back into the `audio_features` MySQL table.

### Phase 4 — Automation (GitHub Actions)
- The entire `run_pipeline.py` script is orchestrated by a GitHub Action.
- Runs on a strict `0 */2 * * *` (Every 2 Hours) cron schedule to guarantee that no Spotify listening history is ever missed (due to Spotify's 50-track history limit).
- Securely injects `SPOTIPY` secrets and the `.cache` token during the cloud runtime.

---

## 🗄️ Database Schema & SQL Views
The Aiven MySQL database is structured relationally to optimize Next.js API querying:
- `tracks`: Core track metadata (ID, Name, Artist, Album, Duration, Image).
- `recently_played`: A pure time-series log of every timestamped song play.
- `audio_features`: 1-to-1 relationship with `tracks`, housing float values for acoustic properties.
- `top_artists` / `top_tracks`: Rolling rankings based on short/medium/long term ranges.
- `playlists` / `playlist_tracks`: Relational mapping of track curation.

---

## 👨‍💻 About
**Gauransh Singh**

*   **Portfolio:** [gauransh-singh.vercel.app](https://gauransh-singh.vercel.app)
*   **LinkedIn:** [linkedin.com/in/gauransh-singh-211586294](https://www.linkedin.com/in/gauransh-singh-211586294)

*Built as a passionate exploration of data engineering, cloud automation, and full-stack web development.*
