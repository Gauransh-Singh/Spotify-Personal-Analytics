import os
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
from sqlalchemy import create_engine, text
import time

from load import (
    load_tracks,
    load_recently_played,
    load_playlists,
    load_playlist_tracks,
    load_top_tracks,
    load_top_artists
)

# LOAD ENVIRONMENT VARIABLES
load_dotenv("config/.env")

# SPOTIFY AUTHENTICATION
sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="""
        user-read-recently-played
        user-top-read
        playlist-read-private
        playlist-read-collaborative
        """
    )
)

# MYSQL CONNECTION
engine = create_engine(
    os.getenv("DATABASE_URL")
)

# GET LAST EXTRACTED TIMESTAMP
state_df = pd.read_sql(
    "SELECT last_played_at FROM etl_state WHERE id = 1",
    con=engine
)

last_played_at = int(
    state_df['last_played_at'][0]
)

print(f"\nLast Extracted Timestamp: {last_played_at}")

# FETCH NEW SONGS
results = sp.current_user_recently_played(
    limit=50,
    after=last_played_at
)

print(f"\nSpotify Returned {len(results['items'])} New Songs")

# FETCH PLAYLISTS
playlists_results = sp.current_user_playlists(limit=50)

# EMPTY LISTS
tracks_data = []
recently_played_data = []
playlists_data = []
playlist_tracks_data = []
top_tracks_data = []
top_tracks_data = []
top_artists_data = []

# =========================
# RECENTLY PLAYED
# =========================
for item in results['items']:

    track = item['track']

    if track is None:
        continue

    track_id = track['id']

    if track_id is None:
        continue

    tracks_data.append({
        "track_id": track['id'],
        "song_name": track['name'],
        "artist_name": track['artists'][0]['name'],
        "album_name": track['album']['name'],
        "release_date": track['album'].get('release_date'),
        "album_image": (
            track['album']['images'][0]['url']
            if track['album'].get('images')
            else None
        ),
        "duration_ms": track.get('duration_ms'),
        "isrc": track.get(
                "external_ids",
                {}
            ).get("isrc")
    })

    recently_played_data.append({
        "track_id": track_id,
        "played_at": item['played_at']
    })

# =========================
# PLAYLISTS
# =========================

for playlist in playlists_results['items']:

    if not playlist:
        continue

    playlist_id = playlist.get('id')

    if not playlist_id:
        continue

    image_url = None

    if playlist.get('images'):
        image_url = playlist['images'][0]['url']

    playlist_track_count = 0

    try:

        offset = 0

        while True:

            playlist_items = sp.playlist_tracks(
                playlist_id,
                limit=100,
                offset=offset
            )

            print(
                f"{playlist.get('name')} -> "
                f"{len(playlist_items['items'])} tracks"
            )

            if len(playlist_items['items']) == 0:
                break

            for playlist_item in playlist_items['items']:

                track = playlist_item.get('item')

                if track is None:
                    continue

                track_id = track.get('id')

                if track_id is None:
                    continue

                playlist_track_count += 1

                tracks_data.append({
                    "track_id": track['id'],
                    "song_name": track['name'],
                    "artist_name": track['artists'][0]['name'],
                    "album_name": track['album']['name'],
                    "release_date": track['album'].get('release_date'),
                    "album_image": (
                        track['album']['images'][0]['url']
                        if track['album'].get('images')
                        else None
                    ),
                    "duration_ms": track.get('duration_ms'),
                    "isrc": track.get(
                        "external_ids",
                        {}
                    ).get("isrc")
                })

                playlist_tracks_data.append({
                    "playlist_id": playlist_id,
                    "track_id": track_id,
                    "added_at": playlist_item.get('added_at')
                })

            offset += 100

        playlists_data.append({
            "playlist_id": playlist_id,
            "playlist_name": playlist.get('name'),
            "owner_name": playlist.get('owner', {}).get('display_name'),
            "total_tracks": playlist_track_count,
            "image_url": image_url
        })

    except Exception as e:

        print(
            f"Could not fetch tracks for playlist: "
            f"{playlist.get('name')}"
        )

        print(e)

# =========================
# TOP TRACKS
# =========================

