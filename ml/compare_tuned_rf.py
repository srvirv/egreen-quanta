import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)

FEATURES = [
    "Age",
    "EDUC",
    "SES",
    "MMSE",
    "eTIV",
    "nWBV",
    "ASF",
    "M/F",
]

NUMERIC = [
    "Age",
    "EDUC",
    "SES",
    "MMSE",
    "eTIV",
    "nWBV",
    "ASF",
]

CATEGORICAL = ["M/F"]

LABELS = ["Normal", "MCI-like", "AD"]


# -----------------------------
# Load and prepare dataset
# -----------------------------

df = pd.read_excel(
    "data/raw/oasis_longitudinal_demographics-8d83e569fa2e2d30.xlsx"
)

df["target"] = df["CDR"].map({
    0: "Normal",
    0.5: "MCI-like",
    1: "AD",
    2: "AD",
})

df = df.dropna(
    subset=["target", "Subject ID"]
).copy()


# -----------------------------
# Subject-level split
# Same logic as train.py
# -----------------------------

subject_info = (
    df.groupby("Subject ID")["CDR"]
    .max()
    .reset_index(name="max_cdr")
)

subject_info["subject_target"] = subject_info["max_cdr"].map({
    0: "Normal",
    0.5: "MCI-like",
    1: "AD",
    2: "AD",
})

train_sub, test_sub = train_test_split(
    subject_info,
    test_size=0.20,
    random_state=42,
    stratify=subject_info["subject_target"],
)

train_ids = set(train_sub["Subject ID"])
test_ids = set(test_sub["Subject ID"])

train = df[df["Subject ID"].isin(train_ids)].copy()
test = df[df["Subject ID"].isin(test_ids)].copy()


# -----------------------------
# Preprocessing
# -----------------------------

preprocessor = ColumnTransformer([
    (
        "num",
        Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]),
        NUMERIC,
    ),
    (
        "cat",
        Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]),
        CATEGORICAL,
    ),
])


# -----------------------------
# Original Random Forest
# -----------------------------

original_rf = RandomForestClassifier(
    n_estimators=500,
    class_weight="balanced",
    random_state=42,
)


original_pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("model", original_rf),
])


original_pipeline.fit(
    train[FEATURES],
    train["target"],
)

original_pred = original_pipeline.predict(
    test[FEATURES]
)


# -----------------------------
# Tuned Random Forest
# -----------------------------

tuned_rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    max_features="sqrt",
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
)


tuned_pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("model", tuned_rf),
])


tuned_pipeline.fit(
    train[FEATURES],
    train["target"],
)

tuned_pred = tuned_pipeline.predict(
    test[FEATURES]
)


# -----------------------------
# Results
# -----------------------------

original_accuracy = accuracy_score(
    test["target"],
    original_pred,
)

original_f1 = f1_score(
    test["target"],
    original_pred,
    labels=LABELS,
    average="macro",
)

tuned_accuracy = accuracy_score(
    test["target"],
    tuned_pred,
)

tuned_f1 = f1_score(
    test["target"],
    tuned_pred,
    labels=LABELS,
    average="macro",
)


print("\n========================================")
print("ORIGINAL RANDOM FOREST")
print("========================================")

print(
    f"Accuracy: {original_accuracy:.4f}"
)

print(
    f"Macro F1: {original_f1:.4f}"
)

print("\nClassification report:")

print(
    classification_report(
        test["target"],
        original_pred,
        labels=LABELS,
        zero_division=0,
    )
)


print("\n========================================")
print("TUNED RANDOM FOREST")
print("========================================")

print(
    f"Accuracy: {tuned_accuracy:.4f}"
)

print(
    f"Macro F1: {tuned_f1:.4f}"
)

print("\nClassification report:")

print(
    classification_report(
        test["target"],
        tuned_pred,
        labels=LABELS,
        zero_division=0,
    )
)


print("\n========================================")
print("COMPARISON")
print("========================================")

print(
    f"Original RF Accuracy : {original_accuracy:.4f}"
)

print(
    f"Tuned RF Accuracy    : {tuned_accuracy:.4f}"
)

print(
    f"Accuracy Change      : "
    f"{tuned_accuracy - original_accuracy:+.4f}"
)

print()

print(
    f"Original RF Macro F1 : {original_f1:.4f}"
)

print(
    f"Tuned RF Macro F1    : {tuned_f1:.4f}"
)

print(
    f"Macro F1 Change      : "
    f"{tuned_f1 - original_f1:+.4f}"
)


print("\n========================================")
print("TUNED RF CONFUSION MATRIX")
print("========================================")

cm = confusion_matrix(
    test["target"],
    tuned_pred,
    labels=LABELS,
)

print(
    pd.DataFrame(
        cm,
        index=LABELS,
        columns=LABELS,
    )
)
