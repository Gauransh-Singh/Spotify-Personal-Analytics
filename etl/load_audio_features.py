import pandas as pd
import requests
import time
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv("config/.env")

# =========================
# CONFIGURATION
# =========================

MELODATA_API_KEY = os.getenv("MELODATA_API_KEY")
MELODATA_ENDPOINT = "https://melodata.voltenworks.com/api/v1/tracks"

# Your existing MySQL connection
engine = create_engine(
    os.getenv("DATABASE_URL")
)

# =========================
# HELPER FUNCTION
# =========================
def get_musical_key(key_int, mode_int):
    """Translates API integers into a readable musical key string."""
    if key_int is None or key_int < 0:
        return None
        
    pitch_classes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    modes = ['Minor', 'Major']
    
    try:
        pitch = pitch_classes[int(key_int)]
        mode = modes[int(mode_int)] if mode_int in [0, 1] else "" 
        return f"{pitch} {mode}".strip()
    except (IndexError, ValueError, TypeError):
        return None

# =========================
# 1. EXTRACT TRACK IDs & ISRCs
# =========================
print("Fetching pending tracks from database...")
with engine.connect() as conn:
    # Pull both ID and ISRC, ensuring ISRC actually exists
    query = """
        SELECT t.track_id, t.isrc
        FROM tracks t
        LEFT JOIN audio_features af ON t.track_id = af.track_id
        WHERE af.track_id IS NULL 
        AND t.isrc IS NOT NULL
    """
    tracks_df = pd.read_sql(query, con=conn)

# Convert DataFrame to a list of dictionaries for easy iteration
tracks_to_process = tracks_df.to_dict('records')
print(f"Found {len(tracks_to_process)} tracks ready for audio features.")

# =========================
# 2. FETCH & LOAD DATA
# =========================
headers = {
    "Authorization": f"Bearer {MELODATA_API_KEY}",
    "Content-Type": "application/json"
}

inserted = 0

with engine.begin() as connection:
    for row in tracks_to_process:
        track_id = row['track_id']
        isrc = row['isrc']
        
        try:
            response = requests.get(
                f"{MELODATA_ENDPOINT}/{isrc}/features",
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 202:
                print(
                    f"{isrc} still analyzing..."
                )

            elif response.status_code == 200:
                data = response.json()

                features = data.get(
                    "data",
                    {}
                ).get(
                    "features",
                    {}
                )

                print(features)
                
                sql = text("""
                    INSERT INTO audio_features (
                        track_id, bpm, energy, danceability, loudness, 
                        speechiness, musical_key, key_confidence
                    ) VALUES (
                        :track_id, :bpm, :energy, :danceability, :loudness, 
                        :speechiness, :musical_key, :key_confidence
                    )
                    ON DUPLICATE KEY UPDATE
                        bpm = VALUES(bpm),
                        energy = VALUES(energy),
                        danceability = VALUES(danceability),
                        loudness = VALUES(loudness),
                        speechiness = VALUES(speechiness),
                        musical_key = VALUES(musical_key),
                        key_confidence = VALUES(key_confidence)
                """)
                
                # Insert into DB using the Spotify track_id
                connection.execute(sql, {
                    "track_id": track_id,
                    "bpm": features.get("bpm"),
                    "energy": features.get("energy"),
                    "danceability": features.get("danceability"),
                    "loudness": features.get("loudness"),
                    "speechiness": features.get("speechiness"),
                    "musical_key": features.get("key"),
                    "key_confidence": features.get("key_confidence")
                })
                
                inserted += 1
                
            else:
                print(f"Failed to fetch ISRC {isrc} (Track: {track_id}): {response.status_code} - {response.text}")
            
            # Rate limit protection
            time.sleep(0.15) 

        except Exception as e:
            print(f"Error processing track {track_id} (ISRC: {isrc}): {e}")

print(f"\nSuccessfully enriched {inserted} tracks with audio features!")