for time_range in [
    "short_term",
    "medium_term",
    "long_term"
]:

    results = sp.current_user_top_tracks(
        limit=50,
        time_range=time_range
    )

    rank = 1

    for item in results['items']:

        track_id = item['id']

        tracks_data.append({
            "track_id": track['id'],
            "song_name": track['name'],
            "artist_name": track['artists'][0]['name'],
            "album_name": track['album']['name'],
            "release_date": track['album'].get('release_date'),
            "album_image": (
                track['album']['images'][0]['url']
                if track['album'].get('images')
                else None
            ),
            "duration_ms": track.get('duration_ms'),
            "isrc": track.get(
                "external_ids",
                {}
            ).get("isrc")
        })

        top_tracks_data.append({
            "track_id": track_id,
            "time_range": time_range,
            "rank_position": rank
        })

        rank += 1

# =========================
# TOP ARTISTS
# =========================

for time_range in [
    "short_term",
    "medium_term",
    "long_term"
]:

    results = sp.current_user_top_artists(
        limit=50,
        time_range=time_range
    )

    rank = 1

    for artist in results['items']:

        top_artists_data.append({
            "artist_id": artist['id'],
            "artist_name": artist['name'],
            "artist_image": (
                artist['images'][0]['url']
                if artist.get('images')
                else None
            ),
            "time_range": time_range,
            "rank_position": rank
        })

        rank += 1

# =========================
# DATAFRAMES
# =========================

tracks_df = pd.DataFrame(tracks_data)

recently_played_df = pd.DataFrame(recently_played_data)

playlists_df = pd.DataFrame(playlists_data)

print(f"\nTotal Playlist Tracks Collected: {len(playlist_tracks_data)}")

playlist_tracks_df = pd.DataFrame(
    playlist_tracks_data
)
top_tracks_df = pd.DataFrame(
    top_tracks_data
)
top_artists_df = pd.DataFrame(
    top_artists_data
)


# =========================
# RECENTLY PLAYED CLEANUP
# =========================

if not tracks_df.empty:
    tracks_df.sort_values(by='isrc', na_position='last', inplace=True)
    
    tracks_df.drop_duplicates(
        subset=['track_id'],
        keep='first',
        inplace=True
    )

if not recently_played_df.empty:

    recently_played_df['played_at'] = pd.to_datetime(
        recently_played_df['played_at']
    )

# =========================
# ISRC ENRICHMENT (NEW)
# =========================

if not tracks_df.empty:
    # Find tracks that still don't have an ISRC
    missing_isrc_mask = tracks_df['isrc'].isna()
    missing_ids = tracks_df[missing_isrc_mask]['track_id'].tolist()

    if missing_ids:
        print(f"\nFetching full metadata for {len(missing_ids)} tracks individually...")
        
        for track_id in missing_ids:
            try:
                # Fetch individually to prevent one bad ID from failing the rest
                track_info = sp.track(track_id)
                
                if track_info and track_info.get('external_ids', {}).get('isrc'):
                    isrc_val = track_info['external_ids']['isrc']
                    tracks_df.loc[
                        tracks_df['track_id'] == track_id, 'isrc'
                    ] = isrc_val
                    
                # Small pause to avoid hitting Spotify's rate limits
                time.sleep(0.1)

            except Exception as e:
                # If a specific track causes a 403, log it and keep going!
                print(f"Skipping track {track_id} - API Error: {e}")

# =========================
# DEBUG OUTPUT
# =========================

print("\nTRACKS:")
print(tracks_df.head())

print("\nRECENTLY PLAYED:")
print(recently_played_df.head())

print("\nPLAYLISTS:")
print(playlists_df.head())

print("\nPLAYLIST TRACKS:")
print(playlist_tracks_df.head())

# =========================
# LOAD DATA
# =========================

tracks_df = tracks_df.where(
    pd.notnull(tracks_df),
    None
)

if not tracks_df.empty:
    load_tracks(tracks_df)

load_playlists(playlists_df)

load_playlist_tracks(
    playlist_tracks_df
)
load_top_tracks(
    top_tracks_df
)
if not recently_played_df.empty:
    load_recently_played(recently_played_df)   
load_top_artists(
    top_artists_df
)

# =========================
# UPDATE ETL STATE
# =========================

if not recently_played_df.empty:

    latest_db_time = pd.read_sql(
        """
        SELECT MAX(played_at) AS latest_time
        FROM recently_played
        """,
        con=engine
    )

    latest_timestamp = int(
        pd.Timestamp(
            latest_db_time['latest_time'][0]
        ).timestamp() * 1000
    )

    update_query = f"""
    UPDATE etl_state
    SET last_played_at = {latest_timestamp}
    WHERE id = 1
    """

    with engine.begin() as connection:
        connection.execute(text(update_query))

    print("\nETL state updated!")

print("\nETL Pipeline Completed Successfully!")

