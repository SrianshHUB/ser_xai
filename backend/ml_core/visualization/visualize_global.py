"""
FILE: visualize_global.py
DESCRIPTION: This script provides global interpretability for the emotion recognition model.
CONTRIBUTION: 
1. Uses SHAP (SHapley Additive exPlanations) to analyze the overall importance of acoustic features.
2. Generates a summary plot showing which features (e.g., loudness, pitch) contribute most to the model's predictions across the entire dataset.
3. Helps researchers understand the global behavior and biases of the SER model.
"""
import shap
import joblib
import pandas as pd
import matplotlib.pyplot as plt

# ===============================
# Load model and dataset
# ===============================
model = joblib.load("../../models/model.joblib")
df = pd.read_csv("../../data/all_handcrafted_data_tess.csv")

# Select features (same as training)
X = df.drop(columns=["class", "path", "source"], errors="ignore")

print("Dataset loaded")
print("Shape:", X.shape)

# ===============================
# Create SHAP explainer
# ===============================
explainer = shap.TreeExplainer(model)

# Compute SHAP values
shap_values = explainer.shap_values(X)

# ===============================
# GLOBAL FEATURE IMPORTANCE
# ===============================
plt.figure(figsize=(10, 6))
shap.summary_plot(
    shap_values,
    X,
    plot_type="bar",
    show=False
)

plt.title("Global Feature Importance using SHAP")
plt.tight_layout()
plt.show()
