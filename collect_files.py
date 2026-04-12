import os
import shutil

# 🔹 Change this to your source folder
SOURCE_FOLDER = r"C:\Users\KALEL\Desktop\Aficagric"

# 🔹 Destination folder (it will be created automatically)
DEST_FOLDER = os.path.join(SOURCE_FOLDER, "ALL_FILES_COLLECTED")

def collect_files(source, destination):
    # Create destination folder if it doesn't exist
    os.makedirs(destination, exist_ok=True)

    for root, dirs, files in os.walk(source):
        # Skip the destination folder itself to avoid infinite loop
        if destination in root:
            continue

        for file in files:
            source_file = os.path.join(root, file)

            # Handle duplicate file names
            dest_file = os.path.join(destination, file)
            base, extension = os.path.splitext(file)
            counter = 1

            while os.path.exists(dest_file):
                dest_file = os.path.join(destination, f"{base}_{counter}{extension}")
                counter += 1

            shutil.copy2(source_file, dest_file)
            print(f"Copied: {source_file} → {dest_file}")

if __name__ == "__main__":
    collect_files(SOURCE_FOLDER, DEST_FOLDER)
    print("\n✅ All files collected successfully!")