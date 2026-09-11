import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
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


# ==========================================
# 1. LOAD DATA
# ==========================================

path = "data/raw/oasis_longitudinal_demographics-8d83e569fa2e2d30.xlsx"

df = pd.read_excel(path)

df = df.sort_values(
    ["Subject ID", "Visit"]
).copy()


# ==========================================
# 2. CREATE CONSECUTIVE VISIT PAIRS
# ==========================================

pairs = []

for subject, group in df.groupby("Subject ID"):

    group = group.sort_values("Visit")

    rows = group.to_dict("records")

    for i in range(len(rows) - 1):

        current = rows[i]
        future = rows[i + 1]

        pair = {
            "Subject ID": subject,

            # Features come ONLY from the earlier visit
            "Age": current["Age"],
            "EDUC": current["EDUC"],
            "SES": current["SES"],
            "MMSE": current["MMSE"],
            "eTIV": current["eTIV"],
            "nWBV": current["nWBV"],
            "ASF": current["ASF"],
            "M/F": current["M/F"],

            # Target comes from the future visit
            "worsened": int(
                future["CDR"] > current["CDR"]
            ),
        }

        pairs.append(pair)


pairs_df = pd.DataFrame(pairs)


print("\n========================================")
print("PROGRESSION DATASET")
print("========================================")

print(
    "Total consecutive visit pairs:",
    len(pairs_df)
)

print(
    "\nTarget distribution:"
)

print(
    pairs_df["worsened"].value_counts()
)


# ==========================================
# 3. SUBJECT-LEVEL SPLIT
# ==========================================

subject_targets = (
    pairs_df.groupby("Subject ID")["worsened"]
    .max()
    .reset_index()
)

train_sub, test_sub = train_test_split(
    subject_targets,
    test_size=0.20,
    random_state=42,
    stratify=subject_targets["worsened"],
)

train_ids = set(train_sub["Subject ID"])
test_ids = set(test_sub["Subject ID"])

train = pairs_df[
    pairs_df["Subject ID"].isin(train_ids)
].copy()

test = pairs_df[
    pairs_df["Subject ID"].isin(test_ids)
].copy()


print("\n========================================")
print("SUBJECT-LEVEL SPLIT")
print("========================================")

print(
    "Training subjects:",
    train["Subject ID"].nunique()
)

print(
    "Testing subjects:",
    test["Subject ID"].nunique()
)

print(
    "\nTraining target distribution:"
)

print(
    train["worsened"].value_counts()
)

print(
    "\nTesting target distribution:"
)

print(
    test["worsened"].value_counts()
)


# ==========================================
# 4. PREPROCESSING
# ==========================================

preprocessor = ColumnTransformer([
    (
        "num",
        Pipeline([
            (
                "imputer",
                SimpleImputer(strategy="median")
            ),
            (
                "scaler",
                StandardScaler()
            ),
        ]),
        NUMERIC,
    ),

    (
        "cat",
        Pipeline([
            (
                "imputer",
                SimpleImputer(strategy="most_frequent")
            ),
            (
                "onehot",
                OneHotEncoder(
                    handle_unknown="ignore"
                )
            ),
        ]),
        CATEGORICAL,
    ),
])


# ==========================================
# 5. RANDOM FOREST
# ==========================================

model = RandomForestClassifier(
    n_estimators=500,
    class_weight="balanced",
    random_state=42,
)


pipeline = Pipeline([
    ("preprocessing", preprocessor),
    ("model", model),
])


# ==========================================
# 6. TRAIN
# ==========================================

pipeline.fit(
    train[FEATURES],
    train["worsened"],
)


# ==========================================
# 7. TEST
# ==========================================

pred = pipeline.predict(
    test[FEATURES]
)


# ==========================================
# 8. METRICS
# ==========================================

accuracy = accuracy_score(
    test["worsened"],
    pred,
)

precision = precision_score(
    test["worsened"],
    pred,
    zero_division=0,
)

recall = recall_score(
    test["worsened"],
    pred,
    zero_division=0,
)

f1 = f1_score(
    test["worsened"],
    pred,
    zero_division=0,
)


print("\n========================================")
print("PROGRESSION BASELINE RESULTS")
print("========================================")

print(
    f"Accuracy : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1       : {f1:.4f}"
)


# ==========================================
# 9. CLASSIFICATION REPORT
# ==========================================

print(
    "\nClassification report:"
)

print(
    classification_report(
        test["worsened"],
        pred,
        target_names=[
            "No worsening",
            "Worsening",
        ],
        zero_division=0,
    )
)


# ==========================================
# 10. CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(
    test["worsened"],
    pred,
)

print(
    "\nConfusion matrix:"
)

print(
    pd.DataFrame(
        cm,
        index=[
            "Actual No worsening",
            "Actual Worsening",
        ],
        columns=[
            "Predicted No worsening",
            "Predicted Worsening",
        ],
    )
)


print("\n========================================")
print("EXPERIMENT COMPLETE")
print("========================================")
