import streamlit as st
import os
import tempfile
import librosa
import numpy as np
import pandas as pd
import joblib
import shap
from sklearn.preprocessing import StandardScaler
import time

st.set_page_config(page_title="SER XAI", page_icon="🎙️", layout="wide")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

# ===============================
# Caching model & data
# ===============================
@st.cache_resource
def load_assets():
    model = joblib.load(os.path.join(BACKEND_DIR, "models/model.joblib"))
    explainer = shap.TreeExplainer(model)
    DF = pd.read_csv(os.path.join(BACKEND_DIR, "data/cremad_handcrafted.csv"))
    
    FEATURE_COLS = DF.drop(columns=["class"], errors="ignore").columns.tolist()
    X_FULL = DF[FEATURE_COLS]
    
    DF["energy"] = DF["rms"]
    DF["pitch"] = DF["spectral_centroid"]
    DF["zcr_simple"] = DF["zcr"]
    
    TRAIT_COLS = ["energy", "pitch", "zcr_simple"]
    scaler = StandardScaler()
    TRAIT_MATRIX = scaler.fit_transform(DF[TRAIT_COLS])
    
    return model, explainer, DF, FEATURE_COLS, X_FULL, scaler, TRAIT_MATRIX

model, explainer, DF, FEATURE_COLS, X_FULL, scaler, TRAIT_MATRIX = load_assets()

# Label map
LABEL_MAP = {
    "angry": "Angry 😡",
    "happy": "Happy 😄",
    "sad": "Sad 😢",
    "neutral": "Neutral 😐",
    "fear": "Fear 😨",
    "disgust": "Disgust 🤢"
}

# ======================================================
# Audio Feature Extraction 
# ======================================================
def extract_audio_traits(audio_path, is_live=False):
    if is_live:
        y, sr = librosa.load(audio_path, sr=16000)
        y, _ = librosa.effects.trim(y, top_db=25)
        if len(y) < sr * 2:
            return None, None
        y = y / (np.max(np.abs(y)) + 1e-8)
    else:
        y, sr = librosa.load(audio_path, duration=3)

    energy = float(np.mean(librosa.feature.rms(y=y)))
    pitch = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
    
    # New layman-friendly traits
    sharpness = float(np.mean(librosa.feature.zero_crossing_rate(y)))
    brightness = float(np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)))
    pureness = float(np.mean(librosa.feature.spectral_flatness(y=y)))
    depth = float(np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr)))

    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo = float(librosa.feature.tempo(onset_envelope=onset_env, sr=sr)[0])

    return np.array([[energy, pitch, zcr]]), {
        "Energy": energy, 
        "Pitch": pitch, 
        "Tempo": tempo,
        "Sharpness": sharpness,
        "Brightness": brightness,
        "Pureness": pureness,
        "Depth": depth
    }

def predict_live_with_voting(audio_path, k=15):
    y, sr = librosa.load(audio_path, sr=16000)
    y, _ = librosa.effects.trim(y, top_db=25)
    if len(y) < sr * 2:
        return "neutral", 0.0

    y = y / (np.max(np.abs(y)) + 1e-8)
    chunks = np.array_split(y, 3)
    all_preds = []

    for chunk in chunks:
        if len(chunk) < sr:
            continue
        chunk_energy = float(np.mean(librosa.feature.rms(y=chunk)))
        chunk_pitch = float(np.mean(librosa.feature.spectral_centroid(y=chunk, sr=sr)))
        chunk_zcr = float(np.mean(librosa.feature.zero_crossing_rate(chunk)))

        live_traits = np.array([[chunk_energy, chunk_pitch, chunk_zcr]])
        live_scaled = scaler.transform(live_traits)
        distances = np.linalg.norm(TRAIT_MATRIX - live_scaled, axis=1)
        nearest_idx = np.argsort(distances)[:k]

        preds = model.predict(X_FULL.iloc[nearest_idx])
        all_preds.extend(preds)

    if len(all_preds) == 0:
        return "neutral", 0.0

    final_pred = pd.Series(all_preds).value_counts().idxmax()
    confidence = (pd.Series(all_preds).value_counts().max() / len(all_preds)) * 100
    return final_pred, round(confidence, 2)


