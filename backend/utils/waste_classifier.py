"""
Waste Classifier - AI Inference Module
Loads the trained EfficientNetB0 model and provides prediction functionality.
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input

# ─── Configuration ──────────────────────────────────────────
IMG_SIZE = 224
MODEL_PATH = os.path.join(os.getcwd(), "waste_classifier.keras")

# Class names in alphabetical order (matches TensorFlow's image_dataset_from_directory default)
CLASS_NAMES = ['dry_waste', 'other_waste', 'wet_waste']

# Friendly display names for the UI
CLASS_DISPLAY = {
    'dry_waste': 'Dry Waste',
    'other_waste': 'Other Waste',
    'wet_waste': 'Wet Waste',
}

# Suggested actions for circular economy
CLASS_ACTIONS = {
    'dry_waste': 'Can be recycled → Paper, plastic, metal recovery',
    'other_waste': 'Needs special handling → Hazardous / e-waste processing',
    'wet_waste': 'Compostable → Organic composting / biogas generation',
}

# ─── Load Model (once at import time) ──────────────────────
print("Checking model path:", MODEL_PATH)
print("File exists:", os.path.exists(MODEL_PATH))
print("Loading waste classification model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")


def predict(image_path):
    """
    Predict waste category from an image file.
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        dict: {
            'class': str,           # e.g. 'dry_waste'
            'display_name': str,    # e.g. '♻️ Dry Waste'
            'confidence': float,    # e.g. 92.5
            'action': str,          # Circular economy suggestion
            'all_predictions': dict # All class probabilities
        }
    """
    # Load and preprocess image (exactly matching training pipeline)
    img = image.load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Run inference
    predictions = model.predict(img_array, verbose=0)[0]

    # Extract results
    index = np.argmax(predictions)
    class_name = CLASS_NAMES[index]
    confidence = float(predictions[index] * 100)

    # Build complete prediction result
    all_predictions = {
        CLASS_NAMES[i]: round(float(predictions[i] * 100), 1)
        for i in range(len(CLASS_NAMES))
    }

    return {
        'class': class_name,
        'display_name': CLASS_DISPLAY.get(class_name, class_name),
        'confidence': round(confidence, 1),
        'action': CLASS_ACTIONS.get(class_name, ''),
        'all_predictions': all_predictions,
    }
