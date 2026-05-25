import subprocess
import sys

def run_script(script_name):
    print(f"\n{'='*50}\n🚀 RUNNING: {script_name}\n{'='*50}")
    try:
        # Use sys.executable to ensure we use the same Python environment
        result = subprocess.run([sys.executable, script_name], check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"\n❌ ERROR: {script_name} failed with exit code {e.returncode}")
        return False
    except Exception as e:
        print(f"\n❌ ERROR: Failed to run {script_name}: {str(e)}")
        return False

if __name__ == "__main__":
    print("🌟 STARTING FULL DATA PIPELINE 🌟")
    
    # 1. Fetch from Spotify and load into database
    if run_script("etl/extract.py"):
        # 2. Fetch missing audio features for any new tracks
        run_script("etl/load_audio_features.py")
        
    print("\n✅ FULL PIPELINE COMPLETE!")
