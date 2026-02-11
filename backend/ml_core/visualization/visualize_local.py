"""
FILE: visualize_local.py
DESCRIPTION: This script provides local interpretability for individual emotion predictions.
CONTRIBUTION: 
1. Uses SHAP force plots to visualize how specific features of a single audio sample influenced the model's decision.
2. Helps developers and users understand why the AI made a particular prediction for a specific instance.
3. Serves as a standalone verification tool for comparing AI reasoning against human intuition.
"""
import shap
import joblib
import pandas as pd
import matplotlib.pyplot as plt

# Load model and data
model = joblib.load("../../models/model.joblib")
df = pd.read_csv("../../data/all_handcrafted_data_tess.csv")

X = df.drop(columns=["class", "path", "source"], errors="ignore")

# Pick one sample
sample = X.sample(1)

# SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)

# Find class index
pred = model.predict(sample)[0]
class_idx = list(model.classes_).index(pred)

# Local explanation
shap.force_plot(
    explainer.expected_value[class_idx],
    shap_values[class_idx][sample.index[0]],
    sample,
    matplotlib=True
)

plt.title(f"Local SHAP Explanation for Emotion: {pred}")
plt.show()
