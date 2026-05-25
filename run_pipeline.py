import subprocess
import sys

def run_script(script_name):
    print(f"\n{'='*50}\n🚀 RUNNING: {script_name}\n{'='*50}")
    try:
        # Use sys.executable to ensure we use the same Python environment
        result = subprocess.run([sys.executable, script_name], check=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"\nERROR: {script_name} failed with exit code {e.returncode}")
        return False
    except Exception as e:
        print(f"\nERROR: Failed to run {script_name}: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n" + "="*50)
    print("STARTING FULL DATA PIPELINE")
    print("="*50 + "\n")
    
    if run_script("etl/extract.py") and run_script("etl/load_audio_features.py"):
        print("\n" + "="*50)
        print("PIPELINE COMPLETED SUCCESSFULLY")
        print("="*50 + "\n")
        print("\nFULL PIPELINE COMPLETE!")
    else:
        print("\n" + "="*50)
        print("PIPELINE FAILED")
        print("="*50 + "\n")
        sys.exit(1)
