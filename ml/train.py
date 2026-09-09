"""
Train the classical ML baselines for Egreen Quanta.

Usage:
    python train.py --data /path/to/oasis_longitudinal_demographics.xlsx
"""

import argparse
import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

FEATURES = ["Age","EDUC","SES","MMSE","eTIV","nWBV","ASF","M/F"]
NUMERIC = ["Age","EDUC","SES","MMSE","eTIV","nWBV","ASF"]
CATEGORICAL = ["M/F"]
LABELS = ["Normal","MCI-like","AD"]

def load_and_label(path):
    df = pd.read_excel(path)
    df["target"] = df["CDR"].map({0:"Normal", 0.5:"MCI-like", 1:"AD", 2:"AD"})
    df = df.dropna(subset=["target", "Subject ID"]).copy()
    return df

def subject_split(df, test_size=0.20, random_state=42):
    subject_info = df.groupby("Subject ID")["CDR"].max().reset_index(name="max_cdr")
    subject_info["subject_target"] = subject_info["max_cdr"].map(
        {0:"Normal", 0.5:"MCI-like", 1:"AD", 2:"AD"}
    )
    train_sub, test_sub = train_test_split(
        subject_info,
        test_size=test_size,
        random_state=random_state,
        stratify=subject_info["subject_target"],
    )
    train_ids = set(train_sub["Subject ID"])
    test_ids = set(test_sub["Subject ID"])
    return df[df["Subject ID"].isin(train_ids)].copy(), df[df["Subject ID"].isin(test_ids)].copy()

def make_preprocessor():
    return ColumnTransformer([
        ("num", Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ]), NUMERIC),
        ("cat", Pipeline([
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]), CATEGORICAL),
    ])

def main(data_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    df = load_and_label(data_path)
    train, test = subject_split(df)

    models = {
        "logistic_regression": LogisticRegression(
            max_iter=2000, class_weight="balanced", random_state=42
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=500, class_weight="balanced", random_state=42
        ),
        "svm": SVC(
            probability=True, class_weight="balanced", random_state=42
        ),
    }

    results = []
    fitted = {}

    for name, model in models.items():
        pipe = Pipeline([
            ("preprocessing", make_preprocessor()),
            ("model", model),
        ])
        pipe.fit(train[FEATURES], train["target"])
        pred = pipe.predict(test[FEATURES])
        p, r, f1, _ = precision_recall_fscore_support(
            test["target"], pred, labels=LABELS, zero_division=0
        )
        results.append({
            "Model": name,
            "Accuracy": accuracy_score(test["target"], pred),
            "Macro Precision": p.mean(),
            "Macro Recall": r.mean(),
            "Macro F1": f1.mean(),
        })
        fitted[name] = pipe

    comparison = pd.DataFrame(results).sort_values("Macro F1", ascending=False)
    best = comparison.iloc[0]["Model"]
    joblib.dump(fitted[best], os.path.join(output_dir, "best_model.joblib"))
    comparison.to_csv(os.path.join(output_dir, "model_comparison.csv"), index=False)

    train[FEATURES + ["Subject ID", "target"]].to_csv(
        os.path.join(output_dir, "train_prepared.csv"), index=False
    )
    test[FEATURES + ["Subject ID", "target"]].to_csv(
        os.path.join(output_dir, "test_prepared.csv"), index=False
    )

    print(comparison.to_string(index=False))
    print(f"\nBest model by macro-F1: {best}")
    print(f"Training subjects: {train['Subject ID'].nunique()}")
    print(f"Testing subjects: {test['Subject ID'].nunique()}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True)
    parser.add_argument("--output", default=".")
    args = parser.parse_args()
    main(args.data, args.output)