def generate_shap_explanation(samples, final_pred, top_n=5):
    try:
        shap_values = explainer.shap_values(samples)

        if isinstance(shap_values, list):
            class_idx = list(model.classes_).index(final_pred)
            shap_vals = shap_values[class_idx]
        else:
            shap_vals = shap_values

        shap_vals = np.asarray(shap_vals)
        shap_vals = np.mean(np.abs(shap_vals), axis=0)

        feature_names = samples.columns.tolist()
        top_idx = np.argsort(shap_vals)[-top_n:][::-1]
        top_idx = [int(i) for i in top_idx]

        top_features = [
            (feature_names[i], float(shap_vals[i]))
            for i in top_idx
            if i < len(feature_names)
        ]

        explanation = (
            f"The predicted emotion is **{LABEL_MAP.get(final_pred)}**, "
            "primarily influenced by:\n\n"
        )
        for f, _ in top_features:
            explanation += f"- {f.replace('_', ' ')}\n"

        return explanation, top_features

    except Exception:
        return (
            f"The emotion **{LABEL_MAP.get(final_pred)}** was predicted "
            "based on overall acoustic characteristics.",
            []
        )

# ======================================================
# UI Layout
# ======================================================
st.title("🎙️ Speech Emotion Recognition (XAI)")
st.markdown("Upload a `.wav` file or record directly from your microphone to instantly analyze vocal characteristics and predict underlying emotions.")

tab1, tab2 = st.tabs(["Upload Audio", "Live Recording"])

def process_audio(path, is_live):
    with st.spinner("Analyzing acoustic traits..."):
        if is_live:
            pred_raw, conf = predict_live_with_voting(path)
            live_traits, traits_dict = extract_audio_traits(path, is_live=True)
            if live_traits is None:
                st.error("Audio is too short. Please provide at least 3 seconds.")
                return
            final_pred = pred_raw
        else:
            live_traits, traits_dict = extract_audio_traits(path, is_live=False)
            live_scaled = scaler.transform(live_traits)
            distances = np.linalg.norm(TRAIT_MATRIX - live_scaled, axis=1)
            nearest_idx = np.argsort(distances)[:15]
            nearest_samples = X_FULL.iloc[nearest_idx]
            preds = model.predict(nearest_samples)
            final_pred = pd.Series(preds).value_counts().idxmax()
            conf = round(pd.Series(preds).value_counts().max() / len(preds) * 100, 2)

        # Generate XAI explanation
        live_scaled_for_exp = scaler.transform(live_traits)
        dist_exp = np.linalg.norm(TRAIT_MATRIX - live_scaled_for_exp, axis=1)
        near_exp_idx = np.argsort(dist_exp)[:15]
        samples_exp = X_FULL.iloc[near_exp_idx]
        exp_text, top_feats = generate_shap_explanation(samples_exp, final_pred)

    # Display Results
    st.success("Analysis Complete!")
    col1, col2 = st.columns(2)
    with col1:
        st.metric(label="Predicted Emotion", value=LABEL_MAP.get(final_pred, final_pred))
    with col2:
        st.metric(label="Confidence", value=f"{conf}%")

    st.subheader("Why this prediction?")
    st.markdown(exp_text)

    # Convert features to slightly dynamic UI
    st.subheader("Key Acoustic Traits")
    cols = st.columns(4)
    idx = 0
    for k, v in traits_dict.items():
        cols[idx % 4].metric(k, f"{v:.2f}")
        idx += 1

with tab1:
    st.header("Upload File")
    uploaded_file = st.file_uploader("Choose a .wav file", type=["wav", "mp3", "ogg"])
    if uploaded_file is not None:
        st.audio(uploaded_file, format="audio/wav")
        if st.button("Predict Emotion"):
            temp_dir = tempfile.gettempdir()
            path = os.path.join(temp_dir, uploaded_file.name)
            with open(path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            process_audio(path, is_live=False)

with tab2:
    st.header("Record Microphone")
    st.markdown("*Note: Microphone recording relies on Streamlit's native audio input component.*")
    # Streamlit natively supports st.audio_input as of v1.38.0
    audio_val = st.audio_input("Record a voice message")
    if audio_val is not None:
        st.audio(audio_val)
        if st.button("Analyze Recording"):
            temp_dir = tempfile.gettempdir()
            path = os.path.join(temp_dir, "live_record.wav")
            with open(path, "wb") as f:
                f.write(audio_val.getbuffer())
            process_audio(path, is_live=True)
