"""
Evaluate the saved Egreen Quanta model.

Usage:
    python evaluate.py --data /path/to/oasis_longitudinal_demographics.xlsx \
        --model best_model.joblib
"""

import argparse
import joblib
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

FEATURES = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF", "M/F"]
LABELS = ["Normal", "MCI-like", "AD"]


def main(data_path, model_path):
    df = pd.read_excel(data_path)

    df["target"] = df["CDR"].map({
        0: "Normal",
        0.5: "MCI-like",
        1: "AD",
        2: "AD"
    })

    df = df.dropna(subset=["target", "Subject ID"]).copy()

    subject_info = (
        df.groupby("Subject ID")["CDR"]
        .max()
        .reset_index(name="max_cdr")
    )

    subject_info["subject_target"] = subject_info["max_cdr"].map({
        0: "Normal",
        0.5: "MCI-like",
        1: "AD",
        2: "AD"
    })

    _, test_sub = train_test_split(
        subject_info,
        test_size=0.20,
        random_state=42,
        stratify=subject_info["subject_target"]
    )

    test_ids = set(test_sub["Subject ID"])
    test = df[df["Subject ID"].isin(test_ids)]

    model = joblib.load(model_path)

    pred = model.predict(test[FEATURES])

    print("Accuracy:", round(
        accuracy_score(test["target"], pred), 4
    ))

    print("\nClassification report:")
    print(classification_report(
        test["target"],
        pred,
        labels=LABELS,
        zero_division=0
    ))

    cm = confusion_matrix(
        test["target"],
        pred,
        labels=LABELS
    )

    print("Confusion matrix (rows=actual, columns=predicted):")

    print(pd.DataFrame(
        cm,
        index=LABELS,
        columns=LABELS
    ))

    plt.figure(figsize=(6, 5))

    plt.imshow(cm)

    plt.title("Confusion Matrix - Random Forest")

    plt.xlabel("Predicted")
    plt.ylabel("Actual")

    plt.xticks(
        range(len(LABELS)),
        LABELS
    )

    plt.yticks(
        range(len(LABELS)),
        LABELS
    )

    for i in range(len(LABELS)):
        for j in range(len(LABELS)):
            plt.text(
                j,
                i,
                cm[i, j],
                ha="center",
                va="center"
            )

    plt.tight_layout()

    plt.savefig(
        "confusion_matrix.png",
        dpi=200
    )

    plt.close()

    print("\nSaved confusion matrix to confusion_matrix.png")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--data",
        required=True
    )

    parser.add_argument(
        "--model",
        default="best_model.joblib"
    )

    args = parser.parse_args()

    main(
        args.data,
        args.model
    )