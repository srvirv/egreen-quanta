import os
import pandas as pd
import joblib

FEATURES = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF", "M/F"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best_model.joblib")

model = joblib.load(MODEL_PATH)


def _get_preprocessor():
    """
    Find the fitted preprocessing transformer inside the saved model.
    """
    if hasattr(model, "named_steps"):
        for step in model.named_steps.values():
            if hasattr(step, "transformers_"):
                return step

    return None


def _get_baseline_values():
    """
    Get baseline values from the fitted preprocessing pipeline.

    Numeric features use the fitted imputer statistics.
    Categorical features use the fitted most-frequent value.
    """
    preprocessor = _get_preprocessor()

    # Safe fallback values matching the current demo patient.
    baselines = {
        "Age": 75,
        "EDUC": 14,
        "SES": 2,
        "MMSE": 24,
        "eTIV": 1500,
        "nWBV": 0.70,
        "ASF": 1.1,
        "M/F": "M",
    }

    if preprocessor is None:
        return baselines

    try:
        for transformer_name, transformer, columns in preprocessor.transformers_:

            if transformer == "drop" or transformer == "passthrough":
                continue

            if not isinstance(columns, (list, tuple)):
                columns = list(columns)

            # Find the fitted imputer inside the transformer.
            imputer = None

            if hasattr(transformer, "named_steps"):
                for step in transformer.named_steps.values():
                    if hasattr(step, "statistics_"):
                        imputer = step
                        break

            elif hasattr(transformer, "statistics_"):
                imputer = transformer

            if imputer is not None:
                for feature, value in zip(columns, imputer.statistics_):
                    if pd.notna(value):
                        baselines[feature] = value

    except Exception:
        # Keep safe fallback values if the saved pipeline structure differs.
        pass

    return baselines


def _feature_contributions(X, predicted_class):
    """
    Estimate local feature contribution.

    Each feature is replaced individually with its preprocessing baseline.
    The change in predicted-class probability is used as the contribution.

    Positive value:
        Removing/replacing the feature decreases the predicted-class
        probability, so the original feature supported the prediction.

    Negative value:
        Removing/replacing the feature increases the predicted-class
        probability, so the original feature opposed the prediction.
    """
    baselines = _get_baseline_values()

    original_probability = float(
        model.predict_proba(X)[0][
            list(model.classes_).index(predicted_class)
        ]
    )

    contributions = []

    for feature in FEATURES:
        modified = X.copy()
        modified.loc[:, feature] = baselines[feature]

        modified_probability = float(
            model.predict_proba(modified)[0][
                list(model.classes_).index(predicted_class)
            ]
        )

        contribution = original_probability - modified_probability

        contributions.append(
            {
                "feature": feature,
                "contribution": float(contribution),
                "percentage_points": float(contribution * 100),
                "direction": (
                    "supports"
                    if contribution > 0
                    else "opposes"
                    if contribution < 0
                    else "neutral"
                ),
            }
        )

    # Largest absolute effects first.
    contributions.sort(
        key=lambda item: abs(item["contribution"]),
        reverse=True,
    )

    return contributions


def predict(input_data):
    if isinstance(input_data, dict):
        X = pd.DataFrame([input_data])
    else:
        X = input_data.copy()

    X = X[FEATURES]

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]

    contributions = _feature_contributions(X, prediction)

    return {
        "prediction": prediction,
        "probabilities": {
            label: float(prob)
            for label, prob in zip(model.classes_, probabilities)
        },
        "feature_contributions": contributions,
    }