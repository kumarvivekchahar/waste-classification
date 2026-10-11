from PIL import Image
import os

DATASET_PATH = "train"

removed = 0

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        path = os.path.join(root, file)

        try:
            img = Image.open(path)

            # Convert everything to RGB
            img = img.convert("RGB")
            img.save(path)

        except:
            print(f"❌ Removing: {path}")
            os.remove(path)
            removed += 1

print(f"✅ Fixed images, removed {removed}")