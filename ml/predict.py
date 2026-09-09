import os
import pandas as pd
import joblib

FEATURES = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF", "M/F"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.joblib")

model = joblib.load(MODEL_PATH)


def predict(input_data):
    if isinstance(input_data, dict):
        X = pd.DataFrame([input_data])
    else:
        X = input_data.copy()

    X = X[FEATURES]

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]

    return {
        "prediction": prediction,
        "probabilities": {
            label: float(prob)
            for label, prob in zip(model.classes_, probabilities)
        }
    }