import pandas as pd

from sklearn.model_selection import StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from sklearn.metrics import accuracy_score, classification_report, f1_score


FEATURES = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF", "M/F"]
NUMERIC = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF"]
CATEGORICAL = ["M/F"]
LABELS = ["Normal", "MCI-like", "AD"]


df = pd.read_excel(
    "data/raw/oasis_longitudinal_demographics-8d83e569fa2e2d30.xlsx"
)

df["target"] = df["CDR"].map({
    0: "Normal",
    0.5: "MCI-like",
    1: "AD",
    2: "AD"
})

df = df.dropna(
    subset=["target", "Subject ID"]
).copy()


def make_preprocessor():
    return ColumnTransformer([
        (
            "num",
            Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]),
            NUMERIC
        ),
        (
            "cat",
            Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))
            ]),
            CATEGORICAL
        )
    ])


models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=500,
        class_weight="balanced",
        random_state=42
    ),
    "SVM": SVC(
        class_weight="balanced",
        random_state=42
    ),
    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        class_weight="balanced",
        random_state=42
    )
}


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


cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


results = []


for name, model in models.items():

    accuracies = []
    f1_scores = []

    class_scores = {
        "Normal": [],
        "MCI-like": [],
        "AD": []
    }

    for train_sub_idx, test_sub_idx in cv.split(
        subject_info["Subject ID"],
        subject_info["subject_target"]
    ):

        train_ids = set(
            subject_info.iloc[train_sub_idx]["Subject ID"]
        )

        test_ids = set(
            subject_info.iloc[test_sub_idx]["Subject ID"]
        )

        train = df[
            df["Subject ID"].isin(train_ids)
        ].copy()

        test = df[
            df["Subject ID"].isin(test_ids)
        ].copy()

        X_train = train[FEATURES]
        X_test = test[FEATURES]

        y_train = train["target"]
        y_test = test["target"]

        pipeline = Pipeline([
            ("preprocessing", make_preprocessor()),
            ("model", model)
        ])

        pipeline.fit(
            X_train,
            y_train
        )

        pred = pipeline.predict(X_test)

        accuracy = accuracy_score(
            y_test,
            pred
        )

        macro_f1 = f1_score(
            y_test,
            pred,
            labels=LABELS,
            average="macro",
            zero_division=0
        )

        accuracies.append(accuracy)
        f1_scores.append(macro_f1)

        report = classification_report(
            y_test,
            pred,
            labels=LABELS,
            output_dict=True,
            zero_division=0
        )

        for label in LABELS:
            class_scores[label].append(
                report[label]["f1-score"]
            )

    print(f"\n{name}")
    print("=" * 60)

    print("\nMean performance by class:")

    for label in LABELS:
        mean_f1 = sum(class_scores[label]) / len(
            class_scores[label]
        )

        print(
            f"  {label}: "
            f"Mean F1 = {mean_f1:.4f}"
        )

    print("\nFold results:")

    for i in range(5):
        print(
            f"  Fold {i + 1}: "
            f"Accuracy={accuracies[i]:.4f}, "
            f"Macro F1={f1_scores[i]:.4f}"
        )

    results.append({
        "Model": name,
        "Mean Accuracy": sum(accuracies) / len(accuracies),
        "Mean Macro F1": sum(f1_scores) / len(f1_scores),
        "Accuracy Std": pd.Series(accuracies).std(),
        "F1 Std": pd.Series(f1_scores).std()
    })


results = pd.DataFrame(results)


print("\n\nFINAL 5-FOLD SUBJECT-LEVEL CROSS-VALIDATION")
print("=" * 60)

print(
    results.to_string(
        index=False,
        float_format=lambda x: f"{x:.4f}"
    )
)