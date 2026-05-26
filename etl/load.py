from sqlalchemy import create_engine, text
import pandas as pd
import os

# MYSQL CONNECTION
engine = create_engine(
    os.getenv("DATABASE_URL")
)

# LOAD TRACKS TABLE
def load_tracks(tracks_df):
    if tracks_df.empty:
        print("No tracks to load.")
        return

    with engine.begin() as connection:
        query = text("""
            INSERT IGNORE INTO tracks (
                track_id, song_name, artist_name, album_name, release_date, album_image, duration_ms, isrc
            ) VALUES (
                :track_id, :song_name, :artist_name, :album_name, :release_date, :album_image, :duration_ms, :isrc
            )
        """)
        
        # Convert to list of dicts for bulk insert (executemany)
        params = []
        for _, row in tracks_df.iterrows():
            params.append({
                "track_id": row['track_id'],
                "song_name": row['song_name'],
                "artist_name": row['artist_name'],
                "album_name": row['album_name'],
                "release_date": None if pd.isna(row['release_date']) else row['release_date'],
                "album_image": None if pd.isna(row['album_image']) else row['album_image'],
                "duration_ms": None if pd.isna(row['duration_ms']) else int(row['duration_ms']),
                "isrc": None if pd.isna(row['isrc']) else row['isrc']
            })
            
        result = connection.execute(query, params)

    print(f"\nTracks Processed (Bulk Inserted): {len(params)}")


def load_playlists(playlists_df):
    if playlists_df.empty:
        print("No playlists to load.")
        return

    with engine.begin() as connection:
        query = text("""
            INSERT INTO playlists (
                playlist_id, playlist_name, owner_name, total_tracks, image_url
            ) VALUES (
                :playlist_id, :playlist_name, :owner_name, :total_tracks, :image_url
            )
            ON DUPLICATE KEY UPDATE
                playlist_name = VALUES(playlist_name),
                owner_name = VALUES(owner_name),
                total_tracks = VALUES(total_tracks),
                image_url = VALUES(image_url)
        """)

        params = playlists_df.to_dict('records')
        connection.execute(query, params)

    print(f"Playlists Processed: {len(params)}")


def load_playlist_tracks(playlist_tracks_df):
    if playlist_tracks_df.empty:
        print("No playlist tracks to load.")
        return

    with engine.begin() as connection:
        query = text("""
            INSERT IGNORE INTO playlist_tracks (
                playlist_id, track_id, added_at
            ) VALUES (
                :playlist_id, :track_id, :added_at
            )
        """)

        params = playlist_tracks_df.to_dict('records')
        connection.execute(query, params)

    print(f"Playlist Tracks Processed: {len(params)}")


def load_top_tracks(top_tracks_df):
    if top_tracks_df.empty:
        print("No top tracks to load.")
        return

    with engine.begin() as connection:
        connection.execute(text("TRUNCATE TABLE top_tracks"))

        query = text("""
            INSERT IGNORE INTO top_tracks (
                track_id, time_range, rank_position
            ) VALUES (
                :track_id, :time_range, :rank_position
            )
        """)

        params = top_tracks_df.to_dict('records')
        connection.execute(query, params)

    print(f"Top Tracks Processed: {len(params)}")


def load_top_artists(top_artists_df):
    if top_artists_df.empty:
        print("No top artists to load.")
        return

    with engine.begin() as connection:
        connection.execute(text("TRUNCATE TABLE top_artists"))

        query = text("""
            INSERT INTO top_artists (
                artist_id, artist_name, artist_image, time_range, rank_position
            ) VALUES (
                :artist_id, :artist_name, :artist_image, :time_range, :rank_position
            )
        """)

        params = top_artists_df.to_dict('records')
        connection.execute(query, params)

    print(f"Top Artists Processed: {len(params)}")


# LOAD RECENTLY PLAYED TABLE
def load_recently_played(recently_played_df):
    if recently_played_df.empty:
        print("No recently played data to load.")
        return

    with engine.begin() as connection:
        query = text("""
            INSERT IGNORE INTO recently_played (
                track_id, played_at
            ) VALUES (
                :track_id, :played_at
            )
        """)

        # Convert to string format if it's datetime to avoid SQLAlchemy parsing issues
        params = []
        for _, row in recently_played_df.iterrows():
            params.append({
                "track_id": row['track_id'],
                "played_at": str(row['played_at'])
            })
            
        connection.execute(query, params)

    print(f"\nRecently Played Processed: {len(params)}")