import pandas as pd
import joblib

FEATURES = ["Age","EDUC","SES","MMSE","eTIV","nWBV","ASF","M/F"]
model = joblib.load("best_model.joblib")

def predict(input_data):
    X = pd.DataFrame([input_data]) if isinstance(input_data, dict) else input_data.copy()
    X = X[FEATURES]
    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]
    return {
        "prediction": prediction,
        "probabilities": {
            label: float(prob) for label, prob in zip(model.classes_, probabilities)
        }
    }
