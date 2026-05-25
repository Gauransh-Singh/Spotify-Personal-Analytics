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

    inserted = 0
    skipped = 0

    with engine.begin() as connection:

        for _, row in tracks_df.iterrows():

            query = text("""
                INSERT IGNORE INTO tracks (
                    track_id,
                    song_name,
                    artist_name,
                    album_name,
                    release_date,
                    album_image,
                    duration_ms,
                    isrc
                )
                VALUES (
                    :track_id,
                    :song_name,
                    :artist_name,
                    :album_name,
                    :release_date,
                    :album_image,
                    :duration_ms,
                    :isrc
                )
            """)

            result = connection.execute(query, {
                "track_id": row['track_id'],
                "song_name": row['song_name'],
                "artist_name": row['artist_name'],
                "album_name": row['album_name'],
                "release_date": (
                    None
                    if pd.isna(row['release_date'])
                    else row['release_date']
                ),
                "album_image": (
                    None
                    if pd.isna(row['album_image'])
                    else row['album_image']
                ),
                "duration_ms": (
                    None
                    if pd.isna(row['duration_ms'])
                    else int(row['duration_ms'])
                ),
                "isrc": (
                    None
                    if pd.isna(row['isrc'])
                    else row['isrc']
                )
            })

            if result.rowcount > 0:
                inserted += 1
            else:
                skipped += 1

    print(f"\nTracks Inserted: {inserted}")
    print(f"Duplicate Tracks Skipped: {skipped}")


def load_playlists(playlists_df):

    if playlists_df.empty:
        print("No playlists to load.")
        return

    inserted = 0

    with engine.begin() as connection:

        for _, row in playlists_df.iterrows():

            query = text("""
                INSERT INTO playlists (
                    playlist_id,
                    playlist_name,
                    owner_name,
                    total_tracks,
                    image_url
                )
                VALUES (
                    :playlist_id,
                    :playlist_name,
                    :owner_name,
                    :total_tracks,
                    :image_url
                )
                ON DUPLICATE KEY UPDATE
                    playlist_name = VALUES(playlist_name),
                    owner_name = VALUES(owner_name),
                    total_tracks = VALUES(total_tracks),
                    image_url = VALUES(image_url)
            """)

            result = connection.execute(query, {
                "playlist_id": row['playlist_id'],
                "playlist_name": row['playlist_name'],
                "owner_name": row['owner_name'],
                "total_tracks": row['total_tracks'],
                "image_url": row['image_url']
            })

            inserted += result.rowcount

    print(f"Playlists Inserted: {inserted}")

def load_playlist_tracks(playlist_tracks_df):

    if playlist_tracks_df.empty:
        print("No playlist tracks to load.")
        return

    inserted = 0

    with engine.begin() as connection:

        for _, row in playlist_tracks_df.iterrows():

            query = text("""
                INSERT IGNORE INTO playlist_tracks (
                    playlist_id,
                    track_id,
                    added_at
                )
                VALUES (
                    :playlist_id,
                    :track_id,
                    :added_at
                )
            """)

            result = connection.execute(query, {
                "playlist_id": row['playlist_id'],
                "track_id": row['track_id'],
                "added_at": row['added_at']
            })

            inserted += result.rowcount

    print(
        f"Playlist Tracks Inserted: {inserted}"
    )

def load_top_tracks(top_tracks_df):

    if top_tracks_df.empty:
        print("No top tracks to load.")
        return

    inserted = 0

    with engine.begin() as connection:
       
        connection.execute(
        text("TRUNCATE TABLE top_tracks")
    )

        for _, row in top_tracks_df.iterrows():

            query = text("""
                INSERT IGNORE INTO top_tracks (
                    track_id,
                    time_range,
                    rank_position
                )
                VALUES (
                    :track_id,
                    :time_range,
                    :rank_position
                )
            """)

            result = connection.execute(query, {
                "track_id": row['track_id'],
                "time_range": row['time_range'],
                "rank_position": row['rank_position']
            })

            inserted += result.rowcount

    print(
        f"Top Tracks Inserted: {inserted}"
    )

def load_top_artists(top_artists_df):

    if top_artists_df.empty:
        print("No top artists to load.")
        return

    inserted = 0

    with engine.begin() as connection:

        connection.execute(
            text("TRUNCATE TABLE top_artists")
        )

        for _, row in top_artists_df.iterrows():

            query = text("""
                INSERT INTO top_artists (
                    artist_id,
                    artist_name,
                    artist_image,
                    time_range,
                    rank_position
                )
                VALUES (
                    :artist_id,
                    :artist_name,
                    :artist_image,
                    :time_range,
                    :rank_position
                )
            """)

            result = connection.execute(query, {
                "artist_id": row['artist_id'],
                "artist_name": row['artist_name'],
                "artist_image": row['artist_image'],
                "time_range": row['time_range'],
                "rank_position": row['rank_position']
            })

            inserted += result.rowcount

    print(
        f"Top Artists Inserted: {inserted}"
    )

# LOAD RECENTLY PLAYED TABLE
def load_recently_played(recently_played_df):

    if recently_played_df.empty:
        print("No recently played data to load.")
        return

    inserted = 0
    skipped = 0

    with engine.begin() as connection:

        for _, row in recently_played_df.iterrows():

            query = text("""
                INSERT IGNORE INTO recently_played (
                    track_id,
                    played_at
                )
                VALUES (
                    :track_id,
                    :played_at
                )
            """)

            result = connection.execute(query, {
                "track_id": row['track_id'],
                "played_at": row['played_at']
            })

            if result.rowcount > 0:
                inserted += 1
            else:
                skipped += 1

    print(f"\nRecently Played Inserted: {inserted}")
    print(f"Duplicate Recently Played Skipped: {skipped}")